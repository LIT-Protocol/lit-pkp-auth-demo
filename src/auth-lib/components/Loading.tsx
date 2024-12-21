import React from 'react';

export interface LoadingLibProps {
  copy: string;
  error?: Error;
}

export const LoadingLib: React.FC<LoadingLibProps> = ({ copy, error }) => {
  return (
    <div className="container">
      <div className="wrapper">
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        <div className="loader-container">
          <div className="loader"></div>
          <p>{copy}</p>
        </div>
      </div>
    </div>
  );
}
