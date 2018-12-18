angular.module('starter.controllers')
.controller('taskCtrl', function ($scope, $rootScope, $state, config, $cordovaSQLite, setGetObj, $ionicPopup, $filter, formsService, $ionicPopover, formsSave, alertService, commonService, $localstorage, reassign, strings, $timeout, $ionicHistory, $ionicListDelegate,taskDownloadAndSync,$ionicSideMenuDelegate,mapComponentServices) {
	$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormData_table(uniqueID integer primary key autoincrement,FormId integer,userId integer ,FormValues text,FormStatus text,TaskId text,recordId text,isRequired text,displayValues text,recordComments text,IsReassign text,lat text,long text,insertDate text,isVideoAvailable text,videoOptions text,videoPath text)').then(function (res) {}, function (err) {
		alert(JSON.stringify(err));
		});
	$scope.taskEllipse = true;
	$scope.status = commonService.checkConnection();
	securityHeaders.headers = commonService.securityHeaders();
	var userId = $localstorage.getObject("userId");
	var user = $localstorage.getObject("username");
	$rootScope.offlineReData = false;
	$rootScope.header_delete_hide = true;
	$rootScope.header_sync_hide = true;
	$scope.clear_hide = true;
//	$scope.progressPercent = 0
	var idArry = [];
	var filterBarInstance;
	$scope.searchBarShow = false;
	$scope.searchIcon = true;
	$scope.backButtonShow = true;







	// >>>> Developer : Phani Kumar Narina
	// >>>> TPCL Customization
	// >>>> Description : Filter popup with date/alphabatical sort
	$scope.filterByAssignee= function(){
		$ionicPopover.fromTemplateUrl('templates/filterByAssignee.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modalCloseAddBookmark = modal;
			$scope.modalCloseAddBookmark.show();
		});
	}

	// >>>> Developer : Phani Kumar Narina
	// >>>> TPCL Customization
	// >>>> Description : Filter popup with date/alphabatical sort
	$scope.filterTaskForms= function(){
		$ionicPopover.fromTemplateUrl('templates/filterTaskForms.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modalFilterTaskForms = modal;
			$scope.modalFilterTaskForms.show();
		});
	}
	

	$scope.applyFilter = function(){
		$scope.statusType = $scope.store;
	}

	$scope.clearFilter = function(){
		$scope.statusType = null;
		$scope.propertyName = null; 
		$scope.reverse = false;
		$scope.activeMenu = null;
	}

	$scope.GetSelectedType = function(val){
	//	console.log(val);
		$scope.store= val;
	}

	$scope.propertyName = 'endDate';
	$scope.reverse = true;

	$scope.sortBy = function(propertyName) {
	    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
	    $scope.propertyName = propertyName;
	};
/*
@developer :Santhosh Kumar Gunti
TPCL customization
toggling sidemenu
*/
	$scope.pullOverCheck = {value : false};

	$scope.$watch(function () {
       return $ionicSideMenuDelegate.isOpenRight();
      },
      function (isOpen) {
        if (isOpen){
	    	$scope.pullOverCheck.value = true;
        } else{
	    	$scope.pullOverCheck.value = false;
		    $rootScope.$broadcast('hidePrePopData');
        }
	});

	$scope.openMenu = function () {
	    $ionicSideMenuDelegate.toggleRight();
  	};
	$scope.selection = [];
	$scope.showSearchBar = function () {
		$scope.searchBarShow = true;
		$scope.searchIcon = false;
		$scope.backButtonShow = false;
	}
	$scope.hideSearchbar = function () {
		$scope.search = {};
		$scope.searchBarShow = false;
		$scope.searchIcon = true;
		$scope.backButtonShow = true;
	}

	$scope.$on('closepopupsInTaskforms', function () {
		if($ionicSideMenuDelegate.isOpen()){
			$scope.openMenu();
		}
   		else if($scope.modalFilterTaskForms != undefined && $scope.modalFilterTaskForms._isShown){
			$scope.modalFilterTaskForms.hide();
   		}
   		else{		
			$ionicHistory.goBack();
		}
	});

	$scope.selectAllCheckBox = false;
	$ionicPopover.fromTemplateUrl('templates/historyPopover.html', {
		scope : $scope
	}).then(function (popover) {
		$scope.popover = popover;
	});
	$ionicPopover.fromTemplateUrl('templates/ellipsePopover.html', {
		scope : $scope
	}).then(function (popover) {
		$scope.elipsePopover = popover;
	});
	$scope.openellipsePopover = function () {
		$scope.elipsePopover.show();
	};
	$scope.closeellipsePopover = function () {
		if ($scope.elipsePopover)
			$scope.elipsePopover.hide();
	};
	$scope.openPopover = function () {
		$scope.popover.show();
	};
	$scope.closePopover = function () {
		$scope.popover.hide();
	};

	if ($scope.status == true) {
		$scope.task_download_button = false;
		$scope.sync_header_option = true;
		if ($rootScope.TaskData) {
			$scope.hide_taskView = false;
			$scope.taskForm_edit_hide = true;
			$scope.sync_hide = true;
			$scope.delete_hide = true;
			//			$rootScope.hide_task_ellipse = true;
		} else {
			$scope.taskForm_edit_hide = false;
		}
	} else {
		$scope.sync_header_option = true;
		$scope.task_download_button = true;
		$scope.sync_hide = true;
		$rootScope.submitButton = true;

	}

	$scope.backToTasks = function () {
		$state.go("sidemenu.tabs.assignedtasks");
	},

	// newly added methods
	$scope.methodCheck = function () {
		$scope.status = commonService.checkConnection();

		if ($scope.status == true) {
			$scope.getAssignedTasks();
		} else {
			$scope.ShowDownloadedTasks();
		}
	};
	$scope.toggleSelection = function (id, item) {
	//	console.log(id);
	//	console.log(item);
		$scope.taskIdOfForms=item.TaskId;
		if (item.status == 1) {
			var idx = $scope.selection.indexOf(id);
			if (idx > -1) {
				$scope.selection.splice(idx, 1);
			}
			// is newly selected
			else {
				$scope.selection.push(id);
			}
		} else {}
	};
	/*$scope.toggleSelectionForms=function(id,item){
		console.log(id);
		console.log(item);
		$scope.taskIdOfForms=item.TaskId;
		if (item.status == 1) {
			var idx = $scope.selection.indexOf(id);
			if (idx > -1) {
				$scope.selection.splice(idx, 1);
			}
			// is newly selected
			else {
				$scope.selection.push(id);
			}
		} else {}
		console.log($scope.selection);
	}*/
	$scope.forDownloadedTask = function (callback) {
		var downloadedIds = [];
		$scope.syncIcon = [];
		var count = 0;

		 $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS downloadedTasks (Username text,TaskName text ,TaskId text,Description text,startDate text,endDate text,createdBy text)").then(function (res) {});
			var query = 'SELECT * FROM downloadedTasks where Username=?';
		//	var query = 'SELECT * FROM FormData_table where userId=?';
		$cordovaSQLite.execute(db, query, [user]).then(function (res) {
			var finalSyncArr = [];
		//	console.log(res.rows.length)
			if (res.rows.length > 0) {
				for (var i = 0; i < res.rows.length; i++) {
					var TaskId = res.rows.item(i).TaskId;
					$scope.checkFormsDataTable(TaskId, function (idresp) {
						finalSyncArr.push(idresp[0]);
						count++;
						if (count == res.rows.length) {
							callback(finalSyncArr);
						}
			//			console.log(finalSyncArr)
					});
				}
			} else {
				callback(downloadedIds);
			}
		});

	};
	   /* Checking for offline saved addresses */
	$scope.checkFormsDataTable = function (item, callback) {
	//	console.log(item);
		var downloadedIds1 = [];
		var syncTaskArr = [];
		var query = "SELECT * FROM FormData_table where TaskId=? and FormStatus='saved'";
		$cordovaSQLite.execute(db, query, [item]).then(function (res) {
	//		console.log(res.rows.length);
			if (res.rows.length > 0) {
				syncTaskArr.push({
					TaskId: item,
					syncStatus: 1
				});
	//			console.log(syncTaskArr)
				$scope.syncIcon.push(1);
				callback(syncTaskArr);
			} else {
	//			console.log("else loop of form data table")
				downloadedIds1.push({
					TaskId: item,
					syncStatus: 2
				});
	//			console.log(downloadedIds1)
				callback(downloadedIds1);
			}
		});
	},
	$scope.checkFormsDataTableForForms = function (item, callback) {
	//	console.log(item);
		var downloadedFormIds1 = [];
		var syncTaskArr = [];
		var query = "SELECT * FROM FormData_table where FormId=? and FormStatus='saved'";
		$cordovaSQLite.execute(db, query, [item]).then(function (res) {
		//	console.log(res.rows.length);
			if (res.rows.length > 0) {
				syncTaskArr.push({
					FormId: item,
					syncStatus: 1
				});
		//		console.log(syncTaskArr)
				$scope.syncIconForms.push(1);
				$rootScope.syncIconForms=$scope.syncIconForms;
				callback(syncTaskArr);
			} else {
		//		console.log("else loop of form data table")
				downloadedFormIds1.push({
					FormId: item,
					syncStatus: 2
				});
				$rootScope.syncIconForms=$scope.syncIconForms;
		//		console.log(downloadedFormIds1)
				callback(downloadedFormIds1);
			}
		});
	},
	$scope.checkDownloads = function (taskId,callback) {
	//	console.log(taskId)

		var downloadedFormIds = [];
		var count=0;
		$scope.syncIconForms = [];
		 $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS formszOfTasks(Username text, FormId integer,FormName text, TaskId integer, Category text,description text,Version text)").then(function (res) {});
		 var query = 'SELECT * FROM formszOfTasks where Username=? and TaskId=?';
	//	var query = 'SELECT * FROM FormData_table where userId=? and TaskId=?';
		$cordovaSQLite.execute(db, query, [user,taskId]).then(function (res) {
			var SyncArrForms = [];
	//		console.log(res.rows.length)
		if (res.rows.length > 0) {
	//		console.log("ifffffffffffffffff")
				for (var i = 0; i < res.rows.length; i++) {
					var FormId = res.rows.item(i).FormId;
					$scope.checkFormsDataTableForForms(FormId, function (idresp) {
						SyncArrForms.push(idresp[0]);
						count++;
						if (count == res.rows.length) {
							callback(SyncArrForms);
						}
	//					console.log(SyncArrForms)
					});
				}
			} else {
	//			console.log("else loop")
				$rootScope.syncIconForms=$scope.syncIconForms;
	//			console.log($rootScope.syncIconForms)
				callback(downloadedFormIds);
			}
		});
			
	};
	$scope.checkRecord = function () {
		$scope.selection = [];
		$scope.sync_header_option = false;
		$scope.selectCheckBox = true;
		$scope.selectAllCheckBox = false;
	},
	//<--
	//-->UE Implementation
	//Addition:Roja:clear checkboxes in job page
	$scope.clearSelection = function () {
		$scope.sync_header_option = true;
		$scope.selectCheckBox = false;
	},
	//<--
	//-->UE Implementation
	//Addition:Roja:select all checkboxes (on-click on sync icon)
	$scope.checkAll = function () {
		$scope.selectCheckBox = true;
		angular.forEach($scope.tasks, function (item) {
			$scope.toggleSelection(item.taskId, item);
		});
	},
	$scope.getAssignedTasks = function () {
		var notifyStatus;
//		console.log($rootScope.notificationsAddress)
	if ($rootScope.notificationsAddress) {
		var item = setGetObj.getNotificationItem();
		$state.go('sidemenu.taskformhistory');
	} else {
		$rootScope.NavigatedFrom = "";
		$scope.forDownloadedTask(function (downloadedIds) {
//		console.log(downloadedIds)
		$scope.arrVals = idArry;
		var tasks = [];
		var userId = $localstorage.getObject("userId");
		commonService.LoaderShow(strings.pleasewait);
		var url = config.url + "/api/v1/tasks/getTasksbyUser/" + userId;
		formsService.assignedtask(url, securityHeaders, function (response, status) {
			commonService.Loaderhide();

			$scope.taskObj = {};
			angular.forEach(response.data, function (dataValue, datakey) {
				var status = "0";
//				console.log(dataValue)
				$scope.formArr = [];
				angular.forEach(downloadedIds, function (downloadId, key) {
//					console.log(downloadId)
					if (downloadId.TaskId === dataValue._id) {
						status = downloadId.syncStatus;
					}else{
						//status = "0"
					}
				});
				console.log($rootScope.notificationsJobsOn)
		//		console.log($rootScope.taskId)
				if ($rootScope.notificationsJobsOn) {
							if (dataValue._id == $rootScope.taskId) {
								notifyStatus = false;
							} else {
								notifyStatus = true;
							}
				} else {
					notifyStatus = true;
				}
				angular.forEach(dataValue.assignedFormsz, function (value, key) {
					$scope.formArr.push({
						formId : value.formId,
						formName : value.formName,
						FormCategory : value.formszCategory,
						formDescription : value.formszDescription,
						workInstruction : value.formWorkInstruction,
						references : value.references,
						version:value.version
					});
				});
				tasks.push({
					TaskName : dataValue.name,
					FormDetails : $scope.formArr,
					startDate : dataValue.startDate,
					endDate : dataValue.endDate,
					createdBy : dataValue.createdBy,
					taskDescription : dataValue.description,
					status: status,
					taskId : dataValue._id,
					notifyStatus: notifyStatus
				});
			});
			$scope.tasks = tasks;
			console.log(tasks)
		});
		});
	}
};
    /**
     * @desc 
        Added the work instruction, references to existing array 
     * @author Santhosh Kumar Gunti
 	*/
 	function clearSelection(){
 		$scope.clearselection();
 	}
	$scope.getAssignedForms = function (item) {
		console.log(item);
		if ($scope.selectCheckBox) {
			$scope.toggleSelection(item.taskId, item);
		} else {
		setGetObj.setFormObject(item);
		localStorage.setItem("mapTaskid", item.taskId);
		$rootScope.imgeasSet = {};
		$rootScope.sign = {};
		$rootScope.isHistoryChecked = !"reassign";
		$rootScope.assignedHistory = true;
		$scope.taskname = item.TaskName;
		if ($scope.status == true) {
			$scope.checkDownloads(item.taskId,function (downloadedIds) {
		//		console.log(downloadedIds)
				$rootScope.TaskData = true;
				$scope.taskId = item.taskId;
				$rootScope.TaskForms = [];
				angular.forEach(item.FormDetails, function (value, key) {
		//			console.log(value)
					var status = "0";
					angular.forEach(downloadedIds, function (downloadId, key) {
						// && downloadId.TaskId === $scope.taskId
						if (downloadId.FormId === value.formId) {
							console.log("if loop")
							status = downloadId.syncStatus;
						}
					});
					
					$rootScope.taskname = item.TaskName;
					$rootScope.TaskForms.push({
						FormName : value.formName,
						FormId : value.formId,
						TaskId : $scope.taskId,
						TaskName : item.TaskName,
						startDate : item.startDate,
						endDate : item.endDate,
						taskDescription : item.taskDescription,
					//	FormDetails : item.FormDetails,
						formDescription:value.formDescription,
						status : status,
						FormWorkInstruction : value.workInstruction,
						references : value.references,
						version:value.version,
						category : value.FormCategory[0].name
					});
				});
				$state.transitionTo("sidemenu.taskforms");
			});
		} else {
			$scope.ShowTaskForms(item);
		}
	}
	};

	//backport from Ue by venki
	$scope.openMap = function (item) {
		commonService.setSelectedForm(item.FormId);
		commonService.setSelectedTaksId(item.TaskId);
	    
		$rootScope.NavigatedFrom = "form";
	    $rootScope.$broadcast('showPrePopData');
	    $scope.openMenu();

/*		console.log("poen a map")
		console.log(item);
		$ionicListDelegate.closeOptionButtons();
		$scope.selcetdFormId = item.FormId;
		$scope.selcetdTaskId = item.TaskId;
		commonService.setSelectedForm(item.FormId)
		commonService.LoaderShow(strings.pleasewait);
		$rootScope.NavigatedFrom = "tasks";
		$state.go("app.map");
		if ($scope.status == false) {
			alertService.showToast(strings.nonetworktoview);
		}
*/	};


	$scope.formInfo = function (formObj) {
		console.log(formObj)
		var category;
		if($scope.status){
		/*	var formDetails=item.FormDetails;
		}else{
			var formDetails=JSON.parse(item.FormCategory)
		}*/
	//	angular.forEach(item.FormCategory, function (formObj, formKey) {

            /*if (!formObj.formName)
                formObj.formName = "";

			if (!formObj.formDescription)
                formObj.formDescription = "";*/

            /*if (formObj.FormCategory.length!=0){
                category=formObj.FormCategory[0].name
            }else{
            	category=''
            }*/

			var alertPopup = $ionicPopup.alert({
					template : "<div>Form Name : " + formObj.FormName + " </br><hr> Description : " + formObj.formDescription + "</br><hr> Category : " + formObj.category + "</br><hr> Version : " +formObj.version+"</div>",
					buttons : [{
							text : 'ok',
							type : 'button-positive'
						}, ]
				});
			alertPopup.then(function (res) {
				$ionicListDelegate.closeOptionButtons();
			});
	//	});
	}else{
		var alertPopup = $ionicPopup.alert({
 template : "<div>Form Name : " + formObj.FormName + " </br><hr> Description : " + formObj.formDescription + "</br><hr> Category : " + formObj.category + "</br><hr> Version : " +formObj.version+"</div>",					buttons : [{
							text : 'ok',
							type : 'button-positive'
						}, ]
				});
			alertPopup.then(function (res) {
				$ionicListDelegate.closeOptionButtons();
			});
	}

	};
	
	$scope.downloadTask=function(item){
	//	console.log(item)
		 $ionicListDelegate.closeOptionButtons();
		 var deviceData = $localstorage.getObject("deviceInfo");
		 	var userDetails={}
			userDetails.model = deviceData.model;
			userDetails.platform = deviceData.platform;
			userDetails.UUID = deviceData.uuid;
			userDetails.macAddress = MacAddress;
	//	console.log(userDetails)
		taskDownloadAndSync.downloadTasksForms($scope,item,"task",userDetails);
	}
		$scope.downloadFormsOfTask=function(item){
	//		console.log(item)
			var item1={
				taskId:item.TaskId,
				FormName : item.FormName,
				FormId : item.FormId,
				TaskName : item.TaskName,
				startDate : item.startDate,
				endDate : item.endDate,
				taskDescription : item.taskDescription
			}
			 var deviceData = $localstorage.getObject("deviceInfo");
		 	var userDetails={}
			userDetails.model = deviceData.model;
			userDetails.platform = deviceData.platform;
			userDetails.UUID = deviceData.uuid;
			userDetails.macAddress = MacAddress;
			$ionicListDelegate.closeOptionButtons();
	//		console.log(item1)
			taskDownloadAndSync.downloadTasksForms($scope,item1,"form",userDetails);
		}
	$scope.syncAllTasksOnline=function(selection,$scope){
		taskDownloadAndSync.syncTasksOnline(selection,$scope,'tasks');		
	}
	$scope.syncAllFormsOnline=function(selection,taskId){
		console.log($scope.taskIdOfForms);
		taskDownloadAndSync.syncTaskFormsOnline(selection,$scope.taskIdOfForms,$scope,'forms');		
	}

	$scope.taskDetails = function (item) {
		if (item == undefined) {
			var item = setGetObj.getFormObject();
		}
		var startDate = $filter('date')(item.startDate, "yyyy-MM-dd");
		var endDate = $filter('date')(item.endDate, "yyyy-MM-dd");

        if (!item.TaskName)
            item.TaskName = "";

        if (!item.taskDescription)
            item.taskDescription = "";

		var alertPopup = $ionicPopup.alert({
				template : "<div>Task Name : " + item.TaskName + " </br><hr> Description : " + item.taskDescription + "</br><hr>Start Date : " + startDate + "</br><hr>End Date : " + endDate + "</div>",
				buttons : [{
						text : 'ok',
						type : 'button-positive'
					},
				]
			});
		alertPopup.then(function (res) {
			$scope.closeellipsePopover();
			$ionicListDelegate.closeOptionButtons();
		});
	},

	$scope.ShowDownloadedTasks = function () {
		$rootScope.TaskData = false;
		var username = $localstorage.getObject("username");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS downloadedTasks (Username text,TaskName text ,TaskId text,Description text,startDate text,endDate text,createdBy text)").then(function (res) {}, function (err) {});
		var query = "SELECT * FROM downloadedTasks WHERE Username=?";
		$cordovaSQLite.execute(db, query, [username]).then(function (res) {
			var len = res.rows.length;
			var arr = [];
			console.log(len);
			for (var i = 0; i < len; i++) {
				var obj = {};
				obj.taskName = res.rows.item(i).TaskName;
				obj.taskId = res.rows.item(i).TaskId;
				obj.taskDescription = res.rows.item(i).Description;
				obj.startDate = res.rows.item(i).startDate;
				obj.endDate = res.rows.item(i).endDate;
				obj.createdBy = res.rows.item(i).createdBy;
				arr.push(obj);
			}
			$scope.downloadedtaskObject = arr;
			var taskItems = [];
			for (var x = 0; x < $scope.downloadedtaskObject.length; x++) {
				taskItems.push({
					TaskName : $scope.downloadedtaskObject[x].taskName,
					taskDescription : $scope.downloadedtaskObject[x].taskDescription,
					TaskId : $scope.downloadedtaskObject[x].taskId,
					startDate : $scope.downloadedtaskObject[x].startDate,
					endDate : $scope.downloadedtaskObject[x].endDate,
					createdBy:$scope.downloadedtaskObject[x].createdBy,
					status: "2",
					notifyStatus: true,
				});
			}
			$scope.tasks = taskItems;
			commonService.Loaderhide();
		}, function (err) {
			$ionicLoading.hide();

		});
	},

	$scope.ShowTaskForms = function (item) {
		$rootScope.TaskData = false;
		$rootScope.assignedHistory = false;
		var username = $localstorage.getObject("username");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS formszOfTasks(Username text, FormId integer, FormName text,TaskId integer, Category text, description text,Version text)").then(function (res) {}, function (err) {});
		var query = "SELECT * FROM formszOfTasks WHERE TaskId=?";
		$cordovaSQLite.execute(db, query, [item.TaskId]).then(function (res) {
	//		$scope.checkDownloads(function (downloadedIds) {

				var len = res.rows.length;
				var arr = [];
				var catArr=[];
				for (var i = 0; i < len; i++) {
					
					var obj = {};
					obj.taskFormId = res.rows.item(i).FormId;
					obj.FormName = res.rows.item(i).FormName;
					obj.TaskId = item.TaskId;
					obj.version = res.rows.item(i).Version;
					obj.description = res.rows.item(i).description;
					
					obj.endDate = res.rows.item(i).endDate;
		//			console.log(res.rows.item(i).Category)
		//			console.log(JSON.parse(res.rows.item(i).Category))
					angular.forEach(JSON.parse(res.rows.item(i).Category),function(value){
						catArr.push(value.name)
					})
					obj.Category = catArr+[];
					arr.push(obj);
				}
			//	$scope.downloadedtaskForms = arr;
				var taskForms = [];
				for (var x = 0; x < arr.length; x++) {
					taskForms.push({
						FormName : arr[x].FormName,
						FormId : arr[x].taskFormId,
						TaskId : arr[x].TaskId,
						category:arr[x].Category,
						endDate:arr[x].endDate,
						version:arr[x].version,
						formDescription:arr[x].description,
						status : "2"
					});
				}
				$rootScope.TaskForms = taskForms;
				commonService.Loaderhide();
				$state.transitionTo("sidemenu.taskforms");

			});
		}, function (err) {
			$ionicLoading.hide();

	//	});
	},
	$rootScope.TaskFormsHistoryOffline=function(item){
//		console.log(item);
		if ($scope.selectCheckBox) {
			$scope.toggleSelection(item.FormId, item);
		} else {
			if ($scope.status == true) {
			localStorage.setItem("mapFormId", item.FormId);
			$rootScope.formname = item.FormName;
			setGetObj.setTaskHisotryForm(item);
			$state.transitionTo("sidemenu.taskformhistory");
			}else{
				setGetObj.setTaskHisotryForm(item);
				$state.transitionTo("sidemenu.taskformhistory");
			}
		}
	}
	/*$rootScope.TaskFormsHistoryOffline = function (item) {
		console.log(item);
		if ($scope.selectCheckBox) {
			$scope.toggleSelection(item.FormId, item);
		} else {
		localStorage.setItem("mapFormId", item.FormId);
		$rootScope.formname = item.FormName;
		setGetObj.setTaskHisotryForm(item);
		$rootScope.isView = false;
		$rootScope.TaskData = true;
		var assignedFormOfflineData = [];
		var reassignRecords=[];
		if ($scope.status == true) {
			var url = config.url + "/api/v1/formszDetails/getPrePopulatedDataforUser/" + item.TaskId + "/" + user+"/"+item.FormId;
			reassign.getPrepopulatedData(url, securityHeaders, function (response) {
				console.log(response)
				angular.forEach(response, function (arrayvalues, arraykeys) {
					angular.forEach(arrayvalues, function (values, keys) {
					//	var FormName = values.FormName;
						commonService.Loaderhide();
							angular.forEach(values.DisplayValues, function (value, key) {
								var dpvals = [];
								angular.forEach(value.record, function (v, k) {
									dpvals.push(v.fieldIdName);
								});
								console.log(dpvals)
								if(value.IsReassign){
									reassignRecords.push({
										recordId : value.recordId,
										recordName : dpvals + [],
										FormName : values.FormName,
										FormId : values.formId,
										comments:values.comments,
										TaskId : item.TaskId
									});
								}else{
									assignedFormOfflineData.push({
										recordId : value.recordId,
										recordName : dpvals + [],
										FormName : values.FormName,
										FormId : values.formId,
										TaskId : item.TaskId
									});
								}
								
							});
							$rootScope.reassignRecords=reassignRecords;
							console.log(reassignRecords)
							$rootScope.prepopRecords = assignedFormOfflineData;
							$state.transitionTo("sidemenu.taskformhistory");
					//	}
					});
				});
			});
		} else {
			$scope.getTaskFormOffline(item);
		}
	}
	},*/

	$scope.getFormRecordsOfTask = function (item) {
		$state.transitionTo("sidemenu.taskformhistory");
	},

	/*$scope.getTaskFormOffline = function (item) {
		console.log(item)
		$rootScope.isGridRecodsShow = false;
		$rootScope.isView = true;
		$rootScope.condition = false;
		var assignedFormOfflineData = [];
		var reassignRecords=[];
		$localstorage.setObject("formId", item.FormId);
		$rootScope.saveButton = false;
		$rootScope.submitButton = false;
		$rootScope.prepopRecords = [];
		$rootScope.reassignRecords = [];
		
				var query = 'SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? ORDER BY insertDate DESC ';
		$cordovaSQLite.execute(db, query, [item.FormId, userId, item.TaskId,"new"]).then(function (res) {
			var len = res.rows.length;
			for (var i = 0; i < len; i++) {
				var obj = {};
				obj.FormId = res.rows.item(i).FormId;
				obj.userId = res.rows.item(i).userId;
				obj.displayValues = res.rows.item(i).displayValues;
				obj.FormValues = res.rows.item(i).FormValues;
				obj.TaskId = res.rows.item(i).TaskId;
				obj.recordType=res.rows.item(i).FormStatus;
				obj.recordId = res.rows.item(i).recordId;
				console.log(res.rows.item(i).FormStatus)
				if(res.rows.item(i).FormStatus=='new'){
					assignedFormOfflineData.push(obj)			
				}else if(res.rows.item(i).FormStatus=='reassign'){
					reassignRecords.push(obj)	
				}
			}
			$rootScope.prepopRecords = assignedFormOfflineData;
			$rootScope.reassignRecords=reassignRecords;
			console.log(assignedFormOfflineData)
			console.log(reassignRecords)
			$state.transitionTo("sidemenu.taskformhistory");
		}, function (err) {
			alert(JSON.stringify(err));
		});
		
	},*/
	
	$scope.refreshItems = function () {
		if (filterBarInstance) {
			filterBarInstance();
			filterBarInstance = null;
		}
		$scope.methodCheck();

		$timeout(function () {
			$scope.methodCheck();

			$scope.$broadcast('scroll.refreshComplete');
		}, 1000);
	};
	$scope.notifications = function () {
		alertService.showToast(strings.unavailable);
	},
	$scope.refreshTaskForms = function () {
		$scope.status = commonService.checkConnection();
		var item = setGetObj.getFormObject();
		if (filterBarInstance) {
			filterBarInstance();
			filterBarInstance = null;
		}
		$scope.getAssignedForms(item);

		$timeout(function () {
			$scope.getAssignedForms(item);

			$scope.$broadcast('scroll.refreshComplete');
		}, 1000);
	};
	$rootScope.$on("clearselection", function () {
//		console.log("clear selkectionnnnnn")
		$scope.sync_header_option = true;
		$scope.selectCheckBox = false;
		$scope.refreshTaskForms();
		//$scope.clearselection();
	});
	$rootScope.$on("refreshtasks", function () {
		$scope.sync_header_option = true;
		$scope.selectCheckBox = false;
		$scope.refreshItems();
	});
	/*$rootScope.$on("refreshForms", function () {
		$scope.refreshItems();
	});*/
	$scope.$on("disablePullover", function () {
		if($scope.pullOverCheck.value == true){
			$scope.pullOverCheck.value = false;
			$scope.openMenu();
		}
	});

	$scope.$on("$ionicView.enter", function () {
		if ($state.current.name === 'sidemenu.tabs.assignedtasks') {
			$ionicHistory.clearCache();
			$ionicHistory.clearHistory();
		}
	});

});
