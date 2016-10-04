(function() {

    var serviceInstances = {};

    /**
     * @class ServiceModel
     * Blueprint used to create instances of undo service.
     */
    var ServiceModel = function() {

        this.undoState = []; /* this is to keep track of the changes */

        /**
         * @method addState
         * @dscription
         * Add a state item to the undo history state
         */
        this.addState = function(stateItem) {
            this.undoState.push(stateItem);
        }.bind(this);
        
        /**
         * @method undoLastAction
         * @dscription
         * Revert the last action
         */
        this.undoLastAction = function() {
            var changedItem = this.undoState.pop();
            changedItem.item[changedItem.property] = changedItem.oldValue;
        }.bind(this),

        /**
         * @method purgeColumnsFromHistory
         * @dscription
         * Removes columns from undo history
         */
        this.purgeColumnsFromHistory = function() {
            this.undoState = _.filter(this.undoState, function(o) {
                return o.type !== 'column';
            });
        }.bind(this)
    };

    /**
     * @method getService
     * @description 
     * Returns a service instance associated with a controller (using a controll key)
     */
    var getService = function(controllerKey, $scope) {
        // singleton, do not recreate instance ifit already exists
        if (!serviceInstances[controllerKey]) {

            // create service instance
            var serviceInstance = new ServiceModel();
            
            // save instance
            serviceInstances[controllerKey] = serviceInstance;

            return serviceInstance;
        } else {
            return serviceInstances[controllerKey];
        }
    };
  
    // service to be exported to angular
	var serviceFactory = function() {
        return {
            getService: getService
        };
    };

    // get reference to Main module
	var app = angular.module('Main');
	
	// register service with angular
	app.factory('undoServiceFactory', [serviceFactory]);

}());
