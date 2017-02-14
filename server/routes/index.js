import express from 'express';
import { username, passkey, domain } from '../config';

const router = new express.Router();

function handleResponse(res, next) {
	return (err, data) => {
		if (err) {
			next(err);
		} else {
			res.send(data);
		}
	};
}

/*
router.get('/incidents', (req, res, next) => {
});
*/

module.exports = router;
