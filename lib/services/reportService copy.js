(function() {
  
	var service = function() {

		var getPersonRow = function(course, person) {
			console.log('getPersonRow', course.title + ' ' + person.name);
			// init row and add first column for store name
			var row = {
				isChild: true,
				show: true, // TODO; change to false by default and the programmatically set to true when clicking on parent row
				category: {
					value: person.name
				},
				summary: {
					value: 0,
					suffix: '%'
				}
			};

			// get this person course
			var personCourse = _.find(person.courses, function(pc) {
				return pc.id === course.id;
			});

			// aggregate section value
			var aggregated = 0, sectionsCount = personCourse.sections.length;
			_.each(personCourse.sections, function(section) {
				aggregated += section.value === 2 ? 1 : 0;

				// init cell with section value
				var cell = {
					value: section.value
				};

				// store cell into row using course.id as the row property
				row[course.id] = cell;
			});

			// the row (horizontal) percentage for all the course sections for this person
			row.summary.value = aggregated > 0 ? sectionsCount / aggregated * 100 : 0;

			return row;
		};

		/**
		 * @method getModel
		 * @decsription
		 * Helper to get a model with the aggregated data that can be used in a generic way
		 */
		var getModel = function(data) {
			// building model
			var model = {
				columns: [{
					id: 'category',
					position:  0,
					show: true,
					locked: true,
					title:  ''
				}, {
					id: 'summary',
					position:  0,
					show: true,
					locked: true,
					title:  'Tot Completion %'
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

			// 1. Add to model.columns collection
			// loop through each course and add a column for each course
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

			// 2. Aggregate data and add to model.result.rows collection
			// loop through each store and add a row for each store
			_.each(data.stores.rows, function(store) {
				// init row and add first column for store name
				var row = {
					isGroup: true,
					show: true,
					children: [],
					category: {
						id: store.id,
						value: store.id + '-' + store.title
					}, 
					summary: {
						id: store.id,
						value: 0,
						suffix: '%'
					}
				};

				// get people for this store
				var peopleByStore = _.filter(data.people.rows, function(person) {
					return person.storeId === store.id;
				});

				console.log('peopleByStore', peopleByStore);

				// loop through each course and aggregate
				// each person data by course by building a cell for each course
				var courseAggregated = 0, coursesCount = data.courses.rows.length;
				_.each(data.courses.rows, function(course) {
					// init cell with value zero
					var cell = {
						value: 0
					};

					var storeAggregated = 0;
					_.each(peopleByStore, function(person) {
						var personRow = getPersonRow(course, person);
						storeAggregated += personRow.summary.value;
						row.children.push(personRow);
					});

					courseAggregated += storeAggregated;

					// store value into cell
					cell.value = storeAggregated;

					// store cell into row using course.id as the row property
					row[course.id] = cell;
				});

				// the row (horizontal) percentage for all the 
				row.summary.value = courseAggregated > 0 ? coursesCount / courseAggregated * 10000 : 0;

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
