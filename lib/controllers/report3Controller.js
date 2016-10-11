(function() {

	// create controller
	var Report3Controller = function($scope, utilsService, undoServiceFactory, dataService, reportService, $timeout, $interval) {
		$scope.title = '';//Report3 Controller';

		$scope.undoService = undoServiceFactory.getService('report3Controller', $scope);

		$scope.undoLastAction = function() {
			$scope.undoService.undoLastAction();
			$scope.recalculate();
		};

		$scope.undoAllActions = function() {
			$scope.undoService.undoAllActions();
			$scope.recalculate();
		};

		$scope.modifiedMessage = function() {
			var undoState = $scope.undoService.undoState;

			if (undoState && undoState.length > 0) {
				var msg = '', things = {
					segments: 0
					, los: 0
					, stores: 0
					, people: 0
				};

				_.each(undoState, function(o) {
					if (o.type === 'column') {
						if (o.item.isChild) {
							things.los++;
						} else {
							things.segments++;
						}
					} else if (o.type === 'row') {
						if (o.item.isChild) {
							things.people++;
						} else {
							things.stores++;
						}
					} else {
						msg = 'Modified';
					}
				});

				if (things.segments > 0) {
					msg = things.segments + ' Segment' + (things.segments > 1 ? 's' : '') + ' removed';
				}
				if (things.los > 0) {
					msg += (msg.length > 0 ? ' | ' : '') + things.los + ' Learning Object' + (things.los > 1 ? 's' : '') + ' removed';
				}
				if (things.stores > 0) {
					msg += (msg.length > 0 ? ' | ' : '') + things.stores + ' Store' + (things.stores > 1 ? 's' : '') + ' removed';
				}
				if (things.people > 0) {
					msg += (msg.length > 0 ? ' | ' : '') + things.people + ' ' + (things.people > 1 ? 'People' : 'Person') + ' removed';
				}

				return msg;
			} else {
				return 'Report is not modified';
			}
		};

		$scope.exportToCsv = function() {
			var fileName = 'Summary.csv',
				mimeType = '',
				csv = utilsService.getCsv($scope.model);
			utilsService.safeLog('Report3Controller.exportToCsv', csv);

			if (navigator.msSaveBlob) { // IE10
				utilsService.safeLog('Report3Controller.exportToCsv INTERNET EXPLORER');
				mimeType = 'application/octet-stream';
				return navigator.msSaveBlob(new Blob([csv], {
						type: mimeType
					}),
					fileName);
			} else { //html5 A[download]
				utilsService.safeLog('Report3Controller.exportToCsv HTML5');
				mimeType = 'attachment/csv';

				var a = document.createElement('a');
				a.href = 'data:' + mimeType + ',' + encodeURIComponent(csv);
				
				if ('download' in a) { //html5 A[download]
					a.setAttribute('download', fileName);
				} else {
					a.setAttribute('target', '_blank');
				}

				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				return true;

			// } else {
			// 	utilsService.safeLog('Report3Controller.exportToCsv OTHERS');

			// 	var f = document.createElement('iframe');
			// 	document.body.appendChild(f);
			// 	mimeType = 'text/plain';
			// 	f.src = 'data:' + mimeType + ',' + encodeURIComponent(csv);

			// 	setTimeout(function() {
			// 		document.body.removeChild(f);
			// 	}, 500);

			// 	return true;
			}
		}

		$scope.colHeaderPopover = {
			templateUrl: 'colHeaderPopoverTemplate.html'
		};

		$scope.visibleColumns = function(isGroup) {
			return _.filter($scope.model.columns, function(col) {
				return col.isGroup === isGroup && col.show;
			});
		}

		// shortcut to service.recalculate
		$scope.recalculate = function() {
			$scope.model.topLevelColumn = $scope.topLevelColumn;
			reportService.recalculate($scope.model, $scope.data);
		};

		var onDataError = function(err) {
			utilsService.safeLog('Report3Controller.onDataError', err);
			$scope.error = 'Could not fetch data';
		};

		var onDataComplete  = function(data) {
			utilsService.safeLog('Report3Controller.onDataComplete', data);
			$scope.data = data;
			$scope.model = reportService.getModel(data);

			// then rowGroups after angular bindings
			$timeout(function(){
				utilsService.safeLog('add');
				var rowGroups = $scope.model.result._rowGroups;
				var intervalId = $interval(function() {
					if (rowGroups.length > 0) {
						utilsService.safeLog('add row');
						$scope.model.result.rows.push(rowGroups.pop());
					} else {
						utilsService.safeLog('clearInterval');
						$interval.cancel(intervalId);
					}
				}, 20);
			}, 0);
		};

		//var fileName = 'report3.json?' + Math.random();
		//var fileName = 'report3-generated1.json?' + Math.random();
		var fileName = 'report3-generated2.json?' + Math.random();
		dataService.getData(fileName)
			.then(onDataComplete, onDataError);
		
		$scope.toggleChildRows = function(model, row) {
			utilsService.safeLog('toggleChildRows', row.children.length);

			// // add state item to undo history
			// var msgPrefix = row.isCollapsed ? 'Expand store ' : 'Collapse store ';
			// $scope.undoService.addState({
			// 	type: 'row',
			// 	item: row,
			// 	property: 'isCollapsed',
			// 	oldValue: row.isCollapsed,
			// 	newValue: !row.isCollapsed,
			// 	msg: msgPrefix + row.category.value
			// });

			row.isCollapsed = !row.isCollapsed;
		};

		/**
		 * @method showAllColumns
		 * @description
		 * Will show all columns, including child columns. Currently used only for debugging.
		 */
		$scope.showAllColumns = function() {
			utilsService.safeLog('showAllColumns');
			if ($scope.model) {
				for (var c in $scope.model.columns) {
					$scope.model.columns[c].show = true;
				}

				// remove columns from undo history
				$scope.undoService.purgeColumnsFromHistory();

				// update values
				//utilsService.safeLog('WARNING: code commented out');
				$scope.recalculate();
			}
		};

		/**
		 * @method hideCol
		 * @description 
		 * Mark a col.show false.
		 */
		$scope.hideCol = function(col) {

			// add state item to undo history
			$scope.undoService.addState({
				type: 'column',
				item: col,
				property: 'show',
				oldValue: col.show,
				newValue: true,
				msg: 'Hide column ' + col.name
			});

			col.show = false;
			if (col.isChild) {
				utilsService.safeLog('hideCol child column. Calculate is', col.calculate);
			}

			// update values
			$scope.recalculate();
		};

		/**
		 * @method hideRow
		 * @description 
		 * Mark a row.show false. This will hide the row but also causes its property "calculate" to return false
		 * so that it will be excluded from the calculations.
		 */
		$scope.hideRow = function(row) {

			// add state item to undo history
			$scope.undoService.addState({
				type: 'row',
				item: row,
				property: 'show',
				oldValue: row.show,
				newValue: false,
				msg: 'Hide row ' + row.category.value
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

				var itemCol;
				for (var c in $scope.model.columns) {
					itemCol = $scope.model.columns[c];
					if (itemCol.isGroup) {
						itemCol.show = false;
					} else if (itemCol.isChild) {
						itemCol.show = itemCol.parentId === groupCol.id;
					} else if (itemCol.isLocked) {
						// probably no need to do anything.. might remove this code
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

				$scope.topLevelColumn = undefined;

				// remove columns from undo history
				$scope.undoService.purgeColumnsFromHistory();

				for (var c in $scope.model.columns) {
					var itemCol = $scope.model.columns[c];
					itemCol.show = !itemCol.isChild;
					if (itemCol.isChild) {
						itemCol.show = false;
						itemCol.calculate = true;
					}
				}

				// update values
				$scope.recalculate();
			}
		};

		$scope.displayHideGroupCol = function() {
			return _.filter($scope.model.columns, function (c) {
				return c.isGroup && c.show;
			}).length > 1;
		};

		$scope.displayHideChildCol = function(col) {
			return _.filter($scope.model.columns, function (c) {
				return c.parentId === col.parentId && c.show;
			}).length > 1;
		};

		$scope.displayHideRow = function(parentRow) {
			// if it's a child row and at least two of its sibilings are still visibile
			if (parentRow) {
				return _.filter(parentRow.children, function (r) {
					return r.show;
				}).length > 1;
			} else { 
				// or is a top level row and at least 2 top level rows are visible
				return _.filter($scope.model.result.rows, function (r) {
					return r.isGroup && r.show;
				}).length > 1;
			}
		};

		$scope.flashCss = function(css, value, hidden, first) {
			return css + ' ' + value + (hidden? ' hidden' : '') + (first? ' first' : '');
		};
	};
	
	// get reference to module 'Main'
	var app = angular.module('Main');
	
	// register controller with module
	app.controller('Report3Controller', [
		'$scope', 
		'utilsService',
		'undoServiceFactory', 
		'dataService', 
		'report3Service', 
		'$timeout',
		'$interval',
		Report3Controller]);
}());
