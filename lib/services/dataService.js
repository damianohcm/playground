(function(angular) {

	var dataService = function($http) {

		var getData = function(fileName) {
			var url = 'data/' + fileName;

			return $http
				.get(url)
				.then(function(response) {
					return response.data;
				});
		};

		return {
			getData: getData
		};
	};

	// get reference to Main module
	var app = angular.module('Main');

	// register service with angular
	app.factory('dataService', ['$http', dataService]);

}(window.angular));
