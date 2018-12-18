angular.module('starter.controllers')
.controller('reassignCtrl', function ($scope, $rootScope, $state, $ionicPopover, setGetObj, config, $cordovaSQLite, $filter, formsService, $ionicPopup, $timeout, $ionicFilterBar, $localstorage, commonService, reassign, alertService, strings, $ionicListDelegate) {
	$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS downloads_collection(Username text,recordId integer)');
	$scope.reassign_action_header = true;
	$rootScope.hidecamera = false;
	$rootScope.hidelocation = false;
	$rootScope.hidebarcode = false;

	$ionicPopover.fromTemplateUrl('templates/reassignOptionsPopover.html', {
		scope : $scope
	}).then(function (popover) {
		$scope.popover = popover;
	});
	$scope.openPopover = function () {
		$scope.popover.show();
	};
	$scope.closePopover = function () {
		$scope.popover.hide();
	};
	var user = $localstorage.getObject("username");
	var userId = $localstorage.getObject("userId");
	securityHeaders.headers = commonService.securityHeaders();
	$scope.status = commonService.checkConnection();
	if ($scope.status == true) {
		$scope.hide_download = false;
	} else {
		$scope.hide_download = true;
	}

	var filterBarInstance;
	$scope.selection = [];

	$scope.toggleSelection = function (recordId) {

		var idx = $scope.selection.indexOf(recordId);
		// is currently selected
		if (idx > -1) {
			$scope.selection.splice(idx, 1);
			if ($scope.selection == "") {
				$rootScope.header_sync_hide = true;
				$rootScope.header_delete_hide = true;
			} else {
				$rootScope.header_delete_hide = false;

			}
		}
		// is newly selected
		else {
			$scope.selection.push(recordId);
			$rootScope.header_delete_hide = false;

		}
	};
	var idArry = [];
	$scope.checkDownloads = function (callback) {
		var query = 'SELECT * FROM downloads_collection where Username=?';
		$cordovaSQLite.execute(db, query, [user]).then(function (res) {
			var len = res.rows.length;
			for (var i = 0; i < len; i++) {
				var recordId = res.rows.item(i).recordId;
				if (idArry.indexOf(recordId) == -1) {
					idArry.push(recordId);
				}

			}
			callback(idArry);
		});

	},
	$scope.notifications = function () {
		alertService.showToast(strings.unavailable);
	},
	$scope.getReassignRecords = function () {
		$scope.checkDownloads(function (idArry) {
			$scope.arrVals = idArry;
			commonService.LoaderShow(strings.pleasewait);
			if ($scope.status == true) {
				var items = [];
				var url = config.url + '/api/v1/formszDetails/getRe-assginedRecodsMobile/' + user;

				formsService.getReassignedRecords(url, securityHeaders, function (response) {

					commonService.Loaderhide();
					if (response.status == 204) {
						$scope.reassignedRecords = '';
					} else {
						angular.forEach(response, function (value, key) {
							if (value.type == "form") {}
							else {}

							var dparr = [];
							angular.forEach(value.displayValues, function (dispValues, dispKeys) {
								dparr.push(dispValues.filedValue);
							});
							items.push({
								formName : value.formName,
								formId : value.formId,
								description : value.description,
								comments : value.comments,
								dpValues : dparr + [],
								recordId : value.recordId,
								taskId : value.taskId,
								taskName : value.taskName,
								type : value.type
							});
							$scope.reassignedRecords = items;
							setGetObj.setFormObject(items);
						});
					}
				});
			} else {
				$scope.reassignDownloadedRecords();
			}
		});
	},
	$scope.reassignDownloadedRecords = function () {
		$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormData_table(uniqueID integer primary key autoincrement,FormId integer,userId integer ,FormValues text,FormStatus text, TaskId text,recordId text,isRequired text)');

		var query = 'SELECT * FROM FormData_table WHERE userId=? and FormStatus="true"';
		$cordovaSQLite.execute(db, query, [userId]).then(function (res) {
			var len = res.rows.length;
			commonService.Loaderhide();
			var arr = [];
			for (var i = 0; i < len; i++) {
				var obj = {};
				obj.formId = res.rows.item(i).FormId;
				obj.userId = res.rows.item(i).userId;
				obj.dpValues = res.rows.item(i).uniqueID;
				obj.taskId = res.rows.item(i).TaskId;
				obj.record = res.rows.item(i).FormValues;

				arr.push(obj);
			}
			$scope.reassignedRecords = arr;
		});

	},
	$scope.ReassignedFormInfo = function (data) {
		var arr = [];
		angular.forEach(JSON.parse(data.comments), function (value, key) {
			arr.push(value.Comment);
		});
		var arrLen = arr.length;
		var Comment = arr[arrLen - 1];
		if (data.type == "form") {
			var alertPopup = $ionicPopup.alert({
					template : "<div>Form Name : " + data.formName + " </br><hr> Description : " + data.description + "</br><hr>Comments : " + Comment + "</div>",
				});
			alertPopup.then(function (res) {
				$ionicListDelegate.closeOptionButtons();
			});
		} else {
			var alertPopup = $ionicPopup.alert({
					template : "<div>Task Name : " + data.taskName + " </br><hr>Form Name : " + data.formName + " </br><hr> Description : " + data.description + "</br><hr>Comments : " + Comment + "</div>",
				});
			alertPopup.then(function (res) {
				$ionicListDelegate.closeOptionButtons();
			});
		}
	},
	$scope.getReassignRecordData = function (item, arrLen) {
		$rootScope.condition = false;
		$rootScope.formname = item.formName;
		$rootScope.prepopDataShow=false;
		if ($scope.status == true) {
			if (arrLen == -1) {
				$rootScope.saveButton = true;
				$rootScope.submitButton = false;
				$localstorage.setObject("reassignedRecordId", item.recordId);
				var url = config.url + "/api/v1/formszDetails/" + item.recordId;
				reassign.getReassignedRecordsData(url, securityHeaders, function (response) {
					$rootScope.skeletonId = item.formId;
					$rootScope.isHistoryChecked = "reassign";
					$rootScope.imgeasSet = {};
					$rootScope.sign = {};
					var RecordValues = response.record;
					$rootScope.selectedFormRecordFields = {};
					angular.forEach(RecordValues, function (value, key) {
						$rootScope.selectedFormRecordFields = value;
					});
					$rootScope.isGridRecodsShow = true;
					$state.transitionTo("app.viewForm");

				});
			} else {
				$scope.getReassignUpdateRecord(item);
			}
		} else {
			$scope.getOfflineReassignRecordData(item);
		}

	},
	$scope.getReassignUpdateRecord = function (item) {
		$rootScope.saveButton = false;
		$rootScope.submitButton = false;
		$rootScope.isHistoryChecked != false;
		$localstorage.setObject("offlineRecordId", item.recordId);
		var query = 'SELECT * FROM FormData_table WHERE FormId=? and recordId=?;';
		$cordovaSQLite.execute(db, query, [item.formId, item.recordId]).then(function (res) {
			var len = res.rows.length;
			for (var i = 0; i < len; i++) {
				var obj = {};
				obj.record = res.rows.item(0).FormValues;
			}
			var RecordData = JSON.parse(obj.record);
			$rootScope.skeletonId = item.formId;
			$rootScope.selectedFormRecordFields = {};
			angular.forEach(RecordData, function (value, key) {
				$rootScope.selectedFormRecordFields = value;
			});
			$rootScope.isGridRecodsShow = true;
			$state.transitionTo("app.viewForm");
		});
	},
	$scope.getOfflineReassignRecordData = function (item) {
		$localstorage.setObject("offlineRecordId", item.dpValues);
		$rootScope.imgeasSet = {};
		$rootScope.sign = {};
		var FormId = item.formId;
		$rootScope.offlineReData = true;
		var RecordData = JSON.parse(item.record);
		$rootScope.selectedFormRecordFields = {};
		angular.forEach(RecordData, function (value, key) {
			$rootScope.selectedFormRecordFields = value;
		});
		$rootScope.isGridRecodsShow = true;
		$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormSkeleton_table(FormId integer,Username text,id integer, FormName text ,FormSkeleton text)').then(function (res) {}, function (err) {});
		var query = 'SELECT * FROM FormSkeleton_table WHERE FormId=?';
		$cordovaSQLite.execute(db, query, [FormId]).then(function (res) {
			var len = res.rows.length;
			for (var i = 0; i < len; i++) {
				var FormValues = res.rows.item(i).FormSkeleton;
				$rootScope.fields = JSON.parse(FormValues);
				$localstorage.setObject("offlineData", FormValues);
				$state.transitionTo("app.viewForm");
			}

		}, function (err) {
			alert(JSON.stringify(err));
		});
	},

	$scope.checkAll = function () {
		$scope.reassign_action_header = false;
		$scope.closePopover();
		$scope.selectedAll = true;
		$scope.selectAllCheckBox = true;
		$scope.select_hide = true;
		$scope.selectCheckBox = false;
		$scope.select_all_hide = true;
		$scope.select_hide = true;
		angular.forEach($scope.reassignedRecords, function (item) {
			item.Selected = $scope.selectedAll;
		});
	},

	$scope.checkRecord = function () {
		$scope.closePopover();
		$scope.reassign_action_header = false;
		$scope.selectCheckBox = true;
		$scope.selectedAll = false;
		$scope.selectAllCheckBox = false;
	},
	$scope.clearSelection = function () {
		$scope.closePopover();
		$scope.reassign_action_header = true;
		$scope.selectedAll = false;
		$scope.select_hide = false;
		$scope.select_all_hide = false;
		$scope.clear_hide = true;
		$scope.selectAllCheckBox = false;

	},

	$scope.downloadReassignedRecords = function (item) {
		var url = config.url + "/api/v1/formszDetails/" + item.recordId;
		$localstorage.setObject("reassignedRecordId", item.recordId);
		reassign.getReassignedRecordsData(url, securityHeaders, function (response) {
			var values = JSON.stringify(response.record);
			$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormData_table(uniqueID integer primary key autoincrement,FormId integer,userId integer ,FormValues text,FormStatus text, TaskId text,recordId text,isRequired text)');

			var query = 'SELECT * FROM FormData_table WHERE FormStatus=? and recordId=?;';
			$cordovaSQLite.execute(db, query, [response.IsReassign, item.recordId]).then(function (res) {
				if (res.rows.length <= 0) {
					var query = 'INSERT INTO FormData_table (FormId,userId, FormValues,FormStatus,TaskId,recordId,isRequired) VALUES (?,?,?,?,?,?,?)';
					$cordovaSQLite.execute(db, query, [item.formId, userId, values, response.IsReassign, response.taskId, item.recordId, false]).then(function (res) {
						var url = config.url + "/api/v1/formsz/" + item.formId;
						formsService.navigateToForms(url, securityHeaders, function (status, response) {

							if (status) {
								$scope.formSkeleton = JSON.stringify(response.FormSkeleton);
								$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormSkeleton_table(FormId integer,Username text,id integer, FormName text ,FormSkeleton text)');
								var query = 'SELECT * FROM FormSkeleton_table WHERE FormId=?';
								$cordovaSQLite.execute(db, query, [item.formId]).then(function (res) {
									var query = 'INSERT INTO downloads_collection (Username,recordId) VALUES (?,?)';
									$cordovaSQLite.execute(db, query, [user, item.recordId]).then(function (res) {});
									if (res.rows.length <= 0) {
										var query = 'INSERT INTO FormSkeleton_table (FormId,Username, id, FormName, FormSkeleton) VALUES (?,?,?,?,?)';
										$cordovaSQLite.execute(db, query, [item.formId, user, userId, item.formName, $scope.formSkeleton]).then(function (res) {});
									}
								});
							}
						});
					});
					alertService.doAlert(strings.reassignRecordDownload, function (res) {
						$scope.refreshItems();
						$ionicListDelegate.closeOptionButtons();
					});
				} else {
					alertService.doAlert(strings.recordExists, function (res) {
						$ionicListDelegate.closeOptionButtons();
					});
				}
			});
		});
	},
	$scope.downloadAllForms = function (selection, item) {}

	$scope.refreshItems = function () {
		if (filterBarInstance) {
			filterBarInstance();
			filterBarInstance = null;
		}
		$scope.getReassignRecords();

		$timeout(function () {
			$scope.getReassignRecords();
			$scope.$broadcast('scroll.refreshComplete');
		}, 1000);
	};
});
