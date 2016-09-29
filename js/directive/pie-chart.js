angular.module("ptoApp.piechart", [])

	.directive('piechart', function($timeout) {
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