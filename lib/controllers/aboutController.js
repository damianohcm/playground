(function() {
  // create controller
  var AboutController = function($scope, dataService) {
    $scope.title = 'About Controller';
  };
  
  // get reference to module 'Main'
  var app = angular.module('Main');
  
  // register controller with module
  app.controller('AboutController', ['$scope', 'dataService', AboutController]);
}());
