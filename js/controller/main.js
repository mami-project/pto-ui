angular.module("ptoApp")

	.controller("MainCtrl", function($scope) {
		$scope.main = {};

		$scope.main.menu = [
			{ label: "Home", href: "", active: false },
			{ label: "Upload Statistics", href: "uploadstats", active: false },
			{ label: "Observatory", href: "observatory", active: false }
		];

		$scope.main.setActiveMenu = function(href) {
			_.each($scope.main.menu, function(item) {
				item.active = false;
				if (item.href === href) {
					item.active = true;
				}
			});
		};

		$scope.main.formatTime = function(unix) {
			return (new Date(unix)).toUTCString();
		}
	});