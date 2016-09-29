angular.module("ptoApp")

	.controller("UploadStatsCtrl", function($scope, $http, config) {
		$scope.main.setActiveMenu("uploadstats");
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

		$http.get(config.apibase + "/api/uploadstats").then(success, error);
	});