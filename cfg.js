
global._CFG = {}

global._CFG.APIGEE = {}
global._CFG.APIGEE.PROXY_URI = process.env.APIGEE_PROXY_URI
global._CFG.APIGEE.DISPLAY_NAME = "Apigee"
global._CFG.APIGEE.LINKS = []
global._CFG.APIGEE.LINKS.push({name: "Integration Guide", href: "https://docs.google.com/document/d/1p1nFTU0SXu2yvfEZeHlilCjbUT2-11Xh3yAUa8vBU5A"})

global._CFG.GOOGLE = {}
global._CFG.GOOGLE.PROXY_URI = process.env.GOOGLE_PROXY_URI
global._CFG.GOOGLE.DISPLAY_NAME = "Google"
global._CFG.GOOGLE.LINKS = []
global._CFG.GOOGLE.LINKS.push({name: "Integration Guide", href: "https://docs.google.com/document/d/1Jqsb-PjiVXS508V_yyTAPKVABDDzZsVIGCaa7dRBXks"})
global._CFG.GOOGLE.LINKS.push({name: "Architecture", href: "https://drive.google.com/file/d/1rWHJ2KTY2UqK359yLwMIK1sNibf_j4Xa"})

global._CFG.MULESOFT = {}
global._CFG.MULESOFT.PROXY_URI = process.env.MULESOFT_PROXY_URI
global._CFG.MULESOFT.DISPLAY_NAME = "Mulesoft"
global._CFG.MULESOFT.LINKS = []
global._CFG.MULESOFT.LINKS.push({name: "Integration Guide", href: "https://docs.google.com/document/d/1et0ayMddVoz7Hnx4ullU_cC9ah_GLisFDXBhHuSH1RU"})
global._CFG.MULESOFT.LINKS.push({name: "Architecture", href: "https://drive.google.com/file/d/1fTxk5wsWlEMfFqft1d_ap3k81HBbBWW6"})

global.OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID
global.OKTA_CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET
global.OKTA_AUTH_SERVER_ID = process.env.OKTA_AUTH_SERVER_ID
global.OKTA_TENANT = process.env.OKTA_TENANT

global.REDIRECT_URI_BASE = process.env.REDIRECT_URI_BASE

global.SESSION_SECRET = process.env.SESSION_SECRET
global.SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE)

global.OKTA_OAUTH_PATH = OKTA_TENANT + "/oauth2/" + OKTA_AUTH_SERVER_ID + "/v1/"