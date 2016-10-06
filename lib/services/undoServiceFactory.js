(function() {

    var serviceInstances = {};

    /* private */
    var undoAction = function(action) {
        var item = action.item;
        item[action.property] = action.oldValue;
        // for child columns need to also restore calculate to true if made visible again
        if (action.property === 'show' && action.oldValue && action.type === 'column' && item.isChild) {
            item.calculate = true;
        }
    };

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
            var action = this.undoState.pop();
            undoAction(action);
        }.bind(this);

        /**
         * @method undoAllActions
         * @dscription
         * Revert all actions
         */
        this.undoAllActions = function() {
            while (this.undoState.length > 0) {
                this.undoLastAction();
            }
        }.bind(this);

        /**
         * @method purgeColumnsFromHistory
         * @dscription
         * Removes columns from undo history
         */
        this.purgeColumnsFromHistory = function() {
            var purgedState = [];
            _.each(this.undoState, function(o) {
                if (o.type === 'column') {
                    undoAction(o);
                } else {
                    purgedState.push(o);
                }
            });

            this.undoState = purgedState;
        }.bind(this);

        /**
         * @method getLastActionMessage
         * @dscription
         * Get the last action message
         */
        this.getLastActionMessage = function() {
            if (this.undoState && this.undoState.length > 0) {
                var lastAction = this.undoState[this.undoState.length - 1];
                if (lastAction.msg) {
                    return lastAction.msg;
                } else {
                    return lastAction.property + ' ' + lastAction.type + ' ' + lastAction.item.name;
                }
            } else {
                return 'Nothing do undo';
            }
        }.bind(this);
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
