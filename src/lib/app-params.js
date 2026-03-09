// Simplified app params for static site
const isNode = typeof window === 'undefined';

const getAppParams = () => {
	if (isNode) {
		return {
			appId: null,
			token: null,
			fromUrl: null,
			functionsVersion: null,
			appBaseUrl: null,
		};
	}
	return {
		appId: null,
		token: null,
		fromUrl: window.location.href,
		functionsVersion: null,
		appBaseUrl: null,
	}
}

export const appParams = {
	...getAppParams()
}
