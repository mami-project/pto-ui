angular.module("ptoApp", [
	"ptoApp.piechart",
	"ptoApp.timeline",
	"ptoApp.mock",
	"ptoApp.userStorage",
	"ngRoute",
	'ui.bootstrap',
	'ui.bootstrap.datetimepicker',
	'angular-loading-bar'
	//'ui.boostrap.modal',
])
	.constant('config', {
		apibase: "https://observatory.mami-project.eu/pto",
	})

	.config([
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
					//reloadOnSearch: false
				}).
				when("/observatory-test", {
					templateUrl: "html/observatory-test.html",
					controller: "ObservatoryTestCtrl"
				}).
				otherwise({
					redirectoTo: "/"
				});
		}
	]);