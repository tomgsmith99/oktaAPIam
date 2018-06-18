# Okta API Center

The Okta API Center gives developers a tool to see how easily Okta's API Access Management (OAuth as a Service) capabiltiies integrate with leading API gateways and application proxies.

Okta is a standards-compliant OAuth 2.0 authorization server and a certified OpenID Provider.

## Quick set-up

If you just want to get started and see what this is all about, you just need the following:

1. An Okta tenant. If you don't already have one, you can get a free, long-lived tenant at [developer.okta.com](https://developer.okta.com/signup/)
2. An Okta API Token. Once you've activated your tenant, you can follow the instructions [here](https://developer.okta.com/docs/api/getting_started/getting_a_token) to get a token.
3. An API Gateway. Today the API center supports the following gateways: Apigee, Amazon API Gateway, and Mulesoft. Support for more gateways is planned. And, please note that as a standards-compliant OAuth 2.0 authorization server and a certified OpenID Provider, Okta works with any solution that supports those standards.

With those items in hand, you can install the node app:

*************SETUP.JS*****************

```javascript
npm install
```

To set up your Okta tenant quickly, you can run the Okta bootstrapper script (beta):

```javascript
node okta_bootstrap.js
```

This will set up your Okta tenant will all of the required users, groups, authorization server, etc. (If you would rather set up your tenant manually you can follow the instructions here.)

Now that you have an Okta authorization server and client, you can add them to your API gateway, following the instructions for your gateway:

* Amazon API Gateway
* Apigee
* Mulesoft

Now, everything is set up, and you can launch the web app:

```javascript
node app.js
```

## Overview

An API access management workflow typically includes the following components:
* An API
* An API gateway
* An application
* An OAuth server
* An identity provider

And, of course, a use-case to drive the configuration of all of those components.

This tool uses a simple use-case to illustrate how the overall flow works:

* You are managing a "solar system" API.
* You want to control access to the API so that only users with a "silver" scope get access to a list of the planets, and only users with a "gold" scope get access to a list of the moons.

With that use-case as context, the components are set up as follows:

### API
Okta provides a very simple solar system API on heroku: https://okta-api-am.herokuapp.com
This API echoes a list (json object) of the planets: https://okta-api-am.herokuapp.com/planets
And a (partial!) list of the moons: https://okta-api-am.herokuapp.com/moons
For demo purposes, the API is wide open. In a real-world use-case you would of course lock down the API so that it could only be accessed through your gateway.

### API Gateway
To set up Okta as an authorization server for your gateway, follow the instructions for your gateway:
* An API gateway
* An application
* An OAuth server
* An identity provider

### Application
The application that coordinates all of the components and UI is the node app.js application included in this repo. The application loads all of the configuration values and launches a web server (Express) to present an end-user UI.

### OAuth server, identity provider
In this case, Okta will be the OAuth server and the identity provider. You have a couple of options to set up your Okta tenant. You can either use the Okta bootstrapper tool, which is an npm package referenced in the node package. Or, you can set up your Okta tenant "manually" following the instructions here.