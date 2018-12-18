/*angular.module('starter.controllers')
.controller('dashboardCtrl', function ($scope, $rootScope, $timeout) {
});
*/
angular.module('starter.controllers')
.controller('dashboardCtrl', function ($scope, $rootScope, $timeout, commonService, $localstorage, config, dashboardService) {
	var username = $localstorage.getObject("username");
	securityHeaders.headers = commonService.securityHeaders();
	$scope.status = commonService.checkConnection();
	
	/* Showing dashboard statistics
	showing the count of completed and pending jobs, carded and non-carded addresses. */
	$scope.dashboardStatistics = function () {
		console.log("dashboardStatistics")
		$rootScope.notificationsJobsOn = false;
		var url = config.url + "/api/v1/formszDetails/DashboardStatistics/" + username;
		dashboardService.dashboardStatistics(url, securityHeaders, function (response) {
			console.log(response);
			var value = response.data;
			$scope.completed = value.taskComp;
			$scope.pending = value.taskPending;
			$scope.overAllTasks = value.taskPending + value.taskComp;
			$scope.cardedAddress = value.cardedAddress;
			$scope.noncardedAddress = value.noncardedAddress;
			$scope.cardingRange = value.cardedAddress + value.noncardedAddress;
			commonService.Loaderhide();
		});

	}
});
