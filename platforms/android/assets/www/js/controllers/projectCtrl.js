angular.module('starter.controllers')
.controller('projectCtrl', function ($scope, $rootScope, $state, config, $cordovaSQLite, setGetObj, $ionicPopup, $filter, formsService, $ionicPopover, formsSave, alertService, commonService, $localstorage, reassign, strings, $timeout, $ionicHistory, $ionicListDelegate,calculatonFrmulaExcecutorService,$ionicModal,$cordovaBarcodeScanner,$ionicPopover,$cordovaCamera,reassign,$ionicSideMenuDelegate,projectTaskServices,mapComponentServices, $ionicScrollDelegate,$q,$cordovaCapture,$sce,promisingMethods)
{	

	/*
	@developer :Santhosh Kumar Gunti
	TPCL customization
	toggling sidemenu
	*/
	$scope.pullOverCheck = {value : false};
	$rootScope.enableCopyForMapInteraction = false;
	var objectOfMapInteraction;

	$scope.voiceSearchToggle = {value : false};

	$scope.filterByFirstPage = true;
	$rootScope.isHistoryShowing = false;
	$rootScope.isReassignShowing = false;
	$rootScope.syncTaskList =[];
	$scope.SyncReadyTasks = [];
	$scope.SyncReadyFormsOfTask =[];
	$scope.targetPath ="";
	$scope.enableCheckboxInProj = false;
	$scope.syncRecIdsProj = [];
	var arrayOps=[];
	var deviceData = $localstorage.getObject("deviceInfo");
	$scope.formLoderMsg = "Please wait,Form loading will take a while"
	$scope.projectListFilterAttribute = '';
	$scope.projectTaskFilterAttribute = '';

	$scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){ 
	    if(toState.name == "sidemenu.tabs.ProjectTasks.assignedProjectTasksforms" || toState.name == "sidemenu.tabs.ProjectTasks.assignedProjectTasksformView" || toState.name == "sidemenu.tabs.ProjectTasks.projectTaskRecords" || toState.name == "sidemenu.tabs.ProjectTasks.assignedProjectTasksformViewHistory"){
		    $rootScope.hideTabs = true;
	    }else{
		    $rootScope.hideTabs = false;
	    }
	});

	$scope.$on('fillMapInteractionInProjectTaskForm', function(event, args) {

	    mapComponentServices.setMapInteractionFieldValue($scope,objectOfMapInteraction,args.fieldValue);
	    // do what you want to do
	});

	//video field start
	$scope.isVideoAvailable=function(videoFieldStatus,id){
		console.log(videoFieldStatus)
		console.log($scope.selectedFormRecordFields)
		console.log($scope.selectedFormRecordFields[id])
		if($scope.selectedFormRecordFields[id]){

		}else{
			$scope.selectedFormRecordFields[id]='';
		}
		$scope.videoFieldStatus=videoFieldStatus;
		console.log($scope.selectedFormRecordFields)
	}

	$scope.getVideo = function(id,fieldId){
		console.log($scope.selectedFormRecordFields)
		if(id !="")
		{
			$scope.id=fieldId;
			$scope.videoUrl = config.url + "/api/v1/gridFS/getvideo/" + id;
		
			$rootScope.config = {
					/*sources: [{
							src: $sce.trustAsResourceUrl($scope.videoUrl),
							type: "video/mp4"
						},
					],*/
					theme: "lib/videogular-themes-default/videogular.css",
					plugins: {
						poster: "http://www.videogular.com/assets/images/videogular.png"
					}
			};
		}
		else
		{
			alert("No video captured")
		}
	}
	$scope.captureVideo = function (id) {
		cordova.plugins.diagnostic.requestExternalStorageAuthorization(
			function (status) {}, function (error) {
			console.error("The following error occurred: " + error);
		}, true);
		
		$scope.url = config.url + "/api/v1/gridFS/addvideo/";
		
		var options = {
			limit: 1,
			duration: 20,
			quality: 0
		};
		
		$cordovaCapture.captureVideo(options).then(function (result) {
			var targetPath = result[0].fullPath;
			console.log(targetPath)
			$scope.targetPath = targetPath;
			$scope.path = targetPath.substring(8);
			var filename = targetPath.split("/").pop();
		
			$scope.options = {
				fileKey: "video",
				fileName: filename,
				chunkedMode: false,
				mimeType: "video/mp4",
				params: {
					fieldId: id
				}
			};
			$scope.selectedFormRecordFields[id]=targetPath;
			arrayOps.push({options:$scope.options,path:$scope.path})
			$scope.arrayOps=arrayOps;
			$scope.config = {
				/*sources: [{
						src: $sce.trustAsResourceUrl(targetPath),
						type: "video/mp4"
					},
				],*/
				theme: "lib/videogular-themes-default/videogular.css",
				plugins: {
					poster: "http://www.videogular.com/assets/images/videogular.png"
				}
			};
		});
	}

	//video field end

	//derived field start

	$scope.isDependentField = function (fieldId) {
//		console.log($scope.dependentFields)
		if ($scope.dependentFields.indexOf(fieldId) != -1) {
			return true
		} else {
			return false
		}
	}

	$scope.getExistOptionDerivedField = function (selectedOption, allOptions, type, field_Id,typeStatus) {

		$scope.getDropDownInfo(selectedOption, allOptions, type, field_Id,typeStatus);
	},
	
	//-->UE Implementation
	//Addition: Roja: Derivative Fields 
	$scope.getDropDownInfo = function (selectedOption, avilableOptions, type, field_Id,typeStatus) {
		$rootScope.isFromDropdown=typeStatus;
		if (type == 'drpdwn') {
			$scope.drpdwnFieldId = field_Id;
		}
		angular.forEach(avilableOptions, function (option, index) {
		if (angular.isDefined(selectedOption)) {
			if ((option.lable).toLowerCase().trim() === (selectedOption).toLowerCase().trim()) {
				angular.forEach(option.dependFields, function (dependFields, logicType) {
					if (logicType == "Show") {
						angular.forEach(dependFields, function (dependField, index) {
							var currentIndex = $scope.dependentFields.indexOf(dependField.id);
							if (currentIndex == -1) {
								
								/*if($scope.prepopDataShow==false){
									$scope.recordInfo[$scope.drpdwnFieldId]="";
								}else{
									$scope.selectedFormRecordFields[$scope.drpdwnFieldId] = '';
								}*/

								$scope.selectedFormRecordFields[$scope.drpdwnFieldId] = '';
								$scope.dependentFields = JSON.parse(TempVar1);
								var currentIndex = $scope.dependentFields.indexOf(dependField.id);
								$scope.dependentFields.splice(currentIndex, 1);
							} else {
								$scope.dependentFields.splice(currentIndex, 1);
							}
						})
					} else if (logicType == "Hide") {
						angular.forEach(dependFields, function (dependField, index) {						
							console.log(dependField);
							/*if($scope.recordInfo!=""){
								$scope.recordInfo[dependField.id]="";
							}*/

							if($scope.selectedFormRecordFields!=undefined ){
							//	$scope.selectedFormRecordFields[dependField.id] = '';
								if( $rootScope.isFromDropdown){
									console.log("$rootScope.prepopDataShow ==true ")
								}else{
									console.log("$rootScope.prepopDataShow ==false ")
									$scope.selectedFormRecordFields[dependField.id] = '';	
								}
								
							}

							if ($scope.dependentFields.indexOf(dependField.id) == -1) {
								$scope.dependentFields.push(dependField.id);
							}

						})

					}
					else if (logicType == "Readonly") {
						angular.forEach(dependFields, function (dependField, index) {
						var currentIndex = $scope.dependentFields.indexOf(dependField.id);
						$scope.dependentFields.splice(currentIndex, 1);
						if ($scope.dependentFields.indexOf(dependField.id) == -1)
						$scope.readonlyFields.push(dependField.id);
						})
					}
				})
			}
			else {

			if (option.dependFields == undefined) {
				angular.forEach(option.dependFields, function (dependFields, logicType) {
					if (logicType == "Show") {
						angular.forEach(dependFields, function (dependField, index) {
							if ($scope.dependentFields.indexOf(dependField.id) == -1)
							$scope.dependentFields.push(dependField.id);
						})
					} else if (logicType == "Hide") {
						angular.forEach(dependFields, function (dependField, index) {
							if ($scope.dependentFields.indexOf(dependField.id) == -1)
							$scope.dependentFields.push(dependField.id);
						})
					}
				})
			}
			}
		}
		})

	}
	//derived field end

	$scope.setMapInteractionFieldValue = function(data){
		if($rootScope.isNetworkOn){
			$rootScope.typeOfTask = "Project Task";
			$rootScope.enableCopyForMapInteraction = true;
			objectOfMapInteraction = data;
			openMenu();
//			mapComponentServices.setMapInteractionFieldValue1($scope,data);
		}else{
			alertService.showToast("You are in offline, not able to perform");			
		}
	}
	
	$scope.goToReferences = function(url){
		mapComponentServices.goToReferences(url);
	}
	
	$scope.gotoField = function(data){
		var fieldDetails;
		if($rootScope.isNetworkOn){
			if ("data" in data){
				fieldDetails = $scope.selectedFormRecordFields[data.data.id];
			}else{
				fieldDetails = $scope.selectedFormRecordFields[data.id];
			}
			mapComponentServices.gotoField($scope,fieldDetails);
		}else{
			alertService.showToast("You are in offline, cannot perform this action");			
		}
	}

	$scope.$watch(function () {
       return $ionicSideMenuDelegate.isOpenRight();
      },
      function (isOpen) {
        if (isOpen){
	    	$scope.pullOverCheck.value = true;
        } else{
	    	$scope.pullOverCheck.value = false;
	      $rootScope.$broadcast('disableSketching');
  	      $rootScope.$broadcast('hidePrePopData');
  	      $rootScope.$broadcast('hideRoutingOnMap');
	      mapComponentServices.removeSketching($scope);
	   	  $rootScope.enableCopyForMapInteraction = false;
        }
	});


	$scope.$on('closepopupsInProjectTask', function () {
		if($ionicSideMenuDelegate.isOpen()){
			$rootScope.$broadcast('closePopoversInMap');
		}
   		else if($scope.modalFilterTaskForms != undefined && $scope.modalFilterTaskForms._isShown){
			$scope.modalFilterTaskForms.hide();
   		}
		else if($scope.sigpopover != undefined && $scope.sigpopover._isShown){
            $rootScope.isSignaturePadEnabled = false;
            $scope.sigpopover.remove();
        }
		else{		
			mapComponentServices.resetSketchingData();
			$scope.stopVoiceRecong = true;
			$ionicHistory.goBack();
		}
	});

 	/**
     * @desc 
        For showing existing sketchings  
     * @modified by Santhosh Kumar Gunti
 	*/
	$scope.sketchings = function(){
//		$scope.getSketchings();
		$rootScope.sketchingFrom = "projectTask";
		mapComponentServices.sketchingsProjectTask($scope);
	}

	$scope.$on("setSketchingDataInProjectTask", function () {
		$scope.selectedFormRecordFields['sketching'] = $rootScope.sketchingData;
	});

	$scope.references = function(){
		mapComponentServices.references($scope,commonService.getSelectedFormReferensesFromProjectTask());
	}

	$scope.closeModalOfReferences = function(){
		mapComponentServices.closeModalOfReferences($scope);
	}

	$scope.workInstructions = function () {
		mapComponentServices.workInstructions($scope,commonService.getSelectedFormWorkInstructionFromProjectTask());
	};

	$scope.openellipsePopoverInForms = function () {
		mapComponentServices.openellipsePopoverInForms($scope);
	};

	$scope.getSketchings = function () {
		$scope.selectedFormRecordFields['sketching'] = commonService.getSketchingData();
	}

	$scope.startSpeech = function (voiceSearchToggle) {
    	if(!voiceSearchToggle.value){
			$scope.stopVoiceRecong = false;
	    	$scope.voiceSearchToggle.value = false; 
			$scope.voiceRecogIncrementForGroupOrSection = 0;
			$scope.voiceRecogIncrementForGroupInSection = 0;
			$scope.voiceRecogIncrement = 0;
			projectTaskServices.startSpeech($scope);
  		}
  		else{
			$scope.stopVoiceRecong = true;
  		}
  		$scope.voiceSearchToggle.value = !$scope.voiceSearchToggle.value;
	};

	$scope.editSketching = function(sketchingData){
		mapComponentServices.editSketching($scope,sketchingData,$rootScope.isHistoryShowing);
	}

	$scope.deleteSketching = function($index){
		mapComponentServices.deleteSketching($scope,$index);
	}

	$scope.addSketching = function () {
		$scope.typeOfSketching = "add";
		mapComponentServices.addSketching($scope);
		openMenu();
	};

	$scope.closeModalOfSketchings = function(){
		mapComponentServices.closeModalOfSketchings($scope);
	}
	$scope.closeModal = function () {
		mapComponentServices.closeModal($scope);
	};

	$scope.openMenu = function () {
	    openMenu();
  	};

  	function openMenu(){
  		if($ionicSideMenuDelegate.isOpen()){
  			$ionicSideMenuDelegate.toggleRight(false);
  		}else{
  			$ionicSideMenuDelegate.toggleRight();
  		}
  	}
	$scope.openMap = function (item) {

		$scope.getProjectTaksFormRecords(item,true);
/*		$rootScope.prepopRecords = [];
			$scope.taskType = commonService.getSelectedTakstype();


			$scope.getSavedRecords(item.frequency,function(){
				if($scope.taskType)
				{	
						var url = config.url + "/api/v1/projectProcesss/getRecordsOfProjectTaskForm/" + item.TaskId + "/" + item.FormId +"/"+$localstorage.getObject("username");
						reassign.getPrepopulatedData(url, securityHeaders, function (response) {
							
							$rootScope.displayValues = response.data.displayValues;
							console.log("pnlie skelton");
							//$scope.dependentFields = response.data.dependentFields;
							commonService.setDepnddentfieldsOfForm(response.data.dependentFields);

							commonService.setSelectedFormWorkInstructionFromProjectTask(response.data.workInstruction);
							commonService.setSelectedFormReferensesFromProjectTask(response.data.references);
							commonService.setSelectedFormSkeltonVersionFromProjectTask(response.data.version);
							commonService.setSelectedFormSkeltonFieldsFromProjectTask( response.data.formSkelton);
							//$scope.progressbar.set(90)
							angular.forEach(response.data.records,function(record,index){
									$rootScope.prepopRecords.push(angular.copy(record))
							})

							//$scope.progressbar.complete();
							commonService.Loaderhide();
						$scope.dependentFields = commonService.getDepnddentfieldsOfForm();

						commonService.setSelectedFormId(item.FormId);
						commonService.setSelectedTaksId(item.TaskId);
						$rootScope.NavigatedFrom = "form";
					    $rootScope.$broadcast('showPrePopDataForProjectTasks');
						$ionicListDelegate.closeOptionButtons();
					    $scope.openMenu();
*/
/*							console.log($scope.prepopRecords)
							$state.transitionTo("sidemenu.tabs.ProjectTasks.projectTaskRecords");
*/							/*$scope.getReassignRecords("venki",function(){
								console.log("ssssssssssssss")
								
							})*/
							
							
/*						});
				}
				else
				{	
					
					var url = config.url + "/api/v1/formsz/" + item.FormId;

					formsService.navigateToForms(url, securityHeaders, function (status, response) {
						console.log("1411111111111111111111111")
						console.log(response.getProjectTaksFormRecords)

						$rootScope.displayValues = response.requiredField;

						commonService.setSelectedFormSkeltonFieldsFromProjectTask(response.FormSkeleton)
						commonService.Loaderhide();
						$state.transitionTo("sidemenu.tabs.ProjectTasks.projectTaskRecords");
					});
					
				}
			});

*/	/*		var url = config.url + "/api/v1/projectProcesss/getRecordsOfProjectTaskForm/" + item.TaskId + "/" + item.FormId +"/"+$localstorage.getObject("username");
		reassign.getPrepopulatedData(url, securityHeaders, function (response) {
			
			$rootScope.displayValues = response.data.displayValues;
			//$scope.dependentFields = response.data.dependentFields;
			commonService.setDepnddentfieldsOfForm(response.data.dependentFields);

			commonService.setSelectedFormWorkInstructionFromProjectTask(response.data.workInstruction);
			commonService.setSelectedFormReferensesFromProjectTask(response.data.references);
			commonService.setSelectedFormSkeltonVersionFromProjectTask(response.data.version);
			commonService.setSelectedFormSkeltonFieldsFromProjectTask( response.data.formSkelton);
			
			$scope.dependentFields = commonService.getDepnddentfieldsOfForm();

			commonService.setSelectedFormId(item.FormId);
			commonService.setSelectedTaksId(item.TaskId);
			$rootScope.NavigatedFrom = "form";
		    $rootScope.$broadcast('showPrePopDataForProjectTasks');
			$ionicListDelegate.closeOptionButtons();
		    $scope.openMenu();
		});
*/
	};
	$scope.navigateToLocationFromPrepop = function (id) {
		$rootScope.NavigatedFrom = "prepoprec";
		$rootScope.navigatetoRecordId = id;
	    $rootScope.$broadcast('showPrePopDataForProjectTasks');
		$ionicListDelegate.closeOptionButtons();
	    $scope.openMenu();
	};


	/* viewing the individual submitted record online*/
	$scope.$on('ViewTaskFormRecordProjectTask', function(event, item,key) {
		$rootScope.isHistoryShowing =true;
		$scope.gotoFormFillingHistory(item.record,'prepop',key);
/*		console.log(item);
		$rootScope.condition = true;
		$rootScope.isGridRecodsShow = true;
		$rootScope.skeletonId = item.FormId;
		$rootScope.prepopDataShow = false;
		$rootScope.TaskData = false;
		$rootScope.isHistoryShowingAtDirectTask = true;
		var url = config.url + "/api/v1/formszDetails/" + item.recordId;
		formsService.getRecords(url, securityHeaders, function (response) {
			console.log(response);
			var RecordValues = response.record;
			$scope.selectedFormRecordFields = {};
			angular.forEach(RecordValues, function (value, key) {
				angular.forEach(value, function (v, k) {
					$scope.selectedFormRecordFields[k] = v;
				});
			});
		});
		hidemapIcon = false;
		$scope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
		$state.transitionTo("sidemenu.tabs.ProjectTasks.assignedProjectTasksformViewHistory");
		//sidemenu.tabs.formTasks.assignedFormTasksformViewHistory
		//only submitted record..... viewing submitted record
*/	});

// In map view, on click on marker a corresponding address should be viewed.
	// This method is called to view the carded or non-carded address
	$scope.$on('getPrePoprecordFromMapProjectTask', function(event, item,key) {
		var isSaved = false;
		var data;
		angular.forEach($rootScope.savedRecordsWhileOnline,function(value,index){
			if(value.record.RUID == item.record.RUID){
				isSaved = true;
				data = value;
			}
		});

		if(isSaved && $rootScope.savedRecordsWhileOnline.length > 0){
			$scope.gotoOpenSavedRecord(data,'saved',key);
			$scope.openMenu();
		}
		else{
			$scope.gotoFormFilling(item.record,'prepop',key);
			$scope.openMenu();
		}

		/*		console.log(item);
		var query = "SELECT * FROM FormData_table WHERE recordId=?";
		$cordovaSQLite.execute(db, query, [item.recordId]).then(function (res) {
		console.log(res);
		console.log(res.rows);
		console.log(res.rows.length);
		if(res.rows.length<=0){
			$scope.isEmptyForm = false;
			$scope.isSavedRecord = false;
			$rootScope.fillingFormtype = 'prepop';
					
			commonService.setRecordUID(item.recordId)

			$rootScope.submittedFrom = "map";
			$scope.selectedFormRecordFields = {};
			var user = $localstorage.getObject("username");
			$rootScope.prepopDataShow = true;
			if ($scope.status == true) {
				console.log("true");
				$rootScope.TaskData = true;
				$rootScope.isGridRecodsShow = true;
				$rootScope.formEllipse = true;
				$rootScope.skeletonId = item.FormId;
				$localstorage.setObject("TaskId", item.TaskId);
				var isPrepopup = true;
				var url = config.url + "/api/v1/projectProcesss/getProjectTaskRecordData/" + user + "/" + item.FormId + "/" + item.TaskId + "/" + item.recordId+ "/" + isPrepopup;
				formsSave.getPrepopData(url, securityHeaders, function (response) {
					console.log(response);
					$localstorage.setObject("reassignedRecordId", item.recordId);
					
					$scope.selectedFormRecordFields = response.data;
					
					$scope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
					$state.transitionTo("sidemenu.tabs.ProjectTasks.assignedProjectTasksformView");
				});

			} else {
				$scope.editPrepopulatedRecord(item);
			}
		}else{
			$scope.isEmptyForm = false;
			$scope.isSavedRecord = true;
			$rootScope.fillingFormtype = 'saved';
			commonService.setRecordUID(item.recordId);
			$scope.directTaskSelectedRecordUniqueId = res.rows.item(0).uniqueID;
			$scope.directTaskSelectedRecordId =  item.recordId;
			for (var i = 0; i < res.rows.length; i++) {
				var obj = {};
					obj.recordId = item.recordId;
				obj.FormId = item.FormId;
				obj.TaskId = item.TaskId;
				obj.FormValues = res.rows.item(0).FormValues;
			//	arr.push(obj);
			}
			$scope.editTaskForm(obj);
		}
		});	
*/	});

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
			$scope.selectedFormRecordFields = {};
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
			$scope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
            $scope.selectedFormRecordFields = {};
            angular.forEach(RecordData, function (value, key) {

				if(value.sketching != undefined)
					$rootScope.sketchingData = value.sketching;

                $scope.selectedFormRecordFields = value;
            });
            $rootScope.isGridRecodsShow = true;
            if ($scope.status == true) {
                $rootScope.skeletonId = item.FormId;
                $state.transitionTo("sidemenu.tabs.ProjectTasks.assignedProjectTasksformView");
            } else {
                var query = 'SELECT * FROM FormSkeleton_table WHERE FormId=?';
                $cordovaSQLite.execute(db, query, [item.FormId]).then(function (res) {
                    var len = res.rows.length;
                    for (var i = 0; i < len; i++) {
                        var TaskFormValues = res.rows.item(i).FormSkeleton;

                        $rootScope.fields = JSON.parse(TaskFormValues);
                        $localstorage.setObject("offlineData", TaskFormValues);

                        $state.transitionTo("sidemenu.tabs.ProjectTasks.assignedProjectTasksformView");
                    }
                }, function (err) {
                    alert(JSON.stringify(err));
                });
            }
        }
//    }
	}

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
					$scope.selectedFormRecordFields = val;
				});
			});
			$scope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
			$state.transitionTo("sidemenu.tabs.ProjectTasks.assignedProjectTasksformView");
		});
	}


	$scope.backToPrePoRecords = function()
	{
		$rootScope.isHistoryShowing =false;
		$rootScope.isReassignShowing = false;
		mapComponentServices.resetSketchingData();
		$scope.stopVoiceRecong = true;
	}

	$scope.closeProjectFormFilter =function(){
		$scope.modalFilterTaskForms.remove();
	}

	$scope.ProjectTasksRefresh = function()
	{
		$scope.projectTaskFilterAttribute = '';
		$scope.getProjectTask();
		$scope.$broadcast('scroll.refreshComplete');
	}


	$scope.refreshTaskForms = function () {
		$scope.getAssignedProjectTaskFormsOnRefresh()
		$scope.$broadcast('scroll.refreshComplete');
	
	}

	$scope.refreshOfflineRecords = function()
	{
		$scope.$broadcast('scroll.refreshComplete');
	}
	$scope.backToTaskForms = function()
	{
		$state.go("sidemenu.tabs.ProjectTasks.assignedProjectTasksforms");
	}

	$scope.backToPrepopRecords = function()
	{
		//$state.go("sidemenu.tabs.ProjectTasks.projectTaskRecords");
		if($scope.sigpopover != undefined && $scope.sigpopover._isShown){
            $rootScope.isSignaturePadEnabled = false;
            $scope.sigpopover.remove();
        }else{
			$state.go("sidemenu.tabs.ProjectTasks.projectTaskRecords");
			mapComponentServices.resetSketchingData();
			$scope.stopVoiceRecong = true;
		}
	}

	$scope.backToTasks = function()
	{
		$scope.projectTaskFilterAttribute = '';
		$state.go("sidemenu.tabs.ProjectTasks.assignedProjectTasks");
	}

	$scope.taskDetails = function (item) {
		console.log(item)
		if (item == undefined) {
			var item = setGetObj.getFormObject();
		}
		var startDate = $filter('date')(item.startDate, "yyyy-MM-dd");
		var endDate = $filter('date')(item.endDate, "yyyy-MM-dd");
		var projectStartDate = $filter('date')(item.projectsDate, "yyyy-MM-dd");
		var projectEndDate = $filter('date')(item.projecteDate, "yyyy-MM-dd");
		console.log("projectStartDateprojectStartDate")
		console.log(projectStartDate)
		console.log(projectEndDate)
       
		var alertPopup = $ionicPopup.alert({
				template : "<div><b>Task Name</b> : " + item.TaskName + "</br></br>"+
				"<b>Assigne</b> : " + item.assignName + " </br></br>"+
				"<b>Description</b> : " + item.taskDescription + "</br></br>"+
				"<b>Zone Name </b>: " + item.zone + "</br></br>"+
				"<b>Start Date</b> : " + startDate + "</br></br>"+
				"<b>End Date</b> : " + endDate + "</br>"+
				"<hr> <b>Project Name</b> : " + item.projectName + "</br></br>"+
				"<b>Project Description</b> : " + item.projectDescription+ "</br></br>"+
				"<b>Start Date </b>: " +projectStartDate + "</br></br>"+
				"<b>End Date</b> : " + projectEndDate + "</div>",
				buttons : [{
						text : 'ok',
						type : 'button-positive'
					},
				]
			});
		alertPopup.then(function (res) {
//			$scope.closeellipsePopover();
			$ionicListDelegate.closeOptionButtons();
		});
	},

	$scope.formInfo = function (item) {
		console.log(item)
		console.log("formInfo")
		if (item == undefined) {
			var item = setGetObj.getFormObject();
		}
		var startDate = $filter('date')(item.startDate, "yyyy-MM-dd");
		var endDate = $filter('date')(item.endDate, "yyyy-MM-dd");
	
       
		var alertPopup = $ionicPopup.alert({
				template : "<div><b>Form Name</b> : " + item.FormName + "</br>"+
				"<hr><b>Start Date</b> : " + startDate + "</br>"+
				"<hr><b>End Date</b> : " + endDate + "</br>"+
				"<hr> <b>Frequency</b> : " + item.frequency + "</br>",
				buttons : [{
						text : 'ok',
						type : 'button-positive'
					},
				]
			});
		alertPopup.then(function (res) {
//			$scope.closeellipsePopover();
			$ionicListDelegate.closeOptionButtons();
		});
	},

	$scope.TaskFormsHistory = function(){
		$rootScope.historyRecords = []
		$rootScope.isHistoryShowing =true;
		$rootScope.isReassignShowing = false;
		$scope.HistoryPopover.hide();
		commonService.getSelectedFormId();
		var taskId = commonService.getSelectedTaksId()
		var formId = commonService.getSelectedFormId();
		var url = config.url + "/api/v1/projectProcesss/getHistroy/" + formId + "/" + taskId +"/"+user;
		console.log(url)

		reassign.getPrepopulatedData(url, securityHeaders, function (response) {
			angular.forEach(response.data,function(record,index){
					$rootScope.historyRecords.push(record)

			})
	
		});

	},

	$scope.getReassignRecords  = function(data)
	{	
		console.log("reassignRecordsreassignRecords")
		$rootScope.reassignRecords = []
		$rootScope.isHistoryShowing =false;
		$rootScope.isReassignShowing =true;

		$scope.HistoryPopover.hide();
		commonService.getSelectedFormId();
		var taskId = commonService.getSelectedTaksId()
		var formId = commonService.getSelectedFormId();
		var url = config.url + "/api/v1/projectProcesss/getReassignRecords/" + formId + "/" + taskId +"/"+user;
		console.log(url)

		reassign.getPrepopulatedData(url, securityHeaders, function (response) {
			
			$scope.getSavedRecordsForReassign(function(recordsdata){
				console.log("recordsdatarecordsdatarecordsdatarecordsdata")
				console.log(recordsdata);

				angular.forEach(response.data,function(record,index)
				{		
						if($scope.savedReassginRecordsList.indexOf(record.recordId ) == -1){
							record.IsReassignSaved = false;
							$rootScope.reassignRecords.push(angular.copy(record))
						}
				})
			})
			
			
		});
	}

	// >>>> Developer : Phani Kumar Narina
	// >>>> TPCL Customization
	// >>>> Description : Filter popup with date/alphabatical sort
	$scope.filterProjectTask= function(){
		$ionicPopover.fromTemplateUrl('templates/filterProjectTask.html', {
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
		$scope.projectListFilterAttribute = '';
	}

	$scope.propertyName = 'endDate';
	$scope.reverse = true;

	$scope.sortBy = function(propertyName) {
		$scope.projectListFilterAttribute = propertyName;
	    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
	    $scope.propertyName = propertyName;
	};

	
	$scope.closeFormFilter = function(propertyName) {
		$scope.modalFilterTaskForms.remove();
	};

	// Project Task Form Filter
	// >>>> Developer : Phani Kumar Narina
	// >>>> Date :01-Feb-2018

	$scope.filterTaskForm = function(){
		$ionicPopover.fromTemplateUrl('templates/projectTasksFormFilter.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modalFilterTaskForms = modal;
			$scope.modalFilterTaskForms.show();
		});
	}

	$scope.backToMain = function(){
		$scope.filterByFirstPage = true;
		$scope.selectedPN = null;
		$scope.selectedZn = null;
		$ionicScrollDelegate.scrollTop();
	}

	$scope.filterByProjects = function(){
		$scope.filterByFirstPage = false;
		$scope.projectListFilterAttribute = '';
		$scope.isProject = true;
	}

	$scope.filterByZones = function(){
		$scope.filterByFirstPage = false;
		$scope.projectListFilterAttribute = '';
		$scope.isProject = false;
	}

	// >>>> Get Selected Project Name
	$scope.getSelectedProjectName = function(name){
		$scope.selectedPN = name;
	}

	$scope.isProjectActive = function(item) {
	     return $scope.selectedPN === item;
	};

	$scope.iszoneActive = function(item) {
	     return $scope.selectedZn === item;
	};

	// Get Selected Zone Name
	$scope.getSelectedZoneName = function(name){
		$scope.selectedZn = name;
	}
	
	// Clear Filters
	$scope.clearFormFilter = function(){
		$scope.selectedPN = null;
		$scope.selectedZn = null;
		$scope.propertyName = null; 
		$scope.reverse = false;
		$scope.projectListFilterAttribute = '';
		console.log("clearFilter");
		$ionicScrollDelegate.scrollTop();
	}

	$scope.applyFormFilter = function(){
		// $scope.keyType = $scope.pN;
		console.log("Apply filter here:"+$scope.keyType);
	}

	$scope.$on("disablePullover", function () {
		if($scope.pullOverCheck.value == true){
			$scope.pullOverCheck.value = false;
			$scope.openMenu();
		}
	});

	console.log("project controller")
	//$scope.progressbar = ngProgressFactory.createInstance();
	securityHeaders.headers = commonService.securityHeaders()
	$rootScope.savedRecordsWhileOnline = []
	$scope.OfflineRecordsList =[];
	var user = $localstorage.getObject("username");
	var filterBarInstance;
	//$scope.isSavedRecord = false;
	//$scope.seletedRecordId ;

	//download form of given task
	$scope.downloadFormsOfTask = function (item,index) {
		var taskId = item.TaskId;
			var FormId = item.FormId;
			var isTaskDownloded = false;
			$scope.isFormALredayDownnLoad(taskId,FormId,user,function(isFormDownloded)
			{
				if(!isFormDownloded && !isTaskDownloded)
				{	
					var url = config.url + "/api/v1/projectProcesss/downloadService/" + taskId + "/" + FormId + "/" + user;
					reassign.downloadProjectTask(url, securityHeaders, function (response) {
						$scope.saveTaskInOffline(JSON.parse(response.taskInfo),function(){
							var taskId = commonService.getSelectedTaksId();
		
							$scope.checkAndSaveFormInOffline(JSON.parse(response.formInfo),taskId,function(){
								$scope.savePrepopRecordsOfForm(taskId,FormId,user,JSON.parse(response.prepopRecords),function()
								{	
									console.log("after prepop records insert")
									$scope.insertDownloadedFormInfo(FormId,taskId, function(){
										$rootScope.TaskForms[index].status = true;
										$ionicListDelegate.closeOptionButtons();
										alertService.doAlert("Downloaded successfully");
									});
								})
							});
						})
						
				
					});	
				}
				else
				{
					$ionicListDelegate.closeOptionButtons();
					alertService.doAlert("Form alredy download");

				}
				
			})
			

		
	}

	$scope.insertDownloadedFormInfo = function(formId, taskId, cb){
		var  insertDownloadedFormInfoUrl = config.url + "/api/v1/projectProcesss/insertDownloadedFormInfo/";
		console.log('insertDownloadedFormInfoUrl '+insertDownloadedFormInfoUrl);
		var formData = {'formId': formId, 'username': $localstorage.getObject("username"), "taskId": taskId};
		console.log('formData '+JSON.stringify(formData));
		
		formsSave.insertDownloadedFormInfo(insertDownloadedFormInfoUrl, formData, securityHeaders, function (response) {
			console.log('insertDownloadedFormInfo '+JSON.stringify(response));
			cb(response);
		});
	}

	$scope.downloadProjectTask = function(item,index)
	{		
			console.log("downloadProjectTaskdownloadProjectTaskdownloadProjectTask")
			console.log(item.taskId);
			var url = config.url + "/api/v1/projectProcesss/downloadProjectTask/" + item.taskId;
			console.log(securityHeaders)
			reassign.downloadProjectTask(url, securityHeaders, function (taskResponse) {
					
					console.log("tassk downloadedddd")
					console.log(taskResponse);

					$scope.saveTaskInOffline(JSON.parse(taskResponse.taskInfo),function(status){

						/*if(status == 1){*/
							var formsCount =0;
							for(var iii = 0; iii < taskResponse.taskFormsList.length; iii++)
		                    {
		                        	var url = config.url + "/api/v1/projectProcesss/downloadService/" + item.taskId + "/" + taskResponse.taskFormsList[iii] + "/" + user;
									reassign.downloadProjectTask(url, securityHeaders, function (response) {
										//$scope.saveTaskInOffline(JSON.parse(response.taskInfo),function(){
											$scope.checkAndSaveFormInOffline(JSON.parse(response.formInfo),item.taskId,function(res){
												console.log('checkAndSaveFormInOffline '+formsCount);
												var formId = JSON.parse(response.formInfo)._id;
												if(!res){
													$scope.savePrepopRecordsOfForm(item.taskId,formId,user,JSON.parse(response.prepopRecords),function()
													{	
														console.log('savePrepopRecordsOfForm '+formsCount);
														$scope.insertDownloadedFormInfo(formId, item.taskId, function(){
															console.log("form downloaded info all")
															formsCount++;
														});
													})
												}
												else{
													formsCount++;
												}
											});
										//})
										
								
									});
		                    }

						
							console.log(index);
							console.log("indexxxxx")
							
							$rootScope.projectTasks[index].isDownloaded = true;
							$scope.$apply();
							$ionicListDelegate.closeOptionButtons();
							alertService.doAlert("Downloaded Successfully");
						/*}
						else
								alertService.doAlert("Task already downloaded")*/	
					})
					
				
			});	
	}

	//check form of given task is downloaaded or not
	$scope.isFormALredayDownnLoad = function (taskId,FormId,user,callback) {
		
		var taskId = commonService.getSelectedTaksId();
		db.transaction(function(tx) {

	        //create table
	        tx.executeSql("CREATE TABLE IF NOT EXISTS FormszTable(Username text,FormId integer,FormName text, TaskId integer,Details text,Frequency text )", [], function(tx, res){
	            tx.executeSql("SELECT * FROM FormszTable WHERE Username=? and TaskId=? and FormId=?", [user,taskId,FormId], function(tx, res){
                  
                   
                    if(res.rows.length == 0)
                    {
                    	callback(false)

                    }
                    else
                    {
                    	callback(true)
                    }
                    
                })
	        });
	    

        }, function(err){

	        //errors for all transactions are reported here
	        console.log("--> db query error:isFormALredayDownnLoad"+err.message)
	        //alert("Error: " + err.message)

    	});




	},

/*$scope.checkAndSaveFormInOffline = function (formInfo,taskId,callback) {
  
  db.transaction(function(tx) {
         //create table
         tx.executeSql("CREATE TABLE IF NOT EXISTS FormszTable(Username text,FormId integer,FormName text, TaskId integer,Details text, Frequency  text)", [], function(tx, res){
              tx.executeSql("SELECT * FROM FormszTable WHERE Username=? and TaskId=? and FormId=?", [user,taskId,formInfo.id], function(tx, res){
                if(res.rows.length == 0)
                { 
                    tx.executeSql("INSERT INTO FormszTable (Username, FormId,FormName, TaskId ,Details , Frequency) VALUES (?,?,?,?,?,?)", [user, formInfo.id, formInfo.name, taskId,JSON.stringify(formInfo),formInfo.formFrequncy], function(tx,res){
                
                		callback(false)
               		});
                     

                }
                else
                {
                 	callback(true)
                }
                   
            })
          
        });
             }, function(err){
         //errors for all transactions are reported here
         alert("Error: " + err.message)
     });
 },*/

 $scope.checkAndSaveFormInOffline = function (formInfo,taskId,callback) {
		
		db.transaction(function(tx) {

	        //create table

	        tx.executeSql("CREATE TABLE IF NOT EXISTS FormszTable(Username text,FormId integer,FormName text, TaskId integer,Details text, Frequency  text)", [], function(tx, res){
	             tx.executeSql("SELECT * FROM FormszTable WHERE Username=? and TaskId=? and FormId=?", [user,taskId,formInfo._id], function(tx, res){
                  
                   
                    if(res.rows.length == 0)
                    {	
                    	tx.executeSql("INSERT INTO FormszTable (Username, FormId,FormName, TaskId ,Details , Frequency) VALUES (?,?,?,?,?,?)", [user, formInfo._id, formInfo.name, taskId,JSON.stringify(formInfo),formInfo.formFrequncy], function(tx,res){
		            		
		            		callback(false)
	            		});
                    	

                    }
                    else
                    {
                    	callback(true)
                    }
                    
                })

	            
	        });
	    

        }, function(err){

	        //errors for all transactions are reported here
	         console.log("--> db query error:"+err.message)

    	});




	},

	//store task in offline
	$scope.saveTaskInOffline = function (taskInfo,callback) {
		console.log(taskInfo)
		console.log("saveTaskInOffline")
		//var taskId = commonService.getSelectedTaksId();
		db.transaction(function(tx) {

	        //create table
	        tx.executeSql("CREATE TABLE IF NOT EXISTS ProjectTaskTable(User text,TaskId integer,Details text )", [], function(tx, res){
	            tx.executeSql("SELECT * FROM ProjectTaskTable WHERE User=? and TaskId=?", [user,taskInfo._id], function(tx, res){
                   

                    if(res.rows.length == 0)
                    {
                    	tx.executeSql("INSERT INTO ProjectTaskTable (User, TaskId ,Details) VALUES (?,?,?)", [user,taskInfo._id,JSON.stringify(taskInfo)], function(tx,res){
		            		callback(1)
	            		});
                    }
                    else
                    {	
                    	callback(2)
                    }
                    
                })

	            

	        });
	    

        }, function(err){

	        //errors for all transactions are reported here
	         console.log("--> db query error:isFormALredayDownnLoad"+err.message)
	        //alert("Error: " + err.message)

    	});




	},

	//store preppop records in offline (sqlite db)
	$scope.savePrepopRecordsOfForm = function (taskId,FormId,user,preporecods,callback) {
		
		//var taskId = commonService.getSelectedTaksId();
		db.transaction(function(tx) {

	        //create table
	        tx.executeSql("CREATE TABLE IF NOT EXISTS ProjectPrepopRecords(User text,TaskId integer,FormId integer,Records text )", [], function(tx, res){
	           tx.executeSql("INSERT INTO ProjectPrepopRecords (User, TaskId ,FormId, Records) VALUES (?,?,?,?)", [user,taskId,FormId,JSON.stringify(preporecods.records)], function(tx,res){
		            		callback(1)
	            });

	        });
	    

        }, function(err){
        	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
	        //alert("Error: " + err.message)

    	});




	},



	


	

	//save form in offline 

	$scope.saveProjectformProcess = function(isValid, type)
	{	
		commonService.LoaderShow(strings.saving);
		commonService.getLatLong(function (geoLocation) 
		{
			if (geoLocation.netstatus == "error") {
				
				alertService.showToast(geoLocation.message);
				$scope.saveProjetcForm(isValid,type,null,null)
				
			} 
			else
			{	
				$scope.lat = geoLocation.latlong[0];
				$scope.long = geoLocation.latlong[1];
				$scope.saveProjetcForm(isValid,type,geoLocation.latlong[0],geoLocation.latlong[1])
			}

			
		})
	}

	$scope.saveProjetcForm = function(isValid, type,lati,longi)
	{		

		var invalidCalculationsFieldList = [];
		calculatonFrmulaExcecutorService.isCalculationsFieldsAreStoresValidValues($scope.recordInfo,invalidCalculationsFieldList,$scope);
	
		//End
		//commonService.LoaderShow(strings.saving);
		$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormData_table(uniqueID integer primary key autoincrement,FormId integer,userId integer ,FormValues text,FormStatus text,TaskId text,recordId text,isRequired text,displayValues text,recordComments text,IsReassign text,lat text,long text,insertDate text,version text,videoOptions text,videoPath text,isVideoAvailable text)').then(function (res) {}, function (err) {
				alert(JSON.stringify(err));
		});
		// object preparation for record 
		var obj = {};
		var arr =[];
		arr.push($scope.selectedFormRecordFields)
		obj.record = arr;
		obj.formId = commonService.getSelectedFormId();
		obj.taskId = commonService.getSelectedTaksId()
		obj.projectId = commonService.getSelectedProjectId()
		obj.RUID = commonService.getRecordUID();
		var index;
		try
		{
			
				index = $scope.OfflineRecordsList.indexOf(obj.RUID);
				if(index == -1)
				{
					$scope.OfflineRecordsList.push(obj.RUID);
				}

		}
		catch(err)
		{
			console.log(err);
		}
		
		var userId = $localstorage.getObject("username");

		var datenow = new Date();
		var isoDate = datenow.toISOString();
		obj.updatedTime = isoDate;
		obj.updatedBy = $localstorage.getObject("username");
		var values = JSON.stringify(obj);
			
		//if record is alreday in offline or prepop record then isempty is false
		if(!$rootScope.isEmptyForm)
		{	
			if(!$scope.isSavedRecord )
			{	
				if($rootScope.fillingFormtype  == 'prepop')
				{   
					if ($scope.videoFieldStatus) {
						if ($scope.targetPath != undefined || $scope.targetPath != null || $scope.targetPath != "") {
							options = $scope.options;
							videoPath = $scope.targetPath
						} else {
							options = null;
							videoPath = null;
						}
					}else{
						options = null;
						videoPath = null;
					}

					query = 'INSERT OR REPLACE INTO FormData_table (FormId,userId, FormValues,FormStatus,TaskId,recordId,isRequired,insertDate,IsReassign,lat,long,version,isVideoAvailable,videoOptions,videoPath) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
					$cordovaSQLite.execute(db, query, [obj.formId, userId, values, "saved", obj.taskId,"", isValid,new Date().setHours(0, 0, 0, 0),"false",lati,longi,commonService.getSelectedFormSkeltonVersionFromProjectTask(),$scope.videoFieldStatus,options,videoPath]).then(function (res) {
						alertService.doAlert(strings.formSaved);

						mapComponentServices.resetSketchingData();

						var obj ={}
						$scope.selectedFormRecordFields['uniqueID']= res.insertId;
						
						obj['record'] = $scope.selectedFormRecordFields;
						obj['uniqueID'] = res.insertId;
						obj.isVideoAvailable = $scope.videoFieldStatus;
						obj.videoOptions = $scope.options;
						obj.videoPath = $scope.targetPath;
						$rootScope.savedRecordsWhileOnline.push(obj);
						commonService.Loaderhide();
						$scope.targetPath ="";
						$ionicHistory.goBack();
					
					}, function (err) {
						console.log("--> db query error:isFormALredayDownnLoad"+err.message)
						//alert("error " + JSON.stringify(e));
					});
				}
				else
				{
					if ($scope.videoFieldStatus) {
						if ($scope.targetPath != undefined || $scope.targetPath != null || $scope.targetPath != "") {
							options = $scope.options;
							videoPath = $scope.targetPath
						} else {
							options = null;
							videoPath = null;
						}
					}else{
						options = null;
						videoPath = null;
					}

					query = 'INSERT OR REPLACE INTO FormData_table (FormId,userId, FormValues,FormStatus,TaskId,recordId,isRequired,insertDate,recordComments,IsReassign,lat,long,version,isVideoAvailable,videoOptions,videoPath) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
					
					$cordovaSQLite.execute(db, query, [obj.formId, userId, values, "saved", obj.taskId, $rootScope.selectedReaginRecordId, isValid,new Date().setHours(0, 0, 0, 0),"","true",lati,longi,commonService.getSelectedFormSkeltonVersionFromProjectTask(),$scope.videoFieldStatus,options,videoPath]).then(function (res) {
						alertService.doAlert(strings.formSaved);
						
						mapComponentServices.resetSketchingData();

						var obj ={}
						$scope.selectedFormRecordFields['uniqueID']= res.insertId;
						obj['record'] = $scope.selectedFormRecordFields;
						obj.isVideoAvailable = $scope.videoFieldStatus;
						obj['uniqueID'] = res.insertId;
						obj.videoOptions = $scope.options;
						obj.videoPath = $scope.targetPath;
						//$rootScope.reassignRecords.splice($rootScope.slectedPrepopRecordIndex,1);
						$rootScope.reassignRecords[$rootScope.slectedPrepopRecordIndex].IsReassignSaved = true;
						commonService.Loaderhide();
						$scope.targetPath ="";
						$ionicHistory.goBack();
					
					}, function (err) {
						console.log("--> db query error:isFormALredayDownnLoad"+err.message)
						alert("error " + JSON.stringify(e));
					});
				}
			}
			else
			{	
				//isVideoAvailable,videoOptions,videoPath
				if ($scope.videoFieldStatus) 
				{
					if ($scope.targetPath != undefined || $scope.targetPath != null || $scope.targetPath != "") {
						options = $scope.options;
						videoPath = $scope.targetPath;
					} else {
						options = null;
						videoPath = null;
					}
				}
				else
				{
						options = null;
						videoPath = null;
				}

				var query = "UPDATE FormData_table SET FormValues=? ,isRequired=?, lat=?,long=?,isVideoAvailable=?,videoOptions=?,videoPath=? where uniqueID=? ";
				$cordovaSQLite.execute(db, query, [values, isValid, lati,longi,$scope.videoFieldStatus,options,videoPath,$scope.selectedFormRecordFields['uniqueID']]).then(function (res) {
					alertService.doAlert(strings.formupdated);

					mapComponentServices.resetSketchingData();

					var obj ={}
					obj['record'] = $scope.selectedFormRecordFields;
			//		obj['uniqueID'] = res.rows.item(i).uniqueID;
					obj['isVideoAvailable'] = $scope.videoFieldStatus;
					obj['videoOptions'] = $scope.options;
					obj['videoPath'] = videoPath;
					//$scope.targetPath ="";
					commonService.Loaderhide();
					$ionicHistory.goBack();
				}, function (err) {
					console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					
				});	
			}
			
			//modified by venkatesh bendi for auto calculations in math field start
	     	
		}
		else
		{	
			if ($scope.videoFieldStatus) 
			{
						if ($scope.targetPath != undefined || $scope.targetPath != null || $scope.targetPath != "") {
							options = $scope.options;
							videoPath = $scope.targetPath
						} else {
							options = null;
							videoPath = null;
						}
			}
			else
			{
						options = null;
						videoPath = null;
			}
			query = 'INSERT OR REPLACE INTO FormData_table (FormId,userId, FormValues,FormStatus,TaskId,recordId,isRequired,insertDate,IsReassign,lat,long,version,isVideoAvailable,videoOptions,videoPath) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
   			$cordovaSQLite.execute(db, query, [obj.formId, userId, values, "saved", obj.taskId, "", isValid, new Date().setHours(0, 0, 0, 0),"false",lati,longi,commonService.getSelectedFormSkeltonVersionFromProjectTask(),$scope.videoFieldStatus,options,videoPath]).then(function (res) {
				
				alertService.doAlert(strings.formSaved);

				mapComponentServices.resetSketchingData();

				var obj ={}
				$scope.selectedFormRecordFields['uniqueID']= res.insertId;
				obj['record'] = $scope.selectedFormRecordFields;
				obj['uniqueID'] = res.insertId;
				obj.isVideoAvailable = $scope.videoFieldStatus;
				obj.videoOptions = $scope.options;
				obj.videoPath = $scope.targetPath;

				$rootScope.savedRecordsWhileOnline.push(obj);
				commonService.Loaderhide();
				$scope.targetPath ="";
				$ionicHistory.goBack();
			
			}, function (err) {
				 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
			});
			
		}
	
		
	}
	
	//get ssaved records
	$scope.getSavedRecords = function (frequency,callback) {
		$scope.enableCheckboxInProj = false;
		$scope.OfflineRecordsList =[];
		$rootScope.savedRecordsWhileOnline = [];
		var arr = [];
		var formId = commonService.getSelectedFormId();
		var taskId = commonService.getSelectedTaksId()
		var projectId = commonService.getSelectedProjectId()
		var RUID = commonService.getRecordUID();
		var userId = $localstorage.getObject("username");
		var taskType = commonService.getSelectedTakstype();
		if(taskType)
		{
			db.transaction(function(tx) {

	        //create table
	        tx.executeSql('CREATE TABLE IF NOT EXISTS FormData_table(uniqueID integer primary key autoincrement,FormId integer,userId integer ,FormValues text,FormStatus text,TaskId text,recordId text,isRequired text,displayValues text,recordComments text,IsReassign text,lat text,long text,insertDate text, version text,videoOptions text,videoPath text,isVideoAvailable text)', [], function(tx, res){
	        	
	               /*	for(var iii = 0; iii < res.rows.length; iii++)
                    {
                        frequency = res.rows.item(iii).Frequency;
                    }*/
                    if(frequency == "None")
                    {
                    	db.transaction(function(tx) 
                    	{
                    		 tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? and IsReassign=?", [formId, userId, taskId,"false"], function(tx, res){
                   		
		                  		var len = res.rows.length;
								for (var i = 0; i < len; i++) {
									var obj = {};
									console.log("get dattttttttttttttttteeeeeeee")
									console.log(res.rows.item(i));
									var savedRecord = JSON.parse(res.rows.item(i).FormValues);
									
									obj.record =  savedRecord.record[0];
									obj.record['RUID'] = savedRecord.RUID;
									obj.record['uniqueID'] = res.rows.item(i).uniqueID;
									obj['uniqueID'] = res.rows.item(i).uniqueID;
									obj.isVideoAvailable = res.rows.item(i).isVideoAvailable;
									obj.videoOptions = res.rows.item(i).videoOptions;
									obj.videoPath = res.rows.item(i).videoPath;
									$scope.OfflineRecordsList.push(savedRecord.RUID)
									$rootScope.savedRecordsWhileOnline.push(obj)
									
								}
								callback();	
                    
                   			})
                    	 }, function(err){

					         console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					       
					 	});
                    }
                    else if(frequency == "Daily")
                    {	db.transaction(function(tx) 
                    	{
                    		 tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=?  and insertDate =? and IsReassign=?", [formId, userId, taskId, new Date().setHours(0, 0, 0, 0),"false"], function(tx, res){
                   		
		                  		var len = res.rows.length;
								for (var i = 0; i < len; i++) {
									var obj = {};
									console.log("get dattttttttttttttttteeeeeeee")
									console.log(res.rows.item(i));
									var savedRecord = JSON.parse(res.rows.item(i).FormValues);
									
									obj.record =  savedRecord.record[0];
									obj.record['RUID'] = savedRecord.RUID;
									obj.record['uniqueID'] = res.rows.item(i).uniqueID;
									obj['uniqueID'] = res.rows.item(i).uniqueID;
									obj.isVideoAvailable = res.rows.item(i).isVideoAvailable;
									obj.videoOptions = res.rows.item(i).videoOptions;
									obj.videoPath = res.rows.item(i).videoPath
									$scope.OfflineRecordsList.push(savedRecord.RUID)
									$rootScope.savedRecordsWhileOnline.push(obj)
									
								}
								callback();	
                    
                   			})
                    	 }, function(err){

					         console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					       
					 	});


                    }
                    else if(frequency == "Monthly")
                    {	
                    	
                    	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
						var firstDay = new Date(y, m, 1);
						var lastDay = new Date(y, m + 1, 0);
                    	db.transaction(function(tx) 
                    	{	
	                    	tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? and insertDate >=? and insertDate <=? and IsReassign=?", [formId, userId, taskId,firstDay.setHours(0, 0, 0, 0),lastDay.setHours(0, 0, 0, 0),'false'], function(tx, res){
	                   		
			                  		var len = res.rows.length;
									for (var i = 0; i < len; i++) {
										var obj = {};
										var savedRecord = JSON.parse(res.rows.item(i).FormValues);
										
										obj.record =  savedRecord.record[0];
										obj.record['RUID'] = savedRecord.RUID;
										obj.record['uniqueID'] = res.rows.item(i).uniqueID;
										obj['uniqueID'] = res.rows.item(i).uniqueID;
										obj.isVideoAvailable = res.rows.item(i).isVideoAvailable;
										obj.videoOptions = res.rows.item(i).videoOptions;
										obj.videoPath = res.rows.item(i).videoPath
										$scope.OfflineRecordsList.push(savedRecord.RUID)
										$rootScope.savedRecordsWhileOnline.push(obj)
										
									}
									callback();	
	                    
	                   		})
	                   	}, function(err){
	                   		 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					        //errors for all transactions are reported here
					        
					 	});
                    }


                    
                    else if(frequency == "Weekly")
                    {	

                    

						var curr = new Date; // get current date
						var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
						var last = first + 6; // last day is the first day + 6

						var firstDay = new Date(curr.setDate(first));
						var lastDay = new Date(curr.setDate(last));
						db.transaction(function(tx) 
                    	{
							tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? and insertDate >=? and insertDate <=? and IsReassign=?", [formId, userId, taskId,firstDay.setHours(0, 0, 0, 0), lastDay.setHours(0, 0, 0, 0),'false'], function(tx, res){
	                   		
			                  		var len = res.rows.length;
									for (var i = 0; i < len; i++) {
										var obj = {};
										var savedRecord = JSON.parse(res.rows.item(i).FormValues);
										
										obj.record =  savedRecord.record[0];
										obj.record['RUID'] = savedRecord.RUID;
										obj.record['uniqueID'] = res.rows.item(i).uniqueID;
										obj['uniqueID'] = res.rows.item(i).uniqueID;
										obj.isVideoAvailable = res.rows.item(i).isVideoAvailable;
										obj.videoOptions = res.rows.item(i).videoOptions;
										obj.videoPath = res.rows.item(i).videoPath
										$scope.OfflineRecordsList.push(savedRecord.RUID)
										$rootScope.savedRecordsWhileOnline.push(obj)
										
									}
									callback();	
	                    
	                   		})
	                   	}, function(err){
	                   		 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					        //errors for all transactions are reported here
					        
					 	});
                    }

                    else if(frequency == "Yearly")
                    {	

                    

						var dt = new Date()
						var month = dt.getMonth()
						var year = dt.getFullYear()
						//current year 
						if(month == 0 || month == 1 || month == 2)
						{
							var firstDay = new Date(year-1, 3, 1);
							var lastDay = new Date(year, 3, 0);
						}
						else
						{
							var firstDay = new Date(year, 3, 1)
							var lastDay = new Date(year+1, 3, 0);
						}
        				
        				db.transaction(function(tx) 
                    	{
	        				tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? and insertDate >=? and insertDate <=? and IsReassign=?", [formId, userId, taskId,firstDay.setHours(0, 0, 0, 0), lastDay.setHours(0, 0, 0, 0),'false'], function(tx, res){
	                   		
			                  		var len = res.rows.length;
									for (var i = 0; i < len; i++) {
										var obj = {};
										var savedRecord = JSON.parse(res.rows.item(i).FormValues);
										
										obj.record =  savedRecord.record[0];
										obj.record['RUID'] = savedRecord.RUID;
										obj.record['uniqueID'] = res.rows.item(i).uniqueID;
										obj['uniqueID'] = res.rows.item(i).uniqueID;
										obj.isVideoAvailable = res.rows.item(i).isVideoAvailable;
										obj.videoOptions = res.rows.item(i).videoOptions;
										obj.videoPath = res.rows.item(i).videoPath
										$scope.OfflineRecordsList.push(savedRecord.RUID)
										$rootScope.savedRecordsWhileOnline.push(obj)
										
									}
									callback();	
	                    
	                   		})
	                   	}, function(err){
	                   		 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					        //errors for all transactions are reported here
					        
					 	});

                    }


                    /*$scope.getSavedRecordsBasedOnGivenFrequency(formId,taskId,projectId,userId,frequency,function()
                    {
                    	callback();
                    })*/
	        });
	    

        }, function(err){
        	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
	        //errors for all transactions are reported here
	        

    	});
	}
	else
	{
		console.log("its empty records form");

		

		db.transaction(function(tx) 
        {	
        	tx.executeSql('CREATE TABLE IF NOT EXISTS FormData_table(uniqueID integer primary key autoincrement,FormId integer,userId integer ,FormValues text,FormStatus text,TaskId text,recordId text,isRequired text,displayValues text,recordComments text,IsReassign text,lat text,long text,insertDate text, version text,videoOptions text,videoPath text,isVideoAvailable text)', [], function(tx, res){
        		tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? and  IsReassign=?", [formId, userId, taskId,"false"], function(tx, res){
	                   		
		      		var len = res.rows.length;
					for (var i = 0; i < len; i++) {
						var obj = {};
						var savedRecord = JSON.parse(res.rows.item(i).FormValues);
						
						obj.record =  savedRecord.record[0];
						obj.record['RUID'] = savedRecord.RUID;
						obj.record['uniqueID'] = res.rows.item(i).uniqueID;
						obj['uniqueID'] = res.rows.item(i).uniqueID;
						obj.isVideoAvailable = res.rows.item(i).isVideoAvailable;
						obj.videoOptions = res.rows.item(i).videoOptions;
						obj.videoPath = res.rows.item(i).videoPath
						$scope.OfflineRecordsList.push(savedRecord.RUID)
						$rootScope.savedRecordsWhileOnline.push(obj)
						
					}
					callback();	
	                    
	   			})
        	})
			
	    }, function(err){
	       		 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
		        //errors for all transactions are reported here
		        
		});
	}
		

	}


	$scope.getSavedRecordsForReassign = function (callback) {
		$scope.OfflineRecordsList =[];
		$scope.savedReassginRecordsList = [];
		$rootScope.savedRecordsWhileOnline = [];
		var userId = $localstorage.getObject("username");
		var arr = [];
		var formId = commonService.getSelectedFormId();
		var taskId = commonService.getSelectedTaksId()
		var projectId = commonService.getSelectedProjectId()
		var RUID = commonService.getRecordUID();

		db.transaction(function(tx) {

	        //create table
	        tx.executeSql('CREATE TABLE IF NOT EXISTS FormData_table(uniqueID integer primary key autoincrement,FormId integer,userId integer ,FormValues text,FormStatus text,TaskId text,recordId text,isRequired text,displayValues text,recordComments text,IsReassign text,lat text,long text,insertDate text,version text,videoOptions text,videoPath text,isVideoAvailable text)', [], function(tx, res){
	        	
	               
                    db.transaction(function(tx) 
                    	{
                    		 tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? and IsReassign=?", [formId, userId, taskId,"true"], function(tx, res){
                   		
		                  		var len = res.rows.length;
								for (var i = 0; i < len; i++) {
									var obj = {};
									console.log("Saved recordssss reassign")
									console.log(res.rows.item(i))
									var savedRecord = JSON.parse(res.rows.item(i).FormValues);
									
									obj.record =  savedRecord.record[0];
									obj.record['RUID'] = savedRecord.RUID;
									obj.record['uniqueID'] = res.rows.item(i).uniqueID;
									obj['uniqueID'] = res.rows.item(i).uniqueID;
									obj.IsReassignSaved = true;
									obj.recordId = res.rows.item(i).recordId;
									$scope.savedReassginRecordsList.push(res.rows.item(i).recordId)
									$rootScope.reassignRecords.push(obj)
									
								}
								callback($rootScope.reassignRecords);	
                    
                   			})
                    	 }, function(err){
                    	 	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					        //errors for all transactions are reported here
					        
					});
	        });
	    

        }, function(err){
        	console.log("--> db query error:isFormALredayDownnLoad"+err.message)
	        //errors for all transactions are reported here
	        

    	});

	}
	
	

	//get saved records based on freqency
	$scope.getSavedRecordsBasedOnGivenFrequency = function(formId,taskId,projectId,userId,frequency,callback)
	{

                    if(frequency == "Daily")
                    {	db.transaction(function(tx) 
                    	{
                    		 tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? and FormStatus=? and insertDate =?", [formId, userId, taskId,"false", new Date().setHours(0, 0, 0, 0)], function(tx, res){
                   		
		                  		var len = res.rows.length;
								for (var i = 0; i < len; i++) {
									var obj = {};
									console.log("get dattttttttttttttttteeeeeeee")
									console.log(res.rows.item(i));
									var savedRecord = JSON.parse(res.rows.item(i).FormValues);
									
									obj.record =  savedRecord.record[0];
									obj.record['RUID'] = savedRecord.RUID;
									obj.record['uniqueID'] = res.rows.item(i).uniqueID;
									obj['uniqueID'] = res.rows.item(i).uniqueID;
									$scope.OfflineRecordsList.push(savedRecord.RUID)
									$rootScope.savedRecordsWhileOnline.push(obj)
									
								}
								callback();	
                    
                   			})
                    	 }, function(err){
                    	 	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					        //errors for all transactions are reported here
					       
					 	});


                    }
                    else if(frequency == "Monthly")
                    {	
                    	
                    	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
						var firstDay = new Date(y, m, 1);
						var lastDay = new Date(y, m + 1, 0);
                    	db.transaction(function(tx) 
                    	{	
	                    	tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? and FormStatus=? and insertDate >=? and insertDate <=?", [formId, userId, taskId,"false", firstDay.setHours(0, 0, 0, 0),lastDay.setHours(0, 0, 0, 0)], function(tx, res){
	                   		
			                  		var len = res.rows.length;
									for (var i = 0; i < len; i++) {
										var obj = {};
										var savedRecord = JSON.parse(res.rows.item(i).FormValues);
										
										obj.record =  savedRecord.record[0];
										obj.record['RUID'] = savedRecord.RUID;
										obj.record['uniqueID'] = res.rows.item(i).uniqueID;
										obj['uniqueID'] = res.rows.item(i).uniqueID;
										$scope.OfflineRecordsList.push(savedRecord.RUID)
										$rootScope.savedRecordsWhileOnline.push(obj)
										
									}
									callback();	
	                    
	                   		})
	                   	}, function(err){
	                   		 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					        //errors for all transactions are reported here
					        
					 	});
                    }


                    
                    else if(frequency == "Weekly")
                    {	

                    

						var curr = new Date; // get current date
						var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
						var last = first + 6; // last day is the first day + 6

						var firstDay = new Date(curr.setDate(first));
						var lastDay = new Date(curr.setDate(last));
						db.transaction(function(tx) 
                    	{
							tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? and FormStatus=? and insertDate >=? and insertDate <=?", [formId, userId, taskId,"false",firstDay.setHours(0, 0, 0, 0), lastDay.setHours(0, 0, 0, 0)], function(tx, res){
	                   		
			                  		var len = res.rows.length;
									for (var i = 0; i < len; i++) {
										var obj = {};
										var savedRecord = JSON.parse(res.rows.item(i).FormValues);
										
										obj.record =  savedRecord.record[0];
										obj.record['RUID'] = savedRecord.RUID;
										obj.record['uniqueID'] = res.rows.item(i).uniqueID;
										obj['uniqueID'] = res.rows.item(i).uniqueID;
										$scope.OfflineRecordsList.push(savedRecord.RUID)
										$rootScope.savedRecordsWhileOnline.push(obj)
										
									}
									callback();	
	                    
	                   		})
	                   	}, function(err){
	                   		 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					        //errors for all transactions are reported here
					       
					 	});
                    }

                    else if(frequency == "Yearly")
                    {	

                    

						var dt = new Date()
						var month = dt.getMonth()
						var year = dt.getFullYear()
						//current year 
						if(month == 0 || month == 1 || month == 2)
						{
							var firstDay = new Date(year-1, 3, 1);
							var lastDay = new Date(year, 3, 0);
						}
						else
						{
							var firstDay = new Date(year, 3, 1)
							var lastDay = new Date(year+1, 3, 0);
						}
        				
        				db.transaction(function(tx) 
                    	{
	        				tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? and FormStatus=? and insertDate >=? and insertDate <=?", [formId, userId, taskId,"false",firstDay.setHours(0, 0, 0, 0), lastDay.setHours(0, 0, 0, 0)], function(tx, res){
	                   		
			                  		var len = res.rows.length;
									for (var i = 0; i < len; i++) {
										var obj = {};
										var savedRecord = JSON.parse(res.rows.item(i).FormValues);
										
										obj.record =  savedRecord.record[0];
										obj.record['RUID'] = savedRecord.RUID;
										obj.record['uniqueID'] = res.rows.item(i).uniqueID;
										obj['uniqueID'] = res.rows.item(i).uniqueID;
										$scope.OfflineRecordsList.push(savedRecord.RUID)
										$rootScope.savedRecordsWhileOnline.push(obj)
										
									}
									callback();	
	                    
	                   		})
	                   	}, function(err){
	                   		 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					        //errors for all transactions are reported here
					       
					 	});

                    }
	}

	$scope.setDefinedValue = function(defalutValue,prepapulatedValue,id,selectedFormRecordFields,isNew,widgetType)
	{		
			if(isNew)
			{
				if(defalutValue == "" || defalutValue == undefined)
				{
						selectedFormRecordFields[id] = ""
				}
				else
				{
					selectedFormRecordFields[id] = defalutValue;
				}
			}
			else
			{
				if(prepapulatedValue !== "" )
				{
						selectedFormRecordFields[id] = prepapulatedValue;
				}
				else
				{
					if(defalutValue == "" || defalutValue == undefined)
					{
							selectedFormRecordFields[id] = ""
					}
					else
					{
						selectedFormRecordFields[id] = defalutValue
					}
				}
			}
	}

	$scope.setDefinedValueForCalender = function(defalutValue,prepapulatedValue,id,selectedFormRecordFields,isNew,widgetType)
	{		
			if(isNew)
			{
				if(defalutValue == "" || defalutValue == undefined)
				{
						selectedFormRecordFields[id] = ""
				}
				else
				{
					selectedFormRecordFields[id] = new Date(defalutValue);
				}
			}
			else
			{
				if(prepapulatedValue !== "" )
				{
						selectedFormRecordFields[id] = prepapulatedValue;
				}
				else
				{
					if(defalutValue == "" || defalutValue == undefined)
					{
							selectedFormRecordFields[id] = ""
					}
					else
					{
						selectedFormRecordFields[id] = defalutValue
					}
				}
			}
	}

	$scope.setCheckBoxDeafultValues = function(defalutValue,prepapulatedValue,id,selectedFormRecordFields,isNew,widgetType)
	{		
			console.log("setDefinedValue")
			console.log(defalutValue)
			console.log(prepapulatedValue)
			console.log(isNew)
			console.log(widgetType)
			console.log("widgetTypewidgetTypewidgetTypewidgetType")
			if(widgetType == 'checkBox')
			{
				$scope.checkFields = [ 
                    {
                        "value" : "checkBox1",
                        "lable" : "checkBox1"
                    }, 
                    {
                        "dependFields" : [],
                        "value" : "checkbox2",
                        "lable" : "checkbox2"
                    }
                ]

			}
			if(isNew)
			{
				if(defalutValue == "" || defalutValue == undefined)
				{
						selectedFormRecordFields[id] = ""
				}
				else
				{
					selectedFormRecordFields[id] = defalutValue
				}
			}
			else
			{
				if(prepapulatedValue !== "" )
				{
						selectedFormRecordFields[id] = prepapulatedValue;
				}
				else
				{
					if(defalutValue == "" || defalutValue == undefined)
					{
							selectedFormRecordFields[id] = ""
					}
					else
					{
						selectedFormRecordFields[id] = defalutValue
					}
				}
			}
	}

	$scope.iscurrentDateBetweenProjectTaskDates = function(startDate,endDate,storedDate)
	{
	   
	    var fDate,lDate,cDate;
	   
	    from = new Date(startDate)
	    to = new Date(endDate)

	    check = new Date(storedDate)

	    fDate = Date.parse(from);
	    lDate = Date.parse(to);
	    cDate = Date.parse(check);
	    console.log(fDate)
	    console.log(lDate)
	    console.log(cDate)
	    if((cDate <= lDate && cDate >= fDate)) {
	      console.log("trueeeeeeeeeeee")
	        return true;
	    }
	    else{
	      console.log("falseeeeeeeeeeeeee")
	      return false;
	    }
	}
	//get forms of particular project task in both online and offline
	$scope.getAssignedProjectTaskForms = function(taskItem)
	{	//this is will usefull for refresh the page start
		if($scope.NotifiedTaskId ==  taskItem.taskId)
		{
			commonService.setProjectTaskNotifications("");
		}
		var obj ={}
		obj.taskId = 	taskItem.taskId;
		obj.taskType =	taskItem.taskType;
		obj.TaskName =	taskItem.TaskName;
		obj.startDate = taskItem.startDate;
		obj.taskId = 	taskItem.taskId;
		$localstorage.setObject("selectedTaskInfo",obj)
		//end 
		
		$rootScope.syncFormList = []		
		
		$rootScope.taskName=taskItem.TaskName;
		var sDate = new Date(taskItem.startDate).setHours(0,0,0,0);
		var eDate = new Date(taskItem.endDate).setHours(0,0,0,0);
		var cDate = new Date().setHours(0,0,0,0);
		
		var userId = $localstorage.getObject("username");
		var departMentId = $localstorage.getObject("groupid");
		commonService.setSelectedTaksId(taskItem.taskId);
		commonService.setSelectedProjectId(taskItem.projectId)
		commonService.setSelectedTakstype(taskItem.taskType)
		commonService.LoaderShow(strings.pleasewait);
		var url = config.url + "/api/v1/projectProcesss/getProjectTaksFromsForUser/"+taskItem.taskId+"/"+taskItem.taskType +"/"+userId;
		console.log(url)
		$rootScope.TaskForms = [];
		//assignd task function call service and return the response
		$scope.getdonwLodedFormOfGivenTask(taskItem.taskId,userId,function(TaskFormsOffline){
				if($rootScope.isNetworkOn)
				{
					formsService.assignedtask(url, securityHeaders, function (response, status) {
						commonService.Loaderhide();
						
						angular.forEach(response.data,function(value,index){
							if($scope.downloadedFormIds.indexOf(value.formId) == -1)
							{
								$rootScope.TaskForms.push({
									FormName :value.formName,
									FormId : value.formId,
									TaskId : value.taskId,
									status:false,
									cats :value.formCat.toString(),
									startDate : value.startDate,
									endDate : value.endDate,
									frequency:value.formFrequency
								});
							}
							
						})

						$scope.SyncReadyFormsOfTask = []
						var loopPromises = [];
						
						angular.forEach($scope.downloadedFormIds, function (formId) 
						{
					        var deferred = $q.defer();
					        loopPromises.push(deferred.promise);
					        
					        db.transaction(function(tx) 
				            {
				            	//var taskId = $scope.downloadedTaskIds[i]
				        		 tx.executeSql("SELECT * FROM FormData_table WHERE TaskId=? and FormId=? and userId", [taskItem.taskId,formId,userId], function(tx, res)
				        		 {
				              		var len = res.rows.length;
				              		if(len>0)
				              		{	
				              			$scope.SyncReadyFormsOfTask.push(formId)	
				              		}
				              		deferred.resolve();
				              		
									
					    
				       			})

				        	 }, function(err){
				        	 	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
						        //errors for all transactions are reported here
						        
						 	});

					       
					        
	    				})
	    				
	    				$q.all(loopPromises).then(function () {
	        					console.log('foreach loop completed. Do something after it...');
	    					});	
						
						$state.go("sidemenu.tabs.ProjectTasks.assignedProjectTasksforms")
						console.log($scope.TaskForms);
					});
				}
				else
				{	
					commonService.Loaderhide();
					$state.go("sidemenu.tabs.ProjectTasks.assignedProjectTasksforms")
				}
				
		})
		
	}

	
	$scope.getAssignedProjectTaskFormsOnRefresh = function()
	{	
		console.log("getAssignedProjectTaskFormsOnRefresh")
		console.log(taskItem)
		var taskItem =  $localstorage.get("selectedTaskInfo")
		taskItem = JSON.parse(taskItem);
		//$localstorage.set("selectedTaskInfo",taskItem);
		
		$rootScope.syncFormList = []		
		
		$rootScope.taskName=taskItem.TaskName;
		var sDate = new Date(taskItem.startDate).setHours(0,0,0,0);
		var eDate = new Date(taskItem.endDate).setHours(0,0,0,0);
		var cDate = new Date().setHours(0,0,0,0);
		
		var userId = $localstorage.getObject("username");
		var departMentId = $localstorage.getObject("groupid");
		commonService.setSelectedTaksId(taskItem.taskId);
		commonService.setSelectedProjectId(taskItem.projectId)
		commonService.setSelectedTakstype(taskItem.taskType)
		commonService.LoaderShow(strings.pleasewait);
		var url = config.url + "/api/v1/projectProcesss/getProjectTaksFromsForUser/"+taskItem.taskId+"/"+taskItem.taskType +"/"+userId;
		console.log(url)
		$rootScope.TaskForms = [];
		//assignd task function call service and return the response
		$scope.getdonwLodedFormOfGivenTask(taskItem.taskId,userId,function(TaskFormsOffline){
				if($rootScope.isNetworkOn)
				{
					formsService.assignedtask(url, securityHeaders, function (response, status) {
						commonService.Loaderhide();
						
						angular.forEach(response.data,function(value,index){
							if($scope.downloadedFormIds.indexOf(value.formId) == -1)
							{
								$rootScope.TaskForms.push({
									FormName :value.formName,
									FormId : value.formId,
									TaskId : value.taskId,
									status:false,
									startDate : value.startDate,
									endDate : value.endDate,
									cats :value.formCat.toString(),
									frequency:value.formFrequency
								});
							}
							
						})

						$scope.SyncReadyFormsOfTask = []
						var loopPromises = [];
						
						angular.forEach($scope.downloadedFormIds, function (formId) 
						{
					        var deferred = $q.defer();
					        loopPromises.push(deferred.promise);
					        
					        db.transaction(function(tx) 
				            {
				            	//var taskId = $scope.downloadedTaskIds[i]
				        		 tx.executeSql("SELECT * FROM FormData_table WHERE TaskId=? and FormId=?", [taskItem.taskId,formId], function(tx, res)
				        		 {
				              		var len = res.rows.length;
				              		if(len>0)
				              		{	
				              			$scope.SyncReadyFormsOfTask.push(formId)	
				              		}
				              		deferred.resolve();
				              		
									
					    
				       			})

				        	 }, function(err){
				        	 	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
						        //errors for all transactions are reported here
						        
						 	});

					       
					        
	    				})
	    				
	    				$q.all(loopPromises).then(function () {
	        					console.log('foreach loop completed. Do something after it...');
	    					});	
						
						$state.go("sidemenu.tabs.ProjectTasks.assignedProjectTasksforms")
						console.log($scope.TaskForms);
					});
				}
				else
				{	
					commonService.Loaderhide();
					$state.go("sidemenu.tabs.ProjectTasks.assignedProjectTasksforms")
				}
				
		})
		
	}
	//get downloaded forms of gevn task
	$scope.getdonwLodedFormOfGivenTask = function (taskId,userId,callback) {
		$scope.downloadedFormIds = [];
		var taskId = commonService.getSelectedTaksId();
		db.transaction(function(tx) {

	        //create table
	        tx.executeSql("CREATE TABLE IF NOT EXISTS FormszTable(Username text,FormId integer,FormName text, TaskId integer,Details text ,Frequency text)", [], function(tx, res){
	        	console.log("table create responseeee")
	        	console.log(res)
	            //insert data
	            tx.executeSql("SELECT * FROM FormszTable WHERE Username=? and TaskId=?", [user,taskId], function(tx, res){
                    for(var iii = 0; iii < res.rows.length; iii++)
                    {	
                    	console.log("")
                        $rootScope.TaskForms.push({
								FormName :res.rows.item(iii).FormName,
								FormId : res.rows.item(iii).FormId,
								TaskId : res.rows.item(iii).TaskId,
								status:true,
								frequency:res.rows.item(iii).Frequency
						});
						
						$scope.downloadedFormIds.push( res.rows.item(iii).FormId)
                        

                    }
                    callback($rootScope.TaskForms)
                  
                    
                })

	            

	        });
	    

        }, function(err){
        	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
	        //errors for all transactions are reported here
	       

    	});


	}

	$scope.syncProjectTaskProcess = function(taskIdsList)
	{	
		
		$rootScope.countOfReadytoSyncTasks = 0;
		$scope.syncTaskRecordsList = [];
		$scope.syncMovingRecordsList = [];
		$scope.syncMovingRecordsListRuids = [];
		var loopPromises = [];
		
		for (var i = 0; i < taskIdsList.length; i++) {
			var deferred = $q.defer();
        	loopPromises.push(deferred.promise);
			$scope.getSavedRecordsOfTaskForSync(taskIdsList[i],deferred,function(res){
				
		
			})
		
		};

		$q.all(loopPromises).then(function () {
        	var url = config.url + "/api/v1/projectProcesss/addmultiPleRecords";
        	var obj = {}
        	obj.formsRecordsList = $scope.syncTaskRecordsList;

        	obj.ruidsList =$scope.syncMovingRecordsListRuids;

        	obj.updatedBy = $localstorage.getObject("username");


			formsSave.saveForm(url, obj, securityHeaders, function (response) {
				var loopPromisesForDelete = [];
				$scope.deleteSyncedRecords($scope.syncMovingRecordsList)

				

			})
    	});	
		





	}


	$scope.syncProjectTaskFormProcess = function(taskFormIdsList)
	{	
		
		$rootScope.countOfReadytoSyncTasks = 0;
		$scope.syncTaskFormRecordsList = [];
		$scope.syncMovingRecordsListOfForm = [];
		$scope.syncMovingRecordsListOfFormRuids = []
		var loopPromises = [];
		
		for (var i = 0; i < taskFormIdsList.length; i++) {
			var deferred = $q.defer();
        	loopPromises.push(deferred.promise);
			$scope.getSavedRecordsOfTaskformForSync(taskFormIdsList[i],deferred,function(res){
				
		
			})
		
		};

		$q.all(loopPromises).then(function () {
        	var url = config.url + "/api/v1/projectProcesss/addmultiPleRecords";
        	var obj = {}
        	
        	obj.formsRecordsList =  $scope.syncTaskFormRecordsList;
        	obj.ruidsList = $scope.syncMovingRecordsListOfFormRuids;
        	obj.updatedBy = $localstorage.getObject("username");

			formsSave.saveForm(url, obj, securityHeaders, function (response) {
				var loopPromisesForDelete = [];
				$scope.deleteSyncedRecordsForForm($scope.syncMovingRecordsListOfForm)

				

			})
    	});	
	}		

	$scope.syncAllTasksOnline=function(selection){
		console.log(selection)
		SyncUtility.syncTasks(function(data){
			console.log(data)
			$scope.syncVideos(deviceData.uuid,data,"1");
		},function(){},[{"url":config.url},{"uuid":deviceData.uuid},{"username":$localstorage.getObject("username")},{"ids":selection}])

	}	
	$scope.syncAllFormsOnline=function(selection,taskId){
		console.log(selection)
		console.log($scope.taskIdOfForm);
		SyncUtility.syncForms(function(data)
		{
			console.log("inside success");
			console.log(data)
			$scope.syncVideos(deviceData.uuid,data,"2");
		},
			function(){},[{"url":config.url},{"uuid":deviceData.uuid},{"username":$localstorage.getObject("username")},{"taskids":[$scope.taskIdOfForm]},{"formids":selection}])

	}
	$scope.syncAllRecordsOnlineProj=function(selection){
		console.log(selection)
		console.log(deviceData.uuid)
		console.log(user)
		console.log(config.url)
		$scope.enableCheckboxInProj = false;
		SyncUtility.syncRecords(function(data)
		{
			console.log("inside success");
			console.log(data)
			$scope.syncVideos(deviceData.uuid,data,"3");	
			
		},function(){},[{"url":config.url},{"uuid":deviceData.uuid},{"username":user},{"ids":selection}])
	}
	$scope.syncVideos=function (uuid,recIds,type){
		console.log(recIds)
		if(recIds.length>0){
			SyncUtility.syncVideos(function(data)
				{
					console.log("inside success");
					console.log(data)
					$scope.deleteRecords(data,type);
				},
					function(){},[{"url":config.url},{"uuid":uuid},{"username":user},{"ids":recIds}])
		}
	}
	$scope.deleteRecords=function(updatedRecIds,type){
		console.log(updatedRecIds)
		var convertArray = "('" + updatedRecIds + "')";
			var arr = convertArray.replace(/,/g, "','")
				var query = "DELETE FROM FormData_table WHERE uniqueID IN " + arr
				$cordovaSQLite.execute(db, query).then(function (res) {
					if(type=="1"){
					alertService.showToast("Tasks Sync Successfull, please reload the page");
				}else if(type=="2"){
						alertService.showToast("Task Forms Sync Successfull, please reload the page"); 
					}else{
						alertService.showToast("Records Sync Successfull, please reload the page");
					}
	//				$scope.formTasksRefresh();
				}, function (err) {

					console.log(JSON.stringify(err));
				});
	}

	$scope.getSavedRecordsOfTaskformForSync = function(formId,deferred,callback)
	{	
		var userId = $localstorage.getObject("username");
		var taskId = commonService.getSelectedTaksId();

		//var userId = $localstorage.getObject("userId");
		db.transaction(function(tx) 
        {
            tx.executeSql("SELECT * FROM FormData_table WHERE userId=? and TaskId=? and FormId =?", [userId,taskId,formId], function(tx, res)
            {
                   		
			        var len = res.rows.length;
					for (var i = 0; i < len; i++) 
					{
						var obj = {};
						console.log("get dattttttttttttttttteeeeeeee")
						console.log(res.rows.item(i));
						var savedRecord = JSON.parse(res.rows.item(i).FormValues);
						obj.record =  savedRecord.record[0];
						console.log(savedRecord.record[0].RUID)
						console.log(typeof savedRecord.record[0])
						obj.record['RUID'] = savedRecord.record[0].RUID;
						obj.updatedTime = new Date();
						obj.version = res.rows.item(i).version;
						obj.taskId = taskId;
						obj.formId = res.rows.item(i).FormId;
						obj.lat = res.rows.item(i).lat
						obj.long = res.rows.item(i).long
						obj.updatedBy = res.rows.item(i).userId
						$scope.syncMovingRecordsListOfForm.push(res.rows.item(i).uniqueID)
						$scope.syncMovingRecordsListOfFormRuids.push(savedRecord.record[0].RUID)
						$scope.syncTaskFormRecordsList.push(obj)
					}
					deferred.resolve();
					callback(obj);	
            })

        }, function(err){
         console.log("--> db query error:isFormALredayDownnLoad"+err.message)
        //errors for all transactions are reported here
      
		});

	}



	//project task sync
	$scope.deleteSyncedRecords = function()
	{	
			var loopPromisesForDelete = [];
			for (var i = 0; i < $scope.syncMovingRecordsList.length; i++) 
				{	
					var deferred = $q.defer();
        			loopPromisesForDelete.push(deferred.promise);
					var query = 'DELETE FROM FormData_table WHERE uniqueID=?';
					$cordovaSQLite.execute(db, query, [$scope.syncMovingRecordsList[i]]).then(function (res) {
						deferred.resolve();
						
					});
				};
				
				$q.all(loopPromisesForDelete).then(function () 
				{
        			$rootScope.syncTaskList =[]
					$scope.SyncReadyTasks = []
					$rootScope.enableSyncTasks = false;
					alertService.doAlert("Sync Successfully completed");
    			});	
	}

	$scope.deleteSyncedRecordsForForm = function()
	{	
			var loopPromisesForDelete = [];
			for (var i = 0; i < $scope.syncMovingRecordsListOfForm.length; i++) 
				{	
					var deferred = $q.defer();
        			loopPromisesForDelete.push(deferred.promise);
					var query = 'DELETE FROM FormData_table WHERE uniqueID=?';
					$cordovaSQLite.execute(db, query, [$scope.syncMovingRecordsListOfForm[i]]).then(function (res) {
						deferred.resolve();
						
					});
				};
				
				$q.all(loopPromisesForDelete).then(function () 
				{
        			
        			$rootScope.syncFormList =[]
					$scope.SyncReadyFormsOfTask = []
					$rootScope.enableSyncforms = false;
					
					alertService.doAlert("Sync Successfully completed");
    			});	
	}

	$scope.getSavedRecordsOfTaskForSync = function(taskId,deferred,callback)
	{	
		var userId = $localstorage.getObject("username");
		//var userId = $localstorage.getObject("userId");
		db.transaction(function(tx) 
        {
            tx.executeSql("SELECT * FROM FormData_table WHERE userId=? and TaskId=?", [userId,taskId], function(tx, res)
            {
                   		
			        var len = res.rows.length;
					for (var i = 0; i < len; i++) 
					{
						var obj = {};
						console.log("get dattttttttttttttttteeeeeeee")
						console.log(res.rows.item(i));
						var savedRecord = JSON.parse(res.rows.item(i).FormValues);
						
						obj.record =  savedRecord.record[0];
						console.log(savedRecord.record[0].RUID)
						console.log(typeof savedRecord.record[0])
						obj.record['RUID'] = savedRecord.record[0].RUID;
						obj.version = res.rows.item(i).version;
						obj.updatedTime = new Date();
						obj.taskId = taskId;
						obj.formId = res.rows.item(i).FormId;
						obj.lat = res.rows.item(i).lat;
						obj.long = res.rows.item(i).long;
						obj.updatedBy = res.rows.item(i).userId;
						$scope.syncMovingRecordsList.push(res.rows.item(i).uniqueID);
						$scope.syncMovingRecordsListRuids.push(savedRecord.record[0].RUID);
						$scope.syncTaskRecordsList.push(obj)
										
					}
					deferred.resolve();
					callback(obj);	
                    
            })

        }, function(err){
         console.log("--> db query error:isFormALredayDownnLoad"+err.message)
        //errors for all transactions are reported here
    	});

	}

	$scope.sumitRecorddirectly = function(item,index)
	{	
		var taskId = commonService.getSelectedTaksId();
		var formId = commonService.getSelectedFormId();
		var userId = $localstorage.getObject("username");
		db.transaction(function(tx) 
        {	
        	var uId =  item.record.uniqueID;
            tx.executeSql("SELECT * FROM FormData_table WHERE userId=? and TaskId=? and FormId =? and uniqueID=?", [userId,taskId,formId,uId], function(tx, res)
            {
                   		
			        var len = res.rows.length;
					for (var i = 0; i < len; i++) 
					{
						var obj = {};
						console.log("get dattttttttttttttttteeeeeeee")
						console.log(res.rows.item(i));
						var savedRecord = JSON.parse(res.rows.item(i).FormValues);
						obj.record =  savedRecord.record[0];
						console.log(savedRecord.record[0].RUID)
						console.log(typeof savedRecord.record[0])
						obj.record['RUID'] = savedRecord.record[0].RUID;
						obj.version = res.rows.item(i).version;
						obj.updatedTime = new Date();
						obj.taskId = taskId;
						obj.formId = res.rows.item(i).FormId;
						obj.lat = res.rows.item(i).lat
						obj.long = res.rows.item(i).long
						obj.updatedBy = res.rows.item(i).userId
						var url = config.url + "/api/v1/projectProcesss/addProjectTaskRecord";
						var recordId = obj.record['RUID'];
						obj.lat = $scope.lat;
						obj.long = $scope.long;
						obj.RUID = savedRecord.record[0].RUID;
						delete obj.record['RUID']
						formsSave.saveForm(url, obj, securityHeaders, function (response) 
						{

								var query = 'DELETE FROM FormData_table WHERE FormId=? and uniqueID=? and TaskId=?';
								$cordovaSQLite.execute(db, query, [obj.formId, uId, obj.taskId]).then(function (res) {
									$ionicListDelegate.closeOptionButtons();
									alertService.doAlert(strings.submitted);
									$rootScope.savedRecordsWhileOnline.splice(index,1)
								});

						})
										
					}

						
                    
            })

        }, function(err){
        	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
        //errors for all transactions are reported here
   	});
	}


	$scope.deleteRecord = function (item,index) {
	/*	if ($scope.selectCheckBox) {
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

		} else {*/
		
			var query = "SELECT * FROM FormData_table WHERE uniqueID=?";
			$cordovaSQLite.execute(db, query, [item.record.uniqueID]).then(function (res) {
				if (res.rows.length > 0) {
					$cordovaSQLite.execute(db, "DELETE FROM FormData_table WHERE uniqueID=?", [item.record.uniqueID])
					.then(function (res) {
						commonService.Loaderhide();
						alertService.doAlert(strings.recordDelete, function (res) {
							$rootScope.savedRecordsWhileOnline.splice(index,1)
							$ionicListDelegate.closeOptionButtons();
					
						});

					}, function (err) {
						alert(JSON.stringify(err));
					});
				}

			}, function (err) {
				alert(JSON.stringify(err));
			});

			



		//}
	}

	$scope.getTaskIdForSyn = function(id)
	{	
		
		if($rootScope.syncTaskList.indexOf(id) == -1)
		{
			$rootScope.syncTaskList.push(id);
		}
		else
		{
			$rootScope.syncTaskList.splice($rootScope.syncTaskList.indexOf(id),1)
		}
		
	}



	$scope.getFormIdForSyn = function(id,item)
	{
		console.log(item)
		$scope.taskIdOfForm=item.TaskId;
		if($rootScope.syncFormList.indexOf(id) == -1)
		{
			$rootScope.syncFormList.push(id);
		}
		else
		{
			$rootScope.syncFormList.splice($rootScope.syncFormList.indexOf(id),1)
		}
	}
	$scope.getUniqueIdsForSyn = function(id)
	{
		
		if($scope.syncRecIdsProj.indexOf(id) == -1)
		{
			$scope.syncRecIdsProj.push(id);
		}
		else
		{
			$scope.syncRecIdsProj.splice($scope.syncRecIdsProj.indexOf(id),1)			
		}
		if ($scope.syncRecIdsProj.length == 0) {
				$scope.header_sync_hide = false;
		} else {
			$scope.header_sync_hide = true;
		}
		console.log($scope.syncRecIdsProj);
	}
	$scope.checkRecords=function(){
		$scope.HistoryPopover.hide();
		$scope.syncRecIdsProj = [];
		$scope.enableCheckboxInProj = true;
	}
	$scope.checkAllRecords=function(){
		$scope.syncRecIdsProj = [];
		$scope.HistoryPopover.hide();
		$scope.enableCheckboxInProj = true;
		angular.forEach($rootScope.savedRecordsWhileOnline, function (item) {
			$scope.getUniqueIdsForSyn(item.uniqueID);
		});
	}
	$scope.clearSelection = function () {
		$scope.enableCheckboxInProj = false;
//		$scope.selectCheckBox = false;
	},
	$scope.enableCheckboxesForReadyToSyncTasks = function()
	{
		$rootScope.enableSyncTasks = true;
	}

	$scope.enableCheckboxesForReadyToSyncTaskForms = function()
	{
		$rootScope.enableSyncforms = true;
	}
	$scope.disableSyncForms = function()
	{	
		$rootScope.syncFormList =[]
		$rootScope.enableSyncforms = false;
	}

	$scope.disableSyncTasks = function()
	{	
		console.log("disableSyncTasks")
		$rootScope.syncTaskList =[]
		$rootScope.enableSyncTasks = false;
	}
	//get project task of particular user in both offline and online base app internet mode
	$scope.getProjectTask = function()
	{	
		$scope.NotifiedTaskId = commonService.getProjectTaskNotifications()
		console.log($scope.NotifiedTaskId )
		console.log("venki")
		$scope.projectListFilterAttribute = '';
		$rootScope.projectTasks =[];
		$rootScope.syncTaskList =[]
		$scope.downloadedTaskIds = [];
		$rootScope.countOfReadytoSyncTasks = 0;
		if($rootScope.isNetworkOn)
		{
			var userId = $localstorage.getObject("username");
			var departMentId = $localstorage.getObject("groupid");
			commonService.LoaderShow(strings.pleasewait);
			var url = config.url + "/api/v1/projectProcesss/getProjectTaksForUser/"+departMentId+"/" + userId;
			$scope.getOfflineTasks(user,function(tasks){

				formsService.assignedtask(url, securityHeaders, function (response, status) {
					commonService.Loaderhide();

					angular.forEach(response.data,function(object,index)
					{	
						console.log(">>>>>>>>>Projects<<<<<<<<<");
						$rootScope.projectList = response.projects;
						console.log(response.projects);
						console.log(">>>>>>>>>Zones<<<<<<<<<");
						console.log(response.zones);
						$rootScope.zoneList = response.zones;

						console.log("each task in online ")
						console.log(object);

						if($scope.downloadedTaskIds.indexOf(object._id) == -1)
						{
								$rootScope.projectTasks.push({
									TaskName : object.name,
									projectId: object.projectID,
									zone:object.zone,
									taskId   : object._id,
									startDate : object.startDate,
									endDate : object.endDate,
									taskDescription : object.description,
									taskType:object.taskType,
									isDownloaded:false,
									projectName:object.projectName,
									projectZone:object.zone,
									assignName:object.assignName,
									projectDescription:object.projectDescription,
									projectsDate:object.projectSDate,
									projecteDate:object.projecteDate

								});	
						}
						
					})

					
					$scope.SyncReadyTasks = []
					var loopPromises = [];
					angular.forEach($scope.downloadedTaskIds, function (taskId) {
				        var deferred = $q.defer();
				        loopPromises.push(deferred.promise);
				        db.transaction(function(tx) 
			            {
			            	//var taskId = $scope.downloadedTaskIds[i]
			        		 tx.executeSql("SELECT * FROM FormData_table WHERE TaskId=?", [taskId], function(tx, res){
			       				
			              		var len = res.rows.length;
			              		if(len>0)
			              		{	
			              			$scope.SyncReadyTasks.push(taskId)	
			              		}
			              		deferred.resolve();
			              		
								
				    
			       			})
			        	 }, function(err){
			        	 	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					        //errors for all transactions are reported here
					 	});

				       
				        $q.all(loopPromises).then(function () {
        					console.log('foreach loop completed. Do something after it...');
    					});	

    				});

				


					});
			})
			
		}
		else
		{
			//alert("no taasks in offline")

			$scope.getOfflineTasks(user,function(tasks)
			{
				//$scope.tasks = tasks;
				$scope.$digest();
			})


		}
		
	}

	$scope.updateSyncReadyTasks = function(taskIds)
	{	
		$scope.SyncReadyTasks = []
		for (var i = 0; i < taskIds.length; i++) 
		{
			db.transaction(function(tx) 
            {
        		 tx.executeSql("SELECT * FROM FormData_table WHERE userId=? and TaskId=?", [userId, taskIds[i]], function(tx, res){
       		
              		var len = res.rows.length;
              		if(len>0)
              		{
              			$scope.SyncReadyTasks.push(taskIds[i])	
              		}
              		
					
	    
       			})
        	 }, function(err){
        	 	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
		        //errors for all transactions are reported here
		 	});

		};


		
	}


	$scope.getOfflineTasks = function(user,callback)
	{
		db.transaction(function(tx) {

	        //create table
	        tx.executeSql("CREATE TABLE IF NOT EXISTS ProjectTaskTable(User text,TaskId integer,Details text )", [], function(tx, res){
	            tx.executeSql("SELECT * FROM ProjectTaskTable WHERE User=?", [user], function(tx, res){
                   

                    //alert("found:"+res.rows.length)
                    var len = res.rows.length;
					console.log("testetsetststststststststts")
					console.log(len)
					var tasks = [];
					for (var i = 0; i < len; i++) {
						var task = JSON.parse(res.rows.item(i).Details);
						console.log(task)
						$scope.downloadedTaskIds.push(task._id)


						$rootScope.projectTasks.push({
							TaskName : task.name,
							projectId: task.projectID,
							taskId   : task._id,
							startDate : task.startDate,
							endDate : task.endDate,
							taskDescription : task.description,
							taskType:task.taskType,
							isDownloaded:true,
							projectName:task.projectName,
							projectZone:task.zone,
							assignName:task.assignName,
							projectDescription:task.projectDescription,
							projectsDate:task.projectSDate,
							projecteDate:task.projecteDate
						});

					}

					console.log(tasks)
					callback($rootScope.projectTasks)
					
                    
                })

	            

	        });
	    

        }, function(err){
        	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
	        //errors for all transactions are reported here

    	});

	}

	

	//get assignd and saved records of particular form of project task in both offline and online
	$scope.getProjectTaksFormRecords = function (item,onSwipe) {
		$scope.projectTaskFilterAttribute = '';
		$scope.prepopshow = true;
		$scope.showSaved = true;
		var sDate = new Date(item.startDate).setHours(0,0,0,0);
		var eDate = new Date(item.endDate).setHours(0,0,0,0);
		var cDate = new Date().setHours(0,0,0,0);
	
		$rootScope.isHistoryShowing = false;	
		$rootScope.isReassignShowing = false;	
		
		//$scope.progressbar.start();
		commonService.LoaderShow(strings.submitting);
		
		$rootScope.prepopRecords = [];

		if($rootScope.isNetworkOn)
		{
			$scope.taskType = commonService.getSelectedTakstype();
			localStorage.setItem("mapFormId", item.FormId);
			commonService.setSelectedFormId(item.FormId);
			commonService.setSelectedFormName(item.FormName);
			$rootScope.formname = item.FormName;
			setGetObj.setTaskHisotryForm(item);
			$rootScope.isView = false;
			$rootScope.TaskData = true;
			var assignedFormOfflineData = [];
			//getting offline records after that fetch onlline records
			$scope.getSavedRecords(item.frequency,function(){
				if($scope.taskType)
				{	
					
						var url = config.url + "/api/v1/projectProcesss/getRecordsOfProjectTaskForm/" + item.TaskId + "/" + item.FormId +"/"+$localstorage.getObject("username");
						reassign.getPrepopulatedData(url, securityHeaders, function (response) {
							
							$rootScope.displayValues = response.data.displayValues;
							console.log("pnlie skelton");
							console.log(response.data.dependentFields)
							//$scope.dependentFields = response.data.dependentFields;
							$localstorage.setObject("setDependentfieldsOfPT", response.data.dependentFields);
							//commonService.setDepnddentfieldsOfForm(response.data.dependentFields);

							commonService.setSelectedFormWorkInstructionFromProjectTask(response.data.workInstruction);
							commonService.setSelectedFormReferensesFromProjectTask(response.data.references);
							commonService.setSelectedFormSkeltonVersionFromProjectTask(response.data.version);
							commonService.setSelectedFormSkeltonFieldsFromProjectTask( response.data.formSkelton);
							//$scope.progressbar.set(90)
							angular.forEach(response.data.records,function(record,index){
									$rootScope.prepopRecords.push(angular.copy(record))
							})

							//$scope.progressbar.complete();
							commonService.Loaderhide();
						
							if(onSwipe){
								commonService.setSelectedFormId(item.FormId);
								commonService.setSelectedTaksId(item.TaskId);
								$rootScope.NavigatedFrom = "form";
							    $rootScope.$broadcast('showPrePopDataForProjectTasks');
								$ionicListDelegate.closeOptionButtons();
							    $scope.openMenu();
							}
							else{
								$state.transitionTo("sidemenu.tabs.ProjectTasks.projectTaskRecords");
							}
							/*$scope.getReassignRecords("venki",function(){
								console.log("ssssssssssssss")
								
							})*/
							
							
						});
				}
				else
				{	
					
					var url = config.url + "/api/v1/formsz/" + item.FormId;

					formsService.navigateToForms(url, securityHeaders, function (status, response) {
						console.log("1411111111111111111111111")
						console.log(response)
						$localstorage.setObject("setDependentfieldsOfPT", response.dependentFields);
						$rootScope.displayValues = response.requiredField;

						commonService.setSelectedFormSkeltonFieldsFromProjectTask(response.FormSkeleton)
						commonService.Loaderhide();
						if(onSwipe){
							commonService.setSelectedFormId(item.FormId);
							commonService.setSelectedTaksId(item.TaskId);
							$rootScope.NavigatedFrom = "form";
						    $rootScope.$broadcast('showPrePopDataForProjectTasks');
							$ionicListDelegate.closeOptionButtons();
						    $scope.openMenu();
						}
						else{
							$state.transitionTo("sidemenu.tabs.ProjectTasks.projectTaskRecords");
						}
					});
					
				}
			});
		}
		else
		{	
			commonService.setSelectedFormId(item.FormId);
			commonService.setSelectedFormName(item.FormName);
			$scope.getSavedRecords(item.frequency,function(){
				$scope.getOfflinePrepopRecords(user,item);
				commonService.Loaderhide();
			})
			
		}
	},

	//get assigned prepop recordds in offline
	$scope.getOfflinePrepopRecords = function(user,item,callback)
	{	
		
		
		db.transaction(function(tx) {

	        //create table
	        tx.executeSql("CREATE TABLE IF NOT EXISTS ProjectPrepopRecords(User text,TaskId integer,Details text)", [], function(tx, res){
	            tx.executeSql("SELECT * FROM ProjectPrepopRecords WHERE User=? and TaskId=? and FormId =?", [user,item.TaskId,item.FormId], function(tx, res){
                    var len = res.rows.length;
					var records = [];
					var count =0;
					for (var i = 0; i < len; i++) {
						//var task = JSON.parse(res.rows.item(i).Details);
						console.log(JSON.parse(res.rows.item(i).Records))
						var records = JSON.parse(res.rows.item(i).Records);
						for (var i = 0; i < records.length; i++) {
							var obj= {}
							obj['record'] = angular.copy(records[i])
							$rootScope.prepopRecords.push(obj)
						};
						/*angular.forEach(records,function(record,index){
							var obj= {}
							obj['record'] = angular.copy(record)
							$rootScope.prepopRecords.push(obj)
						})*/

						console.log($rootScope.prepopRecords);
					}

		
					tx.executeSql("CREATE TABLE IF NOT EXISTS FormszTable(Username text,FormId integer,FormName text, TaskId integer,Details text,Frequency text )", [], function(tx, res){
				 		
							 		tx.executeSql("SELECT * FROM FormszTable WHERE FormId =?", [item.FormId], function(tx, res){
										
										var len = res.rows.length;
										for (var i = 0; i < len; i++) {
											//var task = JSON.parse(res.rows.item(i).Details);
											var formSkelton = JSON.parse(res.rows.item(i).Details);
											
											$rootScope.displayValues = formSkelton.requiredField;
											//$scope.dependentFields = formSkelton.dependentFields;
											$localstorage.setObject("setDependentfieldsOfPT", formSkelton.dependentFields);
											
											//commonService.setDepnddentfieldsOfForm(formSkelton.dependentFields);
											
											commonService.setSelectedFormSkeltonFieldsFromProjectTask(formSkelton.FormSkeleton)

											

										}

										$state.transitionTo("sidemenu.tabs.ProjectTasks.projectTaskRecords");

										//callback($rootScope.prepopRecords,$rootScope.displayValues)
									})

					
				 	})

					


					
					
					
                    
                })

	            

	        });
	    

        }, function(err){
        	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
	        //errors for all transactions are reported here
	  
    	});

	}

	//get offline saved records	
	$scope.gotoOpenSavedRecord = function(recordObjcet,type,index)
	{	
		console.log("recordObjcet")
		console.log(recordObjcet)
		
		if(recordObjcet.isVideoAvailable)
		{	
			if(recordObjcet.videoPath != "" || recordObjcet.videoPath != undefined)
			{
				$scope.options = recordObjcet.videoOptions;
				$scope.targetPath = recordObjcet.videoPath;
				$scope.config = 
				{
					sources: [{
							src: $sce.trustAsResourceUrl($scope.targetPath),
							type: "video/mp4"
						},
					],
					theme: "lib/videogular-themes-default/videogular.css",
					plugins: {
						poster: "http://www.videogular.com/assets/images/videogular.png"
					}
				};

			}
			else
			{
				$scope.targetPath =""
			}
				

		}
		else
		{
			$scope.targetPath =""
		}

		$scope.dependentFields = $localstorage.getObject("setDependentfieldsOfPT");
		if(recordObjcet.record.sketching != undefined)
			$rootScope.sketchingData = recordObjcet.record.sketching;

		$rootScope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
		$scope.selectedFormRecordFields = recordObjcet.record;
		$rootScope.isEmptyForm = false;
		$rootScope.isSavedRecord = true;
		$rootScope.seletedRecordId = recordObjcet.record.RUID
		$rootScope.slectedSavedRecordIndex =index;;
		commonService.setRecordUID(recordObjcet.record.RUID)
		//delete item.record.RUID;
		alertService.showToast($scope.formLoderMsg);
		$state.go("sidemenu.tabs.ProjectTasks.assignedProjectTasksformView");
	},
	
	$scope.gotoFormFilling = function (item,type,index) {
		
		$scope.targetPath =""
		$scope.dependentFields = $localstorage.getObject("setDependentfieldsOfPT");
		console.log("itemmmm")
		console.log(item);
		//$scope.selectedFormRecordFields[k] = v;
		$rootScope.isEmptyForm = false;
		$rootScope.fillingFormtype = type;
		if($rootScope.fillingFormtype == "reassign")
		{	

			/*angular.forEach(item.record, function (value, key) {
				angular.forEach(value, function (v, k) {
					if (k.includes("Video")) {
						$scope.videoUrl = config.url + "/api/v1/gridFS/getvideo/" + v
							console.log($rootScope.videoUrl);
					}
					$rootScope.selectedFormRecordFields[k] = v;
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
			*/

			$rootScope.selectedReaginRecordId = item.recordId;

		}
		$rootScope.isSavedRecord = false;
		$rootScope.slectedPrepopRecordIndex =index;

		$rootScope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
		commonService.setRecordUID(item.record.RUID)
		$rootScope.seletedRecordId = item.record.RUID;
		//delete item.record.RUID;
		$scope.selectedFormRecordFields =item.record;

		if(item.record.sketching != undefined)
			$rootScope.sketchingData = item.record.sketching;

		console.log($scope.selectedFormRecordFields)
		alertService.showToast($scope.formLoderMsg);
		$state.go("sidemenu.tabs.ProjectTasks.assignedProjectTasksformView");
	},

	$scope.gotoFormFillingHistory = function (item,type,index) {
		console.log("gotoFormFillingHistory")
		console.log(item);
		$scope.targetPath =""
		$scope.dependentFields = $localstorage.getObject("setDependentfieldsOfPT");
		$rootScope.slectedPrepopRecordIndex =index;

		$rootScope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
		

		//delete item.record.RUID;
		$scope.selectedFormRecordFields =item.record;

		console.log($scope.selectedFormRecordFields)
		alertService.showToast($scope.formLoderMsg);
		$state.go("sidemenu.tabs.ProjectTasks.assignedProjectTasksformViewHistory");

	},

	$scope.gotoEmptyForrmfilling = function()
	{	
		$scope.targetPath =""
		$scope.dependentFields = $localstorage.getObject("setDependentfieldsOfPT");
		$rootScope.isEmptyForm = true;
		commonService.setSelectedDirectTaskFormRecordId(undefined);
		$rootScope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
		$scope.selectedFormRecordFields ={};
		console.log($rootScope.fields);
		alertService.showToast($scope.formLoderMsg);
		$state.go("sidemenu.tabs.ProjectTasks.assignedProjectTasksformView");	
	}

	//project form submition
	$scope.submitProjectTaskForm =  function(isValid, type)
	{	
		if(!isValid)
		{
			alertService.doAlert(strings.fillMandetory);
			commonService.Loaderhide();
			return;
		}
		
		var obj = {};
		var arr =[];
		arr.push($scope.selectedFormRecordFields)
		obj.record = arr;
		obj.formId = commonService.getSelectedFormId();
		obj.taskId = commonService.getSelectedTaksId()
		obj.projectId = commonService.getSelectedProjectId()
		obj.RUID = commonService.getRecordUID();
		obj.version = commonService.getSelectedFormSkeltonVersionFromProjectTask();
		var datenow = new Date();
		var isoDate = datenow.toISOString();
		obj.updatedTime = isoDate;
		obj.updatedBy = $localstorage.getObject("username");
		if(!$rootScope.isEmptyForm){
			if($rootScope.fillingFormtype  == 'reassign' )
				obj.recordId = $rootScope.selectedReaginRecordId;
			else
				obj.recordId = undefined;
		}
		else{
				obj.recordId = undefined;
		}
		commonService.LoaderShow(strings.submitting);
		
		commonService.getLatLong(function (geoLocation) {
			
			if (geoLocation.netstatus == "error") {
				commonService.Loaderhide();
				alertService.showToast(geoLocation.message);
				return;
			} 
			$scope.lat = geoLocation.latlong[0];
			$scope.long = geoLocation.latlong[1];
			
			if (isValid) 
			{
			//modified by venkatesh bendi for auto calculations in math field start
			var invalidCalculationsFieldList = [];
			calculatonFrmulaExcecutorService.isCalculationsFieldsAreStoresValidValues($scope.recordInfo,invalidCalculationsFieldList,$scope);
			//End

			// conditon to check for any fields are exceuted after calculation is executed
			if(invalidCalculationsFieldList.length == 0)
			{
				//commonService.LoaderShow(strings.submitting);
				
				
			
				var url = config.url + "/api/v1/projectProcesss/addProjectTaskRecord";
				var recordId = obj.record['RUID'];
				obj.lat = $scope.lat;
				obj.long = $scope.long;
				delete obj.record['RUID']
				var deferredForSaveRecord = $q.defer();
				var deferredForSaveRecordPromise;
				var generatedId=Date.now();
				obj.generatedId = generatedId;
				
				formsSave.saveForm(url, obj, securityHeaders, function (response) {
					console.log("submit records responseee");
					if (response.status == 204) {
						commonService.Loaderhide();
						alertService.doAlert("This record alreaady submited by other user,please contact adminstratore");
					} else {
						deferredForSaveRecord.resolve(response);

						var deferredForSaveRecordPromise = deferredForSaveRecord.promise;
						if(!$scope.videoFieldStatus && $scope.path =="" && $scope.path == undefined)
							var deferredForSaveRecordVideoPromise = deferredForSaveRecord.promise;
					}
				});
					
				if($scope.videoFieldStatus && $scope.path !="" && $scope.path != undefined)
				{
					var videoUrl = config.url + "/api/v1/gridFS/addvideo/";

					var deferredForSaveRecordVideoPromise = promisingMethods.uploadVideo(videoUrl,$scope.path,$scope.options,obj.generatedId).then(function(result){
							console.log(result)
							$scope.targetPath ="";
					});
				}				
				
				$q.all([deferredForSaveRecordPromise,deferredForSaveRecordVideoPromise]).then(function(result){
					$rootScope.signatureimage = "";
						commonService.Loaderhide();
						var itemObj = {};
						itemObj['FormId'] = commonService.getSelectedFormId();
						itemObj['FormName'] = commonService.getSelectedFormName();
						itemObj['TaskId'] = commonService.getSelectedTaksId();
						
						if($rootScope.isSavedRecord)
						{
								var query = 'DELETE FROM FormData_table WHERE FormId=? and uniqueID=? and TaskId=?';
								$cordovaSQLite.execute(db, query, [obj.formId, $scope.selectedFormRecordFields['uniqueID'], obj.taskId]).then(function (res) {
									console.log("delete responseeeee");
									console.log(res);
									$rootScope.savedRecordsWhileOnline.splice($rootScope.slectedSavedRecordIndex,1)
									$state.go("sidemenu.tabs.ProjectTasks.projectTaskRecords")
								});
						}
						else
						{		
								if($rootScope.fillingFormtype  == 'prepop')
									$rootScope.prepopRecords.splice($rootScope.slectedPrepopRecordIndex,1)
								else if($rootScope.fillingFormtype  == 'reassign')
									$rootScope.reassignRecords.splice($rootScope.slectedPrepopRecordIndex,1)
								//$ionicHistory.goBack();
								console.log("$rootScope.prepopRecords $rootScope.prepopRecords$rootScope.prepopRecords")
								console.log($rootScope.prepopRecords)
								$state.go("sidemenu.tabs.ProjectTasks.projectTaskRecords")
						}
						
						//$scope.getProjectTaksFormRecords(itemObj);
						commonService.Loaderhide();
						alertService.doAlert(strings.submitted);

						mapComponentServices.resetSketchingData();

				})
				
			}
			else{
				alertService.doAlert("Please recheck listed calulation fileds :"+invalidCalculationsFieldList.join());
				commonService.Loaderhide();
			}

		} else {
			//commonService.Loaderhide();
			//alertService.doAlert(strings.fillMandetory);
		}
	})
		
	}

	
	$scope.getCheck = function(checkBoxValues,curentBoxValueList)
	{	
		if(curentBoxValueList != undefined)
		{
				if(curentBoxValueList.indexOf(checkBoxValues) ==-1)
				{
					return false
				}
				else
					return true
		}
		else
			return false
	
		/*console.log("i ma check callll")
		var existValuescount = 0;
		angular.forEach(checkBoxValues,function(individdualCheckbox,index){
			console.log(individdualCheckbox.value)
			if(curentBoxValueList.indexOf(individdualCheckbox.value) >-1)
			{
				existValuescount ++;
			}
		})

		if(existValuescount>0)
			return true
		else
			return false*/
	}

	$scope.toggleSelectionProject = function (id, item,fieldsList) {
		console.log("toggleSelectionProject")
		if(fieldsList[id] == undefined || fieldsList[id] == "")
		{
			var arr =[];
			arr.push(item)
			fieldsList[id] = arr
		}else{
			console.log("i am elseee")
			if(fieldsList[id].indexOf(item) == -1)
				fieldsList[id].push(item)
			else
				fieldsList[id].splice(fieldsList[id].indexOf(item),1)
		}

		console.log(fieldsList)
		
	}

	$scope.convertToDate = function (date) {
		if (!date || date == null || date == "") {
			return "";
		} else {
			return new Date(date);
		}
	}

	$scope.scanBarcode = function (index, id) {
		console.log("scanBarcodescanBarcodescanBarcode")
		$scope.barCodeIndex = index;
		$cordovaBarcodeScanner.scan().then(function (imageData) {
			$scope.codeURI = imageData.text;
			$scope.selectedFormRecordFields[id] = $scope.codeURI;
			console.log($scope.selectedFormRecordFields[id])
		}, function (error) {});
	}

	/**
     * @description excecte the fromula on widget
     * @param {Number,number,string,boolean} 
     * @developer venkatesh bendi
    */ 
	$scope.formulaExecution = function(id,index,formula,isPrepoRecord)
	{	
	
		$scope.formulaSimplifier ="";
		var isEmptyValues =false;
		angular.forEach(formula,function(formulaObjcet,index){
			if(isPrepoRecord)
			{
					isEmptyValues = calculatonFrmulaExcecutorService.formulaValidatore(formulaObjcet,$scope.selectedFormRecordFields,$scope)

					//isEmptyValues = $scope.formulaValidatore(formulaObjcet,$scope.selectedFormRecordFields)
			}
			else 
					isEmptyValues = calculatonFrmulaExcecutorService.formulaValidatore(formulaObjcet,$scope.recordInfo,$scope)
			
		})
	
		if(!isEmptyValues)
		{
			if(isPrepoRecord)
			{

				$scope.selectedFormRecordFields[id] = math.eval($scope.formulaSimplifier);
			}
			else
			{
				$scope.recordInfo[id] = math.eval($scope.formulaSimplifier);	
			}
		}
		else
		{
			//alert("some Fileds are missing to fill!")
			alertService.doAlert("Some fields are missing to fill")
		}
	}


	$scope.openSignatureModal = function ($event, index, id) {
		$rootScope.isSignaturePadEnabled = true;
		$scope.signIndex = index;
		$ionicModal.fromTemplateUrl('templates/signature.html', {
            scope: $scope,
            animation: 'slide-in-up'
		}).then(function (popover) {
			$scope.sigpopover = popover;
			$scope.sigpopover.show($event);
			var canvas = document.getElementById('signatureCanvas');

			var context = canvas.getContext('2d');

			window.setTimeout(function () {
				var signaturePad = new SignaturePad(canvas);

                        $scope.closeSignaturePadPopover = function() {
                            $rootScope.isSignaturePadEnabled = false;
                            $scope.sigpopover.remove();
                        };
                        $scope.clearCanvas = function() {
                            signaturePad.clear();
                        }
                        $scope.saveCanvas = function() {
                            if (signaturePad.isEmpty()) {
                                signaturePad.clear();
                            } else {
                            	var sigImg = signaturePad.toDataURL();
                            	$scope.selectedFormRecordFields[id] = sigImg;
                                signaturePad.clear();
								context.clearRect(0, 0, canvas.width, canvas.height);
								delete signaturePad;
								$scope.sigpopover.remove();
							}
						}
			}, 300);
		});
		var flag = false;
		$scope.$on('popover.removed', function () {
			flag = true;
		});
		var clearSigPad = function () {
			$scope.sigpopover.remove();
		};
		$scope.$on('popover.hidden', function () {
			if (flag == false) {
				clearSigPad();
			}
			return;
		});
	}

	
	


	//open elipse start 
	$ionicPopover.fromTemplateUrl('templates/elipsseProjectRecords.html', {
		scope : $scope
	}).then(function (popover) {
		$scope.HistoryPopover = popover;
	});

	$scope.projectOpenPopover = function () {
		$scope.HistoryPopover.show();
	};

	$scope.closePopover = function () {
		$scope.HistoryPopover.hide();
	}
	//elipse end

	$scope.getLocation = function (id, index) {
		if($scope.selectedFormRecordFields[id] == null || $scope.selectedFormRecordFields[id] == "" || $scope.selectedFormRecordFields[id] == undefined){
			commonService.LoaderShow(strings.pleasewait);
			$scope.locationIndex = index;
			commonService.getLatLong(function (geoLocation) {
				if (geoLocation.netstatus == "success") {
					var lat = geoLocation.latlong[0];
					var long = geoLocation.latlong[1];
				//	$scope.latLong = "  Lat , Long : " + lat + " , " + long;
					 $scope.latLong= lat + " , " + long;

				//$scope.Location[id] = "  Lat , Long : " + lat + " , " + long;
					$scope.selectedFormRecordFields[id] = $scope.latLong;
					commonService.Loaderhide();
				}
				if (geoLocation.netstatus == "error") {
					commonService.Loaderhide();
					alertService.showToast(geoLocation.message);
				}
			});
		}
	}

	$scope.takePicture = function (id) {
		$scope.popover_hide = false;
		var options = {
			quality : 100,
			destinationType : Camera.DestinationType.DATA_URL,
			sourceType : Camera.PictureSourceType.CAMERA,
			allowEdit : false,
			encodingType : Camera.EncodingType.JPEG,
			targetWidth : 900,
			targetHeight : 900

		};

                $cordovaCamera.getPicture(options).then(function(imageData) {
                	$scope.selectedFormRecordFields[id] = "data:image/jpeg;base64," + imageData;
                    
                   
                    $scope.closePopover();

		}, function (err) {
			$scope.closePopover();
		});
	}

	$scope.choosePhoto = function (id) {
		$scope.popover_hide = false;
		var options = {
			quality : 100,
			destinationType : Camera.DestinationType.DATA_URL,
			sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
			allowEdit : false,
			encodingType : Camera.EncodingType.JPEG,
			targetWidth : 900,
			targetHeight : 900,
			popoverOptions : CameraPopoverOptions,
			saveToPhotoAlbum : false
		};
		$cordovaCamera.getPicture(options).then(function (imageData) {
			$scope.selectedFormRecordFields[id] = "data:image/jpeg;base64," + imageData;
          
			$scope.closePopover();
		}, function (err) {
			$scope.closePopover();
		});
	}

	$scope.removePhoto = function (id) {
		$scope.selectedFormRecordFields[id] = "null";
		$scope.closePopover();
	}

	$scope.imageToDataUri = function (img, width, height) {
		var sourceImage = new Image();
		sourceImage.src = img;
		// create an off-screen canvas
		var canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d');

		// set its dimension to target size
		canvas.width = width;
		canvas.height = height;

		// draw source image into the off-screen canvas:
		ctx.drawImage(sourceImage, 0, 0, width, height);

		// encode image to data-uri with base64 version of compressed image
		return canvas.toDataURL();
	}

	$scope.openPopover = function ($event, id, index) {
		$scope.selectedImageIndex = index;
		$scope.selectedId = id;
		$scope.popover.show($event);
	};

	$scope.closePopover = function () {
		$scope.popover.hide();
	}

//phani cahnges for mailing the records start

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
  obj.formid = commonService.getSelectedFormId();
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


 $scope.GetSelectedType = function(val){
 	$scope.projectTaskFilterAttribute = val;
	if (val == "saved") {
		$scope.prepopshow = false;
		$scope.showSaved = true;
	}
	if (val == "new") {
		$scope.prepopshow = true;
		$scope.showSaved = false;
	}
}

$scope.clearTaskFormFilter = function(){
	$scope.prepopshow = true;
	$scope.showSaved = true;
	$scope.projectTaskFilterAttribute = '';
}

 //phani cahnges for mailing the records end
	$ionicPopover.fromTemplateUrl('templates/popover.html', {
		scope : $scope
	}).then(function (popover) {
		$scope.popover = popover;
	});

	$ionicPopover.fromTemplateUrl('templates/ellipsePopover.html', {
		scope : $scope
	}).then(function (popover) {
		$scope.elipsePopover = popover;
	});

});

app.filter('projectNameFilter',function(){
 return function(input,option){
     if(option == null){
         return input;
        }
        else{
         var output =[];
            angular.forEach(input,function(value,key){
                if(value.projectName == option){
                    output.push(value);
                }
            });
         return output;
        }
    }
});

app.filter('zoneFilter',function(){
 return function(input,option){
     if(option == null){
         return input;
        }
        else{
         var output =[];
            angular.forEach(input,function(value,key){
                if(value.projectZone == option){
                    output.push(value);
                }
            });
         return output;
        }
    }
});
//});
