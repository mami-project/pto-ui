angular.module("ptoApp.piechart", [])

	.directive('piechart', function($timeout) {
		return {
			scope: { renderData: '=renderdata', colorMap: '=colormap' },
			link: function(scope, element, attrs) {

				var conditionsDecorations = {
					"ecn.negotiated": "ecn.negotiation_attempt.succeeded",
					"ecn.not_negotiated": "ecn.negotiation_attempt.failed",
				};

				scope.displayCondition = function(cond) {
					if (_.has(conditionsDecorations, cond)) {
						return conditionsDecorations[cond];
					}
					return cond;
				};

				var getPieData = function(observations) {
					var conds = _.flatten(_.pluck(observations, "conditions"));
					var initial = _.map(_.uniq(conds), function(cond) {
						return { name: cond, count: 0 };
					});
					return _.reduce(conds, function(pieData, cond) {
						_.each(pieData, function(pd) {
							if (pd.name === cond) {
								pd.count++;
							}
						});
						return pieData;
					}, initial);
				};

				var getPieVisualizer = function(selector, options) {
					var defaults = { width: 140, height: 140, radius: 70 };
					var settings = _.extend(defaults, options || {});

					var svgContainer = selector[0].querySelector('.svg-container');
					// console.log("pie selector", selector);
					// console.log("pie selected", svgContainer);

					var $svg = d3.select(svgContainer).append('svg')
						.attr('width', settings.width)
						.attr('height', settings.height)
						.append('g')
						.attr('transform', 'translate(' + (settings.width / 2) +  ',' + (settings.height / 2) + ')');

					var arc = d3.arc()
						.innerRadius(0)
						.outerRadius(settings.radius);

					var pie = d3.pie()
						.value(function(d) { return d.count; })
						.sort(null);

					// filtered pieData
					return function(pieData) {
						//console.log("visualize pie", pieData);
						$svg.selectAll('*').remove();
						$svg.append('circle')
							.attr('cx', function(d) { return 0; })
							.attr('cy', function(d) { return 0; })
							.attr('r', function(d) { return settings.radius; })
							.attr('fill', function(d) { return 'grey'; });
						var path = $svg.selectAll('path').data(pie(pieData), function(d) {return d;});
						var slice = path.enter()
							.append('svg:g')
								.attr('class', "slice");
							slice.append('svg:path')
								.attr('d', arc)
								.attr('fill', function(d, i) {
									var color;
									if (!_.isUndefined(settings.colorMap)) {
										//console.log(settings.colorMap);
										color = _.findWhere(settings.colorMap, { name: d.data.name }).color;
									} else {
										color = colors(i);
									}
									d.data.style = { color: color };
									return color;
								});
							// slice.append('svg:text')
							// 	.attr('color', 'black')
							// 	.text('asdf');
					};
				};

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