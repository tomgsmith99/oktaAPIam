
global._CFG = {}

global._CFG.APIGEE = {}
global._CFG.APIGEE.PROXY_URI = process.env.APIGEE_PROXY_URI

global._CFG.GOOGLE = {}
global._CFG.GOOGLE.PROXY_URI = process.env.GOOGLE_PROXY_URI

global._CFG.MULESOFT = {}
global._CFG.MULESOFT.PROXY_URI = process.env.MULESOFT_PROXY_URI

global.OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID
global.OKTA_CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET
global.OKTA_AUTH_SERVER_ID = process.env.OKTA_AUTH_SERVER_ID
global.OKTA_TENANT = process.env.OKTA_TENANT

global.REDIRECT_URI_BASE = process.env.REDIRECT_URI_BASE

global.SESSION_SECRET = process.env.SESSION_SECRET
global.SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE)

global.OKTA_OAUTH_PATH = OKTA_TENANT + "/oauth2/" + OKTA_AUTH_SERVER_ID + "/v1/"