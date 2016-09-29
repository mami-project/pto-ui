angular.module("ptoApp")

	.controller("ObservatoryCtrl", function($scope, $http, $location, config) {
		$scope.main.setActiveMenu("advanced");
		$scope.directLink = $location.absUrl();

		// from visu.js
		$scope.getTimeWindow = getTimeWindow;

		$scope.ui = {
			pathCriteria: {
				show: false,
			},
			conditions: {
				show: false,
			},
			grouping: {
				show: false,
				type: 'default',
			},
			query: {

			},
			mock: {
				active: false,
				nPathGroups: 0,
				nObservations: 0,
				generate: function() {
					return generateMock(this.nPathGroups, this.nObservations);
				}
			},
		};
		
		$scope.fetching = false;

		var defaultQuery = {
			skip: 0,
			limit: 0,
			sip: "",
			dip: "",
			on_path: "",
			from: 0,
			to: 1567204529149,
			conditions: []
		};

		var paramsToQuery = function(params) {
			var query = _.extend({}, defaultQuery, params);
			if (_.isString(query.conditions)) {
				var reduction = _.reduce(query.conditions.split(""), function(iter, char) {
					console.log("params to query", iter, char);
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
				}, {lastWord: "", result: [{name: ""}], idx: 0});
				query.conditions = reduction.result;
			}
			console.log("conditions", query.conditions);
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

		$scope.allConditions = [];

		var fetchAllConditions = function() {
			var success = function(res) {
				console.log("all conditions", res.data);
				$scope.allConditions = _.keys(res.data.conditions);
			};

			var error = function(err) {
				console.error(err);
			};
			$http.get(config.apibase + '/api/all_conditions').then(success, error);
		};
		fetchAllConditions();

		$scope.printPathCriteria = function(query) {
			return (query.sip || "( empty )") +
				" - " + (query.on_path || "*") +
				" - " + (query.dip || "( empty )") +
				" | " + ($scope.main.formatTime(query.from) || "( empty )") +
				" - " + ($scope.main.formatTime(query.to) || "( empty )");
		};

		$scope.printConditions = function(query) {
			return getConditionsString(query.conditions)
				.replace(":", " AND ")
				.replace(",", " OR ") ||
				"( empty )";
		};

		$scope.printGrouping = function(queryType) {
			return queryType || "( empty )";
		};

		// fetched
		$scope.maxresults = 0;
		$scope.totalresults = 0;
		$scope.results = [];

		$scope.fromIsOpen = false;
		$scope.openFromCalendar = function(e) {
	        e.preventDefault();
	        e.stopPropagation();

	        $scope.fromIsOpen = true;
	    };

	    $scope.toIsOpen = false;
		$scope.openToCalendar = function(e) {
	        e.preventDefault();
	        e.stopPropagation();

	        $scope.toIsOpen = true;
	    };

		$scope.timeLineMouseIn = function(group, obs) {
			$scope.$apply(function() {
				$scope.results[group].observations[obs].highlighted = true;
			});
		};

		$scope.timeLineMouseOut = function(group, obs) {
			$scope.$apply(function() {
				$scope.results[group].observations[obs].highlighted = false;
			});
		};

		var rejectToggle = false;
		$scope.timeLineClick = function(group, obs) {
			console.log('click', group, obs);
			var rejected = $scope.results[group].observations[obs].rejected;
			console.log('rejected', rejected, 'toggle', rejectToggle);
			if (rejected) {
				rejectToggle = true;
			} else {
				rejectToggle = !rejectToggle;
			}

			console.log('new toggle', rejectToggle);

			
			_.each($scope.results, function(group) {
				_.each(group.observations, function(obs) {
					obs.rejected = rejectToggle;
				});
			});
			$scope.results[group].observations[obs].rejected = false;
			console.log($scope.results);
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

		$scope.fetchResults = function(queryObj) {
			$scope.fetching = true;
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
				if ($scope.ui.grouping.type === 'default' && !$scope.ui.mock.active) {
					res.data.results = [{
						sip: "", dip: "",
						observations: res.data.results
					}];
				}
				$scope.results = _.map(res.data.results, function(pg, i) {
					pg.observations = _.map(pg.observations, function(obs, k) {
						obs.grandParentIndex = i;
						obs.parentIndex = k;
						obs.highlighted = false;
						obs.rejected = false;
						return obs;
					});
					return pg;
				});
				//console.log("pi added", $scope.results);
				$scope.maxresults = res.data.max;
				$scope.totalresults = res.data.count;
				$scope.directLink = $location.absUrl();
				$scope.colorMap = getColorMap($scope.results);
				$scope.fetching = false;
			};

			var error = function(res) {
				console.error(res);
				$scope.fetching = false;
				$scope.isError = true;
				$scope.errorResponse = res;
				$scope.results = [];
			};
			if ($scope.ui.mock.active) {
				success({
					data: queryObj
				})
			} else {
				var endPoint = ($scope.ui.grouping.type === 'default') ? '/api/raw/observations?' : '/api/observations?';
				$http.get(config.apibase + endPoint + queryString).then(success, error);
			}
		};

		$scope.nextPage = function() {
			$scope.ui.query.skip = parseInt($scope.ui.query.limit) + parseInt($scope.ui.query.skip);
			$scope.fetchResults($scope.ui.query);
		};

		// initial query from url params
		// TODO error handling / 404
		var params = $location.search();
		$scope.ui.query = paramsToQuery($scope.ui.query, params);
		if (!_.isEmpty(params)) {
			$scope.fetchResults($scope.ui.query);
		}

	});