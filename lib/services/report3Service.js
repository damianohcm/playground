(function() {

	window.services = window.services || {};
  
	window.services.report3Service = function() {
		var private = {};

		// helper to get % cell css
		private.getGroupCellCss = function(cell) {
			if (!cell || typeof cell !== 'object' || !cell.hasOwnProperty('value')) {
				throw Error('getGroupCellCss: Invalid argument');
			} else {
				if (isNaN(cell.value)) {
					return 'col-group na';
				} else if (cell.value === 100) {
					return 'col-group completed';
				} else if (cell.value > 0) {
					return 'col-group in-progress';
				} else {
					return 'col-group zero';
				}
			}
		};

		// helper to get % cell css
		private.getChildCellCss = function(cell) {
			if (!cell || typeof cell !== 'object' || !cell.hasOwnProperty('value')) {
				throw Error('getChildCellCss: Invalid argument');
			} else {
				if (isNaN(cell.value)) {
					return 'col-child na';
				} else if (cell.value === 100) {
					return 'col-child completed';
				} else if (cell.value > 0) {
					return 'col-child in-progress';
				} else {
					return 'col-child zero';
				}
			}
		};

		// helper to get % cell css
		private.getGroupSummaryCellCss = function(cell) {
			if (!cell || typeof cell !== 'object' || !cell.hasOwnProperty('value')) {
				throw Error('getGroupCellCss: Invalid argument');
			} else {
				if (isNaN(cell.value)) {
					return 'col-group na';
				} else if (cell.value === 100) {
					return 'col-group completed';
				} else if (cell.value > 0) {
					return 'col-group in-progress';
				} else {
					return 'col-group zero';
				}
			}
		};

		// helper to get % cell css
		private.getChildSummaryCellCss = function(cell) {
			if (!cell || typeof cell !== 'object' || !cell.hasOwnProperty('value')) {
				throw Error('getChildCellCss: Invalid argument');
			} else {
				if (isNaN(cell.value)) {
					return 'col-group na';
				} else if (cell.value === 100) {
					return 'col-group completed';
				} else if (cell.value > 0) {
					return 'col-group in-progress';
				} else {
					return 'col-group zero';
				}
			}
		};

		// helper to get person segment cell css
		private.getPersonSegmentCellCss = function(cell) {
			if (!cell || typeof cell !== 'object' || !cell.hasOwnProperty('value')) {
				throw Error('getPersonSegmentCellCss: Invalid argument');
			} else {
				if (isNaN(cell.value)) {
					return 'col-child na';
				} else if (cell.value === 100) {
					return 'col-child completed';
				} else if (cell.value > 0) {
					return 'col-child in-progress';
				} else {
					return 'col-child';
				}
			}
		};

		// strategy to lookup person learning object status by id
		private.personLoCells = {
			'-1': {
				isChild: true,
				realValue: -1,
				value: 'N/A',
				css: 'col-child na'
			},
			'0': {
				isChild: true,
				realValue: 0,
				value: 'Not Started',
				css: ''
			},
			'1': {
				isChild: true,
				realValue: 1,
				value: 'In Progress',
				css: 'col-child in-progress'
			},
			'2': {
				isChild: true,
				realValue: 2,
				value: 'Completed',
				css: 'col-child completed'
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

				person.show = person.hasOwnProperty('show') ? person.show : true; // TODO; change to false by default and the programmatically set to true when clicking on parent row

				// init row and add first column for store name
				var row = {
					id: person.id,
					isChild: true,
					show: person.show,
					category: {
						key: 'category',
						locked: true,
						value: person.name,
						value2: person.title,
					},
					summary: {
						key: 'summary',
						locked: true,
						value: 0,
						suffix: '%'
					}
				};

				// loop through each course
				_.each(courses, function(course) {

					// init cell
					var cell = {
						isGroup: true,
						key: course.id,
						id: course.id,
						value: 0,
						suffix: '%'
					};

					// store cell into row using course.id as the row property
					row[cell.key] = cell;

					var currentLos = _.filter(person.los, function(lo) {
						return lo.segmentId === course.id;
					});

					if (currentLos && currentLos.length > 0) {
						// add child cells (visibility is controlled by the child columns)
						_.each(course.los, function(lo) {
							var personLo = _.find(currentLos, function(plo) {
								return plo.id == lo.id;
							});
							// child cell
							var childCell = JSON.parse(JSON.stringify(private.personLoCells[personLo.value]));
							childCell.parentId = course.id;
							childCell.id = lo.id;
							childCell.key = childCell.parentId + '_' + childCell.id;
							row[childCell.key] = childCell;
						});
					} else {
						cell.isNA = true;
						cell.value = 'N/A';
						cell.suffix = '';

						_.each(course.los, function(lo) {
							// child cell
							var childCell = JSON.parse(JSON.stringify(private.personLoCells[-1]));
							childCell.parentId = course.id;
							childCell.id = lo.id;
							childCell.key = childCell.parentId + '_' + childCell.id;
							// child cell
							row[childCell.key] = childCell;
						});
					}
				});	

				// // the row (horizontal) percentage for all the course sections for this person
				// var finalValue;
				// if (naCoursesCount !== courses.length) {
				// 	finalValue = coursesCount > 0 ? Math.round(aggregatedPerson / coursesCount) : 0;
				// } else {
				// 	// if all courses are N/A, then aggregated value is also N/A
				// 	finalValue = 'N/A';
				// }
				row.summary.value = 0;

				return row;
			}
		};

		/**
		 * @method aggregateSegmentByStore
		 * @decription
		 * A colGroup represents a course (segment)
		 * A rowGroup represents a store 
		 */
		private.aggregateSegmentByStore = function(colGroup, rowGroup) {
			if (!colGroup || typeof colGroup !== 'object' || !colGroup.hasOwnProperty('id') || !colGroup.id
				|| !rowGroup || typeof rowGroup !== 'object' 
				|| !rowGroup.hasOwnProperty('children')) {
				throw Error('aggregateSegmentByStore: Invalid arguments');
			} else {
				// aggregate all people
				var peopleRows = rowGroup.children, // the rowGroup children rows are the people rows
					peopleRowsCount = peopleRows.length, 
					naCount = 0,
					aggregated = 0;

				_.each(peopleRows, function(personRow) {
					// include row in calculation only if visible
					if (personRow.show) {
						var currentLos = [];
						_.each(Object.keys(personRow), function(k) {
							if (personRow[k].hasOwnProperty('parentId') && personRow[k].parentId === colGroup.id) {
								currentLos.push(personRow[k]);
							}
						});
						console.log('aggregateSegmentByStore: personRow ' + personRow.id + ' currentLos', currentLos)

						var aggregatedLos = 0, losCount = currentLos.length, naLosCount = 0;

						_.each(currentLos, function(lo) {
							if (lo.realValue > -1) {
								aggregatedLos += lo.realValue === 2 ? 1 : 0;
							} else {
								naLosCount++;
							}
						});

						if (naLosCount !== currentLos.length) {
							aggregated += losCount > 0 ? Math.round(aggregatedLos / losCount * 100) : 0;
						} else {
							peopleRowsCount = peopleRowsCount > 0 ? --peopleRowsCount : 0;
							naCount++; /* keep track of how many people are N/A */
						}
					} else {
						peopleRowsCount = peopleRowsCount > 0 ? --peopleRowsCount : 0;
					}
				});

				// calculate percentage
				console.log('aggregateSegmentByStore peopleCount: ' + peopleRowsCount + ' naCount: ' + naCount, aggregated)
				var finalValue;
				if (naCount !== peopleRows.length) {
					finalValue = peopleRowsCount > 0 ? aggregated / peopleRowsCount : 0;
				} else {
					// if all people are N/A, then aggregated value is also N/A
					finalValue = 'N/A';
				}

				return finalValue;
			}
		};

		/**
		 * @method aggregateLoByStore
		 * A colChild represents a lo
		 * A rowGroup represents a store 
		 */
		private.aggregateLoByStore = function(colChild, rowGroup) {
			var peopleRows = rowGroup.children, // the rowGroup children rows are the people rows
				peopleRowsCount = peopleRows.length, 
				naCount = 0,
				aggregated = 0;

			// loop through all store people
			_.each(peopleRows, function(personRow) {
				// include row in calculation only if visible
				if (personRow.show) {
					// find matching person lo
					// var currentLo = _.find(personRow, function(personLo) {
					// 	return personLo.id === colChild.id;
					// });
					var currentLo;
					Object.keys(personRow).every(function(k) {
						if (personRow[k].hasOwnProperty('id') && personRow[k].id === colChild.id) {
							currentLo = personRow[k];
							return false;
						}
						return true;
					});
					console.log('aggregateLoByStore: personRow ' + personRow.id + ' lo ' + colChild.id + ' ', currentLo)

					if (currentLo && currentLo.realValue > -1) {
						aggregated += currentLo.realValue === 2 ? 1 : 0;
					} else {
						// if person does not have learning object, reduce peopleRowsCount and increase naCount
						peopleRowsCount = peopleRowsCount > 0 ? --peopleRowsCount : 0;
						naCount++;
					}
				} else {
					peopleRowsCount = peopleRowsCount > 0 ? --peopleRowsCount : 0;
				}
			});

			var finalValue = 0;
			if (naCount !== peopleRows.length) {
				finalValue = peopleRowsCount > 0 ? Math.round(aggregated / peopleRowsCount * 100) : 0;
			} else {
				// if all people are N/A, then aggregated value is also N/A
				finalValue = 'N/A';
			}
			return finalValue;
		};

		/**
		 * @method recalculate
		 * @decsription
		 */
		var recalculate = function(model, data) {
			debugger;
			console.log('recalculate - WORKING ON IMPLEMENTATION');
			//data = JSON.parse(JSON.stringify(data));
			var topLevelColumn = model.topLevelColumn;

			// get store rows (row groups)
			var rowGroups = _.filter(model.result.rows, function(row) {
				return row.isGroup;
			});

			// get segments columns (column groups)
			var colGroups = _.filter(model.columns, function(column) {
				return column.isGroup;
			});

			// begin: store (rowGroup) loop
			_.each(rowGroups, function(rowGroup) {

				// include row in calculation only if visible
				if (rowGroup.show) {

					// begin: course (colGroup) loop
					// aggregate each person data by course
					var coursesCount = colGroups.length, naCoursesCount = 0, storeAggregated = 0;

					_.each(colGroups, function(colGroup) {

						// only include colGroup in calculation if group column is visible and we are not in detail view (topLevelColumn will be undefined)
						if (!topLevelColumn && colGroup.show || (topLevelColumn && topLevelColumn.id === colGroup.id)) {
							// get group cell (course cell)
							var groupCell = rowGroup[colGroup.key];

							// aggregate current segment
							groupCell.value = private.aggregateSegmentByStore(colGroup, rowGroup);
							groupCell.css = private.getGroupCellCss(groupCell);

							if (groupCell.value === 'N/A') {
								groupCell.suffix = '';
								naCoursesCount++;
								coursesCount = coursesCount > 0 ? --coursesCount : 0;
							} else {
								groupCell.suffix = '%';
								storeAggregated += groupCell.value;
							}

							// get all child columns (course los)
							var colChildren = _.filter(model.columns, function(col) {
								return col.parentId === colGroup.id;
							});

							_.each(colChildren, function(colChild) {
								var childCell = rowGroup[colChild.key];

								childCell.value = private.aggregateLoByStore(colChild, rowGroup);
								childCell.css = private.getChildCellCss(childCell);
								
								if (childCell.value === 'N/A') {
									childCell.suffix = '';
								} else {
									childCell.suffix = '%';
								}
							}); // end: course los (child columns) loop

						} else {
							coursesCount = coursesCount > 0 ? --coursesCount : 0;
						}

					}); // end: course (columnGroup) loop


					// get all child rows (people)
					// var rowChildren = _.filter(model.result.rows, function(row) {
					// 	return row.parentId === rowGroup.id;
					// });
					var rowChildren = rowGroup.children;

					_.each(rowChildren, function(personRow) {

						// include row in calculation only if visible
						if (personRow.show) {

							// loop through each course
							var aggregatedPerson = 0;
							naCoursesCount = 0;
							coursesCount = colGroups.length;

							_.each(colGroups, function(colGroup) {

								debugger;
							
								// only include colGroup in calculation if group column is visible and we are not in detail view (topLevelColumn will be undefined)
								if (!topLevelColumn && colGroup.show || (topLevelColumn && topLevelColumn.id === colGroup.id)) {
									var personCourseCell = personRow[colGroup.key];

									var currentLos = _.filter(personRow, function(lo) {
										return lo.parentId === colGroup.id;
									});

									// aggregate lo value
									var aggregatedLos = 0, losCount = currentLos.length, naLosCount = 0;

									_.each(currentLos, function(lo) {
										console.log('recalculate: personRow.id ' + personRow.id + ' ' + colGroup.id + ' [' + lo.id + ']', lo);
										if (lo.realValue > -1) {
											aggregatedLos += lo.realValue === 2 ? 1 : 0;
										} else {
											naLosCount++;
										}
									});

									if (naLosCount !== currentLos.length) {
										// person course aggregated
										personCourseCell.value = losCount > 0 ? Math.round(aggregatedLos / losCount * 100) : 0;
										aggregatedPerson += personCourseCell.value;
										console.log('recalculate: personRow.id ' + personRow.id + ' ' + colGroup.id + ' personCourseCell.value', personCourseCell.value);
									} else {
										naCoursesCount++;
										coursesCount--;
										personCourseCell.isNA = true;
										personCourseCell.value = 'N/A';
										personCourseCell.prefix = '%';
									}

									personCourseCell.css = private.getPersonSegmentCellCss(personCourseCell);

								} else {
									coursesCount = coursesCount > 0 ? --coursesCount : 0;
								}
							});

							// the row (horizontal) percentage for all the course sections for this person
							debugger;
							var personRowSummaryValue = 0;
							if (naCoursesCount !== colGroups.length) {
								personRowSummaryValue = coursesCount > 0 ? Math.round(aggregatedPerson / coursesCount) : 0;
							} else {
								// if all courses are N/A, then aggregated value is also N/A
								personRowSummaryValue = 'N/A';
							}

							// set person row summary
							personRow.summary.value = personRowSummaryValue;
							personRow.summary.suffix = '% (person row.summary)';
							personRow.summary.css = private.getChildSummaryCellCss(personRow.summary);

						} else {
							debugger;
						}
					});


					// the row (horizontal) percentage for the rowGroup (store)
					var rowGroupSummaryValue = 0;
					if (naCoursesCount !== colGroups.length) {
						rowGroupSummaryValue = coursesCount > 0 ? Math.round(storeAggregated / coursesCount) : 0;
					} else {
						// if all courses are N/A, then aggregated value is also N/A
						rowGroupSummaryValue = 'N/A';
					}

					// store value in rowGroup summary cell 
					rowGroup.summary.value = rowGroupSummaryValue;
					rowGroup.summary.css = private.getGroupSummaryCellCss(rowGroup.summary);
				} else {
					debugger;
				}

			}); // end: store (rowGroup) loop
			
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
					key: 'category',
					position:  0,
					show: true,
					locked: true,
					css: 'th-category',
					name:  ''
				}, {
					id: 'summary',
					key: 'summary',
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

			// 1. Add to model.columns collection
			// loop through each course and add a column for each course
			_.each(data.segments, function(course) {
				
				// add show property on data (might not needed after refactoring since will be also on model)
				course.show = course.hasOwnProperty('show') ? course.show : true;

				var colGroup = {
					isGroup: true,
					id: course.id,
					key: course.id,
					show: course.show,
					position:  model.columns.length,
					locked: false,
					css: 'th-course',
					name: course.name
				};

				// push row
				model.columns.push(colGroup);

				// add child columns
				_.each(course.los, function(section) {
					section.show = section.hasOwnProperty('show') ? section.show : true;

					// push row
					model.columns.push({
						isChild: true,
						parentId: course.id,
						id: section.id,
						key: course.id + '_' + section.id,
						show: section.show ,
						position:  model.columns.length,
						locked: false,
						css: 'th-section',
						name: section.name
					});
				});
			});

			// 2. Aggregate data and add to model.result.rows collection
			// loop through each store and add a row for each store
			_.each(data.stores, function(store) {

				// add show property on data (might not needed after refactoring since will be also on model)
				store.show = store.hasOwnProperty('show') ? store.show : true;

				// init row and add first column for store name
				var rowGroup = {
					isGroup: true,
					id: store.id,
					show: store.show,
					children: [],
					category: {
						id: 'category',
						key: 'category',
						css: 'category',
						locked: true,
						value: store.id + '-' + store.name
					}, 
					summary: {
						id: 'summary',
						key: 'summary',
						locked: true,
						value: 0,
						suffix: '%'
					}
				};

				var peopleByStore = store.people;

				console.log('peopleByStore', peopleByStore);

				// loop through each course and aggregate
				// and build a cell for each course
				_.each(data.segments, function(course) {
					// init group cell with value zero
					var groupCell = {
						isGroup: true,
						id: course.id,
						key: course.id,
						value: 0,
						suffix: ''
					};

					// store groupCell into row using course.id as the row property
					rowGroup[groupCell.key] = groupCell;

					// add child cell for each course lo
					_.each(course.los, function(courseLo) {
						var childCell = {
							isChild: true,
							parentId: course.id,
							id: courseLo.id,
							key: course.id + '_' + courseLo.id,
							value: 0,
							suffix: ''
						};

						// add child cell
						rowGroup[childCell.key] = childCell;
					});
				});

				_.each(peopleByStore, function(person) {
					var personRow = private.getPersonRow(data.segments, person);
					personRow.parentId = rowGroup.id;
					rowGroup.children.push(personRow);
				});

				// // the row (horizontal) percentage for all the 
				// var finalValue = 0;
				// if (naCoursesCount !== data.segments.length) {
				// 	finalValue = coursesCount > 0 ? Math.round(storeAggregated / coursesCount) : 0;
				// } else {
				// 	// if all courses are N/A, then aggregated value is also N/A
				// 	finalValue = 'N/A';
				// }

				// // store value in summary cell 
				// rowGroup.summary.value = finalValue;

				// push rowGroup
				model.result.rows.push(rowGroup);
			});

			model.topLevelColumn = undefined;

			recalculate(model, data);

			//console.log('model', JSON.stringify(model));
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
