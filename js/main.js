var apibase = "https://observatory.mami-project.eu/pto";

// mock from https://160.85.2.252:6443/pto/api/advanced?sip=&dip=&from=0&to=1567204529149&on_path=&page_num=0&condition_criteria=must:%3F:ecn.negotiated:
//var mock = {"results": [{"dip": "1.1.126.17", "sip": "188.166.146.182", "path": ["188.166.146.182", "*", "1.1.126.17"], "observations": [{"path": ["188.166.146.182", "*", "1.1.126.17"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467192589980}, "to": {"$date": 1467192596588}}}, {"path": ["188.166.146.182", "*", "1.1.126.17"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467104789677}, "to": {"$date": 1467104795691}}}]}, {"dip": "1.1.127.50", "sip": "188.166.146.182", "path": ["188.166.146.182", "*", "1.1.127.50"], "observations": [{"path": ["188.166.146.182", "*", "1.1.127.50"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467206251617}, "to": {"$date": 1467206256900}}}, {"path": ["188.166.146.182", "*", "1.1.127.50"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467118490886}, "to": {"$date": 1467118496911}}}]}, {"dip": "1.1.127.52", "sip": "188.166.146.182", "path": ["188.166.146.182", "*", "1.1.127.52"], "observations": [{"path": ["188.166.146.182", "*", "1.1.127.52"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467191984259}, "to": {"$date": 1467191989344}}}, {"path": ["188.166.146.182", "*", "1.1.127.52"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467104199086}, "to": {"$date": 1467104204154}}}]}, {"dip": "1.1.127.56", "sip": "188.166.146.182", "path": ["188.166.146.182", "*", "1.1.127.56"], "observations": [{"path": ["188.166.146.182", "*", "1.1.127.56"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467192300132}, "to": {"$date": 1467192305442}}}, {"path": ["188.166.146.182", "*", "1.1.127.56"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467104492200}, "to": {"$date": 1467104497637}}}]}, {"dip": "1.1.127.74", "sip": "188.166.146.182", "path": ["188.166.146.182", "*", "1.1.127.74"], "observations": [{"path": ["188.166.146.182", "*", "1.1.127.74"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467195319655}, "to": {"$date": 1467195325028}}}, {"path": ["188.166.146.182", "*", "1.1.127.74"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467107532774}, "to": {"$date": 1467107539566}}}]}, {"dip": "1.1.127.77", "sip": "188.166.146.182", "path": ["188.166.146.182", "*", "1.1.127.77"], "observations": [{"path": ["188.166.146.182", "*", "1.1.127.77"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467196608970}, "to": {"$date": 1467196614134}}}, {"path": ["188.166.146.182", "*", "1.1.127.77"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467108801244}, "to": {"$date": 1467108806390}}}]}, {"dip": "1.1.127.81", "sip": "188.166.146.182", "path": ["188.166.146.182", "*", "1.1.127.81"], "observations": [{"path": ["188.166.146.182", "*", "1.1.127.81"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467191494382}, "to": {"$date": 1467191499817}}}, {"path": ["188.166.146.182", "*", "1.1.127.81"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467103702979}, "to": {"$date": 1467103708744}}}]}, {"dip": "1.1.64.247", "sip": "188.166.146.182", "path": ["188.166.146.182", "*", "1.1.64.247"], "observations": [{"path": ["188.166.146.182", "*", "1.1.64.247"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467200857338}, "to": {"$date": 1467200862862}}}, {"path": ["188.166.146.182", "*", "1.1.64.247"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467113070227}, "to": {"$date": 1467113075171}}}]}, {"dip": "1.1.65.161", "sip": "188.166.146.182", "path": ["188.166.146.182", "*", "1.1.65.161"], "observations": [{"path": ["188.166.146.182", "*", "1.1.65.161"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467197318244}, "to": {"$date": 1467197324319}}}, {"path": ["188.166.146.182", "*", "1.1.65.161"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467109504053}, "to": {"$date": 1467109510289}}}]}, {"dip": "1.1.66.87", "sip": "188.166.146.182", "path": ["188.166.146.182", "*", "1.1.66.87"], "observations": [{"path": ["188.166.146.182", "*", "1.1.66.87"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467206017042}, "to": {"$date": 1467206023513}}}, {"path": ["188.166.146.182", "*", "1.1.66.87"], "value": {}, "conditions": ["ecn.connectivity.works", "ecn.negotiated"], "analyzer": "analyzer-ecnspider1", "time": {"from": {"$date": 1467118248278}, "to": {"$date": 1467118254986}}}]}], "count": 909413};


var access = function(obj, accessors) {
	if (accessors.length === 0) {
		return obj;
	}

	var key = accessors.shift();

	if (_.isUndefined(obj[key])) {
		console.error("accessor not machting", obj, key, accessors);
	}

	return access(obj[key], accessors);
}


var ptoApp = angular.module("ptoApp", [
	"ngRoute",
	'ui.bootstrap',
	'ui.bootstrap.datetimepicker'
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
		scope: {
			renderData: '=renderdata',
			colorMap: '=colormap',
			mousein: '&mousein',
			mouseout: '&mouseout',
			click: '&click'
		},
		link: function(scope, element, attrs) {
			//console.log('timeline directive', element, attrs);
			visualizeTimeline(scope.renderData, element[0],
				{
					colorMap: scope.colorMap,
					mousein: scope.mousein,
					mouseout: scope.mouseout,
					click: scope.click
				});
		}
	};
});

ptoApp.directive('piechart', function($timeout) {
	return {
		scope: { renderData: '=renderdata', colorMap: '=colormap' },
		link: function(scope, element, attrs) {
			$timeout(function() {
					//console.log('piechart directive', element, attrs);
				var pieData = getPieData(scope.renderData.observations);
				var visualizePiechart = getPieVisualizer(element, { colorMap: scope.colorMap });

				scope.slices = _.map(pieData, function(obs, i) {
					var exclude = _.reduce(scope.renderData.observations, function(exclude, pgobs) {
						//console.log("test exclude", exclude, pgobs.conditions, obs.name);
						if (_.contains(pgobs.conditions, obs.name)) {
							return _.union(exclude, _.without(pgobs.conditions, obs.name));
						}
						return exclude;
					}, []);
					//console.log("slice color map", scope.colorMap);
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
			}, 0);
		},
		templateUrl: 'html/piechart-directive.html'
	};
});

ptoApp.controller("MainCtrl", function($scope) {
	$scope.main = {};

	$scope.main.menu = [
		{ label: "Home", href: "", active: false },
		{ label: "Upload Statistics", href: "uploadstats", active: false },
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
		console.log('stats', res);
		$scope.loading = false;
		$scope.error = false;
		$scope.total = res.data.total;
		$scope.msmntCampaigns = res.data.msmntCampaigns;
	};

	var error = function(res) {
		$scope.loading = false;
		$scope.error = true;
		console.log('error', res);
	};

	$http.get(apibase + "/api/uploadstats").then(success, error);
});

ptoApp.controller("AdvancedCtrl", function($scope, $http, $location) {
	$scope.showCriteria = true;
	$scope.showConditions = true;
	$scope.showQuery = true;
	$scope.mockInterface = false;
	$scope.mocking = false;
	$scope.mock = {
		data: {},
		numberPathGroups: 0,
		numberObservations: 0,
		template: mock_template_gen,
		generate: function() {
			this.data = generateMock(this.template(this.numberPathGroups, this.numberObservations));
			addPaths(this.data);
		}
	};

	$scope.setActiveMenu("advanced");
	$scope.directLink = $location.absUrl();

	$scope.getTimeWindow = getTimeWindow;
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

	$scope.queryType = "default";

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

	var getQueryString = function(object) {
		return _.map(object, function(v, k) {
			if (k === "conditions") {
				return k + '=' + encodeURIComponent(_.reduce(v, function(str, condition) {
					return str + ((condition.op) ? condition.op : "") + condition.name;
				}, ""));
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
		$http.get(apibase + '/api/all_conditions').then(success, error);
	};
	fetchAllConditions();

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
			if ($scope.queryType === 'default') {
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
			console.log("pi added", $scope.results);
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
		if ($scope.mockInterface) {
			success({
				data: $scope.mock.data
			})
		} else {
			var endPoint = ($scope.queryType === 'default') ? '/api/raw/observations?' : '/api/observations?';
			$http.get(apibase + endPoint + queryString).then(success, error);
		}
	};

	$scope.nextPage = function() {
		$scope.query.skip = parseInt($scope.query.limit) + parseInt($scope.query.skip);
		$scope.fetchResults($scope.query);
	};

	// initial query from url params
	// TODO error handling / 404
	var params = $location.search();
	$scope.query = paramsToQuery(params);
	if (!_.isEmpty(params)) {
		$scope.showCriteria = false;
		$scope.showConditions = false;
		$scope.showQuery = false;
		$scope.fetchResults($scope.query);
	}

});