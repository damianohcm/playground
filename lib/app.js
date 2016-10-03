(function() {

  // create module 'githubViewer'
  var app = angular.module('Main', ['ngRoute', angularDragula(angular)]);
  
  // configure
  app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
    
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
  
}());
