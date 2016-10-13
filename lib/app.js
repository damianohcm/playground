(function(angular) {

	// create module 'githubViewer'
	var app = angular.module('Main', 
		[
			'ngRoute', 
			//'ngSanitize',
			'ngAnimate', 
			'ui.bootstrap'
		]);
	
	// configure
	app.config([
		'$routeProvider',
		'$locationProvider', 
		function($routeProvider, $locationProvider) {
		
			$routeProvider
				.when('/', {
					templateUrl: 'views/main.html',
					controller: 'mainController'
				})
				.when('/report1', {
					templateUrl: 'views/report1.html',
					controller: 'report1Controller'
				})
				.when('/report2', {
					templateUrl: 'views/report2.html',
					controller: 'report2Controller'
				})
				.when('/report3', {
					templateUrl: 'views/report3.html',
					controller: 'report3Controller'
				})
				.when('/report4', {
					templateUrl: 'views/report4.html',
					controller: 'report4Controller'
				})
				.otherwise({
					redirectTo: '/'
				});

			//$locationProvider.html5Mode(true);
		
		}]);
	
	// register services with angular
    app.factory('utilsService', [services.utilsService]);
	app.factory('dataService', ['$http', services.dataService]);
	app.factory('undoServiceFactory', [services.serviceFactory]);
	app.factory('report2Service', ['utilsService', services.report2Service]);
	app.factory('report3Service', ['utilsService', services.report3Service]);
	app.factory('report4Service', ['utilsService', services.report4Service]);

	// register controllers
	app.controller('mainController', ['$scope', 'dataService', controllers.mainController]);
  	app.controller('report1Controller', ['$scope', 'dataService', controllers.report1Controller]);
    app.controller('report2Controller', ['$scope', 'dataService', 'report2Service', controllers.report2Controller]);
	
	app.controller('report3Controller', [
		'$scope', 
		'utilsService',
		'undoServiceFactory', 
		'dataService', 
		'report3Service', 
		'$timeout',
		'$interval',
		controllers.report3Controller]);

	app.controller('report4Controller', [
		'$scope', 
		'utilsService',
		'undoServiceFactory', 
		'dataService', 
		'report4Service', 
		'$timeout',
		'$interval',
		controllers.report4Controller]);

}(window.angular));
