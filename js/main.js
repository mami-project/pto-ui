var apibase = "https://160.85.2.252:6443/pto";

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
			console.log(res);
		};

		$http.get(apibase + '/api/conditions_total?name=' + encodeURIComponent($scope.condition)).then(success, error);
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

		$http.get(apibase + '/api/conditions?dip=' + encodeURIComponent($scope.dip) + '&sip=' + encodeURIComponent($scope.sip)).then(success, error);
	};
});

ptoApp.controller("AdvancedCtrl", function($scope, $http, $location) {
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

	$scope.query = {
		page: 0,
		sip: "",
		path: "",
		from: 0,
		to: 1567204529149,
		criteria: [],
		condition_criteria: "",
		
		addCriterion: function() {
			this.criteria.push({});
			this.condition_criteria = criteriaToQueryStringValue(this.criteria);
		},
		
		removeCriterion: function() {
			this.criteria.pop();
			this.condition_criteria = criteriaToQueryStringValue(this.criteria);
		}
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

	var inputToQueryString = function(args) {
		return _.map(_.omit(args, _.functions(args)), function(v, k) {
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

	$scope.fetchResults = function(queryObj) {

		console.log('query object', queryObj);

		var queryString = inputToQueryString(queryObj);

		//console.log('query string', queryString);

		$location.search(queryObj);

		var success = function(res) {
			console.log("query response", res.data);
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
		};

		var error = function(res) {
			console.log(res);
		};
		if ($scope.mockInterface) {
			success({
				data: $scope.mock.data
			})
		} else {
			$http.get(apibase + '/api/advanced?' + queryString).then(success, error);
		}
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