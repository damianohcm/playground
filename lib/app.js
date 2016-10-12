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
					controller: 'MainController'
				})
				.when('/report1', {
					templateUrl: 'views/report1.html',
					controller: 'Report1Controller'
				})
				.when('/report2', {
					templateUrl: 'views/report2.html',
					controller: 'Report2Controller'
				})
				.when('/report3', {
					templateUrl: 'views/report3.html',
					controller: 'Report3Controller'
				})
				.otherwise({
					redirectTo: '/'
				});

			//$locationProvider.html5Mode(true);
		
		}]);
	
	// register services with angular
    app.factory('utilsService', [services.utilsService]);
	app.factory('report3Service', ['utilsService', services.report3Service]);
  
}(window.angular));
