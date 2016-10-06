(function() {

	// create controller
	var Report3Controller = function($scope, undoServiceFactory, dataService, reportService) {
		$scope.title = 'Report2 Controller';

		$scope.undoService = undoServiceFactory.getService('report3Controller', $scope);

		$scope.undoLastAction = function() {
			$scope.undoService.undoLastAction();
			$scope.recalculate();
		};

		$scope.colHeaderPopover = {
			templateUrl: 'colHeaderPopoverTemplate.html'
		};

		// shortcut to service.recalculate
		$scope.recalculate = function() {
			$scope.model.topLevelColumn = $scope.topLevelColumn;
			reportService.recalculate($scope.model, $scope.data);
		};

		var onDataError = function(err) {
			console.log('Report3Controller.onDataError', err);
			$scope.error = 'Could not fetch data';
		};

		var onDataComplete  = function(data) {
			console.log('Report3Controller.onDataComplete', data);
			$scope.data = data;
			$scope.model = reportService.getModel(data);
		};

		dataService.getData('report3.json?' + Math.random())
		.then(onDataComplete, onDataError);
		
		$scope.toggleChildRows = function(model, row) {
			console.log('toggleChildRows', row.children.length);

			row.isCollapsed = !row.isCollapsed;

			_.each(row.children, function(child) {
				child.show = row.isCollapsed;
			});
		};

		/**
		 * @method showAllColumns
		 * @description
		 * Will show all columns, including child columns. Currently used only for debugging.
		 */
		$scope.showAllColumns = function() {
			console.log('showAllColumns');
			if ($scope.model) {
				for (var c in $scope.model.columns) {
					$scope.model.columns[c].show = true;
				}

				// remove columns from undo history
				$scope.undoService.purgeColumnsFromHistory();

				// update values
				//console.log('WARNING: code commented out');
				$scope.recalculate();
			}
		};

		$scope.hideCol = function(col) {

			// add state item to undo history
			$scope.undoService.addState({
				type: 'column',
				item: col,
				property: 'show',
				oldValue: col.show,
				newValue: true
			});

			col.show = false;

			// update values
			$scope.recalculate();
		};

		$scope.hideRow = function(row) {

			// add state item to undo history
			$scope.undoService.addState({
				type: 'row',
				item: row,
				property: 'show',
				oldValue: row.show,
				newValue: true
			});

			row.show = false;

			// update values
			$scope.recalculate();
		};

		/**
		 * @method expandChildColumns
		 * @description Hides group columns and shows children columns for a specific group.
		 */
		$scope.expandChildColumns = function(groupCol) {
			if ($scope.model) {
				// remove columns from undo history
				$scope.undoService.purgeColumnsFromHistory();

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

				$scope.topLevelColumn = groupCol;

				// update values
				$scope.recalculate();
			}
		};

		/**
		 * @method backToTopLevel
		 * @description
		 * This will revert the expandChildColumns operation
		 */
		$scope.backToTopLevel = function() {
			if ($scope.model) {
				for (var c in $scope.model.columns) {
					var itemCol = $scope.model.columns[c];
					itemCol.show = !itemCol.isChild;
				}

				$scope.topLevelColumn = undefined;

				// remove columns from undo history
				$scope.undoService.purgeColumnsFromHistory();

				// update values
				$scope.recalculate();
			}
		};
	};
	
	// get reference to module 'Main'
	var app = angular.module('Main');
	
	// register controller with module
	app.controller('Report3Controller', [
		'$scope', 
		'undoServiceFactory', 
		'dataService', 
		'report3Service', 
		Report3Controller]);
}());
