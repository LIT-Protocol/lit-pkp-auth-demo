import React, { useState } from 'react';

export type OtpMethod = 'email' | 'phone';
export type OtpStep = 'submit' | 'verify';

export interface StytchOTPLibProps {
  method: OtpMethod;
  authWithStytch: (accessToken: string, userId: string, method: string) => Promise<void>;
  setView: (view: string) => void;
  onSendCode: (userId: string, method: OtpMethod) => Promise<{ methodId: string }>;
  onVerifyCode: (code: string, methodId: string) => Promise<{ sessionJwt: string; userId: string }>;
}

export const StytchOTPLib: React.FC<StytchOTPLibProps> = ({
  method,
  authWithStytch,
  setView,
  onSendCode,
  onVerifyCode,
}) => {
  const [step, setStep] = useState<OtpStep>('submit');
  const [userId, setUserId] = useState<string>('');
  const [methodId, setMethodId] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  async function sendPasscode(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);
    try {
      const response = await onSendCode(userId, method);
      setMethodId(response.methodId);
      setStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }

  async function authenticate(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);
    try {
      const response = await onVerifyCode(code, methodId);
      await authWithStytch(response.sessionJwt, response.userId, method);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {step === 'submit' && (
        <>
          {error && (
            <div className="alert alert--error">
              <p>{error.message}</p>
            </div>
          )}
          <h1>Enter your {method}</h1>
          <p>A verification code will be sent to your {method}.</p>
          <div className="form-wrapper">
            <form className="form" onSubmit={sendPasscode}>
              <label htmlFor={method} className="sr-only">
                {method === 'email' ? 'Email' : 'Phone number'}
              </label>
              <input
                id={method}
                value={userId}
                onChange={e => setUserId(e.target.value)}
                type={method === 'email' ? 'email' : 'tel'}
                name={method}
                className="form__input"
                placeholder={
                  method === 'email' ? 'Your email' : 'Your phone number'
                }
                autoComplete="off"
              />
              <button
                type="submit"
                className="btn btn--primary"
                disabled={loading}
              >
                Send code
              </button>
              <button
                onClick={() => setView('default')}
                className="btn btn--link"
              >
                Back
              </button>
            </form>
          </div>
        </>
      )}
      {step === 'verify' && (
        <>
          <h1>Check your {method}</h1>
          <p>Enter the 6-digit verification code to {userId}</p>
          <div className="form-wrapper">
            <form className="form" onSubmit={authenticate}>
              <label htmlFor="code" className="sr-only">
                Code
              </label>
              <input
                id="code"
                value={code}
                onChange={e => setCode(e.target.value)}
                type="text"
                name="code"
                className="form__input"
                placeholder="Verification code"
                autoComplete="off"
              />
              <button type="submit" className="btn btn--primary">
                Verify
              </button>
              <button
                onClick={() => setStep('submit')}
                className="btn btn--outline"
              >
                Try again
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};
