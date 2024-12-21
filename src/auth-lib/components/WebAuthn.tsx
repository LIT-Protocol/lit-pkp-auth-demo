import React, { useState } from 'react';

export type WebAuthnStep = 'register' | 'authenticate';

export interface WebAuthnLibProps {
  start: WebAuthnStep;
  authWithWebAuthn: () => Promise<void>;
  setView: (view: string) => void;
  registerWithWebAuthn?: () => Promise<void>;
}

export const WebAuthnLib: React.FC<WebAuthnLibProps> = ({
  start,
  authWithWebAuthn,
  setView,
  registerWithWebAuthn,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [step, setStep] = useState<WebAuthnStep>(start);

  async function handleRegister() {
    if (!registerWithWebAuthn) return;
    
    setError(undefined);
    setLoading(true);
    try {
      await registerWithWebAuthn();
      setStep('authenticate');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <>
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        <div className="loader-container">
          <div className="loader"></div>
          <p>Follow the prompts to continue...</p>
        </div>
      </>
    );
  }

  return (
    <>
      {error && (
        <div className="alert alert--error">
          <p>{error.message}</p>
        </div>
      )}
      {step === 'register' && (
        <>
          <h1>Register with a passkey</h1>
          <p>Passkeys enable simple and secure passwordless authentication.</p>
          <div className="buttons-container">
            <button
              type="button"
              className={`btn btn--outline ${loading && 'btn--loading'}`}
              onClick={handleRegister}
              disabled={loading}
            >
              Create a credential
            </button>
            <button
              onClick={() => setView('default')}
              className="btn btn--link"
            >
              Back
            </button>
          </div>
        </>
      )}
      {step === 'authenticate' && (
        <>
          <h1>Authenticate with your passkey</h1>
          <p>Sign in using your passkey.</p>
          <div className="buttons-container">
            <button
              type="button"
              className={`btn btn--outline ${loading && 'btn--loading'}`}
              onClick={authWithWebAuthn}
              disabled={loading}
            >
              Sign in with passkey
            </button>
            <button
              onClick={() => setView('default')}
              className="btn btn--link"
            >
              Back
            </button>
          </div>
        </>
      )}
    </>
  );
};
