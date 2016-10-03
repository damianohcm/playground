(function() {
  // create controller
  var Report3Controller = function($scope, dataService, reportService) {
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
        console.log('Report3Controller.onDataError', err);
        $scope.error = 'Could not fetch data';
    };

    var onDataComplete  = function(data) {
      console.log('Report3Controller.onDataComplete', data);
      $scope.data = data;
      $scope.model = reportService.getModel(data);
      //$scope.recalculatePercentages();
    };

    dataService.getData('report3.json?' + Math.random())
      .then(onDataComplete, onDataError);
    
    // to keep track of how many columns or rows have been removed by the user
    $scope.changes = [];

    $scope.undoLastAction = function() {
        var changedItem = $scope.changes.pop();
        changedItem.item[changedItem.property] = changedItem.oldValue;
    };

    $scope.isTopLevel = true;

    $scope.toggleChildRows = function(model, row) {
        console.log('toggleChildRows', row.children.length);

        row.isCollapsed = !row.isCollapsed;

        _.each(row.children, function(child) {
            child.show = row.isCollapsed;
        });
    };

    $scope.showAllColumns = function() {
        console.log('showAllColumns');
        if ($scope.model) {
            for (var c in $scope.model.columns) {
                $scope.model.columns[c].show = true;
            }

            $scope.changes = _.filter($scope.changes, function(o) {
                return o.type !== 'column';
            });

            //reportService.recalculatePercentages($scope.model);
            reportService.recalculate($scope.model);
        }
    };

    $scope.hideCol = function(col) {

        $scope.changes.push({
            type: 'column',
            item: col,
            property: 'show',
            oldValue: col.show,
            newValue: true
        });

        col.show = false;

        //reportService.recalculatePercentages($scope.model);
        reportService.recalculate($scope.model);
    };

    $scope.hideRow = function(row) {

        $scope.changes.push({
            type: 'row',
            item: row,
            property: 'show',
            oldValue: row.show,
            newValue: true
        });

        row.show = false;

        //reportService.recalculatePercentages($scope.model);
        reportService.recalculate($scope.model);
    };

    /**
     * @method expandChildColumns
     * @description Hides group columns and shows children columns for a specific group.
     */
    $scope.expandChildColumns = function(groupCol) {
        console.log('expandChildColumns', groupCol.id);
        console.log('expandChildColumns columns', $scope.model.columns);
        if ($scope.model) {
            var itemCol = $scope.model.columns[c];
            for (var c in $scope.model.columns) {
                itemCol = $scope.model.columns[c];
                if (itemCol.isGroup) {
                    itemCol.show = false;
                } else if (itemCol.isChild) {
                    itemCol.show = itemCol.parentId === groupCol.id;
                } else if (itemCol.isLocked) {
                    
                }
            }

            $scope.isTopLevel = false;

            //reportService.recalculatePercentages($scope.model);
            reportService.recalculate($scope.model);
        }
    };

    $scope.showTopLevel = function() {
        for (var c in $scope.model.columns) {
            var itemCol = $scope.model.columns[c];
            itemCol.show = !itemCol.isChild;
        }
        $scope.isTopLevel = true;
    };
    
  };
  
  // get reference to module 'Main'
  var app = angular.module('Main');
  
  // register controller with module
  app.controller('Report3Controller', ['$scope', 'dataService', 'report3Service', Report3Controller]);
}());
