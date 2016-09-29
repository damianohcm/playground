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
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutController'
      })
      .otherwise({
        redirectTo: '/'
      });

	//$locationProvider.html5Mode(true);
  
  }]);
  
}());
