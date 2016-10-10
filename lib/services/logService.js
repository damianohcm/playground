(function() {
  
    var logService = function($http) {

        var safeLog = function(msg, data) {
            // if (arguments.length > 1) {
            //     console.log(msg, data);
            // } else {
            //     console.log(msg);
            // }
        };

        return {
            safeLog: safeLog
        };
    };

    // get reference to Main module
    var app = angular.module('Main');

    // register service with angular
    app.factory('logService', [logService]);

}());
