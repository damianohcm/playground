(function() {

	window.utils = {
		//fastLoop: _.each
		fastLoop: function exportToCsv(items, cb) {
			for (var i = items.length; --i >= 0;) {
				cb(items[i]);
			}
		},
		getCsv: function exportToCsv(model) {
			var cols = model.columns, rows = model.result.rows, 
				visibleRows = _.filter(rows, function(row) {
					return row.show;
				});

			var ret = [];
			// ret.push('"' + Object.keys(arr[0]).join('","') + '"');
			// for (var i = 0, len = arr.length; i < len; i++) {
			// 	var line = [];
			// 	for (var key in arr[i]) {
			// 		if (arr[i].hasOwnProperty(key)) {
			// 			line.push('"' + arr[i][key] + '"');
			// 		}
			// 	}
			// 	ret.push(line.join(','));
			// }

			// if not detail view, export only column groups
			// if (!model.topLevelColumn) {

			// } else {
				var visibleCols = _.filter(cols, function (col) {
					return col.show;
				});
				var colNames = _.map(visibleCols, function(col) {
					return col.name;
				});

				ret.push('"' + colNames.join('","') + '"');

				_.each(visibleRows, function(row) {
					var csvLine = [];
					_.each(visibleCols, function(col) {
						var cell = row[col.key],
							text = cell.value;
							if (cell.value2) {
								text += ' (' + cell.value2 + ')';
							} else if (cell.suffix && cell.suffix.length > 0) {
								text += ' ' + cell.suffix;
							}
						csvLine.push('"' + text + '"');
					});
					ret.push(csvLine.join(','));

					if (!row.isCollapsed) {
						var visibleChildRows = _.filter(row.children, function(cr) {
							return cr.show;
						});

						if (visibleChildRows.length > 0) {
							_.each(visibleChildRows, function(childRow) {
								var csvChildLine = [];
								_.each(visibleCols, function(col) {
									var cell = childRow[col.key],
										text = cell.value;
										if (cell.value2) {
											text += ' (' + cell.value2 + ')';
										} else if (cell.suffix && cell.suffix.length > 0) {
											text += ' ' + cell.suffix;
										}
									csvChildLine.push('"' + text + '"');
								});
								ret.push(csvChildLine.join(','));
							});
						}
					}

				});

			//}

			return ret.join('\n');
		}
	};

	// create module 'githubViewer'
	var app = angular.module('Main', 
		[
		'ngRoute', 
		'ngAnimate', 
		'ui.bootstrap',
		//angularDragula(angular)
		]);
	
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
	
	// register services with angular
    app.factory('logService', [services.logService]);
	app.factory('report3Service', ['logService', services.report3Service]);
  
}());
