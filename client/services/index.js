import fetch from '../core/fetch';

function parseResponse(response) {
	return Promise.all(
		[response.status, response.statusText, response.json()]
	);
}

function checkStatus([status, statusText, data]) {
	if (status < 200 || status > 300) {
		const error = new Error(statusText);
		error.status = status;
		error.error_message = data;
		return Promise.reject(error);
	}
	return data;
}

export default {
	get(url) {
		return fetch(url)
			.then(parseResponse)
			.then(checkStatus);
	},
};
