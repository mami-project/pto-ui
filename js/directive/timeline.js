var timeScope = 31622400000, timeStart = 1451606400000;

var timelineConf = {
	width: 1000, height: 100
};

var renderTimeline = function(data) {
	return _.reduce(data, function(res, d) {
		var pos = (d.time - timeStart) * timelineConf.width / timeScope;
		_.extend(d, {
			x: pos, y: 45,
			height: 10,
			width: 10,
			color: (d.condBool) ? "green" : "red"
		});
		res.result.push(d);
		return res;
	}, { result: [], memo: 0 });
};

var renderChart = function(data) {
	return _.reduce(data, function(res, d) {
		if (d.condBool) {
			res.result[0].count++;
		} else {
			res.result[1].count++;
		}
		return res;
	}, { result: [ { count: 0, condBool: true }, { count: 0, condBool: false } ]});
};

var $timeline = d3.select("#timeline").append("svg")
	.attr("width", timelineConf.width)
	.attr("height", timelineConf.height);

//$timeline.call(tip);

var $line = $timeline.append("line")
	.attr("x1", 0)
	.attr("y1", timelineConf.height/2)
	.attr("x2", timelineConf.width)
	.attr("y2", timelineConf.height/2)
	.attr("stroke", "black")
	.attr("stroke-width", 2);

var chartConf = {
	width: 360,
	height: 360,
	radius: 180
};

var $chart = d3.select('#chart')
	.append('svg')
	.attr('width', chartConf.width)
	.attr('height', chartConf.height)
	.append('g')
	.attr('transform', 'translate(' + (chartConf.width / 2) +  ',' + (chartConf.height / 2) + ')');

var visualize = function(queryData) {

	var timelineData = renderTimeline(queryData).result;
	var rects = $timeline.selectAll("rect.datarect").data(timelineData, function(d) {return d;});
	rects.enter()
		.append("svg:rect")
		.attr("class", "datarect")
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; })
		.attr("height", function(d) { return d.height; })
		.attr("width", function(d) { return d.width; })
		.style("fill", function(d) { return d.color; })
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);
	rects.exit().remove();

	var arc = d3.arc()
		.innerRadius(0)
		.outerRadius(chartConf.radius);

	var pie = d3.pie()
		.value(function(d) { return d.count; })
		.sort(null);

	var chartData = renderChart(queryData).result;
	$chart.selectAll('path').remove();
	var path = $chart.selectAll('path').data(pie(chartData), function(d) {return d;});
	var slice = path.enter()
		.append('svg:g')
			.attr('class', "slice");
		slice.append('svg:path')
			.attr('d', arc)
			.attr('fill', function(d, i) {
				return (d.data.condBool) ? "green" : "red";
			});
		slice.append('svg:text')
			.attr('color', 'black')
			.text('asdf');
};

var getUniqueConditions = function(pathGroup) {
	return _.reduce(pathGroup.observations, function(conds, obs) {
		return _.union(conds, obs.conditions);
	}, []);
};

var getCondObs = function(pathGroup, cond) {
	return _.filter(pathGroup.observations, function(obs, k) {
		return _.contains(obs.conditions, cond);
	});
};

var getTimeWindow = function(observations) {
	var timeWindow = _.reduce(observations, function(tl, obs) {
		tl.start = (tl.start > obs.time.from.$date) ? obs.time.from.$date : tl.start;
		tl.end = (tl.end < obs.time.to.$date) ? obs.time.to.$date : tl.end;
		return tl;
	}, { start: Number.MAX_VALUE, end: 0 });
	timeWindow.diff = timeWindow.end - timeWindow.start;
	return timeWindow;
};

var getTimelineData = function(observations, timeWindow, tlwidth) {
	return _.map(observations, function(obs) {
		//console.log("obs time", obs.time);
		return _.extend({
			x: (tlwidth * ((obs.time.from.$date - timeWindow.start) / timeWindow.diff)),
			width: (tlwidth * ((obs.time.to.$date - obs.time.from.$date) / timeWindow.diff))
		}, obs);
	});
};

var colors = function(i) {
	var c = d3.schemeCategory10;
	//console.log(c);
	return c[i % (c.length)];
};

var highlightObs = function(d) {
	console.log('highlightObs', d.parentIndex);
};

var unHighlightObs = function(d) {
	console.log('unHighlightObs', d.parentIndex);
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

var filterPieObservations = function(observations, condition) {
	return _.filter(observations, function(obs) {
		return !_.contains(obs.conditions, condition);
	});
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