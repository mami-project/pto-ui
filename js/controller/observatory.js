angular.module("ptoApp")

	.controller("ObservatoryCtrl", function($scope, $q, $http, $uibModal, cfpLoadingBar, $location, mock, userStorage, config) {
		$scope.main.setActiveMenu("advanced");
		$scope.directLink = $location.absUrl();
		//cfpLoadingBar.start();

		var getProperty = function(obj, arr) {
			if (arr.length === 0) {
				return obj;
			}
			return getProperty(obj[arr[0]], arr.slice(1, arr.length));
		};

		// this is copy pasted in pie-chart.js

		var conditionsDecorations = {
			"ecn.negotiated": "ecn.negotiation_attempt.succeeded",
			"ecn.not_negotiated": "ecn.negotiation_attempt.failed",
		};

		$scope.main.displayCondition = function(cond) {
			if (_.has(conditionsDecorations, cond)) {
				return conditionsDecorations[cond];
			}
			return cond;
		};

		$scope.main.displayConditions = function(conditions) {
			return _.map(conditions, function(cond) {
				return $scope.main.displayCondition(cond);
			});
		};

		$scope.main.displayConditionsCollection = function(conditions) {
			return _.map(conditions, function(cond) {
				return _.extend({}, cond, {name: $scope.main.displayCondition(cond.name)});
			});
		};

		$scope.main.displayConditionsString = function(condstring) {
			return _.reduce(conditionsDecorations, function(str, replStr, matchStr) {
				return str.replace(matchStr, replStr);
			}, condstring)
		};

		var getConditionMatch = function(cname) {
			return $scope.main.displayCondition(cname).match(/^([a-zA-Z0-9_]*\.)([a-zA-Z0-9_]*\.)[a-zA-Z0-9_]*$/);
		};

		var sortORConditions = function(condstring) {
			return condstring.split(",").sort().join(",");
		};

		var getWildCardConditions = function(conditionNames) {
			return _.reduce(conditionNames, function(wcs, cname) {
				var match = getConditionMatch(cname);
				if (match && match.length === 3) {
					var str = match[1] + match[2] + "*";
					var wc = _.find(wcs, function(wc) { return wc.display === str;})
					if (wc) {
						wc.count++;
						wc.value = sortORConditions(wc.value + "," + cname);
						return wcs;
					}
					return wcs.concat({display: str, count: 1, value: cname});
				}
				return wcs;
			}, []);
		};

		var groupCondToWildcards = function(conditions) {
			return _.reduce(conditions, function(grouped, cond) {
				var match = getConditionMatch(cond.name);
				if (match && match.length === 3) {
					var group = _.find(grouped, function(gcond) {
						return gcond.display.match(match[1] + match[2]);
					});
					if (group) {
						group.name = sortORConditions(group.name + "," + cond.name);
						return grouped;
					}
				}
				return grouped.concat(_.extend({}, cond, {display: $scope.main.displayCondition(cond.name)} ));
			}, []);
		};

		// from timeline.js TODO...
		$scope.getTimeWindow = getTimeWindow;

		var init = function() {
			console.log("init started");
			$scope.fetchAllConditions();

			// user storage init
			console.log("loading user storage");
			var userUI = userStorage.load("ui");
			console.log("applying user storage");
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
			console.log("applying query params");
			var params = $location.search();
			_.extend($scope.input.query, paramsToQuery($scope.input.query, params));
			console.log("input", $scope.input);
			//cfpLoadingBar.complete();
			if (!_.isEmpty(params)) {
				// the user comes from a direct link,
				// so we ignore storage data for mocking
				$scope.ui.mock.active = false;
				$scope.ui.queries = _.map($scope.ui.queries, function(query) {
					query.show = false;
					return query;
				});
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
					return $scope.main.displayConditionsString(getConditionsString(query.conditions))
						.replace(/:/g, " AND ")
						.replace(/,/g, " OR ") ||
						"( empty )";
				}
			},
			
			grouping: {
				show: false,
				display: function(query) {
					return query.type || "( empty )";
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

			table: {
				rev: true,
				orderBy: null,
				sort: function(orderBy) {
					if (orderBy === this.orderBy) {
						this.rev = !this.rev
					} else {
						this.rev = false;
					}
					this.orderBy = orderBy;
				}
			},

			details: {
				show: function(observation) {
					$uibModal.open({
						templateUrl: "html/observation-details.html",
						controller: "ObervationDetailsCtrl",
						resolve: {
							observation: function() {
								return observation;
							},
							main: function() {
								return $scope.main;
							},
						}
					}).result.then(function(){},function(){});
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

			queries: [],

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

		var Table = function(table) {
			this.currentPage = table.currentPage;
			this.pages = table.pages;
		};

		Table.prototype.isPage = function(idx) {
			return Math.floor(idx / 20) === this.currentPage;
		};

		Table.prototype.toPage = function(page) {
			this.currentPage = page;
		};

		Table.prototype.next = function() {
			if (!(this.currentPage < this.pages.length - 1)) {
				return;
			}
			this.currentPage += 1;
		};

		Table.prototype.previous = function() {
			if (this.currentPage === 0) {
				return;
			}
			this.currentPage -= 1;
		};

		Table.prototype.showPagination = function(page) {
			return Math.abs(page - this.currentPage) <= 10 ||
				(this.currentPage <= 10 && page <= 20) ||
				(this.currentPage >= this.pages.length - 10 && page >= this.pages.length - 20);
		};


		$scope.forgetUI = {
			pagination: {
				active: true,
			},
			tables: [],
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
				console.log("paramsToQuery conditions", query.conditions);
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

		$scope.sourceIP = function(observation) {
			return observation.path[0];
		};

		$scope.destinationIP = function(observation) {
			return observation.path[observation.path.length - 1];
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

			$scope.forgetUI.pagination.active = !rejectToggle;

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
				// extend with wildcard conditions
				var conditionNames = _.keys(res.data.conditions);
				var wildCardConditions = getWildCardConditions(conditionNames);
				console.log("wc conditions", wildCardConditions);
				var extendedConditions = _.map(conditionNames, function(cname) {
					return {display: $scope.main.displayCondition(cname), value: cname};
				}).concat(wildCardConditions);
				$scope.api.allConditions = extendedConditions;

				// $scope.input.query.conditions = _.reduce($scope.input.query.conditions, function(clean, cond) {
				// 	if (cond.name.match(",")){
				// 		var lookup = _.find(extendedConditions, function(extCond) {
				// 			return extCond.value === cond.name;
				// 		});
				// 		if (lookup) {
				// 			return clean.concat(cond);
				// 		}
				// 		var conds = _.map(cond.name.split(","), function(condname) {
				// 			return {name: condname};
				// 		});
				// 	}
				// 	return clean.concat(cond);
				// }, []);
			};

			var error = function(err) {
				console.error(err);
			};
			$http.get(config.apibase + '/api/all_conditions').then(success, error);
		};

		
		$scope.fetchResults = function(queryObj) {
			// _.each($http.pendingRequests, function(req) {
			// 	if (req.timeout && req.cancel) {
			// 		console.log("canceling request", req);
			// 		req.cancel.resolve();
			// 	}
			// });
			// var canceler = $q.defer();
			$scope.ui.loading = true;
			$scope.isError = false;
			$scope.errorResponse = {};

			if (queryObj.limit == 0 && queryObj.type == "grouped") {
				queryObj.limit = 16;
			}

			if (queryObj.limit == 0 || queryObj.type == "default") {
				delete queryObj.limit;
				delete queryObj.skip;
			}

			console.log('query object', queryObj);
			var queryString = getQueryString(queryObj);

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
				var date = new Date();
				$scope.forgetUI.tables = _.map($scope.api.results, function(res) {
					return new Table({
						currentPage: 0,
						pages: Array(Math.ceil(res.observations.length / 20)),
					});
				});
				if ($scope.ui.mock.active) {
					return;
				}
				$scope.ui.queries.unshift({
					link: "#/observatory?" + queryString,
					time: date.toLocaleString(),
					data: JSON.parse(JSON.stringify(queryObj)),
					display: $scope.ui.pathCriteria.display(queryObj) +"\n"+ $scope.ui.conditions.display(queryObj) +"\n"+ $scope.ui.grouping.display(queryObj)
				});
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
				console.log("mocking", queryObj);
				return success({ data: queryObj });
			}
			$location.search(queryString);
			console.log("starting fetch")
			var endPoint = ($scope.input.query.type === 'default') ? '/api/raw/observations?' : '/api/observations?';
			$http.get(config.apibase + endPoint + queryString).then(success, error);
			//$http.get(config.apibase + endPoint + queryString, { timeout: canceler.promise, cancel: canceler }).then(success, error);
		};

		$scope.nextPage = function() {
			$scope.input.query.skip = parseInt($scope.input.query.limit) + parseInt($scope.input.query.skip);
			$scope.fetchResults($scope.input.query);
		};

		init();
	})

	.controller("ObervationDetailsCtrl", function($scope, main, observation, $uibModalInstance, $http, config) {
		$scope.main = main;
		$scope.ui = {
			loading: true,
			error: false,
			table: {
				rev: true,
				orderBy: null,
				sort: function(orderBy) {
					if (orderBy === this.orderBy) {
						this.rev = !this.rev
					} else {
						this.rev = false;
					}
					this.orderBy = orderBy;
				},
			}
		};
		$scope.asJSON = function(data) {
			return JSON.stringify(data);
		};
		$scope.aidsToString = function(aids) {
			return _.map(aids, function(aid) {
				return aid.id + ":" + aid.valid;
			}).join(", ");
		};
		$scope.sourcesToString = function(sources) {
			return _.pluck(sources, "$oid").join(", ");
		};
		$scope.valueToString = function(value) {
			return _.isEmpty(value) ? "( empty )" : value;
		};
		$scope.data = {};
		$scope.close = function() {
			$uibModalInstance.close();
		};
		var success = function(res) {
			$scope.ui.loading = false;
			$scope.ui.error = false;
			console.log("obs details res", res);
			$scope.data = res.data.result;
		};
		var error = function(err) {
			$scope.ui.loading = false;
			$scope.ui.error = err;
			console.log("obs details err", err);
		};
		$http.get(config.apibase + "/api/raw/single?oid=" + observation.id.$oid).then(success, error);
	});