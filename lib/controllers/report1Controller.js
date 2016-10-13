(function() {

    // create controller
	window.controllers = window.controllers || {};
  
    window.controllers.report1Controller = function($scope, dataService) {

        $scope.title = 'Report1 Controller';

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

        $scope.recalculateTotals = function() {
            if ($scope.data) {
                var col, row, cell, val, tot;

                for (var r in $scope.data.result.rows) {
                    row = $scope.data.result.rows[r], tot = 0;
                    for (var c in $scope.data.columns) {
                        col = $scope.data.columns[c], cell = row[col.key], val = cell.value;
                        if (col.show && !isNaN(val)) {
                            tot += Number(val);
                        }
                    }
                    row.tot = tot;

                    console.log('recalculateTotals:', row.tot);
                }
            }
        };

        $scope.recalculatePercentages = function() {
            if ($scope.data) {
                $scope.recalculateTotals();

                var col, row, cell, val;

                for (var r in $scope.data.result.rows) {
                    row = $scope.data.result.rows[r];
                    for (var c in $scope.data.columns) {
                        col = $scope.data.columns[c], cell = row[col.key], val = cell.value;
                        if (col.show && !isNaN(val) && row.tot > 0) {
                            cell.perc = Math.round((Number(val) / row.tot) * 100);
                        } else {
                            cell.perc = 0;
                        }

                        var css = _.find(cellCssClasses, function(item) {
                            return item.key >= cell.perc;
                        });

                        if (!col.locked && cell.value !== 'N/A' && css) {
                            cell.css = css.value;
                        }

                        console.log('recalculatePercentages ' + col.key + ': ', cell.perc);
                    }
                }
            }
        };

        var onDataError = function(err) {
            console.log('Report1Controller.onDataError', err);
            $scope.error = 'Could not fetch data';
        };

        var onDataComplete  = function(data) {
        console.log('onDataComplete', data);
        $scope.data = data;
        $scope.recalculatePercentages();
        };

        dataService.getData('report1.json?' + Math.random())
        .then(onDataComplete, onDataError);

        $scope.showAllColumns = function() {
            console.log('showAllColumns');
            if ($scope.data) {
                for (var c in $scope.data.columns) {
                    $scope.data.columns[c].show = true;
                }

                $scope.recalculatePercentages();
            }
        };

        $scope.hideCol = function(col) {
            col.show = false;
            $scope.recalculatePercentages();
        };

    };

}());
