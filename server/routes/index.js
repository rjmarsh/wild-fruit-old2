import express from 'express';
import DataRequestor from '../DataRequestor';
import { username, passkey, domain } from '../config';

const router = new express.Router();
const requestor = new DataRequestor(username, passkey, domain);

function handleResponse(res, next) {
	return (err, data) => {
		if (err) {
			next(err);
		} else {
			res.send(data);
		}
	};
}

router.get('/incidents', (req, res, next) => {
	requestor.getIncidents(handleResponse(res, next));
});

router.get('/maintenance', (req, res, next) => {
	requestor.getMaintenance(handleResponse(res, next));
});

router.get('/services', (req, res, next) => {
	requestor.getServices(handleResponse(res, next));
});

module.exports = router;
