import ENV from '../config/environment';
import Oauth2 from 'torii/providers/oauth2-code';

/**
 * This class implements authentication against Dropbox
 * using the client-side OAuth2 authorization flow in a popup window.
 */

export default Oauth2.extend({
  name: 'dropbox-oauth2',
  baseUrl: 'https://www.dropbox.com/1/oauth2/authorize',

  // additional params that this provider requires
  requiredUrlParams: ['client_id', 'redirect_uri', 'response_type'],
  optionalUrlParams: [],

  clientId: ENV.torii.providers['dropbox-oauth2'].apiKey,
  redirectUri: ENV.torii.providers['dropbox-oauth2'].redirectUri,
  responseType: 'code',

  responseParams: ['code', 'state']
});
