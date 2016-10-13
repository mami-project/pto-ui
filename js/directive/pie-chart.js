angular.module("ptoApp.piechart", [])

	.directive('piechart', function($timeout) {
		return {
			scope: { renderData: '=renderdata', colorMap: '=colormap' },
			link: function(scope, element, attrs) {

				// copy pasted from observatory.js
				var conditionsDecorations = {
					"ecn.negotiated": "ecn.negotiation_attempt.succeeded",
					"ecn.not_negotiated": "ecn.negotiation_attempt.failed",
				};
				var displayCondition = function(cond) {
					if (_.has(conditionsDecorations, cond)) {
						return conditionsDecorations[cond];
					}
					return cond;
				};
				var invertDisplayCondition = function(cond) {
					var invMap = _.invert(conditionsDecorations);
					if (_.has(invMap, cond)) {
						return invMap[cond];
					}
					return cond;
				};

				var pointIsInArc = function(pt, ptData, d3Arc) {
					var r1 = d3Arc.innerRadius()(ptData),
					r2 = d3Arc.outerRadius()(ptData),
					theta1 = d3Arc.startAngle()(ptData),
					theta2 = d3Arc.endAngle()(ptData);
					var dist = pt.x * pt.x + pt.y * pt.y,
					angle = Math.atan2(pt.x, -pt.y);
					angle = (angle < 0) ? (angle + Math.PI * 2) : angle;
					return (r1 * r1 <= dist) && (dist <= r2 * r2) && 
						(theta1 <= angle) && (angle <= theta2);
				};

				var getAngle = function (d) {
					return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
				};

				var getPieData = function(observations) {
					var conds = _.flatten(_.pluck(observations, "conditions"));
					var counted = _.countBy(conds, function(cond) {
						return cond;
					})
					var coll = _.map(counted, function(count, name) {
						return {count: count, name: displayCondition(name)};
					});
					var grouped = _.groupBy(coll, function(cond) {
						return cond.name.split(".").slice(0, 2).join(".");
					});
					return _.mapObject(grouped, function(coll, k) {
						var total = _.reduce(coll, function(total, cond) {
							return total + cond.count;
						}, 0);
						console.log("total "+k, total);
						return _.map(coll, function(cond) {
							return _.extend(cond, {percentage: Math.round((cond.count / total) * 100) })
						});;
					})
				};

				var getPieVisualizer = function(selector, options) {
					var defaults = { width: 200, height: 200, radius: 70 };
					var settings = _.extend(defaults, options || {});

					var svgContainer = selector.querySelector('.svg-container');

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
						console.log("visualize pie", pieData);
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
										color = _.findWhere(settings.colorMap, { name: invertDisplayCondition(d.data.name) }).color;
									} else {
										color = colors(i);
									}
									d.data.style = { color: color };
									return color;
								});
							slice.append('svg:text')
								.attr('transform', function(d) {
									d.innerRadius = 0;
									d.outerRadius = settings.radius;
									if (pieData.length > 1) {
										return "translate(" + arc.centroid(d) + ")";
									}
									return "";
								})
								.attr('color', 'black')
								.attr("text-anchor", "middle")
								.text(function(d) {
									return d.data.percentage + "%";
								})
								.each(function (d) {
									var bb = this.getBBox(),
									center = arc.centroid(d);
									console.log("width", bb.width);
									var topLeft = {
										x: center[0] + bb.x,
										y: center[1] + bb.y
									};
									var topRight = {
										x: topLeft.x + bb.width - 20,
										y: topLeft.y
									};
									var bottomLeft = {
										x: topLeft.x,
										y: topLeft.y + bb.height
									};
									var bottomRight = {
										x: topLeft.x + bb.width  - 20,
										y: topLeft.y + bb.height
									};

									d.inside = pointIsInArc(topLeft, d, arc) &&
										pointIsInArc(topRight, d, arc) &&
										pointIsInArc(bottomLeft, d, arc) &&
										pointIsInArc(bottomRight, d, arc);

								})
								.attr("transform", function(d) {
									if (pieData.length <= 1) {
										return ""
									}
									if (d.inside) {
										return "translate(" + arc.centroid(d) + ")";;
									}
									return "translate(" + arc.centroid(d) + ") rotate(" + getAngle(d) + ")";
								})
								.attr("dx", function(d) {
									if (!d.inside) {
										return 50;
									}
									return 0;
								})
								// .attr("transform", function(d) {
								// 	if (!d.inside) {
								// 		return "translate(" + arc.centroid(d) + ") " +
								// 		"rotate(" + getAngle(d) + ")";
								// 	}
								// 	return "translate(" + arc.centroid(d) + ")";
								// })
								// .attr("dx", function(d) {
								// 	if (!d.inside) {
								// 		return 20;
								// 	}
								// })

					};
				};

				scope.piecharts = [];
					//console.log('piechart directive', element, attrs);
				var pieData = getPieData(scope.renderData.observations);

				console.log("piedata", pieData);

				_.each(pieData, function(pie, idx) {
					var piechart = {};
					scope.piecharts.push(piechart);
					
					piechart.slices = _.map(pie, function(obs, i) {
						console.log("slice color map", scope.colorMap);
						console.log("obs", obs);
						return _.extend({
							style: { color: _.findWhere(scope.colorMap, { name: invertDisplayCondition(obs.name) }).color }
						}, obs);
					});
					//console.log("slices", scope.slices);
					
				});

				var rendered = [];
				scope.renderOnce = function(piechart, idx) {
					if (_.contains(rendered, idx)) {
						return;
					}
					rendered.push(idx);
					var visualizePiechart = getPieVisualizer(element[0].querySelector('#piechart-'+idx), { colorMap: scope.colorMap });
					visualizePiechart(piechart.slices);
				};
			},
			templateUrl: 'html/piechart-directive.html'
		};
	});