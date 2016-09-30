// TODO these 3 functions

var getTimeWindow = function(observations) {
	var timeWindow = _.reduce(observations, function(tl, obs) {
		tl.start = (tl.start > obs.time.from.$date) ? obs.time.from.$date : tl.start;
		tl.end = (tl.end < obs.time.to.$date) ? obs.time.to.$date : tl.end;
		return tl;
	}, { start: Number.MAX_VALUE, end: 0 });
	timeWindow.diff = timeWindow.end - timeWindow.start;
	return timeWindow;
};

var colors = function(i) {
	var c = d3.schemeCategory10;
	return c[i % (c.length)];
};

var getUniqueConditions = function(pathGroup) {
	return _.reduce(pathGroup.observations, function(conds, obs) {
		return _.union(conds, obs.conditions);
	}, []);
};

angular.module("ptoApp.timeline", [])

	.directive('timeline', function() {
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

				var getTimelineData = function(observations, timeWindow, tlwidth) {
					return _.map(observations, function(obs) {
						//console.log("obs time", obs.time);
						return _.extend({
							x: (tlwidth * ((obs.time.from.$date - timeWindow.start) / timeWindow.diff)),
							width: (tlwidth * ((obs.time.to.$date - obs.time.from.$date) / timeWindow.diff))
						}, obs);
					});
				};

				var getCondObs = function(pathGroup, cond) {
					return _.filter(pathGroup.observations, function(obs, k) {
						return _.contains(obs.conditions, cond);
					});
				};

				var visualizeTimeline = function(pathGroup, selector, options) {
					//console.log("pg", pathGroup);
					var defaults = {
						width: 800,
						rowHeight: 20,
						padding: 100,
						mousein: function() {},
						mouseout: function() {},
						click: function() {},
					};

					var settings = _.extend(defaults, options || {});

					var conditions = getUniqueConditions(pathGroup);
					//console.log("arguments", arguments);
					//console.log("conditions", conditions);

					var $svg = d3.select(selector).append('svg')
						.attr('width', settings.width)
						.attr('height', settings.rowHeight * conditions.length);

					// $svg.append('text')
					// 	.attr("x", 0)
					// 	.attr("y", 12)
					// 	.text("lorem ipsum");
					// $svg.append('text')
					// 	.attr("x", settings.width - settings.padding + 5)
					// 	.attr("y", 12)
					// 	.text("lorem ipsum");

					// prepare popover per timeline data point
					// var tip = d3.tip()
					// 	.attr('class', 'd3-tip')
					// 	.html(function(d) {
					// 		//console.log("tip d", d);
					// 		return "" +
					// 			(new Date(d.time.from.$date)).toUTCString() +
					// 			" - " +
					// 			(new Date(d.time.to.$date)).toUTCString();
					// 	});
					// $svg.call(tip);

					console.log("tl pg", pathGroup);

					var timeWindow = getTimeWindow(pathGroup.observations);

					// create a timeline for each condition
					_.each(conditions, function(cond, cond_i) {
						var $cond = $svg.append('g')
							.attr('class', 'condition-group')
							.attr('id', 'condition-group-' + cond);
						$cond.append("line")
							.attr("x1", 0)
							.attr("y1", settings.rowHeight * cond_i + settings.rowHeight / 2)
							.attr("x2", settings.width)
							.attr("y2", settings.rowHeight * cond_i + settings.rowHeight / 2)
							.attr("stroke", "black")
							.attr("stroke-width", 1);
						$cond.append('line')
							.attr("x1", settings.padding)
							.attr("y1", settings.rowHeight * cond_i)
							.attr("x2", settings.padding)
							.attr("y2", settings.rowHeight * cond_i + settings.rowHeight)
							.attr("stroke", "black")
							.attr("stroke-width", 1);
						$cond.append('line')
							.attr("x1", settings.width - settings.padding)
							.attr("y1", settings.rowHeight * cond_i)
							.attr("x2", settings.width - settings.padding)
							.attr("y2", settings.rowHeight * cond_i + settings.rowHeight)
							.attr("stroke", "black")
							.attr("stroke-width", 1);

						var obs = getTimelineData(getCondObs(pathGroup, cond), timeWindow, settings.width - settings.padding * 2);
						//console.log("timeline data", obs);
						var dataPoints = $cond.selectAll("rect.datarect-" + cond).data(obs, function(d) {return d;});
						dataPoints.enter()
							.append("svg:rect")
							.attr("class", "datarect-" + cond)
							.attr("x", function(d) { return d.x + settings.padding; })
							.attr("y", settings.rowHeight * cond_i)
							.attr("height", settings.rowHeight)
							.attr("width", function(d) { return d.width; })
							.style("fill", function(d, i) {
								var color;
								if (!_.isUndefined(settings.colorMap)) {
									//console.log(settings.colorMap);
									color = _.findWhere(settings.colorMap, { name: cond }).color;
								} else {
									color = colors(i);
								}
								return color;
							})
							.style("stroke-width", 3)
							.style("stroke", function(d, i) {
								var color;
								if (!_.isUndefined(settings.colorMap)) {
									//console.log(settings.colorMap);
									color = _.findWhere(settings.colorMap, { name: cond }).color;
								} else {
									color = colors(i);
								}
								return color;
							})
							// .on('mouseover', tip.show)
							// .on('mouseout', tip.hide);
							.on('mouseover', function(d) { settings.mousein({group: d.grandParentIndex, obs: d.parentIndex}); })
							.on('mouseout', function(d) { settings.mouseout({group: d.grandParentIndex, obs: d.parentIndex}); })
							.on('click', function(d) { settings.click({group: d.grandParentIndex, obs: d.parentIndex}); });
						// remove old elements if this is a recurring call on these elements
						// probably not needed...
						// dataPoints.exit().remove();


					});
				};

				visualizeTimeline(scope.renderData, element[0],
					{
						colorMap: scope.colorMap,
						mousein: scope.mousein,
						mouseout: scope.mouseout,
						click: scope.click
					});
			}
		};
	})