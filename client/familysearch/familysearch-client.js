import cookiesUtil from './cookies';
import FamilySearch from 'fs-js-lite';

const fsClient = new FamilySearch({

	// A client ID for sandbox is obtained by registering with the FamilySearch developer's website
	appKey: 'a02j000000LrqV5AAJ',

	// When using the the popup method of authentication, the redirect uri doesn't need to be a
	// page that actually exists, it just needs to be a page on the same domain.
	// But in our case we have an example that uses the full redirect method so
	// we set the redirect_uri to the page that handle the redirect response.
	// Here we programmatically set the redirect uri to the base path of the
	// current domain. That helps the sample app work wherever it runs so
	// that we don't have to change this between development and production.
	redirectUri: document.location.protocol + '//' + document.location.host + '/',
//	redirectUri: document.location.protocol + '//' + document.location.host + '/familysearch/authentication-redirect-end',

	// Store the access token in a cookie so that the user doesn't have to
	// login every time the page loads
	saveAccessToken: true,

});

export default {
	getClient() {
		return fsClient;
	},
	getUser() {
		console.log(fsClient.red)
		// In this next section we are populating the username in the header.
		// First we check if the username is stored in a cookie. If we are logged in
		// (have an access token) but don't have a username then we request the
		// current user from the API and save the username in a cookie.
		return new Promise(function(resolve,reject) {
			debugger;
			if(cookiesUtil.getItem('username')) {
				return resolve({
					username: cookiesUtil.getItem('username'),
				});
			}
			if(!fsClient.hasAccessToken()){
				return reject("Username not found")
			}

			return fsClient.getCurrentUser().then(function(response){
				const username = response.getUser().getContactName();
				cookiesUtil.setItem('username', username, 86400);
				return {
					username: username,
				};								// might need to resolve rather than return
			});
		});
	},
	// Function is called when the user clicks the "Sign In" button.
	login() {
		debugger;
		// Redirect the user to the FamilySearch OAuth page
		fsClient.oauthRedirect();
		// we don't return here
	},
	logout() {
		// clear cookie here
		fsClient.deleteAccessToken();
	},
};
