angular.module('starter.controllers')
.controller('tabsController', function ($scope, $rootScope, $timeout, commonService) {
	$scope.status = commonService.checkConnection();
  		$rootScope.dashboardTab = true;
		$rootScope.taskTab = true;
  		$rootScope.formsTab = true;
		$rootScope.reassignTab = true;
		$rootScope.settingsTab = true;
		$rootScope.projectTasksTab = true;
		$rootScope.notificationTab = true;
		$rootScope.projectTask = true;
});
