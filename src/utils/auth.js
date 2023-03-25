import { nanoid } from 'nanoid';

const STATE_PARAM_KEY = 'lit-state-param';

/**
 * Create login url with query params
 *
 * @param {string} redirectUri - Redirect uri
 *
 * @returns {string} - Login url
 */
export function getLoginUrl(redirectUri) {
  const baseUrl = `https://login.litgateway.com/auth/google`;
  const state = encode(setStateParam());
  const authParams = {
    app_redirect: redirectUri,
  };
  const queryAuthParams = createQueryParams(authParams);
  return `${baseUrl}?${queryAuthParams}&state=${state}`;
}

/**
 * Parse the redirect url and return the Google ID token
 *
 * @param {string} redirectUri - Redirect uri
 *
 * @returns {string} - Google ID token
 */
export function handleSignInRedirect(redirectUri) {
  // Check if current url matches redirect uri
  if (!window.location.href.startsWith(redirectUri)) {
    throw new Error(
      `Current url "${window.location.href}" does not match provided redirect uri "${redirectUri}"`
    );
  }

  // Check url for params
  const { provider, idToken, state, error } = parseLoginParams(
    window.document.location.search
  );

  // Check if there's an error
  if (error) {
    throw new Error(error);
  }

  // Check if provider exists and is supported
  if (provider !== 'google') {
    throw new Error(
      `Invalid OAuth provider "${provider}" passed in redirect callback URL`
    );
  }

  // Check if state param matches
  if (!state || decode(decodeURIComponent(state)) !== getStateParam()) {
    throw new Error(
      `Invalid state parameter "${state}" passed in redirect callback URL`
    );
  }

  // Clear params from url
  // Note: In Next.js, use the useRouter hook instead
  // window.history.replaceState({}, document.title, redirectUri);

  // Return Google ID token
  return idToken;
}

/**
 * Check if current url is redirect uri to determine if app was redirected back from external login page
 *
 * @returns {boolean} - True if current url is redirect uri and has redirect params
 */
export function isSignInRedirect(redirectUri) {
  // Check if current url matches redirect uri
  const isRedirectUri = window.location.href.startsWith(redirectUri);
  if (!isRedirectUri) {
    return false;
  }
  // Check url for redirect params
  const { provider, idToken, state, error } = parseLoginParams(
    window.document.location.search
  );
  // Check if current url is redirect uri and has redirect params
  if (isRedirectUri && (provider || idToken || state || error)) {
    return true;
  }
  return false;
}

/**
 * Create query params string from given object
 *
 * @param params {any} - Object of query params
 *
 * @returns {string} - Query string
 */
function createQueryParams(params) {
  // Strip undefined values from params
  const filteredParams = Object.keys(params)
    .filter(k => typeof params[k] !== 'undefined')
    .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});
  // Create query string
  return new URLSearchParams(filteredParams).toString();
}

/**
 * Parse out login parameters from the query string
 *
 * @param {string} search - Query string
 *
 * @returns {params} - Login url params
 * @returns {string} params.provider - OAuth provider
 * @returns {string} params.idToken - Google ID token
 * @returns {string} params.state - OAuth state param
 * @returns {string} params.error - Error message
 */
function parseLoginParams(search) {
  const searchParams = new URLSearchParams(search);
  const provider = searchParams.get('provider');
  const idToken = searchParams.get('id_token');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  return {
    provider,
    idToken,
    state,
    error,
  };
}

/**
 * Get OAuth 2.0 state param from session storage
 *
 * @returns {string} - State param
 */
function getStateParam() {
  return sessionStorage.getItem(STATE_PARAM_KEY);
}

/**
 * Create OAuth 2.0 state param and store it in session storage
 *
 * @returns {string} - State param
 */
function setStateParam() {
  const state = nanoid(15);
  sessionStorage.setItem(STATE_PARAM_KEY, state);
  return state;
}

/**
 * Remove OAuth 2.0 state param from session storage
 *
 * @returns {void}
 */
function removeStateParam() {
  return sessionStorage.removeItem(STATE_PARAM_KEY);
}

/**
 * Encode a string with base64
 *
 * @param value {string} - String to encode
 *
 * @returns {string} - Encoded string
 */
function encode(value) {
  return window.btoa(value);
}

/**
 * Decode a string with base64
 *
 * @param value {string} - String to decode
 *
 * @returns {string} - Decoded string
 */
function decode(value) {
  return window.atob(value);
}
