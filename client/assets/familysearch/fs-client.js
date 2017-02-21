/**
 * This file contains code to setup the SDK client and detect whether the user is logged in.
 */

require("./cookies.js");

// Setup the SDK client
var fsClient = new FamilySearch({

	// A client ID for sandbox is obtained by registering with the FamilySearch developer's website
	fs_client_id: 'a02j000000LrqV5AAJ',

	// When using the the popup method of authentication, the redirect uri doesn't need to be a
	// page that actually exists, it just needs to be a page on the same domain.
	// But in our case we have an example that uses the full redirect method so
	// we set the redirect_uri to the page that handle the redirect response.
	// Here we programmatically set the redirect uri to the base path of the
	// current domain. That helps the sample app work wherever it runs so
	// that we don't have to change this between development and production.
	redirect_uri: document.location.protocol + '//' + document.location.host + '/fsClient/assets/familysearch',

	// Store the access token in a cookie so that the user doesn't have to
	// login every time the page loads
	save_access_token: true,

	// Sandbox is the testing environment
	environment: 'sandbox'

});

// In this next section we are populating the username in the header.
// First we check if the username is stored in a cookie. If we are logged in
// (have an access token) but don't have a username then we request the
// current user from the API and save the username in a cookie.
var promise;
if (cookiesUtil.getItem('username')) {
	promise = Promise.resolve(cookiesUtil.getItem('username'));
} else if (fsClient.hasAccessToken()) {
	promise = fsClient.getCurrentUser().then(function (response) {
		var username = response.getUser().getContactName();
		// Expire cookie after 24 hours (86400 seconds)
		cookiesUtil.setItem('username', username, 86400);
		return username;
	});
}


// If we have a username then add it to the header
if (promise) {
	promise.then(function (username) {
		$('#username').text(username);
		$('#signOut').click(signOut).show();
	});
}

function signOut() {
	fsClient.invalidateAccessToken();
	cookiesUtil.removeItem('username');
	document.location.reload();
}
