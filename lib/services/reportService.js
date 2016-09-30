(function() {
  
	var service = function() {

		var personSectionStatus = {
			0: 'Not Started',
			1: 'In Progress',
			2: 'Completed'
		};

		var getPersonRow = function(courses, person) {
			console.log('getPersonRow', courses.length + ' ' + person.name);
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

			// loop through each course
			var aggregatedPerson = 0, coursesCount = courses.length;
			_.each(courses, function(course) {

				// init cell
				var cell = {
					value: 0,
					suffix: '%'
				};

				// get this person course
				var personCourse = _.find(person.courses, function(pc) {
					return pc.id === course.id;
				});

				// aggregate section value
				var aggregatedSections = 0, sectionsCount = personCourse.sections.length;
				_.each(personCourse.sections, function(section) {
					console.log('getPersonRow ' + person.name + ' ' + course.title + ' [' + section.id + ']', section.value === 2 ? 1 : 0);
					aggregatedSections += section.value === 2 ? 1 : 0;
				});

				console.log('getPersonRow ' + person.name + ' ' + course.title + ' aggregatedSections', aggregatedSections);

				cell.value = sectionsCount > 0 ? Math.round(aggregatedSections / sectionsCount * 100) : 0;
				console.log('getPersonRow ' + person.name + ' ' + course.title + ' cell.value', cell.value);

				// store cell into row using course.id as the row property
				row[course.id] = cell;

				aggregatedPerson += cell.value;
			});

			// the row (horizontal) percentage for all the course sections for this person
			row.summary.value = coursesCount > 0 ? Math.round(aggregatedPerson / coursesCount) : 0;

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
			var storesCount = data.stores.rows.length, coursesCount = data.courses.rows.length;
			_.each(data.stores.rows, function(store) {
				var storeAggregated = 0,
				// init row and add first column for store name
				row = {
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
				var coursesCount = data.courses.rows.length;
				_.each(data.courses.rows, function(course) {
					// init cell with value zero
					var cell = {
						value: 0,
						suffix: '%'
					};

					// aggregate all people
					var courseAggregated = 0, peopleByStoreCount = peopleByStore.length;
					_.each(peopleByStore, function(person) {
						// get this person course
						var personCourse = _.find(person.courses, function(pc) {
							return pc.id === course.id;
						});

						// aggregate all person's sections for this course
						var aggregatedSections = 0, sectionsCount = personCourse.sections.length;
						_.each(personCourse.sections, function(section) {
							aggregatedSections += section.value === 2 ? 1 : 0;
						});
						courseAggregated += sectionsCount > 0 ? Math.round(aggregatedSections / sectionsCount * 100) : 0;
					});

					storeAggregated += courseAggregated;
					
					// store value into cell
					cell.value = peopleByStoreCount > 0 ? courseAggregated / peopleByStoreCount : 0;
					console.log('courseAggregated', courseAggregated);

					// store cell into row using course.id as the row property
					row[course.id] = cell;
				});

				_.each(peopleByStore, function(person) {
					var personRow = getPersonRow(data.courses.rows, person);
					row.children.push(personRow);
				});

				// the row (horizontal) percentage for all the 
				row.summary.value = storesCount > 0 ? storeAggregated / storesCount : 0;

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
