(function() {

	// create controller
	window.controllers = window.controllers || {};
  
    window.controllers.mainController = function($scope, dataService) {
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

}());
