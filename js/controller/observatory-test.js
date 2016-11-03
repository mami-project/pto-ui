angular.module("ptoApp")

	.controller("ObservatoryTestCtrl", function($scope) {
		$scope.isSelected = function(v, i, arr) {
			return v.selected;
		};

		$scope.sortBy = { type: ""};
		$scope.sortDesc = true;

		$scope.mocks = [
			{
				name: "ecn example",
				overviews: [
					{
						type: "condition",
						groups: [
							{
								value: "ecn.connectivity.works",
								count: 950,
								pct: 95
							},
							{
								value: "ecn.connectivity.broken",
								count: 50,
								pct: 5
							}
						]
					},
					{
						type: "IP dst",
						groups: [
							{
								value: "42.42.42.42",
								count: 10,
								pct: 1
							},
							{
								value: "23.23.23.23",
								count: 230,
								pct: 23
							},
							{
								value: "13.13.13.13",
								count: 760,
								pct: 76
							}
						]
					},
					{
						type: "campaign",
						groups: [
							{
								value: "ecn-foo",
								count: 334,
								pct: 33.4
							},
							{
								value: "ecn-bar",
								count: 666,
								pct: 66.6
							}
						]
					}
				]
			}
		];
		$scope.mockIndex = 0;

		var identity = function(x) {
			return x;
		};
		
		var formatTime = $scope.main.formatTime;

		$scope.columns = [
			{
				type: "sip",
				label: "IP src",
				selected: false,
				sort: false,
				format: identity
			},
			{
				type: "dip",
				label: "IP dst",
				selected: false,
				sort: false,
				format: identity
			},
			{
				type: "path",
				label: "Path",
				selected: false,
				sort: false,
				format: identity
			},
			{
				type: "from",
				label: "From",
				selected: false,
				sort: false,
				format: formatTime
			},
			{
				type: "to",
				label: "To",
				selected: false,
				sort: false,
				format: formatTime
			},
			{
				type: "ecn.connectivity",
				label: "ecn.connectivity",
				selected: false,
				sort: false,
				format: identity
			},
			{
				type: "ecn.negotiation_attempt",
				label: "ecn.negotiation_attempt",
				selected: false,
				sort: false,
				format: identity
			},
			{
				type: "campaign",
				label: "Campaign",
				selected: false,
				sort: false,
				format: identity
			},
			{
				type: "analyzer",
				label: "Analyzer",
				selected: false,
				sort: false,
				format: identity
			},
		];

		$scope.wurstsalat = function() {
			console.log("wurstsalat");
		};

		$scope.setSortBy = function(type) {
			$scope.sortBy = type;
		};

		$scope.$watch('sortBy', function(newValue, oldValue) {
			console.log("sortBy", oldValue, newValue);
		}, true);

		var rndInt = function(min, max) {
			return min + Math.floor((max - min) * Math.random());
		};

		var rndBool = function() {
			return Math.random() > 0.5;
		};

		var rndIP = function() {
			return rndInt(0, 255) + "." + rndInt(0, 255) + "." + rndInt(0, 255) + "." + rndInt(0, 255);
		};

		var getSrcIP = function(ctx) {
			return ctx.path[0];
		};

		var getDstIP = function(ctx) {
			return ctx.path[ctx.path.length - 1];
		};

		var addTo = function(ctx, field, n) {
			return ctx[field] + n;
		};

		var rndVal = function(values) {
			return values[Math.round( (values.length - 1) * Math.random() )];
		};

		var mockPaths = _.map(Array(3), function() {
			return [rndIP(), "*", rndIP()];
		});

		var RandomObservation = function() {
			this.path = rndVal(mockPaths);
			this.sip = getSrcIP(this)
			this.dip = getDstIP(this)
			this.from = rndInt(0, 145160640000)
			this.to = addTo(this, "from", 60000)
			this["ecn.connectivity"] = rndVal(["transient", "offline", "broken", "works"]);
			this["ecn.negotiation_attempt"] = rndVal(["succeeded", "failed"]);
			this.campaign = rndVal(["camp-foo", "camp-bar"]);
			this.analyzer = rndVal(["analyzer-foo", "analyzer-bar"]);
		};

		var groupObservations = function(observations, type) {
			var groups = _.groupBy(observations, function(obs) {
				return obs[type];
			});
			var total = _.reduce(groups, function(total, group) {
				return total + group.length;
			}, 0);
			return _.map(groups, function(group, k) {
				return { value: k, count: group.length, pct: Math.round(100 * group.length / total) };
			});
		};

		$scope.observations = _.map(Array(10), function() {
			return new RandomObservation();
		});

		$scope.groupedObservations = _.reduce($scope.columns, function(grouped, col) {
			grouped[col.type] = groupObservations($scope.observations, col.type);
			return grouped;
		}, {});

		console.log("grouped", $scope.groupedObservations);
	});