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

		$scope.ui = {
			table: {
				rev: false,
				orderBy: '_id',
				sort: function(orderBy) {
					if (orderBy === this.orderBy) {
						this.rev = !this.rev
					} else {
						this.rev = false;
					}
					this.orderBy = orderBy;
				}
			},
		};
	});