(function() {

	window.services = window.services || {};
  
	window.services.report3Service = function() {
		var private = {};

		// helper to get person segment cell css
		private.getPersonSegmentCellCss = function(cell) {
			if (!cell || typeof cell !== 'object' || !cell.hasOwnProperty('value')) {
				throw Error('getPersonSegmentCellCss: Invalid argument');
			} else {
				if (isNaN(cell.value)) {
					return 'col-group na';
				} else if (cell.value === 100) {
					return 'col-group completed';
				} else if (cell.value > 0) {
					return 'col-group in-progress';
				} else {
					return 'col-group';
				}
			}
		};

		// strategy to lookup person learning object status by id
		private.personLoCells = {
			0: {
				value: 'Not Started',
				css: ''
			},
			1: {
				value: 'In Progress',
				css: 'in-progress'
			},
			2: {
				value: 'Completed',
				css: 'completed'
			}
		};

		/**
		 * @method getPersonRow
		 * @description
		 * Gets a row for a specific person and her learning objects
		 */
		private.getPersonRow = function(courses, person) {
			if (!courses || typeof courses !== 'object' || courses.length < 1 
				|| !person || typeof person !== 'object' 
				|| !person.hasOwnProperty('name') || !person.hasOwnProperty('title') || !person.hasOwnProperty('los')) {
				throw Error('getPersonRow: Invalid arguments');
			} else {

				console.log('getPersonRow', courses.length + ' ' + person.name);
				console.log('getPersonRow courses', JSON.stringify(courses));
				console.log('getPersonRow person', JSON.stringify(person));

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
				var aggregatedPerson = 0, coursesCount = courses.length, naCoursesCount = 0;
				_.each(courses, function(course) {

					// init cell
					var cell = {
						value: 0,
						suffix: '%'
					};

					var currentLos = _.filter(person.los, function(lo) {
						return lo.segmentId === course.id;
					});

					if (currentLos && currentLos.length > 0) {
						// aggregate lo value
						var aggregatedLos = 0, losCount = currentLos.length;
						_.each(currentLos, function(lo) {
							console.log('getPersonRow ' + person.name + ' ' + course.name + ' [' + lo.id + ']', lo.value === 2 ? 1 : 0);
							aggregatedLos += lo.value === 2 ? 1 : 0;
						});

						console.log('getPersonRow ' + person.name + ' ' + course.name + ' aggregatedLos', aggregatedLos);

						// top level cell (segment)
						cell.value = losCount > 0 ? Math.round(aggregatedLos / losCount * 100) : 0;
						console.log('getPersonRow ' + person.name + ' ' + course.name + ' cell.value', cell.value);
						cell.css = private.getPersonSegmentCellCss(cell);

						aggregatedPerson += cell.value;

						// store cell into row using course.id as the row property
						row[course.id] = cell;

						// add child cells (visibility is controlled by the child columns)
						_.each(currentLos, function(lo) {
							// child cell
							row[course.id + '_' + lo.id] = private.personLoCells[lo.value];
						});
					} else {
						coursesCount = coursesCount > 0 ? --coursesCount : 0;
						naCoursesCount++;

						cell.isNA = true;
						cell.value = 'N/A';
						cell.suffix = '';
						//aggregatedPerson += 100;

						// store cell into row using course.id as the row property
						row[course.id] = cell;

						_.each(course.los, function(lo) {
							// child cell
							row[course.id + '_' + lo.id] = {
								value: 'N/A'
							};
						});
					}
				});	

				// the row (horizontal) percentage for all the course sections for this person
				var finalValue;
				if (naCoursesCount !== courses.length) {
					finalValue = coursesCount > 0 ? Math.round(aggregatedPerson / coursesCount) : 0;
				} else {
					// if all courses are N/A, then aggregated value is also N/A
					finalValue = 'N/A';
				}
				row.summary.value = finalValue;

				return row;
			}
		};

		/**
		 * @method aggregateSegmentByStore
		 */
		private.aggregateSegmentByStore = function(course, store) {
			if (!course || typeof course !== 'object' || !course.hasOwnProperty('id') || !course.id
				|| !store || typeof store !== 'object' 
				|| !store.hasOwnProperty('people')) {
				throw Error('aggregateSegmentByStore: Invalid arguments');
			} else {
				// aggregate all people
				var peopleByStore = store.people, 
					courseAggregated = 0, 
					peopleByStoreCount = peopleByStore.length,
					naCount = 0;

				_.each(peopleByStore, function(person) {

					var currentLos = _.filter(person.los, function(lo) {
						return lo.segmentId === course.id;
					});

					if (currentLos && currentLos.length > 0) {
						var aggregatedLos = 0, losCount = currentLos.length;

						_.each(currentLos, function(lo) {
							aggregatedLos += lo.value === 2 ? 1 : 0;
						});

						courseAggregated += losCount > 0 ? Math.round(aggregatedLos / losCount * 100) : 0;

					} else {
						peopleByStoreCount = peopleByStoreCount > 0 ? --peopleByStoreCount : 0;
						naCount++; /* keep track of how many people are N/A */
					}
				});

				// calculate percentage
				console.log('aggregateSegmentByStore peopleCount: ' + peopleByStoreCount + ' naCount: ' + naCount, courseAggregated)
				var finalValue;
				if (naCount !== peopleByStore.length) {
					finalValue = peopleByStoreCount > 0 ? courseAggregated / peopleByStoreCount : 0;
				} else {
					// if all people are N/A, then aggregated value is also N/A
					finalValue = 'N/A';
				}

				return finalValue;
			}
		};

		/**
		 * @method aggregateLoByStore
		 */
		private.aggregateLoByStore = function(courseLo, store) {
			var peopleByStore = store.people,
				aggregatedLos = 0, 
				peopleCount = peopleByStore.length, 
				naPeopleCount = 0;

			// loop through all store people
			_.each(peopleByStore, function(person) {
				// find matching person lo
				var currentLo = _.find(person.los, function(personLo) {
					return personLo.id === courseLo.id;
				});
				//console.log('person ' + person.name + ' lo ' + courseLo.id + ' ', currentLo)

				if (currentLo) {
					aggregatedLos += currentLo.value === 2 ? 1 : 0;
				} else {
					// if person does not have learnig object, reduce peopleCount and increase naPeopleCount
					peopleCount = peopleCount > 0 ? --peopleCount : 0;
					naPeopleCount++;
				}
			});

			var peopleAggregated = 0;
			if (naPeopleCount !== peopleByStore.length) {
				peopleAggregated = peopleCount > 0 ? Math.round(aggregatedLos / peopleCount * 100) : 0;
			} else {
				// if all people are N/A, then aggregated value is also N/A
				peopleAggregated = 'N/A';
			}
			return peopleAggregated;
		};

		/**
		 * @method recalculate
		 * @decsription
		 */
		var recalculate = function(model) {
			console.log('recalculate - NOT IMPLEMENTED');
		};

		/**
		 * @method getModel
		 * @decsription
		 * Helper to get a model with the aggregated data that can be used in a generic way
		 */
		var getModel = function(data) {

            // TODO: check if the backend can easily add segmentId to each person Learning Object.
            // if not, we have to map it here:
            if (!data.stores[0].people[0].los[0].segmentId) {
                console.log('Adding segmentId to people learning objects');

                _.each(data.stores, function(store) {
                    _.each(store.people, function(person) {
                        _.each(person.los, function(personLo) {
                            var itemLo;
                            for (var p in data.segments) {
                                var segm = data.segments[p];
                                itemLo = _.find(segm.los, function(lookupLo) {
                                    return lookupLo.id === personLo.id;
                                });

                                if (itemLo) {
                                    personLo.segmentId = segm.id;
                                }
                            }
                        });
                    });
                });

                console.log('Data with segmentId on people learning object', data);
            }
            

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
			_.each(data.segments, function(course) {
				course.show = course.show || true;

				var colGroup = {
					isGroup: true,
					show: course.show,
					id: course.id,
					position:  model.columns.length,
					locked: false,
					css: 'th-course',
					name:  course.name
				};

				// push row
				model.columns.push(colGroup);

				// add child columns
				_.each(course.los, function(section) {
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
			_.each(data.stores, function(store) {
				// init row and add first column for store name
				var rowGroup = {
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

				var peopleByStore = store.people;

				console.log('peopleByStore', peopleByStore);

				// loop through each course and aggregate
				// each person data by course by building a cell for each course
				var coursesCount = data.segments.length, naCoursesCount = 0, storeAggregated = 0;

				_.each(data.segments, function(course) {
					// init cell with value zero
					var groupCell = {
						value: 0
					};

					// aggregate current segment and stor into cell
					groupCell.value = private.aggregateSegmentByStore(course, store);
					if (groupCell.value === 'N/A') {
						groupCell.suffix = '';
						naCoursesCount++;
						coursesCount = coursesCount > 0 ? --coursesCount : 0;
					} else {
						groupCell.suffix = '%';
						storeAggregated += groupCell.value;
					}

					// store groupCell into row using course.id as the row property
					rowGroup[course.id] = groupCell;

					_.each(course.los, function(courseLo) {
						var childCell = {
							value: private.aggregateLoByStore(courseLo, store)
						};

						if (childCell.value === 'N/A') {
							childCell.suffix = '';
						} else {
							childCell.suffix = '%';
						}

						// add child cell
						rowGroup[course.id + '_' + courseLo.id] = childCell;
					});
				});

				_.each(peopleByStore, function(person) {
					var personRow = private.getPersonRow(data.segments, person);
					rowGroup.children.push(personRow);
				});

				// the row (horizontal) percentage for all the 
				var finalValue = 0;
				if (naCoursesCount !== data.segments.length) {
					finalValue = coursesCount > 0 ? Math.round(storeAggregated / coursesCount) : 0;
				} else {
					// if all courses are N/A, then aggregated value is also N/A
					finalValue = 'N/A';
				}

				// store value in summary cell 
				rowGroup.summary.value = finalValue;

				// push rowGroup
				model.result.rows.push(rowGroup);
			});
			
			console.log('model', JSON.stringify(model));
			return model;
		};
		
		return {
			getModel: getModel,
			recalculate: recalculate,
			private: private
		};
	};
  
	// // get reference to Main module
	// var app = angular.module('Main');
	
	// // register service with angular
	// app.factory('report3Service', [reportService]);
  
}());
