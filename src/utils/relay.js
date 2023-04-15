const RELAY_API_URL = 'https://relay-server-staging.herokuapp.com';
const RELAY_API_KEY = 'google-auth-next-example';

/**
 * Fetch PKPs associated with the given Google account
 *
 * @param {string} body - Body of the request
 *
 * @returns Response from the relay server
 */
export async function fetchPKPs(body) {
  const response = await fetch(`${RELAY_API_URL}/auth/google/userinfo`, {
    method: 'POST',
    headers: {
      'api-key': RELAY_API_KEY,
      'Content-Type': 'application/json',
    },
    body: body,
  });

  if (response.status < 200 || response.status >= 400) {
    console.warn('Something wrong with the API call', await response.json());
    const err = new Error('Unable to fetch PKPs through relay server');
    throw err;
  } else {
    const resBody = await response.json();
    console.log('Response OK', { body: resBody });
    console.log('Successfully fetched PKPs with relayer');
    return resBody;
  }
}

/**
 * Mint a new PKP associated with the given Google account
 *
 * @param {string} body - Body of the request
 *
 * @returns Response from the relay server
 */
export async function mintPKP(body) {
  const response = await fetch(`${RELAY_API_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'api-key': RELAY_API_KEY,
      'Content-Type': 'application/json',
    },
    body: body,
  });

  if (response.status < 200 || response.status >= 400) {
    console.warn('Something wrong with the API call', await response.json());
    const err = new Error('Unable to mint PKP through relay server');
    throw err;
  } else {
    const resBody = await response.json();
    console.log('Response OK', { body: resBody });
    console.log('Successfully initiated minting PKP with relayer');
    return resBody;
  }
}

/**
 * Poll the relay server for status of minting request
 *
 * @param {string} requestId - Request ID to poll, likely the minting transaction hash
 *
 * @returns Response from the relay server
 */
export async function pollRequestUntilTerminalState(requestId) {
  const maxPollCount = 20;
  for (let i = 0; i < maxPollCount; i++) {
    const response = await fetch(`${RELAY_API_URL}/auth/status/${requestId}`, {
      method: 'GET',
      headers: {
        'api-key': RELAY_API_KEY,
      },
    });

    if (response.status < 200 || response.status >= 400) {
      console.warn('Something wrong with the API call', await response.json());
      const err = new Error(
        `Unable to poll the status of this mint PKP transaction: ${requestId}`
      );
      throw err;
    }

    const resBody = await response.json();
    console.log('Response OK', { body: resBody });

    if (resBody.error) {
      // exit loop since error
      console.warn('Something wrong with the API call', {
        error: resBody.error,
      });
      const err = new Error(resBody.error);
      throw err;
    } else if (resBody.status === 'Succeeded') {
      // exit loop since success
      console.info('Successfully authed', { ...resBody });
      return resBody;
    }

    // otherwise, sleep then continue polling
    await new Promise(r => setTimeout(r, 15000));
  }

  // at this point, polling ended and still no success, set failure status
  // console.error(`Hmm this is taking longer than expected...`);
  const err = new Error('Polling for mint PKP transaction status timed out');
  throw err;
}
