(function() {
  
	var service = function() {

		var getModel = function(data) {
			var model = {
				columns: [{
					id: 'category',
					position:  0,
					show: true,
					locked: true,
					title:  ''
				}],
				 result: {
					tot: 10,
					rows: []
				 }
			};
			
			// data.stores;
			// data.courses;
			// data.courseSections;
			// data.people;

			// loop through each course
			_.each(data.courses.rows, function(course, i) {
				course.show = course.show || true;

				var col = {
					id: course.id,
					position:  i,
					show: course.show,
					locked: false,
					title:  course.title
				};

				// push row
				model.columns.push(col);
			});


			// loop through each store
			_.each(data.stores.rows, function(store) {
				// init row and add first column for store name
				var row = {
					category: {
						value: store.id + '-' + store.title
					}
				};

				var peopleByStore = _.filter(data.people.rows, function(person) {
					return person.storeId === store.id;
				});

				_.each(data.courses.rows, function(course) {
					var cell = {
						value: 0
					};

					var aggregated = 0;
					_.each(peopleByStore, function(person) {
						var personCourse = _.find(person.courses, function(pc) {
							return pc.id === course.id;
						});

						// aggregate section value
						_.each(personCourse.sections, function(section) {
							aggregated += section.value;
						});
					});

					cell.value = aggregated;

					row[course.id] = cell;
				});


				// push row
				model.result.rows.push(row);
			});
			
			console.log('model', model);
			return model;
		};
		
		return {
			getModel: getModel
		};
	};
  
	// get reference to Main module
	var app = angular.module('Main');
	
	// register service with angular
	app.factory('reportService', [service]);
  
}());
