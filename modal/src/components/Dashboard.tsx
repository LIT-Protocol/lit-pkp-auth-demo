import React, { useState } from 'react';
import { IRelayPKP, SessionSigs } from '@lit-protocol/types';
import { ethers } from 'ethers';
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { litNodeClient } from '../utils/lit';

interface DashboardProps {
  currentAccount: IRelayPKP;
  sessionSigs: SessionSigs;
  onLogout?: () => void;
}

const Dashboard = ({
  currentAccount,
  sessionSigs,
  onLogout,
}: DashboardProps): JSX.Element => {
  const [message, setMessage] = useState<string>('Free the web!');
  const [signature, setSignature] = useState<string>();
  const [recoveredAddress, setRecoveredAddress] = useState<string>();
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  /**
   * Sign a message with current PKP
   */
  async function signMessageWithPKP() {
    setLoading(true);

    try {
      await litNodeClient.connect();

      const pkpWallet = new PKPEthersWallet({
        controllerSessionSigs: sessionSigs,
        pkpPubKey: currentAccount.publicKey,
        litNodeClient: litNodeClient,
      });

      await pkpWallet.init();

      const signature = await pkpWallet.signMessage(message);
      setSignature(signature);

      // Get the address associated with the signature created by signing the message
      const recoveredAddr = ethers.utils.verifyMessage(message, signature);
      setRecoveredAddress(recoveredAddr);

      // Check if the address associated with the signature is the same as the current PKP
      const verified =
        currentAccount.ethAddress.toLowerCase() === recoveredAddr.toLowerCase();
      setVerified(verified);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <div className="logout-container">
        <button className="btn btn--link" onClick={onLogout}>
          Logout
        </button>
      </div>
      <h1>Ready for the open web</h1>
      <div className="details-card">
        <p>My address: {currentAccount.ethAddress.toLowerCase()}</p>
      </div>
      <div className="divider"></div>
      <div className="message-card">
        <p>Test out your wallet by signing this message:</p>
        <p className="message-card__prompt">{message}</p>
        <button
          onClick={signMessageWithPKP}
          disabled={loading}
          className={`btn ${signature ? (verified ? 'btn--success' : 'btn--error') : ''
            } ${loading && 'btn--loading'}`}
        >
          {signature ? (
            verified ? (
              <span>Verified ✓</span>
            ) : (
              <span>Failed x</span>
            )
          ) : (
            <span>Sign message</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
