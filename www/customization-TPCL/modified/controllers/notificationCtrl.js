angular.module('starter.controllers')
.controller('nofification', function ($scope, $rootScope, $ionicHistory, alertService, dashboardService, $state, strings, setGetObj, $timeout, $ionicTabsDelegate, config, commonService, $filter, $localstorage, reassign) {
	var username = $localstorage.getObject("username");
	$scope.status = commonService.checkConnection();
	securityHeaders.headers = commonService.securityHeaders();
	var filterBarInstance;

	$scope.getNotifications = function () {
		$rootScope.recordId = '';
		$rootScope.taskId = '';
		var items = [];
		$rootScope.notificationsJobsOn = false;
		$rootScope.notificationsAddress = false;

		if ($scope.status) {
			var url = config.url + "/api/v1/formszDetails/getNotifications/" + username;
			console.log(url);
			
			dashboardService.notifyService(url, securityHeaders, function (response) {
				console.log(response);
				if (response.status == 200) {
					angular.forEach(response.data, function (dataObj, key) {
						items.push({
							_id: dataObj._id,
							adminName: dataObj.adminName,
							TaskId: dataObj.taskId,
							taskName: dataObj.taskName,
							recordId: dataObj.recordId,
							actionType: dataObj.actionType,
							displayValues: dataObj.displayValues,
							comments: dataObj.comments,
							FormId: dataObj.formId,
							status: dataObj.status,
							time: dataObj.createdTime
						});
					});
				}
				$scope.items = items;
				console.log($scope.items);

			});
		} else {
			$scope.items = items;
		}
	},

	$scope.navigate = function (item) {
		//1 means task reasign
		if (item.actionType == 1) {
			$scope.navigateToDirectTaskRecord(item);
		}
		//2 means project task reassign
		else if (item.actionType == 2) {
			console.log("project task record click")
			//$scope.navigateToProjectTaskRecord(item);
		} 
		else if(item.actionType =='assignjob'){
			$scope.navigateToDiirectTask(item);
		}else{
			$scope.navigateToProjectTask(item);
		}
	},
	$scope.navigateToRecord = function (item) {
		console.log(item);
		setGetObj.setNotificationItem(item);
		$rootScope.notificationsAddress = true;
		$rootScope.recordId = item.recordId;
		$rootScope.taskname = item.taskName;
		if (item.status == false) {
			console.log("first loop");
			var url = config.url + '/api/v1/formszDetails/notificationChange/' + item._id;
			var data = {};
			data.status = true;
			reassign.updateAddress(url, data, securityHeaders, function (response) {
				console.log(response);
				if (response.status == 200) {
					console.log("no navigationnnnnn");
					//	$state.go("app.taskformhistory");
					$state.go("sidemenu.tabs.assignedtasks");
				}
			});

		} else {
			console.log("second loop");
			$state.go("sidemenu.tabs.assignedtasks");

		}
	},
	$scope.navigateToProjectTask=function(item){

		var url = config.url + '/api/v1/formszDetails/notificationChange/' + item._id;
		var data = {};
		data.status = true;
		
		reassign.updateAddress(url, data, securityHeaders, function (response) {
			if (response.status == 200) 
			{
				commonService.setProjectTaskNotifications(item.TaskId);
				$state.go("sidemenu.tabs.ProjectTasks.assignedProjectTasks");
			}
		});

		
	}

	$scope.navigateToDiirectTask=function(item){

		var url = config.url + '/api/v1/formszDetails/notificationChange/' + item._id;
		var data = {};
		data.status = true;
		commonService.setDirectTaskNotifications(item.TaskId);
		//$state.go("sidemenu.tabs.formTasks.formTaskRecords");
		reassign.updateAddress(url, data, securityHeaders, function (response) {
			if (response.status == 200) 
			{
				commonService.setDirectTaskNotifications(item.TaskId);
				$state.transitionTo("sidemenu.tabs.formTasks.assignedFormTasks");

			}
		});

		
	}

	$scope.navigateToDirectTaskRecord=function(item){

		var url = config.url + '/api/v1/formszDetails/notificationChange/' + item._id;
			var data = {};
			data.status = true;
		reassign.updateAddress(url, data, securityHeaders, function (response) {
			if (response.status == 200) 
			{
				commonService.setDirectTaskRecordNotifications(item.recordId);
				$state.go("sidemenu.tabs.formTasks.formTaskRecords");
			}
		});

	}

	$scope.navigateToProjectTaskRecord=function(item){

		var url = config.url + '/api/v1/formszDetails/notificationChange/' + item._id;
			var data = {};
			data.status = true;
		reassign.updateAddress(url, data, securityHeaders, function (response) {
			if (response.status == 200) 
			{
				commonService.setProjectTaskRecordNotifications(item.recordId);
				$state.go("sidemenu.tabs.ProjectTasks.projectTaskRecords");
			}
		});

	}

	$scope.navigateToTask = function (item) {
		console.log(item);
		$rootScope.notificationsJobsOn = true;
		$rootScope.taskId = item.TaskId;
		if (item.status == false) {
			var url = config.url + '/api/v1/formszDetails/notificationChange/' + item._id;
			var data = {};
			data.status = true;
			reassign.updateJob(url, data, securityHeaders, function (response) {
				console.log(response);
				if (response.status == 200) {
					$state.go("sidemenu.tabs.assignedtasks");
				}
			});
		} else {
			$state.go("sidemenu.tabs.assignedtasks");
		}
	},
	$scope.refreshNotification = function () {
		$scope.status = commonService.checkConnection();
		if (filterBarInstance) {
			filterBarInstance();
			filterBarInstance = null;
		}
		$scope.getNotifications();
		$timeout(function () {
			$scope.$broadcast('scroll.refreshComplete');
		}, 1000);
	}
});
