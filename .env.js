module.exports = {

	oktaTenant: "https://partnerpoc.oktapreview.com",

	okta: {
		redirect_uri: "http://localhost:3090",

		experian_proxy: "http://34.235.5.179:3050",
		authn: { // for admins to run the demo
			tenantName: 'oktabiz',
			domain: 'okta.com',

			client_id: '0oa1ctd4624WvBclY1d8',
			client_secret: 'BAifyC8LR8TMl5mZc37k6yi9Exerplk4MTMrfgRV',
		},
		reg: { // for end-users
			tenantName: 'partnerpoc',
			domain: 'oktapreview.com',
			api_key: "00krYRESVGC4BWQ3ZJNgvfktgM17A7BICxwepl4X4p"
		}
	}
}