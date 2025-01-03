import React from 'react';
import { AuthMethod } from '@lit-protocol/types';

interface CreateAccountProps {
  authMethod: AuthMethod;
  createAccount: (authMethod: AuthMethod) => Promise<void>;
  error?: Error;
}

export default function CreateAccount({
  authMethod,
  createAccount,
  error,
}: CreateAccountProps) {
  return (
    <div className="container">
      <div className="wrapper">
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        <h1>Create a new account</h1>
        <p>
          Create a new wallet that is secured by your authentication method.
        </p>
        <div className="buttons-container">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => createAccount(authMethod)}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
