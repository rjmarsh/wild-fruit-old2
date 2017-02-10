const https = require('https');
const os = require('os');
const querystring = require('querystring');
const fs = require('fs');

const CLIENT_TYPE = 'node.https';
const CLIENT_VERSION = '1.0';

/**
 * Class to allow easy access to the SKMS Web API.
 * This version of the class requires the following:
 * @version v1.0
 */
class SkmsWebApiClient{
	/**
	 * This is the constructor method. It can be passed the username, passkey, and skms_domain settings.
	 * @param {string} username The username to use to login to the SKMS Web API
	 * @param {string} passkey The passkey to use to login to the SKMS Web API
	 * @param {string} skms_domain The hostname of the SKMS that will be accessed
	 */
	constructor(username, passkey, skms_domain) {
		this.username = username;
		this.passkey = passkey;
		this.skms_domain = skms_domain;

		this.debug = false;
		this.request_timeout = 25000;
		this.verify_ssl_chain = true;

		this.response_header = '';
		this.response_str = '';
		this.error_message = '';
	}

	/**
	 * Enables the debug mode which will return debug information with all messages.
	 */
	enableDebugMode() {
		this.debug = true;
	}

	/**
	 * Disables the debug mode which will return debug information with all messages.
	 */
	disableDebugMode() {
		this.debug = false;
	}

	/**
	 * Returns the current request timeout setting
	 * @returns {Number} The current request timeout in milliseconds
	 */
	getRequestTimeout() {
		return this.request_timeout;
	}

	/**
	 * Sets the request timeout setting
	 * @param {Number} timeout The timeout to set in milliseconds
	 */
	setRequestTimeout(timeout) {
		if(Number.isInteger(timeout) && timeout > 0) {
			this.request_timeout = timeout;
		}
	}

	/**
	 * Enables Skms Session Optimization by storing session information in a local file that will be reused in future requests.
	 * @param {string} skms_session_storage_file The path to the file where session information should be stored.
	 */
	enableSkmsSessionOptimization(skms_session_storage_file) {
		fs.readFile(skms_session_storage_file, 'utf8', (err, data) => {
			if(data) {
				try {
					const session_info = JSON.parse(data);
					if(session_info.skms_session_id) {
						this.setSkmsSessionId(session_info.skms_session_id);
					}
					if(session_info.skms_csrf_token) {
						this.setSkmsCsrfToken(session_info.skms_csrf_token);
					}
				} catch(err) {
					// Don't do anything if data can't be parsed
				}
			}
		});

		this.skms_session_storage_file = skms_session_storage_file;
	}

	/**
	 * Returns the SKMS session id returned from the last request. Returns undefined if there is no session id.
	 * @returns {string|undefined} The session_id or undefined
	 */
	getSkmsSessionId() {
		return this.skms_session_id;
	}

	/**
	 * Sets the SKMS session id
	 * @param {string} skms_session_id The SKMS session id
	 */
	setSkmsSessionId(skms_session_id) {
		if(skms_session_id.trim() != '') {
			this.skms_session_id = skms_session_id;
		}
	}

	/**
	 * Returns the latest SKMS CSRF Token. Returns undefined if there is no CSRF token.
	 * @return {string|undefined} The CSRF token or undefined
	 */
	getSkmsCsrfToken() {
		return this.skms_csrf_token;
	}

	/**
	 * Sets the SKMS CSRF Token
	 * @param {string} skms_csrf_token The CSRF Token
	 */
	setSkmsCsrfToken(skms_csrf_token) {
		this.skms_csrf_token = skms_csrf_token;
	}

	/**
	 * Enables SSL Chain Verification
	 */
	enableSslChainVerification() {
		this.verify_ssl_chain = true;
	}

	/**
	 * Disables SSL Chain Verification
	 */
	disableSslChainVerification() {
		this.verify_ssl_chain = false;
	}

	/**
	 * Sends a request based on the passed in object_name, method_name, and method_params
	 * @param {string} object_name The name of the object to access via the API.
	 * @param {string} method_name The name of the method to access via the API.
	 * @param {object} method_params An associative array of key/value pairs that represent parameters that will be passed to the method
	 * @param {function} callback The callback function that will be called when the request completes
	 */
	sendRequest(object_name, method_name, method_params, callback) {
		// Debug
		if(this.debug) {
			method_params['_debug'] = true;
		}

		// Tracking Data
		method_params['_client_type'] = CLIENT_TYPE;
		method_params['_client_ver'] = CLIENT_VERSION;
		method_params['_client_script'] = __filename;
		method_params['_client_hostname'] = os.hostname();
		method_params['_client_username'] = os.userInfo().username;

		// Username and Passkey
		if(this.username.trim() != '' && this.passkey.trim() != '') {
			method_params['_username'] = this.username;
			method_params['_passkey'] = this.passkey;
		}

		// CSRF
		if(this.skms_csrf_token) {
			method_params['csrf_token'] = this.skms_csrf_token;
		}

		method_params['_object'] = object_name;
		method_params['_method'] = method_name;

		const post_data = querystring.stringify({'_parameters': JSON.stringify(method_params)});

		const http_options = {
			host: this.skms_domain,
			path: '/web_api/',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': post_data.length
			},
			rejectUnauthorized: this.verify_ssl_chain
		};

		// Add Session Cookie (if applicable)
		if(this.skms_session_id) {
			let cookie_name = 'SkmsSID';
			if(this.skms_domain.match(/\.dev\.skms/i)) {
				cookie_name = 'dev_' + cookie_name;
			}

			http_options.headers['Cookie'] = cookie_name + '=' + encodeURIComponent(this.skms_session_id);
		}

		const req = https.request(http_options, (res) => {
			res.setEncoding('utf8');

			this.response_header = res.headers;

			// Pull Out Session Cookie and CSRF Token from header
			if(res.headers && res.headers['set-cookie']) {
				res.headers['set-cookie'].forEach((cookie) => {
					const session_id_matches = cookie.match(/(?:dev_)?SkmsSID=([^;]+);/);
					if(session_id_matches && session_id_matches[1] && session_id_matches[1].length > 0) {
						this.skms_session_id = session_id_matches[1];
					}

					const csrf_matches = cookie.match(/(?:dev_)?csrf_token=([^;]+);/);
					if(csrf_matches && csrf_matches[1] && csrf_matches[1].length > 0) {
						this.skms_csrf_token = csrf_matches[1];
					}
				});
			}

			// Check for session storage
			if(this.skms_session_storage_file) {
				const session_info = {
					skms_session_id: this.skms_session_id,
					skms_csrf_token: this.skms_csrf_token
				};
				fs.writeFile(this.skms_session_storage_file, JSON.stringify(session_info));
			}

			let response_data = '';
			res.on('data', (chunk) => {
				response_data += chunk;
			});

			res.on('end', () => {
				this.response_str = response_data;

				// Check Response Status
				const response_arr = this.getResponseArray();
				if(response_arr === false) {
					this.error_message = 'Unable to JSON decode the response string.';
					callback.call(this);
					return;
				}
				let status = 'unknown';
				if(response_arr.status && response_arr.status.trim() != "") {
					status = response_arr['status'];
				}

				if(status.toLocaleLowerCase() != "success") {
					// Pull out error messages
					const error_message_arr = this.getErrorMessageArray();
					if(error_message_arr.length > 1) {
						this.error_message = "The API returned " + error_message_arr.length + " error messages:\n";
						for(let i = 0; i < error_message_arr.length; i++) {
							this.error_message += (i + 1) + '. ' + error_message_arr[i].message + "\n";
						}
					} else if(error_message_arr.length == 1) {
						this.error_message = error_message_arr[0].message;
					} else {
						this.error_message = 'The status was returned as "' + status + '" but no errors were in the messages array.';
					}
				}

				callback.call(this);
			});
		});

		req.setTimeout(this.request_timeout, () => {
			this.error_message = 'Request timed out';
			req.abort();
			callback.call(this);
		});

		req.on('error', (err) => {
			this.error_message = 'Error making request: ' + err;
			callback.call(this);
		});

		req.end(post_data);
	}

	/**
	 * Returns the response header of the last request.
	 * @return {string} The response header
	 */
	getResponseHeader() {
		return JSON.stringify(this.response_header);
	}

	/**
	 * Returns the response string of the last request.
	 * @return {string} The response string
	 */
	getResponseString() {
		return this.response_str;
	}

	/**
	 * Returns an associative array that was created by decoding the returned JSON. If the JSON could not be decoded, false will be returned.
	 * @return {array|Boolean} The decoded array or bool false
	 */
	getResponseArray() {
		try {
			return JSON.parse(this.response_str);
		} catch(e) {
			return false;
		}
	}

	/**
	 * Returns the 'status' field from the response if it can be found. Otherwise, a blank string is returned.
	 * @return {string} The status string
	 */
	getResponseStatus() {
		const response_arr = this.getResponseArray();
		if(response_arr.status) {
			return response_arr.status;
		} else {
			return '';
		}
	}

	/**
	 * Returns the 'data' array from the response if it can be found. Otherwise, an empty array is returned.
	 * @return {array} The data array from the api response
	 */
	getDataArray() {
		const response_arr = this.getResponseArray();
		if(response_arr.data) {
			return response_arr.data;
		} else {
			return [];
		}
	}

	/**
	 * Returns the 'error_type' field from the response if it can be found. Otherwise, a blank string is returned.
	 * @return {string} The error_type string
	 */
	getErrorType() {
		const response_arr = this.getResponseArray();
		if(response_arr.error_type) {
			return response_arr.error_type;
		} else {
			return '';
		}
	}

	/**
	 * Returns the error message from the last request. Will be an empty string if there was no error.
	 * @return {string} The error message
	 */
	getErrorMessage() {
		return this.error_message;
	}

	/**
	 * Returns an array of messages based on the passed in type. If a blank string is passed in, all message are returned.
	 * @param {string} type The type of message to include in the array (blank for all messages)
	 * @returns {array} An array of messages
	 */
	getMessageArrayByType(type = '') {
		const ret_arr = [];
		const response_arr = this.getResponseArray();
		if(response_arr.messages) {
			response_arr.messages.forEach(function(msg) {
				if(type.trim() == '' || msg.type.toLocaleLowerCase() == type.toLocaleLowerCase()) {
					ret_arr.push(msg);
				}
			});
		}

		return ret_arr;
	}

	/**
	 * Returns an array of messages where type=error
	 * @return {array} An array of error messages
	 */
	getErrorMessageArray() {
		return this.getMessageArrayByType('error');
	}

	/**
	 * Returns an array of all messages
	 * @return {array} All of the messages in the response
	 */
	getAllMessageArray() {
		return this.getMessageArrayByType();
	}
}

module.exports = SkmsWebApiClient;
