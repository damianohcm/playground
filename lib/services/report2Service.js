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
				show: false, // TODO; change to false by default and the programmatically set to true when clicking on parent row
				category: {
					value: person.name,
					value2: person.title,
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

				if (personCourse) {
					// aggregate section value
					var aggregatedSections = 0, sectionsCount = personCourse.sections.length;
					_.each(personCourse.sections, function(section) {
						console.log('getPersonRow ' + person.name + ' ' + course.name + ' [' + section.id + ']', section.value === 2 ? 1 : 0);
						aggregatedSections += section.value === 2 ? 1 : 0;
					});

					console.log('getPersonRow ' + person.name + ' ' + course.name + ' aggregatedSections', aggregatedSections);

					cell.value = sectionsCount > 0 ? Math.round(aggregatedSections / sectionsCount * 100) : 0;
					console.log('getPersonRow ' + person.name + ' ' + course.name + ' cell.value', cell.value);

					aggregatedPerson += cell.value;

					// store cell into row using course.id as the row property
					row[course.id] = cell;

					// add child cells (visibility is controlled by the child columns)
					_.each(personCourse.sections, function(section) {
						// child cell
						row[course.id + '_' + section.id] = {
							value: personSectionStatus[section.value]
						};
					});
				} else {
					cell.isNA = true;
					cell.value = 'N/A';
					cell.suffix = '';
					aggregatedPerson += 100;

					// store cell into row using course.id as the row property
					row[course.id] = cell;

					_.each(course.sections, function(section) {
						// child cell
						row[course.id + '_' + section.id] = {
							value: 'N/A'
						};
					});
				}
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
					css: 'th-category',
					name:  ''
				}, {
					id: 'summary',
					position:  1,
					show: true,
					locked: true,
					css: 'th-summary',
					name:  'Tot Completion %'
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
			_.each(data.courses.rows, function(course) {
				course.show = course.show || true;

				var col = {
					isGroup: true,
					show: course.show,
					id: course.id,
					position:  model.columns.length,
					locked: false,
					css: 'th-course',
					name:  course.name
				};

				// push row
				model.columns.push(col);

				// add child columns
				_.each(course.sections, function(section) {
					// push row
					model.columns.push({
						isChild: true,
						show: false,
						parentId: course.id,
						id: course.id + '_' + section.id,
						position:  model.columns.length,
						locked: false,
						css: 'th-section',
						name:  section.name
					});
				});
			});

			// 2. Aggregate data and add to model.result.rows collection
			// loop through each store and add a row for each store
			var coursesCount = data.courses.rows.length;
			_.each(data.stores.rows, function(store) {
				var storeAggregated = 0,
				// init row and add first column for store name
				row = {
					isGroup: true,
					show: true,
					children: [],
					category: {
						id: store.id,
						value: store.id + '-' + store.name
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

						if (personCourse) {
							// aggregate all person's sections for this course
							var aggregatedSections = 0, sectionsCount = personCourse.sections.length;
							_.each(personCourse.sections, function(section) {
								aggregatedSections += section.value === 2 ? 1 : 0;

								// child cell
								row[personCourse.id + '_' + section.id] = {
									value: 'test'
								};
							});
							courseAggregated += sectionsCount > 0 ? Math.round(aggregatedSections / sectionsCount * 100) : 0;
						} else {
							courseAggregated += 100; // 'N/A' should count as 100% compete
						}
					});
					
					// store value into cell
					cell.value = peopleByStoreCount > 0 ? courseAggregated / peopleByStoreCount : 0;
					
					storeAggregated += cell.value;

					// store cell into row using course.id as the row property
					row[course.id] = cell;
				});

				_.each(peopleByStore, function(person) {
					var personRow = getPersonRow(data.courses.rows, person);
					row.children.push(personRow);
				});

				// the row (horizontal) percentage for all the 
				row.summary.value = coursesCount > 0 ? Math.round(storeAggregated / coursesCount) : 0;

				// push row
				model.result.rows.push(row);
			});
			
			console.log('model', model);
			return model;
		};

		var recalculate = function(model) {
			console.log('recalculate - NOT IMPLEMENTED');
		};
		
		return {
			getModel: getModel,
			recalculate: recalculate
		};
	};
  
	// get reference to Main module
	var app = angular.module('Main');
	
	// register service with angular
	app.factory('report2Service', [service]);
  
}());
