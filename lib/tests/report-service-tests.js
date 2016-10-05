/*global requirejs, describe, it, logger, chai, mocha*/
(function(){

	requirejs(['../services/report3Service.js'], function() {

		mocha.setup('bdd');

		var service = window.services.report3Service();
		console.log('loaded', service);

		var expect = chai.expect,
			_refErr = new Error('Unit test reference error'),
			_courses = JSON.parse('[{"id":"welcome-to-dd","name":"Welcome to Dunkin\' Donuts!","los":[{"id":"welcome-1","name":"Introduction","type":"Video"},{"id":"welcome-2","name":"History","type":"Video"},{"id":"welcome-3","name":"Future","type":"Video"}],"show":true},{"id":"guest-services","name":"Guest Services","los":[{"id":"guest-services-1","name":"Guest First Commitment","type":"Online Class"},{"id":"guest-services-2","name":"The Six Steps of Guest Services","type":"Online Class"},{"id":"guest-services-3","name":"Serving Guest with Disabilities","type":"Online Class"},{"id":"guest-services-4","name":"Meeting Guest Expectations","type":"Online Class"}],"show":true},{"id":"crew-only","name":"Crew only","los":[{"id":"crew-only-1","name":"Crew Beginners","type":"Video"},{"id":"crew-only-2","name":"Crew Intermediary","type":"Video"},{"id":"crew-only-3","name":"Crew Advanced","type":"Video"}],"show":true}]'),
			_personManager = JSON.parse('{"id":6543,"name":"Ella Cunningham","title":"Manager","los":[{"id":"welcome-1","value":2,"segmentId":"welcome-to-dd"},{"id":"welcome-2","value":1,"segmentId":"welcome-to-dd"},{"id":"welcome-3","value":0,"segmentId":"welcome-to-dd"},{"id":"guest-services-1","value":2,"segmentId":"guest-services"},{"id":"guest-services-2","value":2,"segmentId":"guest-services"},{"id":"guest-services-3","value":1,"segmentId":"guest-services"},{"id":"guest-services-4","value":0,"segmentId":"guest-services"}]}'),
			_personCrew = JSON.parse('{"id":6544,"name":"Max Garcia","title":"Crew Member","los":[{"id":"welcome-1","value":0,"segmentId":"welcome-to-dd"},{"id":"welcome-2","value":1,"segmentId":"welcome-to-dd"},{"id":"welcome-3","value":2,"segmentId":"welcome-to-dd"},{"id":"guest-services-1","value":2,"segmentId":"guest-services"},{"id":"guest-services-2","value":1,"segmentId":"guest-services"},{"id":"guest-services-3","value":0,"segmentId":"guest-services"},{"id":"guest-services-4","value":0,"segmentId":"guest-services"},{"id":"crew-only-1","value":1,"segmentId":"crew-only"},{"id":"crew-only-2","value":1,"segmentId":"crew-only"},{"id":"crew-only-3","value":2,"segmentId":"crew-only"}]}'),
			
			_expectedData = {
				manager: {
					row: {
						summary: {
							value: 42,
							suffix: '%'
						},
						'welcome-to-dd': {
							value: 33,
							suffix: '%'
						},
						'guest-services':  {
							value: 50,
							suffix: '%'
						},
						'crew-only': {
							value: 'N/A',
							suffix: ''
						}
					}
				},
				crew: {
					row: {
						summary: {
							value: 30,
							suffix: '%'
						},
						'welcome-to-dd': {
							value: 33,
							suffix: '%'
						},
						'guest-services':  {
							value: 25,
							suffix: '%'
						},
						'crew-only': {
							value: 33,
							suffix: '%'
						}
					}
				}
			};


		// var logger = require('../../../lib/index.js');
		// var chromeTransport = require('../../../lib/clientSideTransports/chromeTransport');
		// var htmlTransport = require('../../../lib/clientSideTransports/htmlTransport');

		describe('report3Service', function() {

			it('service: should not be undefined', function(done) {
				expect(service).to.not.be.undefined;
				done();
			});

			// respondTo tests
			it('service: should respond to', function(done) {
				expect(service).to.respondTo('getModel');
				expect(service).to.respondTo('recalculate');
				done();
			});

			// properties tests
			it('service: should have "private" property', function(done) {
				expect(service.private).to.be.an('object');
				done();
			});

			// service.private tests
			describe('service.private', function() {
				var private = service.private;

				it('service.private: should respond to', function(done) {
					expect(private).to.respondTo('getPersonSegmentCellCss');
					expect(private).to.respondTo('getPersonRow');
					expect(private).to.respondTo('aggregateSegmentByStore');
					expect(private).to.respondTo('aggregateLoByStore');
					done();
				});

				// properties tests
				it('service.private: should have "personLoCells" property', function(done) {
					expect(private.personLoCells).to.be.an('object');
					done();
				});
			});

			// service.private.personLoCells tests
			describe('service.private.personLoCells', function() {
				var personLoCells = service.private.personLoCells;

				// properties tests
				it('service.private: should have "personLoCells" property', function(done) {
					expect(personLoCells).to.be.an('object');
					done();
				});

				// personLoCells tests
				it('service.private.personLoCells: should return correct label and css when value is 0 (zero)', function(done) {
					var value = 0, item = personLoCells[value];
					expect(item).to.be.an('object');
					expect(item.value).to.be.a('string')
						.to.equal('Not Started');
					expect(item.css).to.be.a('string')
						.to.equal('');
					done();
				});
				it('service.private.personLoCells: should return correct label and css when value is 1 (one)', function(done) {
					var value = 1, item = personLoCells[value];
					expect(item).to.be.an('object');
					expect(item.value).to.be.a('string')
						.to.equal('In Progress');
					expect(item.css).to.be.a('string')
						.to.equal('in-progress');
					done();
				});
				it('service.private.personLoCells: should return correct label and css when value is 2 (two)', function(done) {
					var value = 2, item = personLoCells[value];
					expect(item).to.be.an('object');
					expect(item.value).to.be.a('string')
						.to.equal('Completed');
					expect(item.css).to.be.a('string')
						.to.equal('completed');
					done();
				});
			});

			// service.private.getPersonSegmentCellCss tests
			describe('service.private.getPersonSegmentCellCss', function() {
				var getPersonSegmentCellCss = service.private.getPersonSegmentCellCss;

				// getPersonSegmentCellCss tests
				it('service.private.getPersonSegmentCellCss: should not throw', function(done) {
					var fn = function () { 
						try {
							var cell = {
								value: 'N/A'
							};

							getPersonSegmentCellCss(cell);
						} catch (e) {
							throw _refErr;
						}
					};

					// expect to not throw
					expect(fn).to.not.throw(_refErr);
					done();
				});
				it('service.private.getPersonSegmentCellCss: should throw when invalid arguments', function(done) {
					var test = this.test,
						fn = function () { 
							try {
								getPersonSegmentCellCss(); // calling without argument should cause it to throw
							} catch (e) {
								console.log(test.title + ': Expected exception thrown', e);
								throw _refErr;
							}
						};

					// expect to throw
					expect(fn).to.throw(_refErr);
					done();
				});
				it('service.private.getPersonSegmentCellCss: should return correct css when value is N/A or not a number', function(done) {
					var cell = {
						value: 'N/A'
					}, item = getPersonSegmentCellCss(cell);
					expect(item).to.be.a('string')
						.to.equal('col-group na');
					done();
				});
				it('service.private.getPersonSegmentCellCss: should return correct css when value is exactly 100', function(done) {
					var cell = {
						value: 100
					}, item = getPersonSegmentCellCss(cell);
					expect(item).to.be.a('string')
						.to.equal('col-group completed');
					done();
				});
				it('service.private.getPersonSegmentCellCss: should return correct css when value is > 0 and < 100', function(done) {
					var cell = {
						value: 99
					}, item = getPersonSegmentCellCss(cell);
					expect(item).to.be.a('string')
						.to.equal('col-group in-progress');

					// test lower boundary
					cell.value = 1;
					item = getPersonSegmentCellCss(cell);
					expect(item).to.be.a('string')
						.to.equal('col-group in-progress');
					done();
				});
				it('service.private.getPersonSegmentCellCss: should return correct css when value is 0 (zero)', function(done) {
					var cell = {
						value: 0
					}, item = getPersonSegmentCellCss(cell);
					expect(item).to.be.a('string')
						.to.equal('col-group');
					done();
				});
			});

			// service.private.getPersonRow tests
			describe('service.private.getPersonRow', function() {
				var getPersonRow = service.private.getPersonRow;
				// getPersonRow tests
				it('service.private.getPersonRow: should not throw', function(done) {
					this.timeout(3000);
					var test = this.test,
						fn = function () { 
							try {
								var cell = {
									value: 'N/A'
								};

								getPersonRow(_courses, _personManager);
							} catch (e) {
								console.log(test.title + ': UNEXPECTED exception thrown', e);
								debugger;
								throw _refErr;
							}
						};

					// expect to not throw
					expect(fn).to.not.throw(_refErr);
					done();
				});
				it('service.private.getPersonRow: should throw when invalid arguments', function(done) {
					this.timeout(3000);
					var test = this.test,
						fn = function () { 
							try {
								getPersonRow(); // calling without argument should cause it to throw
							} catch (e) {
								console.log(test.title + ': Expected exception thrown', e);
								throw _refErr;
							}
						};

					// expect to throw
					expect(fn).to.throw(_refErr);
					done();
				});

				it('service.private.getPersonRow: returned row should have the proper structure for a person of type manager', function(done) {
					var test = this.test,
						result = getPersonRow(_courses, _personManager);

					console.log(test.title + ': result', JSON.stringify(result));
					
					expect(result).to.not.be.undefined;
					expect(result).to.be.an('object');

					var rowExpectedKeys = [
						'isChild'
						, 'show'
						, 'category'
						, 'summary'
					];

					// we are expecting the row to have a cell for each course and also for each course.los
					_.each(_courses, function(course) {
						rowExpectedKeys.push(course.id);
						_.each(course.los, function(lo) {
							rowExpectedKeys.push(course.id + '_' + lo.id);
						});
					});

					console.log(test.title + ': rowExpectedKeys', rowExpectedKeys);
					
					expect(result).to.have.all.keys(rowExpectedKeys);
					done();
				});

				it('service.private.getPersonRow: returned row should have the proper structure for a person of type crew', function(done) {
					var test = this.test,
						result = getPersonRow(_courses, _personCrew);

					console.log(test.title + ': result', JSON.stringify(result));

					expect(result).to.not.be.undefined;
					expect(result).to.be.an('object');

					var rowExpectedKeys = [
						'isChild'
						, 'show'
						, 'category'
						, 'summary'
					];

					// we are expecting the row to have a cell for each course and also for each course.los
					_.each(_courses, function(course) {
						rowExpectedKeys.push(course.id);
						_.each(course.los, function(lo) {
							rowExpectedKeys.push(course.id + '_' + lo.id);
						});
					});

					console.log(test.title + ': rowExpectedKeys', rowExpectedKeys);
					
					expect(result).to.have.all.keys(rowExpectedKeys);
					done();
				});

				// data checks
				it('service.private.getPersonRow: returned row should have valid row summary for a person of type manager', function(done) {
					var test = this.test,
						result = getPersonRow(_courses, _personManager);

					//console.log(test.title + ': result', JSON.stringify(result));
					//console.log(test.title + ': result.summary', JSON.stringify(result.summary));
					
					expect(result.summary).to.not.be.undefined;
					expect(result.summary).to.have.all.keys([
						'value', 'suffix'
					]);

					var expectedCell = _expectedData.manager.row.summary;
					expect(result.summary.value).to.equal(expectedCell.value);
					expect(result.summary.suffix).to.equal(expectedCell.suffix);
					
					done();
				});

				it('service.private.getPersonRow: returned row should have valid row summary for a person of type crew', function(done) {
					var test = this.test,
						result = getPersonRow(_courses, _personCrew);

					//console.log(test.title + ': result', JSON.stringify(result));
					//console.log(test.title + ': result.summary', JSON.stringify(result.summary));
					
					expect(result.summary).to.not.be.undefined;
					expect(result.summary).to.have.all.keys([
						'value', 'suffix'
					]);

					var expectedCell = _expectedData.crew.row.summary;
					expect(result.summary.value).to.equal(expectedCell.value);
					expect(result.summary.suffix).to.equal(expectedCell.suffix);
					
					done();
				});

				it('service.private.getPersonRow: returned row should have valid course cells values for a person of type manager', function(done) {
					var test = this.test,
						result = getPersonRow(_courses, _personManager);

					//console.log(test.title + ': result', JSON.stringify(result));

					_.each(_courses, function(course) {
						var expectedCell = _expectedData.manager.row[course.id],
							courseCell = result[course.id];
						
						console.log(test.title + ': expectedCell: ' + expectedCell + ' courseCell:', JSON.stringify(courseCell));

						expect(courseCell).to.not.be.undefined;
						expect(courseCell.value).to.equal(expectedCell.value);
						expect(courseCell.suffix).to.equal(expectedCell.suffix);

						if (courseCell.value === 'N/A') {
							expect(courseCell.isNA).to.equal(true);
						}
					});
					
					done();
				});

				it('service.private.getPersonRow: returned row should have valid course cells values for a person of type crew', function(done) {
					var test = this.test,
						result = getPersonRow(_courses, _personCrew);

					//console.log(test.title + ': result', JSON.stringify(result));

					_.each(_courses, function(course) {
						var expectedCell = _expectedData.crew.row[course.id],
							courseCell = result[course.id];
						
						console.log(test.title + ': expectedCell: ' + expectedCell + ' courseCell:', JSON.stringify(courseCell));

						expect(courseCell).to.not.be.undefined;
						expect(courseCell.value).to.equal(expectedCell.value);
						expect(courseCell.suffix).to.equal(expectedCell.suffix);

						if (courseCell.value === 'N/A') {
							expect(courseCell.isNA).to.equal(true);
						}
					});
					
					done();
				});
			});

			// it('should have error function', function() {
			// 	expect(logger.error).to.not.be.undefined;
			// });

			// // it('should successfully log with info', function() {
			// // 	expect(logger.info('this is an information')).to.not.throw;
			// // });

			// // it('should successfully log with warn', function() {
			// // 	expect(logger.warn('this is a warning')).to.not.throw;
			// // });

			// // it('should successfully log with error', function() {
			// // 	expect(logger.error('this is an error')).to.not.throw;
			// // });

			// it('should successfully log message using Chrome transport', function() {

			// 	var transports = [
			// 		chromeTransport
			// 	];

			// 	logger.init(transports);
			// 	logger.log('___________ test: log message using Chrome transport ___________');
				
			// 	var msg = 'this is an information';
			// 	expect(logger.silly(msg)).to.not.throw;
			// 	expect(logger.debug(msg)).to.not.throw;
			// 	expect(logger.info(msg)).to.not.throw;
			// 	expect(logger.warn(msg)).to.not.throw;
			// 	expect(logger.error(msg)).to.not.throw;
			// 	expect(logger.cyan(msg)).to.not.throw;
			// });
			
			// it('should successfully log message and data using Chrome transport', function() {

			// 	var transports = [
			// 		chromeTransport
			// 	];

			// 	logger.init(transports);
			// 	logger.log('___________ test: log message and data using Chrome transport ___________');
				
			// 	var msg = 'this is an information';
			// 	var data = { name: 'This is some javascript object or other data structure' };
			// 	expect(logger.silly(msg, data)).to.not.throw;
			// 	expect(logger.debug(msg, data)).to.not.throw;
			// 	expect(logger.info(msg, data)).to.not.throw;
			// 	expect(logger.warn(msg, data)).to.not.throw;
			// 	expect(logger.error(msg, data)).to.not.throw;
			// 	expect(logger.cyan(msg, data)).to.not.throw;
			// });
			
			// it('should successfully log message and \'undefined\' data using Chrome transport', function() {

			// 	var transports = [
			// 		chromeTransport
			// 	];

			// 	logger.init(transports);
			// 	logger.log('___________ test: log message and \'undefined\' data using Chrome transport ___________');
				
			// 	var msg = 'this is an information';
			// 	var data; // this should log as 'undefined'
			// 	expect(logger.silly(msg, data)).to.not.throw;
			// 	expect(logger.debug(msg, data)).to.not.throw;
			// 	expect(logger.info(msg, data)).to.not.throw;
			// 	expect(logger.warn(msg, data)).to.not.throw;
			// 	expect(logger.error(msg, data)).to.not.throw;
			// 	expect(logger.cyan(msg, data)).to.not.throw;
			// });

			// it('should successfully log message using html transport', function() {

			// 	var divLog = document.getElementById('divLog');
			// 	htmlTransport.setDomElement(divLog);
			// 	//console.log('divLog', divLog);

			// 	var transports = [
			// 		htmlTransport
			// 	];

			// 	logger.init(transports);
			// 	logger.log('___________ test: log message using html transport ___________');
				
			// 	var msg = 'this is an information';
			// 	expect(logger.silly(msg)).to.not.throw;
			// 	expect(logger.debug(msg)).to.not.throw;
			// 	expect(logger.info(msg)).to.not.throw;
			// 	expect(logger.warn(msg)).to.not.throw;
			// 	expect(logger.error(msg)).to.not.throw;
			// 	expect(logger.cyan(msg)).to.not.throw;
			// });
			
			// it('should successfully log message and data using html transport', function() {

			// 	var divLog = document.getElementById('divLog');
			// 	htmlTransport.setDomElement(divLog);
			// 	//console.log('divLog', divLog);

			// 	var transports = [
			// 		htmlTransport
			// 	];

			// 	logger.init(transports);
			// 	logger.log('___________ test: log message and data using html transport ___________');
				
			// 	var msg = 'this is an information';
			// 	var data = { name: 'This is some javascript object or other data structure' };
			// 	expect(logger.silly(msg, data)).to.not.throw;
			// 	expect(logger.debug(msg, data)).to.not.throw;
			// 	expect(logger.info(msg, data)).to.not.throw;
			// 	expect(logger.warn(msg, data)).to.not.throw;
			// 	expect(logger.error(msg, data)).to.not.throw;
			// 	expect(logger.cyan(msg, data)).to.not.throw;
			// });
			
			// it('should successfully log message and \'undefined\' data using html transport', function() {

			// 	var divLog = document.getElementById('divLog');
			// 	htmlTransport.setDomElement(divLog);
			// 	//console.log('divLog', divLog);

			// 	var transports = [
			// 		htmlTransport
			// 	];

			// 	logger.init(transports);
			// 	logger.log('___________ test: log message and \'undefined\' data using html transport ___________');
				
			// 	var msg = 'this is an information';
			// 	var data; // should log as 'undefined'
			// 	expect(logger.silly(msg, data)).to.not.throw;
			// 	expect(logger.debug(msg, data)).to.not.throw;
			// 	expect(logger.info(msg, data)).to.not.throw;
			// 	expect(logger.warn(msg, data)).to.not.throw;
			// 	expect(logger.error(msg, data)).to.not.throw;
			// 	expect(logger.cyan(msg, data)).to.not.throw;
			// });

		});

		mocha.run();
	});

}());
