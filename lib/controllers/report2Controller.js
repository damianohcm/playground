(function() {
  // create controller
  var Report2Controller = function($scope, dataService, reportService) {
    $scope.title = 'Report2 Controller';

    var cellCssClasses = [{
        key: 25,
        value: 'cell-25-or-less'
    }, {
        key: 50,
        value: 'cell-50-or-less'
    }, {
        key: 99,
        value: 'cell-99-or-less'
    }, {
        key: 100,
        value: 'cell-100'
    }];

    var onDataError = function(err) {
        console.log('Report2Controller.onDataError', err);
        $scope.error = 'Could not fetch data';
    };

    var onDataComplete  = function(data) {
      console.log('Report2Controller.onDataComplete', data);
      $scope.data = data;
      $scope.model = reportService.getModel(data);
      //$scope.recalculatePercentages();
    };

    dataService.getData('report2.json?' + Math.random())
      .then(onDataComplete, onDataError);

    $scope.toggleChildRows = function(model, row) {
        console.log('toggleChildRows', row.children.length);

        row.isCollapsed = !row.isCollapsed;

        _.each(row.children, function(child) {
            child.show = row.isCollapsed;
        });
    };

  };
  
  // get reference to module 'Main'
  var app = angular.module('Main');
  
  // register controller with module
  app.controller('Report2Controller', ['$scope', 'dataService', 'reportService', Report2Controller]);
}());
