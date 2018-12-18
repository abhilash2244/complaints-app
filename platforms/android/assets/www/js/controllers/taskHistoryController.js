angular.module('starter.controllers')
.controller('taskHistoryCtrl', function ($scope, $rootScope, config, $state, setGetObj, $ionicPopup, $cordovaSQLite, $timeout, $ionicFilterBar, commonService, $localstorage, reassign, $ionicPopover, formsSave, alertService, strings, $ionicListDelegate, formsService, $ionicSideMenuDelegate, $ionicModal, $sce, $ionicHistory, promisingMethods, $q,$filter) {
	$scope.statusType = 'All';
	$scope.task_action_header = true;
	$scope.addrecordicon = true;
	securityHeaders.headers = commonService.securityHeaders();
	$scope.status = commonService.checkConnection();
	$scope.searchBarShow = false;
	$scope.searchIcon = true;
	$scope.backButtonShow = true;
	var promises = [];
	//backport form UE by venki
	$scope.pullOverCheck = {value : false};

	$scope.$watch(function () {
       return $ionicSideMenuDelegate.isOpenRight();
      },
      function (isOpen) {
        if (isOpen){
	    	$scope.pullOverCheck.value = true;
        } else{
	    	$scope.pullOverCheck.value = false;
		    $rootScope.$broadcast('hideRoutingOnMap');
        }
	});

	$scope.$on("disablePullover", function () {
		if($scope.pullOverCheck.value == true){
			$scope.pullOverCheck.value = false;
			$scope.openMenu();
		}
	});


// @Phani:
$scope.convertToShortDate = function (date) {
 if (!date || date == null || date == "") {
  return "";
 } else {
  return $filter('date')(new Date(date), 'M/d/yyyy');
 }
}
$scope.convertToDate = function (date) {
 if (!date || date == null || date == "") {
  return "";
 } else {
  return new Date(date);
 }
},


// Email record to admin @phani
// $scope.emailRecords = function(item){
//  console.log(item);
//  //commonService.LoaderShow(strings.loading);
//  var url = config.url + "/api/v1/formszDetails/generatePDF";
//  var obj = {};
//  obj.formid = $localstorage.getObject("formId");
//  var records = [];
//  records.push(item.recordId);
//  obj.records = records;
//  obj.altemail = "";
//  console.log(obj);
//  formsSave.emailRecords(url, obj, securityHeaders, function (response) {
//   if (response.status == 200) {
//    console.log(response);
//    alertService.showToast(""+response.message+"");
//   }
//   else{
//    alertService.showToast("Something went wrong!");
//   }
//  });
// }

	// >>>>> Open Email Popup Modal 
	// >>>>> Developer : Phani Kumar Narina
	// >>>>> TPCL Customization
	$scope.email = function(item){
		$ionicPopover.fromTemplateUrl('templates/emailContent.html', {
			scope: $scope,
			backdropClickToClose :false
		}).then(function (modal) {
			$scope.emailModal = modal;
			$scope.emailData = item;
			$scope.info = {};
			openEmailModal($scope);
		});
	}

	// >>>>> Email record
	// >>>>> Parameters :  
	// >>>>> Developer : Phani Kumar Narina
	// >>>>> TPCL Customization
	$scope.emailRecords = function(item,info,FormName){
		console.log(item);
		var url = config.url + "/api/v1/formszDetails/mobilegeneratePDF";
		var obj = {};
		var records = [];
		records.push(item.recordId);
		obj.records = records;
		obj.altemail = "";
		obj.formid = item.FormId;
		obj.username = $localstorage.getObject("username");
		obj.groupid = $localstorage.getObject("groupid");
		obj.sendTo = info.toAddress;
		obj.body = info.body;
		console.log(obj);
		formsSave.emailMobileRecords(url, obj, securityHeaders, function (response) {
		  if (response.status == 200) {
		   	console.log(response);
		   	$scope.emailModal.hide();
		   	alertService.showToast(""+response.message+"");
		  }
		  else{
		   	alertService.showToast("Something went wrong!");
		  }
		});
	}

	function openEmailModal($scope){
		$scope.emailModal.show();
	}

	$scope.closeBtn = function(){
		$scope.emailModal.hide();
	}

	$scope.sendMail = function(item){
		$state.go("app.mailer");
		$scope.emailData = item;
		$scope.info = {};
		$scope.closeBtn();
	}


$scope.applyFilter = function(){
	$scope.statusType = $scope.store;
}

$scope.clearFilter = function(){
	$scope.statusType = 'All';
	$scope.propertyName = null; 
	$scope.reverse = false;
	$scope.activeMenu = null;
}

$scope.GetSelectedType = function(val){
	console.log(val);
	$scope.store= val;
}

$scope.propertyName = 'dateCreated';
$scope.keyName = 'createdTime';
$scope.reverse = true;

$scope.sortBy = function(propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
 };

$scope.$on('closepopupsInTaskHistory', function () {
		if($ionicSideMenuDelegate.isOpen()){
			$scope.openMenu();
		}
		else if($scope.modalFilterTasksRecords != undefined && $scope.modalFilterTasksRecords._isShown){
			$scope.modalFilterTasksRecords.hide();
		}
		else{
			$ionicHistory.goBack();
		}
});


// TaskRecord History page filters
$scope.filterTaskRecord = function(){
 $ionicPopover.fromTemplateUrl('templates/filterTasksRecords.html', {
  scope: $scope,
  animation: 'slide-in-up'
 }).then(function (modal) {
  $scope.modalFilterTasksRecords = modal;
  $scope.modalFilterTasksRecords.show();
 });
}

// Developer : Phani Kumar Narina
// History Page Sorting
// Params: Sort by Date/Alphabatical
$scope.sortHistoryList = function(){
	$ionicPopover.fromTemplateUrl('templates/sortHistoryList.html', {
  	scope: $scope,
  	animation: 'slide-in-up'
 	}).then(function (modal) {
  	$scope.modalCloseAddBookmark = modal;
  	$scope.modalCloseAddBookmark.show();
 });
}

// $scope.reverse = true;

$scope.sortByDate = function(propertyName) {
    $scope.reverse = ($scope.keyName === propertyName) ? !$scope.reverse : false;
    $scope.keyName = propertyName;
};

/*
@developer :Santhosh Kumar Gunti
TPCL customization
toggleing sidemenu
*/
	$scope.openMenu = function () {
	    $ionicSideMenuDelegate.toggleRight();
  	};

  	$scope.reassignComments = function (item) {
  console.log(item)
  var comments;
  var UpdatedTime;
  if ($scope.status) {
   angular.forEach(JSON.parse(item.comments), function (v, k) {
    comments = v.Comment;
    UpdatedTime = $filter('date')(v.UpdatedTime, "yyyy-MM-dd");
   });
  } else {
   var reassignComments = JSON.parse(item.comments);
   angular.forEach(reassignComments, function (v, k) {
    comments = v.Comment;
    UpdatedTime = $filter('date')(v.UpdatedTime, "yyyy-MM-dd");
   });
  }

  var alertPopup = $ionicPopup.alert({
    cssClass: 'custom-class', // Add
    template: "<div>Comments: " + comments + "</br><hr> UpdatedTime : " + UpdatedTime + "</div>",
    buttons: [{
      text: 'ok',
      type: 'button-dark'
     }, ]
   });
  alertPopup.then(function (res) {});
 }

  		$rootScope.getPrePoprecordFromMap = function (item) {
		$rootScope.submittedFrom = "map";
		$rootScope.selectedFormRecordFields = {};
		var user = $localstorage.getObject("username");
		$rootScope.prepopDataShow = true;
		if ($scope.status == true) {
			$rootScope.TaskData = true;
			$rootScope.isGridRecodsShow = true;
			$rootScope.formEllipse = true;
			$rootScope.skeletonId = item.FormId;
			$localstorage.setObject("TaskId", item.TaskId);
			var url = config.url + "/api/v1/formszDetails/getprePOPRecords/" + user + "/" + item.FormId + "/" + item.recordId;
			formsSave.getPrepopData(url, securityHeaders, function (response) {
//				console.log(response);
				$localstorage.setObject("reassignedRecordId", item.recordId);
				if (response.message) {}
				else {
					angular.forEach(response, function (value, key) {
						angular.forEach(value.prepopulatedData, function (recordValues, recordKeys) {
							angular.forEach(recordValues, function (v, k) {
								$rootScope.selectedFormRecordFields[k] = v;
							});
						});
					});
				}
				$state.transitionTo("sidemenu.viewForm");
			});
			//		}
		} else {
			$scope.editPrepopulatedRecord(item);
		}

	},
	$scope.editPrepopulatedRecord = function (item) {
		$rootScope.skeletonId = item.FormId;
		var arr = [];
		$rootScope.prepopDataShow = true;
		$rootScope.isHistoryChecked = false;
		$rootScope.isView = false;
		$localstorage.setObject("TaskId", item.TaskId)
		$localstorage.setObject("offlineRecordId", item.recordId);
		var query = "SELECT * FROM FormData_table WHERE recordId=?";
		$cordovaSQLite.execute(db, query, [item.recordId]).then(function (res) {
			for (var i = 0; i < res.rows.length; i++) {
				var obj = {};
				obj.recordId = item.recordId;
				obj.formId = item.FormId;
				obj.taskId = item.TaskId;
				obj.record = res.rows.item(0).FormValues;
				arr.push(obj);
			}
			angular.forEach(arr, function (values, keys) {
				var prepopValues = JSON.parse(values.record);
				angular.forEach(prepopValues, function (val, k) {
					$rootScope.selectedFormRecordFields = val;
				});
			});
			$state.transitionTo("tabs.tasks.eachTask.viewForm");
			
		});

	}

	$scope.navigateToLocationFromPrepop = function (id) {
		$rootScope.NavigatedFrom = "prepoprec";
		$rootScope.navigatetoRecordId = id;
	    $rootScope.$broadcast('showPrePopData');
	};

	//backport end
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
	var user = $localstorage.getObject("username");
	$rootScope.selectedFormRecordFields = {};
	var filterBarInstance;

    $scope.selectCheckBox = false;
	$scope.selection = [];

	$scope.toggleSelection = function (recordId) {
		var idx = $scope.selection.indexOf(recordId);
		// is currently selected
		if (idx > -1) {
			$scope.selection.splice(idx, 1);
			if ($scope.selection.length == 0) {
				$scope.header_delete_hide = true;
				$scope.header_sync_hide = true;
			} else {
				$scope.header_delete_hide = false;
				$scope.header_sync_hide = false;
			}
		}
		// is newly selected
		else {
			$scope.selection.push(recordId);
			$scope.header_delete_hide = false;
			$scope.header_sync_hide = false;
		}
	};
	$ionicPopover.fromTemplateUrl('templates/taskformhistorypopover.html', {
		scope : $scope
	}).then(function (popover) {
		$scope.popover = popover;
	});
	$scope.openPopover = function () {
		$scope.popover.show();
	};
	$scope.closePopover = function () {
		$scope.popover.hide();
	}
	$scope.openMap = function () {
		$rootScope.NavigatedFrom = "tasks";
		$state.go("app.map");
		if ($scope.status == false) {
			alertService.showToast(strings.nonetworktoview);
		}
	},
	$scope.TaskFormsHistory = function () {
		$scope.closePopover();
			commonService.LoaderShow(strings.loading);
		var item = setGetObj.getTaskHisotryForm();
		$rootScope.formEllipse = true;
		$rootScope.hidecamera = true;
		$rootScope.hidebarcode = true;
		$rootScope.hidelocation = true;
		$rootScope.condition = true;
		$scope.historyObjects = [];
		var user = $localstorage.getObject("username");
		if ($scope.status == true) {
			var items = [];
			$rootScope.isHistoryChecked = !"reassign";
			$rootScope.hide_taskellipse = true;
			var url = config.url + "/api/v1/formszDetails/" + item.FormId + "/" + user + "/" + item.TaskId;
			reassign.getTaskRecords(url, securityHeaders, function (response) {
				$scope.taskRecords = response;
				console.log("...............................");
				console.log(response);
				angular.forEach(response.data, function (res) {
					var finalDisplay = "";
					var flag = true;
					angular.forEach(res.displayFields, function (value, key) {
						if (res.displayFields.length == 1) {
							items.push({
								FormId : item.FormId,
								recordId : res.recordId,
								FormValues : value.filedValue,
								createdTime : res.createdTime
							});
						} else {
							flag = false;
							if (key == 0) {
								finalDisplay = finalDisplay + " " + value.filedValue;
							} else if (value.filedValue != "") {
								finalDisplay = finalDisplay + "<br/> " + value.filedValue;
							} else {
								finalDisplay = finalDisplay + value.filedValue;
							}
						}
						if (key == res.displayFields.length - 1 && flag == false) {
							items.push({
								FormId : item.FormId,
								recordId : res.recordId,
								FormValues : finalDisplay,
								createdTime : res.createdTime
							});
						}
					});
				});
				commonService.Loaderhide();
				$rootScope.taskformOnlinehistoryObjects = items;
				//$rootScope.taskformOnlinehistoryObjects = $scope.historyObjects;
				$state.transitionTo("app.taskformOnlinehistory");
			});

		} else {
			commonService.Loaderhide();
			alertService.showToast(strings.nonetworktoview);
		}
	},

	$scope.Tformhistory = function () {
		if ($rootScope.notificationsAddress) {
			console.log(item)
			var item = setGetObj.getNotificationItem();
		} else {
			var item = setGetObj.getTaskHisotryForm();
		}
		$scope.task_action_header = true;
		$scope.addrecordicon = true;
		var userId = $localstorage.getObject("userId");
	//	var item = setGetObj.getTaskHisotryForm();
		var arr = [];
		var reassignRecords=[];
		var prepopAndReassign=[];
		var prepopArr=[];
		$rootScope.formEllipse = false;
		$rootScope.TaskData = true;
			var query = 'SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? ORDER BY insertDate DESC';
		$cordovaSQLite.execute(db, query, [item.FormId, userId, item.TaskId]).then(function (res) {
			var len = res.rows.length;
			//		console.log(len)
			for (var i = 0; i < len; i++) {
				var obj = {};
			//	obj.FormId = res.rows.item(i).FormId;
				obj.FormId = item.FormId;
				obj.userId = res.rows.item(i).userId;
				obj.displayValues = res.rows.item(i).displayValues;
				obj.FormValues = res.rows.item(i).FormValues;
				obj.TaskId = res.rows.item(i).TaskId;
				obj.recordType=res.rows.item(i).FormStatus;
				obj.dateCreated = res.rows.item(i).insertDate;
				obj.prepopRecId = res.rows.item(i).recordId;
				obj.comments=res.rows.item(i).recordComments;
				if (res.rows.item(i).FormStatus == "saved") {
					//			console.log(res.rows.item(i).recordId)
					obj.recordId = res.rows.item(i).uniqueID;
					arr.push(obj);
				} else {
					console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
					obj.recordId = res.rows.item(i).recordId;
					prepopAndReassign.push(obj);
				}
				console.log(arr)
			}
				if ($scope.status ){
					$scope.TaskFormsPrepopRecords(item,arr,function(reassignedResponse, prepopRecordsResponse, isReassign){
						if (isReassign) {
						$rootScope.reassignRecords = reassignedResponse;
					//	commonService.setReassignRecords($scope.reassignedDataVals);
					} else {
						$rootScope.prepopRecords = prepopRecordsResponse;
					//	commonService.setPrepopRecords($scope.prepopRecords);
					}
					$rootScope.offlineTaskformhistory = arr;
					})
				}else{
					$rootScope.offlineTaskformhistory = arr;
					$scope.getofflinePrepopRecords(item,prepopAndReassign);
				}
		//	console.log($rootScope.offlineTaskformhistory)
		}, function (err) {
			alert(JSON.stringify(err));
		});

	},
	$scope.TaskFormsPrepopRecords = function (item, arr, callback) {
	//	console.log(item);
/*		localStorage.setItem("mapFormId", item.FormId);
		$rootScope.formname = item.FormName;
		setGetObj.setTaskHisotryForm(item);*/
		$rootScope.isView = false;
		$rootScope.TaskData = true;
		$rootScope.prepopRecords=[];
		$rootScope.reassignRecords=[];
		var prepopRecordsResponse = [];
		var reassignRecords = [];
		var notifyStatus = true;
		//	if ($scope.status == true) {
		var url = config.url + "/api/v1/formszDetails/getPrePopulatedDataforUser/" + item.TaskId + "/" + user + "/" + item.FormId;
		reassign.getPrepopulatedData(url, securityHeaders, function (response) {
						console.log(response)
			angular.forEach(response, function (arrayvalues, arraykeys) {
				angular.forEach(arrayvalues, function (values, keys) {
						$scope.formname = values.FormName;
					commonService.Loaderhide();
					//				console.log(values.DisplayValues)
					if (values.DisplayValues.length != 0) {
						//						console.log("valuess")
						angular.forEach(values.DisplayValues, function (value, key) {
							if ($rootScope.notificationsAddress) {
								if (value.recordId == $rootScope.recordId) {
									notifyStatus = false;
								} else {
									notifyStatus = true;
								}
							} else {
								notifyStatus = true;
							}
							var dpvals = [];
							angular.forEach(value.record, function (v, k) {
								dpvals.push(v.fieldIdName);
							});
							//					console.log(dpvals)
							if (value.IsReassign) {
								if ($scope.checkRecordsOnline(arr, value) == 0) {
									reassignRecords.push({
										recordId: value.recordId,
										recordName: dpvals + [],
										FormName: values.FormName,
										FormId: values.formId,
										comments: value.comments,
										TaskId: item.TaskId,
										notifyStatus: notifyStatus
									});
								}
							} else {

								if ($scope.checkRecordsOnline(arr, value) == 0) {
									prepopRecordsResponse.push({
										recordId: value.recordId,
										recordName: dpvals + [],
										FormName: values.FormName,
										FormId: values.formId,
										TaskId: item.TaskId,
										notifyStatus: notifyStatus
									});
								}
							}
							console.log(reassignRecords)
							callback(reassignRecords, prepopRecordsResponse, value.IsReassign);
						});
					} else {
						console.log("no values")
						$rootScope.prepopRecords = [];
						$rootScope.reassignRecords = [];
						callback(reassignRecords, prepopRecordsResponse, false);
					}
					//	}
					});
				});
			});
		/*} else {
			$scope.getofflinePrepopRecords(item,);
		}*/
//	}
	},
	$scope.getofflinePrepopRecords = function (item, arr) {
	//	console.log(item)
	//	console.log(arr)
		$rootScope.isGridRecodsShow = false;
		$rootScope.isView = true;
		$rootScope.condition = false;
		var prepopRecordsResponse = [];
		var reassignRecords=[];
		$localstorage.setObject("formId", item.FormId);
		$rootScope.saveButton = false;
		$rootScope.submitButton = false;
		$rootScope.prepopRecords = [];
		$rootScope.reassignRecords = [];
		if(arr!=0){
		angular.forEach(arr, function (objValue, objKey) {
			console.log(objValue)
			if (objValue.recordType=="new") {
				prepopRecordsResponse.push({
					recordName: JSON.parse(objValue.displayValues)+[],
					recordId: objValue.recordId,
					TaskId: objValue.TaskId,
					FormId: objValue.FormId,
					comments: objValue.comments,
					FormValues: objValue.FormValues
				});
			} else if (objValue.recordType=="reassign") {
				reassignRecords.push({
					recordName: JSON.parse(objValue.displayValues)+[],
					recordId: objValue.recordId,
					TaskId: objValue.TaskId,
					FormId: objValue.FormId,
					comments: objValue.comments,
					FormValues: objValue.FormValues,
					notifyStatus: true
				});
			}
			
			$scope.reassignRecords = reassignRecords;
			$scope.prepopRecords = prepopRecordsResponse;
		});
		}else{
			$scope.reassignRecords = [];
			$scope.prepopRecords = [];
		}

	},
	$scope.checkRecordsOnline = function (arr, value) {
	//	console.log(arr)
	//	console.log(value)
		var count = 0;
		for (var i = 0; i < arr.length; i++) {

			if (arr[i].prepopRecId.indexOf(value.recordId) == -1) {
			} else {
				count++;
			}
		}
		return count;
	}
	$scope.getTaskFormDetails = function () {
		hidemapIcon = true;
		commonService.LoaderShow(strings.pleasewait);
		var item = setGetObj.getTaskHisotryForm();
		$rootScope.TaskData = true;
		$localstorage.setObject("TaskId", item.TaskId);
		$rootScope.formname = item.FormName;
		$rootScope.saveButton = false;
		$rootScope.submitButton = false;
		$rootScope.hidecamera = false;
		$rootScope.hidebarcode = false;
		$rootScope.hidelocation = false;
		$rootScope.prepopDataShow = false;
		$rootScope.imgeasSet = {};
		$rootScope.sign = {};
		$rootScope.condition = false;
		if ($scope.status == true) {
			$scope.taskId = item.TaskId;
			commonService.LoaderShow(strings.loading);
			$scope.condition = false;
			$rootScope.isView = true;
			$rootScope.isGridRecodsShow = false;
			$rootScope.skeletonId = item.FormId;
			$state.transitionTo("sidemenu.viewForm");
		} else {
			$scope.getTaskFormOfflineSkeleton(item);
		}

	},
	$scope.getTaskFormOfflineSkeleton = function (item) {
		console.log(item)
		$rootScope.isView = true;
		$rootScope.prepopDataShow = false;
		$rootScope.isGridRecodsShow = false;
		$scope.formId = $localstorage.setObject("offlineFormId", item.FormId);
	/*	$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormSkeleton_table(FormId integer,Username text,id integer, FormName text ,FormSkeleton text)').then(function (res) {}, function (err) {});
		var query = 'SELECT * FROM FormSkeleton_table WHERE FormId=? ';
		$cordovaSQLite.execute(db, query, [item.FormId]).then(function (res) {
			var len = res.rows.length;
			for (var i = 0; i < len; i++) {
				var formSkeleton = JSON.parse(res.rows.item(i).FormSkeleton);
				var formid = res.rows.item(i).FormId;
				var formname = res.rows.item(i).FormName;
				$localstorage.setObject("offlineData", formSkeleton);
				$state.transitionTo("sidemenu.viewForm");

			}
		}, function (err) {
			alert(JSON.stringify(err));
		});*/
		
		$rootScope.skeletonId = item.FormId;
		$state.transitionTo("sidemenu.viewForm");
	},
	$scope.editTaskForm = function (item) {
		console.log(item);
		if ($scope.selectCheckBox) {
            $scope.toggleSelection(item.recordId);
        } else {
        	if(item.prepopRecId == ''){
            $rootScope.prepopDataShow = false;
            $rootScope.isHistoryChecked = !"reassign";
            $rootScope.imgeasSet = {};
            $rootScope.sign = {};
            $rootScope.button = "save";
            $rootScope.TaskData = false;
            $rootScope.isView = false;
            $rootScope.offlineReData = false;
            $rootScope.TaskData = true;
     //       $rootScope.hidecamera = false;
     //       $rootScope.hidebarcode = false;
     //       $rootScope.hidelocation = false;
            $localstorage.setObject("offlineRecordId", item.recordId);
        }else{
        	$rootScope.isHistoryChecked = false;
			$rootScope.prepopDataShow = false;
			$rootScope.isView = false;
			$rootScope.isHistoryChecked = "reassign";
			$rootScope.selectedFormRecordFields = {};
			$rootScope.isGridRecodsShow = true;
			$rootScope.skeletonId=item.FormId;
			$localstorage.setObject("TaskId", item.TaskId);
			$localstorage.setObject("offlineRecordId", item.recordId);
	    }
            if ($scope.status == true) {
            }
            else {
                $localstorage.setObject("formId", item.FormId);
            }
            $rootScope.condition = false;
            var RecordValues = JSON.parse(item.FormValues);
            var RecordData = RecordValues.record;
            $rootScope.selectedFormRecordFields = {};
            angular.forEach(RecordData, function (value, key) {
            //	console.log(value)
            //	console.log(key)

				if(value.sketching != undefined)
					$rootScope.sketchingData = value.sketching;

            	 angular.forEach(value, function (v, k) {
            	 //	console.log(v)
            	 //	console.log(k)
	            	if (k.includes("Video")) {
			$rootScope.config = {
				sources: [
					{src: $sce.trustAsResourceUrl(v), type: "video/mp4"},
				],
				theme: "lib/videogular-themes-default/videogular.css",
				plugins: {
					poster: "http://www.videogular.com/assets/images/videogular.png"
				}
			};

	            	}
            		else{
            			console.log("elseeeeeeeeeeeeeeeeeeeeeeeeeeee")
            		}
            	});
        //     commonService.resetSketchingData();
/*             angular.forEach(value.sketching, function (val, key) {
              commonService.setSketchingData(val);
             });
*/
                $rootScope.selectedFormRecordFields = value;
            });
            $rootScope.isGridRecodsShow = true;
            if ($scope.status == true) {
                $rootScope.skeletonId = item.FormId;
                $state.transitionTo("sidemenu.viewForm");
            } else {
                var query = 'SELECT * FROM FormSkeleton_table WHERE FormId=?';
                $cordovaSQLite.execute(db, query, [item.FormId]).then(function (res) {
                    var len = res.rows.length;
                    for (var i = 0; i < len; i++) {
                        var TaskFormValues = res.rows.item(i).FormSkeleton;

                        $rootScope.fields = JSON.parse(TaskFormValues);
                        $localstorage.setObject("offlineData", TaskFormValues);

                        $state.transitionTo("sidemenu.viewForm");
                    }
                }, function (err) {
                    alert(JSON.stringify(err));
                });
            }
        }
//    }
	},
	$scope.ViewTaskFormRecord = function (item) {
		console.log(item)
		$rootScope.condition = true;
		$scope.videoUrl='';
		$rootScope.skeletonId = item.FormId;
		$rootScope.prepopDataShow = false;
		$rootScope.TaskData = false;
		$rootScope.saveButton = true;
		$rootScope.submitButton = true;
		var url = config.url + "/api/v1/formszDetails/" + item.recordId;
		formsService.getRecords(url, securityHeaders, function (response) {
			console.log(response)
			var RecordValues = response.record;
			$rootScope.selectedFormRecordFields = {};
			angular.forEach(RecordValues, function (value, key) {
				angular.forEach(value, function (v, k) {
					if (k.includes("Video")) {
						$scope.videoUrl = config.url + "/api/v1/gridFS/getvideo/" + v
							console.log($rootScope.videoUrl);
					}
					$rootScope.selectedFormRecordFields[k] = v;
				});
			});
			//	console.log($scope.videoUrl)
			if ($scope.videoUrl) {
				$rootScope.config = {
					sources: [{
							src: $sce.trustAsResourceUrl($scope.videoUrl),
							type: "video/mp4"
						},
					],

					theme: "lib/videogular-themes-default/videogular.css",
					plugins: {
						poster: "http://www.videogular.com/assets/images/videogular.png"
					}
				};
			}
		});
		$rootScope.isGridRecodsShow = true;
		hidemapIcon = false;
		$state.transitionTo("sidemenu.viewForm");

	},

	$scope.getPrePoprecord = function (item) {
		console.log(item)
		hidemapIcon = true;
		$rootScope.selectedFormRecordFields = {};
		var user = $localstorage.getObject("username");
	//	$rootScope.hidecamera = false;
		$rootScope.imgeasSet = {};
		$rootScope.sign = {};
		$rootScope.prepopDataShow = true;
		if ($scope.status == true) {
			$rootScope.isView = false;
	//		$rootScope.saveButton = false;
	//		$rootScope.submitButton = false;
			$rootScope.TaskData = true;
			$rootScope.isGridRecodsShow = true;
			$rootScope.condition = false;
			$rootScope.formEllipse = true;
			$rootScope.skeletonId = item.FormId;
			$localstorage.setObject("TaskId", item.TaskId);
			var url = config.url + "/api/v1/formszDetails/getprePOPRecords/" + user + "/" + item.FormId + "/" + item.recordId;
			formsSave.getPrepopData(url, securityHeaders, function (response) {
				$localstorage.setObject("reassignedRecordId", item.recordId);
				$rootScope.selectedFormRecordFields = {};
				if (response.message) {}
				else {
					angular.forEach(response, function (value, key) {
						angular.forEach(value.prepopulatedData, function (recordValues, recordKeys) {
							angular.forEach(recordValues, function (v, k) {
								if (k.includes("Video")) {
									$scope.videoUrl = config.url + "/api/v1/gridFS/getvideo/" + v
									console.log($rootScope.videoUrl);
								}
								$rootScope.selectedFormRecordFields[k] = v;
			//					$rootScope.selectedFormRecordFields[k] = v;
							});
						});
						if ($scope.videoUrl) {
							$rootScope.config = {
								sources: [{
										src: $sce.trustAsResourceUrl($scope.videoUrl),
										type: "video/mp4"
									},
								],

								theme: "lib/videogular-themes-default/videogular.css",
								plugins: {
									poster: "http://www.videogular.com/assets/images/videogular.png"
								}
							};
						}
					});
				}
				$state.transitionTo("sidemenu.viewForm");
			});
			//		}
		} else {
			$scope.editPrepopulatedRecord(item);
		}

	},
	$scope.editPrepopulatedRecord = function (item) {
		//	console.log(item)
		var arr = [];
		$rootScope.isHistoryChecked = false;
		$rootScope.prepopDataShow = true;
		$rootScope.isView = false;
		$rootScope.selectedFormRecordFields = {};
		$rootScope.isGridRecodsShow = true;
		$rootScope.skeletonId = item.FormId;
		$localstorage.setObject("TaskId", item.TaskId);
		$localstorage.setObject("offlineRecordId", item.recordId);
		var query = "SELECT * FROM FormData_table WHERE recordId=?";
		$cordovaSQLite.execute(db, query, [item.recordId]).then(function (res) {
			for (var i = 0; i < res.rows.length; i++) {
				var obj = {};
				obj.recordId = res.rows.item(0).recordId;
				obj.formId = res.rows.item(0).FormId;
				obj.taskId = res.rows.item(0).TaskId;
				obj.record = res.rows.item(0).FormValues;
				arr.push(obj);
			}
			$scope.prepopRecValues = arr;
			console.log(arr)
			angular.forEach(arr, function (values, keys) {
				var prepopValues = JSON.parse(values.record);
				angular.forEach(prepopValues, function (v, k) {
					$rootScope.selectedFormRecordFields = v;
				});
				$state.transitionTo("sidemenu.viewForm");
			});

		}, function (err) {
				alert(JSON.stringify(err));
			});
	},
	$scope.backToOfflineTaskForms = function () {
		$state.go("sidemenu.taskformhistory");
	},
	$scope.backToTaskForms = function () {
	if ($rootScope.notificationsAddress) {
			$rootScope.notificationsAddress = false;
			$state.go('sidemenu.tabs.notifications');
		} else {
			$state.go("sidemenu.taskforms");
		}
	},
	$scope.checkAll = function () {
		$scope.closePopover();
		if ($scope.offlineTaskformhistory.length == 0) {
			alertService.showToast(strings.norecords);
		} else {
			$scope.addrecordicon = false;
			$scope.task_action_header = false;
			$scope.select_hide = true;
			$scope.selectCheckBox = true;
			$scope.select_all_hide = true;
			$scope.select_hide = true;
			$scope.taskMapAllowed = false;
			$scope.header_delete_hide = false;
			if ($scope.status == true) {
				$scope.header_sync_hide = false;
			} else {
				$scope.header_sync_hide = true;
			}
			$scope.clear_hide = false;

            angular.forEach($scope.offlineTaskformhistory, function (item) {
                $scope.toggleSelection(item.recordId);
            });
		}
	},
	$scope.checkRecord = function () {
		$scope.closePopover();
		$scope.header_delete_hide = true;
		$scope.header_sync_hide = true;
		if ($scope.offlineTaskformhistory.length == 0) {
			alertService.showToast(strings.norecords);

		} else {
			$scope.addrecordicon = false;
			$scope.task_action_header = false;
			$scope.selectCheckBox = true;
			$scope.taskMapAllowed = false;
			if ($scope.status == true) {
			} else {
				$scope.header_sync_hide = true;
			}
		}
	},
	$scope.clearSelection = function () {
		$scope.closePopover();
		$scope.task_action_header = true;
		$scope.select_hide = false;
		$scope.header_delete_hide = true;
		$scope.header_sync_hide = true;
		$scope.select_all_hide = false;
		$scope.clear_hide = true;
        $scope.selectCheckBox = false;
        $scope.selection = [];
	},
	$scope.deleteAllRecords = function (selection) {
		$ionicPopup.confirm({
			title : 'Confirmation',
			template : 'Are you sure you want to Delete the Selected Records?'
		}).then(function (res) {
			if (res) {
				console.log(selection)
				//	$scope.deleteRecord(selection);
				deleteEditedAddress(selection)
				}
		});
	},
	function deleteEditedAddress  (selection) {
	//	if (updatedRecIds.length != 0) {
			var convertArray = "('" + selection + "')";
			var arr = convertArray.replace(/,/g, "','")
				var query = "DELETE FROM FormData_table WHERE recordId IN " + arr
				$cordovaSQLite.execute(db, query).then(function (res) {
				$rootScope.$broadcast('clearselection');
				}, function (err) {
					alert(JSON.stringify(err));
				});
	//	}
	}
	$scope.syncOfflineForm = function (item) {

		if ($scope.selectCheckBox) {
			/* sync selected records */
			
			for (var i = 0; i < item.length; i++) {
				(function (x) {
					var query = "SELECT * FROM FormData_table WHERE uniqueID=? AND FormStatus='saved';";
					$cordovaSQLite.execute(db, query, [item[i]]).then(function (res) {
						var obj = {};
						var isValid = res.rows.item(0).isRequired;
						var uid = res.rows.item(0).uniqueID;
						var FormId = res.rows.item(0).FormId;
						var FormStatus = res.rows.item(0).FormStatus;
						var taskId = res.rows.item(0).TaskId;
						var formvalues = res.rows.item(0).FormValues;
						var recordId = res.rows.item(0).recordId;
						var isVideoAvailable = res.rows.item(0).isVideoAvailable;
						obj.taskId = taskId;
						obj.formId = FormId;
						obj.record = JSON.parse(formvalues).record;
						obj.updatedBy = $localstorage.getObject("username");
						obj.generatedId = Date.now();
						var datenow = new Date();
						var isoDate = datenow.toISOString();
						obj.updatedTime = isoDate;
						obj.UUID=$localstorage.getObject("deviceInfo").uuid;
						console.log(res.rows.item(0).isVideoAvailable)
						if (isVideoAvailable) {
						var videoOptions = res.rows.item(0).videoOptions;
						var videoPath = res.rows.item(0).videoPath;
							if (videoOptions == null ||videoOptions == '') {
								console.log("///////////////////////")
								if (isValid == "true") {
									console.log(i)
									console.log(item.length)
									if(recordId==''){
									var url = config.url + "/api/v1/formszDetails/create";
									formsSave.saveForm(url, obj, securityHeaders, function (response) {
										if (response.status == 200) {
											var query = "DELETE FROM FormData_table WHERE uniqueID=?";
											$cordovaSQLite.execute(db, query, [uid]).then(function (res) {
												$ionicListDelegate.closeOptionButtons();
												$scope.refreshOfflineRecords();
											}, function (err) {
												alert(JSON.stringify(err));
											});
										}
									});
								}else{
									var url = config.url + "/api/v1/formszDetails/" + recordId;
									formsSave.saveReassignedForm(url, obj, securityHeaders, function (response) {
										if (response.status == 204) {
											commonService.Loaderhide();
											alertService.doAlert(response.message);
										} else {
											var query = "DELETE FROM FormData_table WHERE recordId=?";
											$cordovaSQLite.execute(db, query, [recordId]).then(function (res) {}, function (err) {
												alert(JSON.stringify(err));
											});
										/*alertService.doAlert(strings.submitted, function (res) {
											$ionicListDelegate.closeOptionButtons();

											$scope.refreshOfflineRecords();
											$state.transitionTo("sidemenu.taskformhistory");
										});*/
										}
									});
								}
								} else {
									$ionicListDelegate.closeOptionButtons();
									alertService.showToast("unable to submit few records as mandatory fields are not filled");
									$scope.clearSelection();
								}
							} else {
								var videoUrl = config.url + "/api/v1/gridFS/addvideo/";
								if(recordId=''){
									var url = config.url + "/api/v1/formszDetails/create";
									promisingMethods.createRecord(url, obj, securityHeaders).then(function (result) {
										console.log(result)
										promises.push(result)
									});
								}else{
									promisingMethods.updatePrepopRecord(obj, securityHeaders).then(function (result) {
										console.log(result)
										promises.push(result)
									});
								}
								promisingMethods.uploadVideo(videoUrl, videoPath, JSON.parse(videoOptions), obj.generatedId).then(function (result) {
									console.log(result)
									promises.push(result)
									var query = 'DELETE FROM FormData_table WHERE uniqueID=?';
									$cordovaSQLite.execute(db, query, [uid]).then(function (res) {
										$scope.clearSelection();
									});
									
								});
								$q.all(promises).then(function (result) {
									console.log(result)
									var query = 'DELETE FROM FormData_table WHERE uniqueID=?';
									$cordovaSQLite.execute(db, query, [uid]).then(function (res) {});
									commonService.Loaderhide();
									
								});
							}
						} else {
							if (isValid == "true") {
								if(recordId==''){
									var url = config.url + "/api/v1/formszDetails/create";
									$scope.createService(url,obj,item);


								}else{
									putService(obj,recordId)
								}
								/*formsSave.saveForm(url, obj, securityHeaders, function (response) {
									if (response.status == 200) {
										var query = "DELETE FROM FormData_table WHERE uniqueID=?";
										$cordovaSQLite.execute(db, query, [uid]).then(function (res) {
											$ionicListDelegate.closeOptionButtons();
											$scope.refreshOfflineRecords();
										}, function (err) {
											alert(JSON.stringify(err));
										});
									}
								});*/
							} else {
								$ionicListDelegate.closeOptionButtons();
								alertService.showToast("unable to submit few records as mandatory fields are not filled");
								$scope.clearSelection();
							}
						}
					}, function (err) {
						alert(JSON.stringify(err));
					});
				})(i);

			}
			alertService.doAlert(strings.submitted, function (res) {
				$ionicListDelegate.closeOptionButtons();
				$scope.clearSelection();
				$state.transitionTo("sidemenu.taskformhistory");
			});

		} else {
			console.log("individual record")
			console.log(item)
			/* sync individual record */
			var query = "SELECT * FROM FormData_table WHERE FormId=? AND uniqueID=? AND FormStatus='saved';";
			$cordovaSQLite.execute(db, query, [item.FormId, item.recordId]).then(function (res) {
				var len = res.rows.length;
				if (len == 0) {
					alertService.doAlert(strings.nodata, function (res) {
						$ionicListDelegate.closeOptionButtons();
					});
				} else {
					var url = config.url + "/api/v1/formszDetails/create/";
					var obj = {};

					for (var i = 0; i < len; i++) {
						var isValid = res.rows.item(i).isRequired;
						var formvalues = res.rows.item(i).FormValues;
						var uid = res.rows.item(i).uniqueID;
				//		var FormId = res.rows.item(i).FormId;
						var taskId = res.rows.item(0).TaskId;
						var FormStatus = res.rows.item(i).FormStatus;
						var videoOptions = res.rows.item(i).videoOptions;
						var videoPath = res.rows.item(i).videoPath;
						var recordId = res.rows.item(i).recordId;
						var isVideoAvailable = res.rows.item(i).isVideoAvailable;
						obj.taskId = taskId;
						obj.formId = item.FormId;
						obj.record = JSON.parse(formvalues).record;
						obj.updatedBy = $localstorage.getObject("username");
						obj.generatedId = Date.now();
						obj.UUID=$localstorage.getObject("deviceInfo").uuid;
						var datenow = new Date();
						var isoDate = datenow.toISOString();
						obj.updatedTime = isoDate;
						obj.updatedBy = $localstorage.getObject("username");
						console.log(videoOptions)
						console.log(res.rows.item(i).recordId)
						if (isVideoAvailable) {
							if ( videoOptions == null ||videoOptions == '') {
								console.log("///////////////////////")
								if (isValid == "true") {
								if(recordId==''){
									$scope.createService(url,obj,item,uid);

								}else{
									putService(obj,recordId);
								}
								} else {
									$ionicListDelegate.closeOptionButtons();
									alertService.showToast("unable to submit record as mandatory fields are not filled");
									$scope.clearSelection();
								}
							} else {
								var videoUrl = config.url + "/api/v1/gridFS/addvideo/";
								promisingMethods.createRecord(url, obj, securityHeaders).then(function (result) {
									console.log(result)
									promises.push(result)
								});
								promisingMethods.uploadVideo(videoUrl, videoPath, JSON.parse(videoOptions), obj.generatedId).then(function (result) {
									console.log(result)
									promises.push(result)
								});
								$q.all(promises).then(function (result) {
									console.log(result)
									var query = 'DELETE FROM FormData_table WHERE uniqueID=?';
									$cordovaSQLite.execute(db, query, [uid]).then(function (res) {});
									commonService.Loaderhide();
									alertService.doAlert(strings.submitted, function (res) {
										$state.transitionTo("sidemenu.taskformhistory");
									});

								});
							}
						} else {
							if (isValid == "true") {
							//	createService(url,obj,item);
							if(recordId==''){
									$scope.createService(url,obj,item,uid);

								}else{
									putService(obj,recordId);
								}
								/*formsSave.saveForm(url, obj, securityHeaders, function (response) {
									commonService.Loaderhide();

									if (response.status == 200) {
										var query = "DELETE FROM FormData_table WHERE uniqueID=?";
										$cordovaSQLite.execute(db, query, [item.recordId]).then(function (res) {}, function (err) {
											alert(JSON.stringify(err));
										});
										alertService.doAlert(strings.submitted, function (res) {
											$ionicListDelegate.closeOptionButtons();

											$scope.refreshOfflineRecords();
											$state.transitionTo("sidemenu.taskformhistory");
										});
									}

								});*/
							} else {
								$ionicListDelegate.closeOptionButtons();
								alertService.showToast("unable to submit record as mandatory fields are not filled");
								$scope.clearSelection();
							}
						} // video field not available
					}
				} //else
			}, function (err) {
				alert(JSON.stringify(err));
			});
		}
	},
	$scope.createService=function(url,obj,item,uid){
		console.log(item)
		formsSave.saveForm(url, obj, securityHeaders, function (response) {
			commonService.Loaderhide();

			if (response.status == 200) {
				var query = "DELETE FROM FormData_table WHERE uniqueID=?";
				$cordovaSQLite.execute(db, query, [uid]).then(function (res) {}, function (err) {
					alert(JSON.stringify(err));
				});
				alertService.doAlert(strings.submitted, function (res) {
					$ionicListDelegate.closeOptionButtons();

					$scope.refreshOfflineRecords();
					$state.transitionTo("sidemenu.taskformhistory");
				});
			}

		});
	}
	function putService(obj,recordId){
		var url = config.url + "/api/v1/formszDetails/" + recordId;
		formsSave.saveReassignedForm(url, obj, securityHeaders, function (response) {
//			deferred.resolve(response); 
			if (response.status == 204) {
				commonService.Loaderhide();
				alertService.doAlert(response.message);
			} else {
				var query = "DELETE FROM FormData_table WHERE recordId=?";
				$cordovaSQLite.execute(db, query, [recordId]).then(function (res) {}, function (err) {
					alert(JSON.stringify(err));
				});
			alertService.doAlert(strings.submitted, function (res) {
				$ionicListDelegate.closeOptionButtons();

				$scope.refreshOfflineRecords();
				$state.transitionTo("sidemenu.taskformhistory");
			});
			}
		});
	}
	$scope.syncAllOfflineForm = function (selection) {
		$ionicPopup.confirm({
			title : 'Confirmation',
			template : 'Submit the Selected Records?'
		}).then(function (res) {
			if (res) {
					$scope.syncOfflineForm(selection);
				}
		});
	},
	$scope.deleteRecord = function (item) {
		commonService.LoaderShow(strings.Deleting);
		/* delete selected records */
		if ($scope.selectCheckBox) {
			for (var i = 0; i < item.length; i++) {
				$cordovaSQLite.execute(db, "DELETE FROM FormData_table WHERE uniqueID=?", [item[i]])
				.then(function (res) {
					commonService.Loaderhide();
				}, function (err) {
					alert(JSON.stringify(err));
				});
			}
			alertService.doAlert(strings.selectedRecordDelete, function (res) {
				$ionicListDelegate.closeOptionButtons();
				$scope.refreshOfflineRecords();
				$state.transitionTo("sidemenu.taskformhistory");
			});

		} else {
			/*delete individual record*/

			var query = "SELECT * FROM FormData_table WHERE uniqueID=?";
			$cordovaSQLite.execute(db, query, [item.recordId]).then(function (res) {
				if (res.rows.length > 0) {
					$cordovaSQLite.execute(db, "DELETE FROM FormData_table WHERE uniqueID=?", [item.recordId])
					.then(function (res) {
						commonService.Loaderhide();
						alertService.doAlert(strings.recordDelete, function (res) {
							$ionicListDelegate.closeOptionButtons();
							$scope.refreshOfflineRecords();
							$state.transitionTo("sidemenu.taskformhistory");
						});

					}, function (err) {
						alert(JSON.stringify(err));
					});
				}

			}, function (err) {
				alert(JSON.stringify(err));
			});

		}
	};
	$scope.refreshOfflineRecords = function () {
		if (filterBarInstance) {
			filterBarInstance();
			filterBarInstance = null;
		}
		$scope.Tformhistory();
	//	var item = setGetObj.getTaskHisotryForm();
	//	$rootScope.TaskFormsHistoryOffline(item);
		$timeout(function () {
	//		$scope.Tformhistory();

			$scope.$broadcast('scroll.refreshComplete');
		}, 1000);

        $scope.clearSelection();
	};

});

app.filter('recFilter',function(){
	return function(input,option){
    	if(option == 'All'){
        	return input;
        }
        else{
        	var output =[];
            angular.forEach(input,function(value,key){
            	console.log(value);
                if(value.recordType == option){
                    output.push(value);
                }
            });
        	return output;
        }
    }
});
