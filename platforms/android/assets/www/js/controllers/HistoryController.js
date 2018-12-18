var app = angular.module('starter.controllers')
.controller('HistoryCtrl', function ($scope, $rootScope, config, $state, setGetObj, $ionicPopup, $cordovaSQLite, $timeout, $ionicFilterBar, commonService, $localstorage, formsService, $ionicPopover, formsSave, alertService, strings, commonMethod, $ionicListDelegate,$ionicModal,$cordovaPrinter) {
	$scope.forms_action_header = true;
	$rootScope.prepopDataShow = false;
	$scope.optionStatus = "true";
	securityHeaders.headers = commonService.securityHeaders();
	if ($state.current.name === 'app.history') {
		$rootScope.isHistoryChecked = false;
	}
	$ionicPopover.fromTemplateUrl('templates/historyPopover.html', {
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

	// Code to Open the filter records by type popup
	$scope.openPopUp = function () {
		$scope.popup.show();
	};
	$scope.closePopUp = function () {
		$scope.popup.hide();
	};

	$ionicModal.fromTemplateUrl('my-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	 	}).then(function(modal) {
	    	$scope.modal = modal;
	});
  
	$scope.openModal = function() {
	    $scope.modal.show();
	};
	$scope.closeModal = function() {
	    $scope.modal.hide();
	};

	$scope.applyFilter = function(){
		$scope.statusType = $scope.store;
	}

    $scope.GetSelectedType = function(val){
		console.log(val);
		$scope.store= val;
	}

	$scope.clear_hide = true;
	$scope.selection = [];


	$scope.openModal = function () {
		$scope.modal.show();
	};
	$scope.closeModal = function () {
		$scope.modal.hide();
	};

	$scope.clear_hide = true;
	$scope.selection = [];

	console.log($scope.selection);

	$scope.toggleSelection = function (recordId) {
		var idx = $scope.selection.indexOf(recordId);
		// is currently selected
		if (idx > -1) {
			$scope.selection.splice(idx, 1);
			if ($scope.selection.length == 0) {
				$scope.header_delete = true;
				$scope.heder_sync = true;
			} else {
				$scope.header_delete = false;
				if ($scope.status == true) {
					$scope.heder_sync = false;
				} else {
					$scope.heder_sync = true;
				}
			}
		}
		// is newly selected
		else {
			$scope.selection.push(recordId);
			$scope.header_delete = false;
			if ($scope.status == true) {
				$scope.heder_sync = false;
			} else {
				$scope.heder_sync = true;
			}
		}

	};

	$scope.status = commonService.checkConnection();
	var filterBarInstance;

	if ($scope.status == true) {
		$scope.form_history_hide = false;
		if ($rootScope.isHistoryChecked) {
			$scope.ViewOnlineRecord = false;
			$scope.sync_hide = true;
			$scope.delete_hide = true;
			$scope.edit_hide = true;
			//		$scope.hide_ellipse = true;

		} else {
			$scope.ViewOnlineRecord = true;
		}
	} else {
		$scope.form_history_hide = true;
		$scope.sync_hide = true;
		$scope.ViewOnlineRecord = true;
		$scope.heder_sync = true;
	}

	// $scope.getOfflineForms = function () {
	// 	$scope.forms_action_header = true;
	// 	var item = setGetObj.getHistoryOfForms();
	// 	$rootScope.TaskData = false;
	// 	$rootScope.isHistoryChecked = false;
	// 	$rootScope.isView = false;
	// 	$scope.header_delete_hide = true;
	// 	$scope.header_sync_hide = true;
	// 	$rootScope.formname = item.FormName;
	// 	var userId = $localstorage.getObject("userId");
	// 	var user = $localstorage.getObject("username");
	// 	$localstorage.setObject("formId", item.id);
	// 	$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS FormData_table(uniqueID integer primary key autoincrement,FormId integer,userId integer ,FormValues text,FormStatus text,TaskId text,recordId text,isRequired text)").then(function (res) {}, function (err) {});
	// 	var query = 'SELECT * FROM FormData_table WHERE FormId=? and userId=? and FormStatus="false" and TaskId="form";';
	// 	$cordovaSQLite.execute(db, query, [item.id, userId]).then(function (res) {
	// 		var len = res.rows.length;
	// 		var arr = [];
	// 		for (var i = 0; i < len; i++) {
	// 			var obj = {};
	// 			obj.FormId = res.rows.item(i).FormId;
	// 			obj.userId = res.rows.item(i).userId;
	// 			obj._id = res.rows.item(i).uniqueID;
	// 			obj.records = res.rows.item(i).FormValues;
	// 			obj.formName = item.FormName;
	// 			arr.push(obj);
	// 		}
	// 		$scope.historyFormObjects = arr;
	// 		var items = [];
	// 		try {
	// 			for (var x = 0; x < $scope.historyFormObjects.records.length; x++) {
	// 				items.push({
	// 					recordId : x + 1,
	// 					FormValues : $scope.historyFormObjects.records[x]
	// 				});
	// 			}
	// 		} catch (err) {
	// 			for (var x = 0; x < $scope.historyFormObjects.length; x++) {
	// 				$localstorage.setObject("offlineFormId", $scope.historyFormObjects[x].FormId);
	// 				items.push({
	// 					recordId : $scope.historyFormObjects[x]._id,
	// 					FormId : $scope.historyFormObjects[x].FormId,
	// 					FormValues : $scope.historyFormObjects[x].records
	// 				});
	// 			}

	// 		}

	// 		$scope.offlineitems = items;
	// 		commonService.Loaderhide();
	// 		$state.transitionTo("app.history");
	// 	}, function (err) {
	// 		alert(JSON.stringify(err));
	// 	});
	// },
	$scope.statusFilter = ["All","Saved","New","Reassigned"];

	$scope.getOfflineForms = function () {
		$scope.forms_action_header = true;
		var item = setGetObj.getHistoryOfForms();
		$rootScope.TaskData = false;
		$rootScope.isHistoryChecked = false;
		$rootScope.isView = false;
		$scope.header_delete_hide = true;
		$scope.header_sync_hide = true;
		$rootScope.formname = item.FormName;
		var userId = $localstorage.getObject("userId");
		var user = $localstorage.getObject("username");
		$localstorage.setObject("formId", item.id);
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS FormData_table(uniqueID integer primary key autoincrement,FormId integer,userId integer ,FormValues text,FormStatus text,TaskId text,recordId text,isRequired text)").then(function (res) {}, function (err) {});
		var query = 'SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId="form";';
		$cordovaSQLite.execute(db, query, [item.id, userId]).then(function (res) {
			var len = res.rows.length;
			var arr = [];
			var items = [];

			for (var i = 0; i < len; i++) {
				var obj = {};
				obj.FormId = res.rows.item(i).FormId;
			//	obj.FormStatus = res.rows.item(i).FormStatus;
				obj.userId = res.rows.item(i).userId;
				obj._id = res.rows.item(i).uniqueID;
				obj.records = res.rows.item(i).FormValues;
				obj.formName = item.FormName;
				console.log(res.rows.item(i).FormStatus);
				if(res.rows.item(i).FormStatus="false"){
					obj.status="Saved";
				}else{

					obj.status="reassign"
				}
				arr.push(obj);
			}
		//	$scope.historyFormObjects = arr;
			for (var x = 0; x < arr.length; x++) {
				$localstorage.setObject("offlineFormId", arr[x].FormId);
				items.push({
					recordId : arr[x]._id,
					FormId : arr[x].FormId,
					FormValues : arr[x].records,
					Status:arr[x].status
				});
			}
			$scope.offlineitems = items;
			$scope.orderList = "Saved";
			console.log($scope.offlineitems);
			commonService.Loaderhide();
			$state.transitionTo("app.history");
		}, function (err) {
			alert(JSON.stringify(err));
		});
	}

	$scope.getOnlineItems = function () {
		$scope.items = $rootScope.historyObjects;
	},

	$scope.getListOfRecords = function () {
		commonService.LoaderShow(strings.loading);
		$scope.closePopover();
		var id = $localstorage.getObject("formId");
		$scope.header_delete_hide = true;
		$scope.header_sync_hide = true;
		$rootScope.hidecamera = true;
		$rootScope.hidebarcode = true;
		$rootScope.hidelocation = true;

		$rootScope.skeletonId = id;
		var user = $localstorage.getObject("username");
		if ($scope.status == true) {
			var items = [];
			$rootScope.isHistoryChecked = true;
			var url = config.url + "/api/v1/formszDetails/" + id + "/" + user + "/form";
			formsService.getRecords(url, securityHeaders, function (response) {
				$rootScope.formname = response.formName;

				angular.forEach(response.data, function (res) {
					var finalDisplay = "";
					var flag = true;
					angular.forEach(res.displayFields, function (value, key) {
						if (res.displayFields.length == 1) {
							items.push({
								recordId : res.recordId,
								FormValues : value.filedValue
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
								recordId : res.recordId,
								FormValues : finalDisplay
							});
						}
						//alert(finalDisplay);
					});
				});
				commonService.Loaderhide();
				$rootScope.historyObjects = items;
				$state.transitionTo("app.onlinehistory");
			});
		}
	},
	$scope.getFormDetails = function () {
		hidemapIcon = true;
		var id = $localstorage.getObject("formId");
		$localstorage.setObject("offlineFormId", id);
		$rootScope.imgeasSet = {};
		$rootScope.sign = {};
		$rootScope.condition = false;
		$rootScope.isView = true;
		$rootScope.isHistoryChecked = false;
		$rootScope.isGridRecodsShow = false;
		$rootScope.saveButton = false;
		$rootScope.submitButton = false;
		$rootScope.hidecamera = false;
		$rootScope.hidebarcode = false;
		$rootScope.hidelocation = false;
		$scope.status = commonService.checkConnection();
		commonService.LoaderShow(strings.loading);
		if ($scope.status == true) {
			if (formskeletonStorage.length > 0) {
				commonService.LoaderShow(strings.loading);
				angular.forEach(formskeletonStorage, function (value, key) {

					if (value.formId == id) {
						$scope.formSkeleton = value.formSkeleton;
						$scope.formId = value.formId;
						$localstorage.setObject("formId", $scope.formId);
						$localstorage.setObject("data", $scope.formSkeleton);
						$state.transitionTo("sidemenu.viewForm");
					} else {
						$rootScope.skeletonId = id;
						$state.transitionTo("sidemenu.viewForm");
					}
				});
			} else {
				$rootScope.skeletonId = id;

				// abhilash commented previous code was app.viewform
			 //    $state.transitionTo("app.viewForm");

				$state.transitionTo("sidemenu.viewForm");
			}
		} else {
			$scope.viewOfflineForm(id);
		}
	},
	$scope.viewOfflineForm = function (id) {
		//		$rootScope.TaskData = !false;
		$rootScope.isView = true;
		$scope.formId = $localstorage.setObject("offlineFormId", id);
		$localstorage.setObject("hTaskId", "form");
		$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormSkeleton_table(FormId integer,Username text,id integer, FormName text ,FormSkeleton text)').then(function (res) {}, function (err) {});
		var query = 'SELECT * FROM FormSkeleton_table WHERE FormId=? ';
		$cordovaSQLite.execute(db, query, [id]).then(function (res) {
			var len = res.rows.length;
			for (var i = 0; i < len; i++) {
				var formSkeleton = JSON.parse(res.rows.item(i).FormSkeleton);
				var formid = res.rows.item(i).FormId;
				var formname = res.rows.item(i).FormName;
				$localstorage.setObject("offlineData", formSkeleton);
				$state.transitionTo("app.viewForm");

			}
		}, function (err) {
			alert(JSON.stringify(err));
		});
	},
 	/**
     * @desc 
       storing sketching data to common service variable to see the sketching when we are in offline mode  
     * @modified by Santhosh Kumar Gunti
 	*/

	$scope.editOfflineForm = function (item) {
		if ($scope.selectCheckBox) {
            $scope.toggleSelection(item.recordId);
		} else {
            $rootScope.TaskData = false;
            $rootScope.isHistoryChecked != "reassign";
            $rootScope.imgeasSet = {};
            $rootScope.sign = {};
            $rootScope.hidecamera = false;
            $rootScope.hidebarcode = false;
            $rootScope.hidelocation = false;
            $rootScope.condition = false;
            $rootScope.saveButton = false;
            $rootScope.submitButton = false;
            $rootScope.offlineReData = false;
            $localstorage.setObject("offlineRecordId", item.recordId);
            var recordId = $localstorage.getObject("offlineRecordId");
            var RecordValues = JSON.parse(item.FormValues);
            var RecordData = RecordValues.record;
            $rootScope.selectedFormRecordFields = {};
            console.log(RecordData);
            angular.forEach(RecordData, function (value, key) {
                $rootScope.selectedFormRecordFields = value;
//            	commonService.resetSketchingData();
	            angular.forEach(value.sketching, function (val, key) {
	            	commonService.setSketchingData(val);
	            });

                setGetObj.setHisotryForm(value);
            });
            $rootScope.isGridRecodsShow = true;
            if ($scope.status == true) {
                $rootScope.skeletonId = item.FormId;
                $state.transitionTo("app.viewForm");
            } else {
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormSkeleton_table(FormId integer,Username text,id integer, FormName text ,FormSkeleton text)').then(function (res) {
                    var query = 'SELECT * FROM FormSkeleton_table WHERE FormId=?';
                    $cordovaSQLite.execute(db, query, [item.FormId]).then(function (res) {
                        var len = res.rows.length;
                        for (var i = 0; i < len; i++) {
                            var FormValues = res.rows.item(i).FormSkeleton;
                            $rootScope.fields = JSON.parse(FormValues);
                            $state.transitionTo("app.viewForm");
                        }
                    }, function (err) {
                        alert(JSON.stringify(err));
                    });
                }, function (err) {
                });
            }
        }
	},

	$scope.viewRecord = function (item) {
		hidemapIcon = false;
		$rootScope.imgeasSet = {};
		$rootScope.sign = {};
		$rootScope.condition = true;
		$rootScope.formEllipse = true;
		var url = config.url + "/api/v1/formszDetails/" + item.recordId;
		formsService.getRecords(url, securityHeaders, function (response) {
			var RecordValues = response.record;
			$rootScope.selectedFormRecordFields = {};
			angular.forEach(RecordValues, function (value, key) {
				angular.forEach(value, function (v, k) {
					$rootScope.selectedFormRecordFields[k] = v;
				});
			});
			$rootScope.isGridRecodsShow = true;
			$state.transitionTo("app.viewForm");
		});
	},
	/*
@developer :Santhosh Kumar Gunti
TPCL customization
changed transition from tabs to sidemenu
*/
	$scope.back = function () {
		if ($rootScope.isHistoryChecked) {
			$state.transitionTo("app.history");
		} else {
			$state.transitionTo("sidemenu.tabs.forms");
		}
	},
	$scope.modalClose = function(){
		$scope.closeModal();
	}
	$scope.backToHeader = function () {
		$scope.forms_action_header = true;
	},

	$scope.checkAll = function () {
		$scope.closePopover();
		if ($scope.offlineitems.length == 0) {
			alertService.showToast(strings.norecords);
		} else {
			$scope.optionStatus = "false";
			$scope.header_delete = false;
			if ($scope.status == true) {
				$scope.heder_sync = false;
			} else {
				$scope.heder_sync = true;
			}
			$scope.forms_action_header = false;
			$scope.select_hide = true;
			$scope.selectCheckBox = true;
			$scope.select_all_hide = true;
			$scope.work_instruction_hide = true;
			$scope.select_hide = true;
			angular.forEach($scope.offlineitems, function (item) {
                $scope.toggleSelection(item.recordId);
			});
		}
	},

	$scope.checkRecord = function () {
		$scope.closePopover();
		if ($scope.offlineitems.length == 0) {
			alertService.showToast(strings.norecords);
		} else {
			$scope.optionStatus = "false";
			$scope.forms_action_header = false;
			$scope.closePopover();
			$scope.header_delete = true;
			$scope.heder_sync = true;
            $scope.selectCheckBox = true;
		}

	},
	$scope.clearSelection = function () {
		$scope.closePopover();
		$scope.forms_action_header = true;
		$scope.select_hide = false;
		$scope.select_all_hide = false;
		$scope.work_instruction_hide = false;
		$scope.clear_hide = true;
		$scope.selectCheckBox = false;
        $scope.selection = [];
	},

	$scope.syncOfflineForm = function (item) {
		var isFormExist = false;
		var FormId = $localstorage.getObject("offlineFormId");
		if ($scope.selectCheckBox) {
			/* sync selected records */
			var url = config.url + "/api/v1/formszDetails/create/";
			for (var i = 0; i < item.length; i++) {
				if (!isFormExist) {
					(function (x) {
						var query = "SELECT * FROM FormData_table WHERE FormId=? AND uniqueID=? AND FormStatus='false';";
						$cordovaSQLite.execute(db, query, [FormId, item[i]]).then(function (res) {
							var obj = {};
							var isValid = res.rows.item(0).isRequired;
							var formvalues = res.rows.item(0).FormValues;
							var uid = res.rows.item(0).uniqueID;
							var FormId = res.rows.item(0).FormId;
							var taskId = res.rows.item(0).TaskId;
							var FormStatus = res.rows.item(0).FormStatus;
							obj.taskId = taskId;
							obj.formId = FormId;
							obj.record = JSON.parse(formvalues).record;
							obj.updatedBy = $localstorage.getObject("username");
							if (isValid == "true") {
								formsSave.saveForm(url, obj, securityHeaders, function (response) {

									if (response.status == 200) {
										var query = "DELETE FROM FormData_table WHERE uniqueID=?";
										$cordovaSQLite.execute(db, query, [uid]).then(function (res) {
											$ionicListDelegate.closeOptionButtons();
											$scope.refreshItems();
										}, function (err) {
											alert(JSON.stringify(err));
										});
									}
								});
							} else {
                                $ionicListDelegate.closeOptionButtons();
								alertService.showToast("unable to submit few records as mandatory fields are not filled");
								$scope.clearSelection();
							}
						}, function (err) {
							alert(JSON.stringify(err));
						});
					})(i);
				}
			}
			if (!isFormExist) {
				alertService.doAlert(strings.submitted, function (res) {
					$ionicListDelegate.closeOptionButtons();
					$state.transitionTo("app.history");
				});

			}

		} else {
			/* sync individual record */
			var query = "SELECT * FROM FormData_table WHERE FormId=? AND uniqueID=? AND FormStatus='false';";
			$cordovaSQLite.execute(db, query, [FormId, item.recordId]).then(function (res) {
				var len = res.rows.length;
				if (len == 0) {
					alertService.doAlert(strings.nodata);
				} else {
					var url = config.url + "/api/v1/formszDetails/create/";
					var obj = {};

					for (var i = 0; i < len; i++) {
						var isValid = res.rows.item(i).isRequired;
						var formvalues = res.rows.item(i).FormValues;
						var uid = res.rows.item(i).uniqueID;
						var FormId = res.rows.item(i).FormId;
						var FormStatus = res.rows.item(i).FormStatus;
						var taskId = res.rows.item(i).TaskId;
						obj.taskId = taskId;
						obj.formId = FormId;
						obj.record = JSON.parse(formvalues).record;
						obj.updatedBy = $localstorage.getObject("username");
						if (isValid == "true") {
							formsSave.saveForm(url, obj, securityHeaders, function (response) {
								if (response.status == 200) {
									var query = "DELETE FROM FormData_table WHERE uniqueID=?";
									$cordovaSQLite.execute(db, query, [item.recordId]).then(function (res) {}, function (err) {
										alert(JSON.stringify(err));
									});

									alertService.doAlert(strings.submitted, function (res) {
                                        $scope.refreshItems();
									    $state.transitionTo("app.history");
                                    });
								}

							});
						} else {
                            $ionicListDelegate.closeOptionButtons();
							alertService.showToast("unable to submit record as mandatory fields are not filled");
							$scope.clearSelection();
						}
					}

				} //else
			}, function (err) {
				alert(JSON.stringify(err));
			});
		}
	},
	$scope.syncAllOfflineForm = function (selection) {
		$ionicPopup.confirm({
			title : 'Confirmation',
			template : 'Submit the Selected Records?'
		}).then(function (res) {
			if (res) {
                $scope.syncOfflineForm(selection);
            } else {}
		});
	},

	// Email record to admin @phani
	$scope.emailRecords = function(item){
		console.log(item);
		//commonService.LoaderShow(strings.loading);
    	var url = config.url + "/api/v1/formszDetails/generatePDF";
		var obj = {};
		obj.formid = $localstorage.getObject("formId");
		var records = [];
		records.push(item.recordId);
		obj.records = records;
		obj.altemail = $localstorage.getObject("emailId");
		console.log(obj);
    	formsSave.emailRecords(url, obj, securityHeaders, function (response) {
			if (response.status == 200) {
				console.log(response);
				alertService.showToast(""+response.message+"");
			}
			else{
				alertService.showToast("Something went wrong!");
			}
		});
	}

	$scope.refreshItems = function () {

		if (filterBarInstance) {
			filterBarInstance();
			filterBarInstance = null;
		}
		if ($rootScope.isHistoryChecked) {
			$scope.getOnlineItems();
		} else {
			$scope.getOfflineForms();
		}

		$timeout(function () {

			if ($rootScope.isHistoryChecked) {
				$scope.getOnlineItems();
			} else {
				$scope.getOfflineForms();
			}
			$scope.$broadcast('scroll.refreshComplete');
		}, 1000);

        $scope.clearSelection();
	};

	$scope.deleteRecord = function (item) {
		/* delete selected records */
		if ($scope.selectCheckBox) {
			for (var i = 0; i < item.length; i++) {
				$cordovaSQLite.execute(db, "DELETE FROM FormData_table WHERE uniqueID=?", [item[i]])
				.then(function (res) {}, function (err) {
					alert(JSON.stringify(err));
				});
				//		$scope.refreshItems(item);
			}
			alertService.doAlert(strings.selectedRecordDelete, function (res) {
				$ionicListDelegate.closeOptionButtons();
                $scope.refreshItems();
                $state.transitionTo("app.history");
            });
		} else {
			/*delete individual record*/
			var query = "SELECT * FROM FormData_table WHERE uniqueID=?";
			$cordovaSQLite.execute(db, query, [item.recordId]).then(function (res) {
				if (res.rows.length > 0) {
					$cordovaSQLite.execute(db, "DELETE FROM FormData_table WHERE uniqueID=?", [item.recordId])
					.then(function (res) {
						alertService.doAlert(strings.recordDelete, function (res) {
							$ionicListDelegate.closeOptionButtons();
							$scope.refreshItems();
							$state.transitionTo("app.history");
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
	$scope.deleteAllRecord = function (selection) {
		$ionicPopup.confirm({
			title : 'Confirmation',
			template : 'Are you sure you want to Delete the Selected Records?'
		}).then(function (res) {
			if (res) {
                $scope.deleteRecord(selection);
			} else {}
		});
		var item = setGetObj.getHistoryOfForms();

	};
	$scope.statusType  = "All";

});

app.filter('recFilter',function(){
	return function(input,option){
    	console.log(option);
    	if(option == "All"){
        	return input;
        }
        else{
        	var output =[];
            angular.forEach(input,function(value,key){
                if(value.Status == option){
                    output.push(value);
                }
            });
        	return output;
        }
    }
});

