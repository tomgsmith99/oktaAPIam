
global._CFG = {}

global._CFG.AWS = {}
global._CFG.AWS.PROXY_URI = process.env.AWS_PROXY_URI
global._CFG.AWS.DISPLAY_NAME = "Amazon API Gateway"
global._CFG.AWS.LINKS = []
global._CFG.AWS.LINKS.push({name: "Integration Guide", href: "https://docs.google.com/document/d/1JXuopuDhHV0ky_KJr0qgAq0hjcil1NBqh2WwCWq-KeI/view?usp=sharing"})
global._CFG.AWS.LINKS.push({name: "Flow: Getting an access token", href: "https://drive.google.com/file/d/1ENgxK5dvyvxAuk1VNqShI2v10US2W6VX/view?usp=sharing"})
global._CFG.AWS.LINKS.push({name: "Flow: Token -> AWS API Gateway", href: "https://drive.google.com/file/d/13JHxmLQCumR6WqIC2clvhz3-09dKOkki/view?usp=sharing"})

global._CFG.APIGEE = {}
global._CFG.APIGEE.PROXY_URI = process.env.APIGEE_PROXY_URI
global._CFG.APIGEE.DISPLAY_NAME = "Apigee"
global._CFG.APIGEE.LINKS = []
global._CFG.APIGEE.LINKS.push({name: "Integration Guide", href: "https://docs.google.com/document/d/1p1nFTU0SXu2yvfEZeHlilCjbUT2-11Xh3yAUa8vBU5A"})
global._CFG.APIGEE.LINKS.push({name: "Architecture", href: "https://drive.google.com/open?id=1U_IiBqbijO9uNlDpQjKhwMdThSZUUzwd"})

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