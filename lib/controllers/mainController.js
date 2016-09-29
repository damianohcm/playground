(function() {
  // create controller
  var MainController = function($scope, dataService) {
    $scope.title = 'Main Controller';

    var onDataError = function(err) {
        console.log('MainController.onDataError', err);
        $scope.error = 'Could not fetch data';
    };

    var onDataComplete  = function(data) {
      console.log('MainController.onDataComplete', data);
      $scope.data = data;
    };

    dataService.getData('main.json?' + Math.random())
      .then(onDataComplete, onDataError);

  };
  
  // get reference to module 'Main'
  var app = angular.module('Main');
  
  // register controller with module
  app.controller('MainController', ['$scope', 'dataService', MainController]);
}());
