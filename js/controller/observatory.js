angular.module("ptoApp")

	.controller("ObservatoryCtrl", function($scope, $http, $location, mock, userStorage, config) {
		$scope.main.setActiveMenu("advanced");
		$scope.directLink = $location.absUrl();

		// from timeline.js TODO...
		$scope.getTimeWindow = getTimeWindow;

		var init = function() {
			$scope.fetchAllConditions();

			// user storage init
			var userUI = userStorage.load("ui");
			if (userUI) {
				_.each(userUI, function(v, k) {
					if (!_.isUndefined($scope.ui[k])) {
						_.extend($scope.ui[k], v);
					}
				});
				// :( in case the user closed the window during
				// query loading
				$scope.ui.loading = false;
			}
			$scope.$watch('ui', function(newValue, oldValue) {
				//console.log("ui change", newValue, oldValue);
				userStorage.save("ui", newValue);
			}, true);

			// url parameter init
			var params = $location.search();
			_.extend($scope.input.query, paramsToQuery($scope.input.query, params));
			console.log("input", $scope.input);
			if (!_.isEmpty(params)) {
				// the user comes from a direct link,
				// so we ignore storage data for mocking
				$scope.ui.mock.active = false;
				$scope.fetchResults($scope.input.query);
			}
		};

		$scope.ui = {
			
			loading: false,
			
			pathCriteria: {
				show: false,
				calendarFrom: false,
				calendarTo: false,
				display: function(query) {
					return (query.sip || "( empty )") +
						" - " + (query.on_path || "*") +
						" - " + (query.dip || "( empty )") +
						" | " + ($scope.main.formatTime(query.from) || "( empty )") +
						" - " + ($scope.main.formatTime(query.to) || "( empty )");
				}
			},

			conditions: {
				show: false,
				display: function(query) {
					return getConditionsString(query.conditions)
						.replace(":", " AND ")
						.replace(",", " OR ") ||
						"( empty )";
				}
			},
			
			grouping: {
				show: false,
				display: function(queryType) {
					return queryType || "( empty )";
				}
			},

			render: {
				show: false,
				pieChart: true,
				table: true,
				timeline: true,
				display: function() {
					return _.without([
						(this.pieChart ? "pie chart" : null),
						(this.table ? "table" : null),
						(this.timeline ? "timeline" : null)
					], null).join(", ") || "( empty )";
				}
			},

			results: {
				show: true,
				display: function() {
					return ($scope.isError ? $scope.errorResponse.status : false) ||
						(($scope.api.results.length == 1) ?
						$scope.api.results[0].observations.length :
						$scope.api.results.length) ||
						"( empty )"
				}
			},

			mock: {
				active: false,
				error: false,
				nPathGroups: 0,
				nObservations: 0,
				generate: function() {
					return mock(this.nPathGroups, this.nObservations);
				}
			},
		};

		$scope.input = {
			query: {
				type: "default",
				skip: 0,
				limit: 0,
				sip: "",
				dip: "",
				on_path: "",
				from: 0,
				to: 1567204529149,
				conditions: []
			}
		};

		$scope.api = {

			allConditions: [],
			
			results: [],
			max: 0,
			count: 0,
		};

		var paramsToQuery = function(uiQuery, params) {
			var query = _.extend({}, uiQuery, params);
			//console.log("ui query", query);
			if (_.isString(query.conditions)) {
				var reduction = _.reduce(query.conditions.split(""), function(iter, char) {
					//console.log("params to query", iter, char);
					if (char === ":" || char === ",") {
						return {
							idx: iter.idx + 1,
							result: iter.result.concat({ name: "", op: char })
						};
					}
					iter.result[iter.idx].name += char;
					return {
						idx: iter.idx,
						result: iter.result
					};
				}, { lastWord: "", result: [ {name: ""} ], idx: 0 });
				query.conditions = reduction.result;
			}
			query.from = parseInt(query.from);
			query.to = parseInt(query.to);
			//console.log("conditions", query.conditions);
			return query;
		};

		var getConditionsString = function(conditions) {
			return _.reduce(conditions, function(str, condition) {
				return str + ((condition.op) ? condition.op : "") + condition.name;
			}, "");
		};

		var getQueryString = function(object) {
			return _.map(object, function(v, k) {
				if (k === "conditions") {
					return k + '=' + encodeURIComponent(getConditionsString(v));
				}
				return k + '=' + encodeURIComponent(v);
			}).join('&');
		};

		// TODO decouple sideeffects from timeline
		// TODO decouple timeline into separate controller or put it into UI

		$scope.timeLineMouseIn = function(group, obs) {
			$scope.$apply(function() {
				$scope.api.results[group].observations[obs].highlighted = true;
			});
		};

		$scope.timeLineMouseOut = function(group, obs) {
			$scope.$apply(function() {
				$scope.api.results[group].observations[obs].highlighted = false;
			});
		};

		var rejectToggle = false;
		$scope.timeLineClick = function(group, obs) {
			//console.log('click', group, obs);
			var rejected = $scope.api.results[group].observations[obs].rejected;
			//console.log('rejected', rejected, 'toggle', rejectToggle);
			if (rejected) {
				rejectToggle = true;
			} else {
				rejectToggle = !rejectToggle;
			}
			//console.log('new toggle', rejectToggle);
			_.each($scope.api.results, function(group) {
				_.each(group.observations, function(obs) {
					obs.rejected = rejectToggle;
				});
			});
			$scope.api.results[group].observations[obs].rejected = false;
			//console.log($scope.api.results);
			$scope.$apply();
		};

		var getColorMap = function(pathGroups) {
			return _.map(pathGroups, function(pg, i) {
				//console.log('start color mapping');
				return _.reduce(getUniqueConditions(pg), function(cm, cond, i) {
					//console.log('colormap', cond, i, colors(i));
					cm.push({ name: cond, color: colors(i)})
					return cm;
				}, []);
			});
		};

		$scope.fetchAllConditions = function() {
			var success = function(res) {
				console.log("all conditions", res.data);
				$scope.api.allConditions = _.keys(res.data.conditions);
			};

			var error = function(err) {
				console.error(err);
			};
			$http.get(config.apibase + '/api/all_conditions').then(success, error);
		};

		$scope.fetchResults = function(queryObj) {
			//return;
			$scope.ui.loading = true;
			$scope.isError = false;
			$scope.errorResponse = {};

			if (queryObj.limit == 0) {
				delete queryObj.limit;
				delete queryObj.skip;
			}

			console.log('query object', queryObj);
			var queryString = getQueryString(queryObj);
			
			$location.search(queryString);

			var success = function(res) {
				console.log("query response", res.data);
				if ($scope.input.query.type === 'default' && !$scope.ui.mock.active) {
					res.data.results = [{
						sip: "", dip: "",
						observations: res.data.results
					}];
				}
				$scope.api.results = _.map(res.data.results, function(pg, i) {
					pg.observations = _.map(pg.observations, function(obs, k) {
						obs.grandParentIndex = i;
						obs.parentIndex = k;
						obs.highlighted = false;
						obs.rejected = false;
						return obs;
					});
					return pg;
				});
				//console.log("pi added", $scope.api.results);
				$scope.maxresults = res.data.max;
				$scope.totalresults = res.data.count;
				$scope.directLink = $location.absUrl();
				$scope.colorMap = getColorMap($scope.api.results);
				$scope.ui.loading = false;
			};

			var error = function(res) {
				console.error(res);
				$scope.ui.loading = false;
				$scope.isError = true;
				$scope.errorResponse = res;
				$scope.api.results = [];
			};
			if ($scope.ui.mock.active) {
				if ($scope.ui.mock.error) {
					return error({ status: 404 });
				}
				return success({ data: queryObj });
			}
			var endPoint = ($scope.input.query.type === 'default') ? '/api/raw/observations?' : '/api/observations?';
			$http.get(config.apibase + endPoint + queryString).then(success, error);
		};

		$scope.nextPage = function() {
			$scope.input.query.skip = parseInt($scope.input.query.limit) + parseInt($scope.input.query.skip);
			$scope.fetchResults($scope.input.query);
		};

		init();
	});