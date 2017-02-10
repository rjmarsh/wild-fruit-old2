import express from 'express';
import routes from './routes/index';
import { port } from './config';
import bodyParser from 'body-parser';

const server = express();

const errHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(err); // eslint-disable-line no-console
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.send({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  });
};

server
// api
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.use('/api', routes)
	// static assets
	.use('/', express.static('./static'))
	.use('/static', express.static('./static'))
	.use(errHandler);

server.listen(port, function () {
	/* eslint-disable no-console */
	console.log(`The server is running at http://localhost:${port}/`);
});