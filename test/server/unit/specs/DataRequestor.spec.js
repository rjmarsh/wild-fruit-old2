const sinon = require('sinon');
const DataRequestor = require('../../../../server/DataRequestor.js');
const SkmsWebApiClient = require('../../../../server/SkmsWebApiClient.js');
const fs = require('fs');

describe('DataRequestor', () => {
	it('should get service data', sinon.test(function(done) {
		new Promise((resolve, reject) => {
			fs.readFile(__dirname + '/DataRequestorDataFiles/services_input.json', 'utf8', (err, service_input) => {
				const clock = sinon.useFakeTimers(1486415848000);

				if(err) {
					reject(err);
				}

				const data_array_spy = this.spy(function () {
					return JSON.parse(service_input);
				});

				this.stub(SkmsWebApiClient.prototype, 'getDataArray', data_array_spy);
				this.stub(SkmsWebApiClient.prototype, 'getResponseStatus').returns("success");

				const api_request = this.stub(SkmsWebApiClient.prototype, 'sendRequest');
				api_request.callsArg(3);

				const data_requestor = new DataRequestor('username', 'passkey', 'skms_domain');
				data_requestor.getServices((err, service_arr) => {
					try {
						expect(err).to.be.null;
						expect(service_arr).to.not.be.null;
						expect(service_arr.md5).to.equal('0c1e1d7c905f9cec13edc632f04d9fb6');
					} catch (e) {
						reject(e);
					}

					// Second call to test caching
					clock.tick(45000);
					data_requestor.getServices((err, service_arr) => {
						try {
							expect(err).to.be.null;
							expect(service_arr).to.not.be.null;
							expect(service_arr.md5).to.equal('0c1e1d7c905f9cec13edc632f04d9fb6');
							expect(data_array_spy.callCount).to.equal(1);
						} catch (e) {
							reject(e);
						}

						// Third call to test cache expiration
						clock.tick(45000);
						data_requestor.getServices((err, service_arr) => {
							try {
								expect(err).to.be.null;
								expect(service_arr).to.not.be.null;
								expect(service_arr.md5).to.equal('0c1e1d7c905f9cec13edc632f04d9fb6');
								expect(data_array_spy.callCount).to.equal(2);
							} catch (e) {
								reject(e);
							}
							resolve();
						});
					});
				});
			});
		}).then(done, done);
	}));
	it('should get incident data', sinon.test(function(done) {
		new Promise((resolve, reject) => {
			// Read input data from files
			const service_promise = new Promise((resolve, reject) => {
				fs.readFile(__dirname + '/DataRequestorDataFiles/services.json', 'utf8', (err, file_data) => {
					if(err) {
						reject(err);
					} else {
						resolve(file_data);
					}
				});
			});

			const incident_promise = new Promise((resolve, reject) => {
				fs.readFile(__dirname + '/DataRequestorDataFiles/incident_input.json', 'utf8', (err, file_data) => {
					if(err) {
						reject(err);
					} else {
						resolve(file_data);
					}
				});
			});

			const global_message_promise = new Promise((resolve, reject) => {
				fs.readFile(__dirname + '/DataRequestorDataFiles/incident_global_message.json', 'utf8', (err, file_data) => {
					if(err) {
						reject(err);
					} else {
						resolve(file_data);
					}
				});
			});

			Promise.all([service_promise, incident_promise, global_message_promise]).then((input_data) => {
				const service_data = JSON.parse(input_data[0]);
				const incident_data = JSON.parse(input_data[1]);
				const global_message_data = JSON.parse(input_data[2]);

				const clock = sinon.useFakeTimers(1486415848000);

				this.stub(DataRequestor.prototype, 'getServices').callsArgWith(0, null, service_data);

				this.stub(SkmsWebApiClient.prototype, 'getDataArray')
					.onCall(0).returns(incident_data)
					.onCall(1).returns(global_message_data)
					.onCall(2).returns(incident_data)
					.onCall(3).returns(global_message_data);

				this.stub(SkmsWebApiClient.prototype, 'getResponseStatus').returns("success");
				this.stub(SkmsWebApiClient.prototype, 'sendRequest').callsArg(3);

				const data_requestor = new DataRequestor('username', 'passkey', 'skms_domain');
				data_requestor.getIncidents((err, incident_arr) => {
					try {
						expect(err).to.be.null;
						expect(incident_arr).to.not.be.null;
						expect(incident_arr.md5).to.equal('03a41b66b759dabbfd76f248af0e8e1c');
					} catch (e) {
						reject(e);
					}

					// Second call to test caching
					clock.tick(45000);
					data_requestor.getIncidents((err, incident_arr) => {
						try {
							expect(err).to.be.null;
							expect(incident_arr).to.not.be.null;
							expect(incident_arr.md5).to.equal('03a41b66b759dabbfd76f248af0e8e1c');
							expect(SkmsWebApiClient.prototype.getDataArray.callCount).to.equal(2);
						} catch (e) {
							reject(e);
						}

						// Third call to test cache expiration
						clock.tick(45000);
						data_requestor.getIncidents((err, incident_arr) => {
							try {
								expect(err).to.be.null;
								expect(incident_arr).to.not.be.null;
								expect(incident_arr.md5).to.equal('03a41b66b759dabbfd76f248af0e8e1c');
								expect(SkmsWebApiClient.prototype.getDataArray.callCount).to.equal(4);
							} catch (e) {
								reject(e);
							}
							resolve();
						});
					});
				});
			}, done);
		}).then(done, done);
	}));
	it('should get maintenance data', sinon.test(function(done) {
		new Promise((resolve, reject) => {
			// Read input data from files
			const service_promise = new Promise((resolve, reject) => {
				fs.readFile(__dirname + '/DataRequestorDataFiles/services.json', 'utf8', (err, file_data) => {
					if(err) {
						reject(err);
					} else {
						resolve(file_data);
					}
				});
			});

			const maintenance_promise = new Promise((resolve, reject) => {
				fs.readFile(__dirname + '/DataRequestorDataFiles/maintenance_input.json', 'utf8', (err, file_data) => {
					if(err) {
						reject(err);
					} else {
						resolve(file_data);
					}
				});
			});

			Promise.all([service_promise, maintenance_promise]).then((input_data) => {
				const service_data = JSON.parse(input_data[0]);
				const maintenance_data = JSON.parse(input_data[1]);

				const clock = sinon.useFakeTimers(1486415848000);

				this.stub(DataRequestor.prototype, 'getServices').callsArgWith(0, null, service_data);
				this.stub(SkmsWebApiClient.prototype, 'getDataArray').returns(maintenance_data);
				this.stub(SkmsWebApiClient.prototype, 'getResponseStatus').returns("success");
				this.stub(SkmsWebApiClient.prototype, 'sendRequest').callsArg(3);

				const data_requestor = new DataRequestor('username', 'passkey', 'skms_domain');

				data_requestor.getMaintenance((err, maintenance_arr) => {
					try {
						expect(err).to.be.null;
						expect(maintenance_arr).to.not.be.null;
						expect(maintenance_arr.md5).to.equal('f558124aeb05519dde02d8d2f5db0b4d');
					} catch (e) {
						reject(e);
					}

					// Second call to test caching
					clock.tick(45000);
					data_requestor.getMaintenance((err, maintenance_arr) => {
						try {
							expect(err).to.be.null;
							expect(maintenance_arr).to.not.be.null;
							expect(maintenance_arr.md5).to.equal('f558124aeb05519dde02d8d2f5db0b4d');
							expect(SkmsWebApiClient.prototype.getDataArray.callCount).to.equal(1);
						} catch (e) {
							reject(e);
						}

						// Third call to test cache expiration
						clock.tick(45000);
						data_requestor.getMaintenance((err, maintenance_arr) => {
							try {
								expect(err).to.be.null;
								expect(maintenance_arr).to.not.be.null;
								expect(maintenance_arr.md5).to.equal('f558124aeb05519dde02d8d2f5db0b4d');
								expect(SkmsWebApiClient.prototype.getDataArray.callCount).to.equal(2);
							} catch (e) {
								reject(e);
							}
							resolve();
						});
					});
				});
			}, done);
		}).then(done, done);
	}));
	it('should get localization data');
});
