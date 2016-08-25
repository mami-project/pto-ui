var ptoApp = angular.module("ptoApp", [
	"ngRoute",
	'ui.bootstrap',
]);

ptoApp.config([
	"$routeProvider", function($routeProvider) {
		$routeProvider.
			when("/", {
				templateUrl: "html/home.html",
				controller: "HomeCtrl"
			}).
			when("/uploadstats", {
				templateUrl: "html/uploadstats.html",
				controller: "UploadStatsCtrl"
			}).
			when("/observatory", {
				templateUrl: "html/observatory.html",
				controller: "ObservatoryCtrl"
			}).
			when("/advanced", {
				templateUrl: "html/advanced.html",
				controller: "AdvancedCtrl",
				reloadOnSearch: false
			}).
			otherwise({
				redirectoTo: "/"
			});
	}
]);

ptoApp.directive('timeline', function() {
	return {
		scope: { renderData: '=renderdata', colorMap: '=colormap' },
		link: function(scope, element, attrs) {
			//console.log('timeline directive', element, attrs);
			visualizeTimeline(scope.renderData, element[0], { colorMap: scope.colorMap });
		}
	};
});

ptoApp.directive('piechart', function() {
	return {
		scope: { renderData: '=renderdata', colorMap: '=colormap' },
		link: function(scope, element, attrs) {
			//console.log('piechart directive', element, attrs);
			var pieData = getPieData(scope.renderData.observations);
			var visualizePiechart = getPieVisualizer(element[0], { colorMap: scope.colorMap });

			scope.slices = _.map(pieData, function(obs, i) {
				var exclude = _.reduce(scope.renderData.observations, function(exclude, pgobs) {
					//console.log("test exclude", exclude, pgobs.conditions, obs.name);
					if (_.contains(pgobs.conditions, obs.name)) {
						return _.union(exclude, _.without(pgobs.conditions, obs.name));
					}
					return exclude;
				}, []);
				console.log("slice color map", scope.colorMap);
				return _.extend({
					selected: false,
					disabled: false,
					exclude: exclude,
					style: { color: _.findWhere(scope.colorMap, { name: obs.name }).color }
				}, obs);
			});

			//console.log("slices", scope.slices);

			var updateSelections = function(slices) {
				_.each(slices, function(slice) {
					slice.disabled = false;
					//slice.style.color = 'black';
				});

				_.each(slices, function(slice) {
					if (slice.selected) {
						_.each(slices, function(sl) {
							if (_.contains(slice.exclude, sl.name)) {
								sl.disabled = true;
							}
						})
					}
				});
			};

			scope.$watch('slices', function(newValue, oldValue) {
				updateSelections(newValue);
				visualizePiechart(_.filter(newValue, function(obs) {
					return obs.selected;
				}));
			}, true);
		},
		templateUrl: 'html/piechart-directive.html'
	};
});

ptoApp.controller("MainCtrl", function($scope) {
	$scope.main = {};

	$scope.main.menu = [
		{ label: "Home", href: "", active: false },
		{ label: "Upload Statistics", href: "uploadstats", active: false },
		{ label: "Observatory", href: "observatory", active: false },
		{ label: "Advanced", href: "advanced", active: false }
	];

	$scope.setActiveMenu = function(href) {
		_.each($scope.main.menu, function(item) {
			item.active = false;
			if (item.href === href) {
				item.active = true;
			}
		});
	};

	$scope.formatTime = function(unix) {
		return (new Date(unix)).toUTCString();
	}
});

ptoApp.controller("HomeCtrl", function($scope) {
	$scope.setActiveMenu("");
});

ptoApp.controller("UploadStatsCtrl", function($scope, $http) {
	$scope.setActiveMenu("uploadstats");
	$scope.loading = true;
	$scope.error = false;
	$scope.total = "";
	$scope.msmntCampaigns = [];

	var success = function(res) {
		//console.log('stats', res);
		$scope.loading = false;
		$scope.error = false;
		$scope.total = res.data.total;
		$scope.msmntCampaigns = res.data.msmntCampaigns;
	};

	var error = function(res) {
		$scope.loading = false;
		$scope.error = true;
		//console.log('error', res);
	};

	$http.get("/api/uploadstats").then(success, error);
});

ptoApp.controller("ObservatoryCtrl", function($scope, $http) {
	$scope.setActiveMenu("observatory");

	$scope.dip = "";
	$scope.sip = "";
	$scope.condition = "";
	$scope.data = [];
	$scope.dataTotal = [];

	$scope.loadDataTotal = function() {
		$scope.error_dt = false;
		$scope.loading_dt = true;

		var success = function(res) {
			$scope.loading_dt = false;
			$scope.dataTotal = res.data;
		};

		var error = function(res) {
			$scope.loading_dt = false;
			$scope.error_dt = true;
		};

		$http.get('/api/conditions_total?name=' + encodeURIComponent($scope.condition)).then(success, error);
	};

	$scope.loadData = function() {
		$scope.error_d = false;
		$scope.loading_d = true;

		var success = function(res) {
			$scope.loading_d = false;
			//console.log(res.data);
			_.each(res.data, function(item, i) {
				_.each(item.data, function(condition, c_i) {
					$scope.data.push({
						sip: item._id,
						condition: condition.condition,
						count: condition.count
					});
				})
			})
		};

		var error = function(res) {
			$scope.loading_d = false;
			$scope.error_d = true;
		};

		$http.get('/api/conditions?dip=' + encodeURIComponent($scope.dip) + '&sip=' + encodeURIComponent($scope.sip)).then(success, error);
	};
});

ptoApp.controller("AdvancedCtrl", function($scope, $http, $location) {
	$scope.setActiveMenu("advanced");
	$scope.directLink = $location.absUrl();
	$scope.page = 0;
	$scope.sip = "";
	$scope.dip = "";
	$scope.path = "";
	$scope.maxresults = 0;
	$scope.totalresults = 0;

	$scope.results = [];
	$scope.criteria = [];

	$scope.addCriterion = function() {
		$scope.criteria.push({});
	};

	$scope.removeCriterion = function() {
		$scope.criteria.pop();
	};

	var criteriaToQueryStringValue = function(criteria) {
		return _.map(criteria, function(crit) {
			return (_.isUndefined(crit.combinator) ? "" : crit.combinator) +
				":" + (_.isUndefined(crit.operator) ? "" : crit.operator) +
				":" + (_.isUndefined(crit.condition) ? "" : crit.condition)  +
				":" + (_.isUndefined(crit.value) ? "" : crit.value);
		}).join(",");
	};

	var queryStringValueToCriteria = function(string) {
		return _.map(string.split(','), function(crit) {
			var critarr = crit.split(':');
			return {
				combinator: critarr[0],
				operator: critarr[1],
				condition: critarr[2],
				value: critarr[3]
			};
		});
	};

	var inputToQueryString = function(args) {
		return _.map(args, function(v, k) {
			return k + '=' + encodeURIComponent(v)
		}).join('&');
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

	$scope.query = function() {
		var queryObj = {
			sip: $scope.sip,
			dip: $scope.dip,
			on_path: $scope.path,
			page_num: $scope.page,
			condition_criteria: criteriaToQueryStringValue($scope.criteria)
		};

		//console.log('query object', queryObj);

		var queryString = inputToQueryString(queryObj);

		//console.log('query string', queryString);

		$location.search(queryObj);

		var success = function(res) {
			$scope.results = res.data.results;
			$scope.maxresults = res.data.max;
			$scope.totalresults = res.data.count;
			$scope.directLink = $location.absUrl();
			$scope.colorMap = getColorMap($scope.results);
			//console.log('color map complete', $scope.colorMap);
			//console.log("query response", res.data);
		};

		var error = function(res) {
			//console.log(res);
		};

		$http.get('/api/advanced?' + queryString).then(success, error);
	};

	$scope.nextPage = function() {
		$scope.page += 1;
		$scope.query();
	};

	// initial query from url params
	var params = $location.search();
	if (!_.isUndefined(params.sip) && !_.isUndefined(params.dip)) {
		$scope.sip = params.sip;
		$scope.dip = params.dip;
		$scope.path = params.on_path;
		$scope.page = params.page_num;
		$scope.criteria = queryStringValueToCriteria(params.condition_criteria);
		$scope.query();
	}

});