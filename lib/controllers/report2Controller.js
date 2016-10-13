(function() {

    // create controller
	window.controllers = window.controllers || {};
  
    window.controllers.report2Controller = function($scope, dataService, reportService) {
        $scope.title = 'Report2 Controller';

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

        $scope.showAllColumns = function() {
            console.log('showAllColumns');
            if ($scope.model) {
                for (var c in $scope.model.columns) {
                    $scope.model.columns[c].show = true;
                }

                //reportService.recalculatePercentages($scope.model);
                reportService.recalculate($scope.model);
            }
        };

        $scope.hideCol = function(col) {
            col.show = false;
            //reportService.recalculatePercentages($scope.model);
            reportService.recalculate($scope.model);
        };

        $scope.expandChildColumns = function(groupCol) {
            console.log('expandChildColumns', groupCol.id);
            console.log('expandChildColumns columns', $scope.model.columns);
            if ($scope.model) {
                for (var c in $scope.model.columns) {
                    var itemCol = $scope.model.columns[c];
                    if (itemCol.isGroup) {
                        itemCol.show = false;
                    } else if (itemCol.isChild) {
                        itemCol.show = itemCol.parentId === groupCol.id;
                    } else if (itemCol.locked) {

                    }
                }

                //reportService.recalculatePercentages($scope.model);
                reportService.recalculate($scope.model);
            }
        };
        
    };

}());
