
global._CFG = {}

// the client_id and client_secret values here are *Okta* client
// ids and secrets. So GOOGLE_CLIENT_ID is the Okta client you're
// using for the integration with Google.
global._CFG.GOOGLE = {}
global._CFG.GOOGLE.CLIENT_ID = process.env.GOOGLE_CLIENT_ID
global._CFG.GOOGLE.CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
global._CFG.GOOGLE.PROXY_URI = process.env.GOOGLE_PROXY_URI

global._CFG.MULESOFT = {}
global._CFG.MULESOFT.CLIENT_ID = process.env.MULE_CLIENT_ID
global._CFG.MULESOFT.CLIENT_SECRET = process.env.MULE_CLIENT_SECRET
global._CFG.MULESOFT.PROXY_URI = process.env.MULE_PROXY_URI

global.OKTA_AUTH_SERVER_ID = process.env.OKTA_AUTH_SERVER_ID
global.OKTA_TENANT = process.env.OKTA_TENANT
global.REDIRECT_URI_BASE = process.env.REDIRECT_URI_BASE

global.SESSION_SECRET = process.env.SESSION_SECRET
global.SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE)

global.OKTA_OAUTH_PATH = OKTA_TENANT + "/oauth2/" + OKTA_AUTH_SERVER_ID + "/v1/";

