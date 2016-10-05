/*global requirejs, describe, it, logger, chai, mocha*/
(function(){

	requirejs(['../services/report3Service.js'], function() {

		mocha.setup('bdd');

		var report3Service = window.services.report3Service;
		console.log('loaded', report3Service);

		var expect = chai.expect;

		// var logger = require('../../../lib/index.js');
		// var chromeTransport = require('../../../lib/clientSideTransports/chromeTransport');
		// var htmlTransport = require('../../../lib/clientSideTransports/htmlTransport');

		describe('report3Service', function() {

			it('should have info function', function() {
				expect(report3Service).to.not.be.undefined;
			});

			// it('should have warn function', function() {
			// 	expect(logger.warn).to.not.be.undefined;
			// });

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