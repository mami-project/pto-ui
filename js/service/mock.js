angular.module("ptoApp.mock", [])

	.service("mock", function() {
		var mock_template = {
			"results":
				[
				'{{ repeat(2, 3) }}',
					{
						"dip": '{{ integer(0,255) }}.{{ integer(0,255) }}.{{ integer(0,255) }}.{{ integer(0,255) }}',
						"sip": '{{ integer(0,255) }}.{{ integer(0,255) }}.{{ integer(0,255) }}.{{ integer(0,255) }}',
						"path": function(tags, idx) {
							return [ this.dip, "*", this.sip ];
						},
						"observations": [
						'{{ repeat(50, 100) }}',
							{
								//"path": ["188.166.146.182", "*", "1.1.126.17"],
								"value": {},
								"conditions": [
									'{{ random("ecn.connectivity.works","ecn.connectivity.broken") }}',
									'ecn.negotiated'
									],
								"analyzer": "analyzer-ecnspider1",
								"time": function(tags, idx) {
									var dateFrom = tags.integer(145160640000, 148322880000);
									var dateDelta = tags.integer(1000, 60000);
									return {
										"from": {"$date": dateFrom },
										"to": {"$date": dateFrom + dateDelta}
									};
								}
							}
						]
					}
				],
			"count": "over 9000"
		};

		var genN = function(n, obj) {
			return Array(n).fill(obj);
		};

		var rndInt = function(min, max) {
			return function() {
			return min + Math.floor((max - min) * Math.random());
			}
		};

		var rndVal = function(values) {
			return function() {
			return values[Math.round( (values.length - 1) * Math.random() )];
			}
		};

		var rndIP = function() {
			return function() {
			return rndInt(0, 255)() + "." + rndInt(0, 255)() + "." + rndInt(0, 255)() + "." + rndInt(0, 255)();
			}
		};

		var rndConditions = function() {
			return function() {
				switch(Math.round(Math.random() * 5)) {
					case 0:
					return ['ecn.connectivity.works', 'ecn.negotiated'];
					case 1:
					return ['ecn.connectivity.works', 'ecn.not_negotiated'];
					case 2:
					return ['ecn.connectivity.transient', 'ecn.negotiated'];
					case 3:
					return ['ecn.connectivity.transient', 'ecn.not_negotiated'];
					case 4:
					return ['ecn.connectivity.broken'];
					case 5:
					return ['ecn.connectivity.offline'];
				}
			}
		};

		var mock_template_gen = function(nPath, nObs) {
			return {
			"results": genN(nPath,
				{
					"dip": rndIP(),
					"sip": rndIP(),
					"path": function() {
					return [ this.dip, "*", this.sip ];
					},
					"observations": genN(nObs,
					{
						"value": {},
						"conditions": rndConditions(),
						"analyzer": "MOCK",
						"time": function() {
						var dateFrom = rndInt(145160640000, 148322880000)();
						var dateDelta = rndInt(1000, 60000)();
						return {
							"from": {"$date": dateFrom },
							"to": {"$date": dateFrom + dateDelta}
						};
						}
					}
					)
				}
				),
			"count": "over 9000"
			};
		};

		var mockFromTemplate = function(tpl) {
			if (_.isFunction(tpl)) {
			return tpl();
			}

			if (_.isArray(tpl)) {
			return _.map(tpl, mockFromTemplate);
			}

			if (_.isObject(tpl)) {
			return _.mapObject(tpl, mockFromTemplate);
			}

			return tpl;
		};

		var extendObservations = function(data) {
			return _.map(data.results, function(result) {
			result.path = [result.sip, "*", result.dip];
			result.observations = _.map(result.observations, function(obs) {
				obs.path = result.path;
				return obs;
			});
			return result;
			});
		};

		return function(nPathGroups, nObservations) {
			var tpl = mock_template_gen(nPathGroups, nObservations);
			var data = mockFromTemplate(tpl);
			data.results = extendObservations(data);
			return data;
		};
	});