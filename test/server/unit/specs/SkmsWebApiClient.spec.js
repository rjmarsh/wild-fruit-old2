const http = require('http');
const sinon = require('sinon');
const PassThrough = require('stream').PassThrough;
const SkmsWebApiClient = require('../../../../server/SkmsWebApiClient.js');

describe('SkmsWebApiClient', () => {
	const api = new SkmsWebApiClient('username', 'passkey', 'test.skms.adobe.com');

	it('should get response data', (done) => {
		const test_reply_header = {'Content-Type': 'application/json', 'Set-Cookie':'dev_SkmsSID=864106_3564e09f9e110.588f6166efc99;'};
		const test_data = {"results": [{"service_id": "1211","name": "SiteCatalyst"}],"paging_info": {"item_count": 1,"items_per_page": 25,"current_page": 1,"last_page": 1}};
		const test_reply = {"status": "success","test_mode": true,"error_type": "","messages": [],"data": test_data};

		const request = new PassThrough();
		request.setTimeout = function() {};

		const response = new PassThrough();
		response.headers = test_reply_header;
		response.write(JSON.stringify(test_reply));
		response.end();

		const http_request = sinon.stub(http, 'request');
		http_request.callsArgWith(1, response).returns(request);

		const query = 'SELECT service_id, name WHERE service_id=1211';
		api.sendRequest('ServiceDao', 'search', {params: query}, () =>{
			expect(api.getDataArray()).to.deep.equal(test_data);
			expect(api.getResponseHeader()).to.equal(JSON.stringify(test_reply_header));
			expect(JSON.parse(api.getResponseString())).to.deep.equal(test_reply);
			expect(api.getResponseArray()).to.deep.equal(test_reply);
			expect(api.getResponseStatus()).to.equal("success");
			done();
		});

		http.request.restore();
	});

	it('should report errors', (done) => {
		const test_reply_header = {'Content-Type': 'application/json', 'Set-Cookie':'dev_SkmsSID=864106_3564e09f9e110.588f6166efc99;'};
		const error = {"type": "error","message": "You cannot specify a from table or any table joins. The from table is automatically selected based on the called object and the table joins are automatically built based on the fields specified in the select and where clauses.", "error_code": ""};
		const test_reply = {"status": "error","test_mode": true, "error_type":"unknown","messages":[error],"data": {}};

		const request = new PassThrough();
		request.setTimeout = function() {};

		const response = new PassThrough();
		response.headers = test_reply_header;
		response.write(JSON.stringify(test_reply));
		response.end();

		const http_request = sinon.stub(http, 'request');
		http_request.callsArgWith(1, response).returns(request);

		const query = 'SELECT service_id, name WHERE service_id=1211';
		api.sendRequest('ServiceDao', 'search', {params: query}, () =>{
			expect(api.getResponseHeader()).to.equal(JSON.stringify(test_reply_header));
			expect(JSON.parse(api.getResponseString())).to.deep.equal(test_reply);
			expect(api.getResponseArray()).to.deep.equal(test_reply);
			expect(api.getResponseStatus()).to.deep.equal("error");
			expect(api.getErrorType()).to.equal('unknown');
			expect(api.getErrorMessage()).to.equal(error.message);
			expect(api.getErrorMessageArray()).to.deep.equal([error]);
			expect(api.getAllMessageArray()).to.deep.equal([error]);
			done();
		});

		http.request.restore();
	});
});