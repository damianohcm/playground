(function() {
  
    window.services = window.services || {};
  
    window.services.logService = function($) {

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

}());
