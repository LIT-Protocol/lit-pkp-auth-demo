import React from 'react';

interface LoadingProps {
  copy: string;
  error?: Error;
}

const Loading = ({ copy, error }: LoadingProps): JSX.Element => {
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

export default Loading;
