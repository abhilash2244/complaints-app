angular.module('starter.controllers')
.controller('formDetailsCtrl', function ($filter, $scope, $state, $ionicHistory, $rootScope, setGetObj, $ionicPopover, $ionicModal, $localstorage, config, alertService, $cordovaCamera, $cordovaBarcodeScanner, formsSave, formsService, commonService, $cordovaSQLite, strings,calculatonFrmulaExcecutorService,taskDownloadAndSync,$cordovaCapture, $cordovaFileTransfer,mapComponentServices,$http,$ionicSideMenuDelegate,$sce,promisingMethods,$q) {
	$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormSkeleton_table(FormId integer,Username text,id integer, FormName text ,FormSkeleton text,requiredFields text,derivedFields text)').then(function (res) {}, function (err) {
		alert(JSON.stringify(err));
		});
	$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS videoDataOffline(videoOptions text,videoPath text,recordId text,FormId text, TaskId text,Username text)').then(function (res) {}, function (err) {
		alert(JSON.stringify(err));
		});
	console.log($rootScope.condition)

	$scope.taskEllipse = false;
	securityHeaders.headers = commonService.securityHeaders();
	$scope.rating = {};
	$scope.videoPath={};
	$scope.recordInfo = {};
	$scope.filedId = "";
	$scope.status = commonService.checkConnection();
  	$scope.rating.max = 5;
	$scope.calculationFieldsList = [];
	$scope.selection = [];
	$scope.fileds = [];
	$scope.stopVoiceRecong = false;
	$scope.pullOverCheck = {value : false};
	$scope.voiceSearchToggle = {value : false};
	var promises=[];
	if ($scope.status == true) {
		if($rootScope.condition){
			$scope.hideicon=true;
			$scope.saveButton = true;
			$scope.submitButton = true;
		}else{
			$scope.hideicon=false;
			$scope.saveButton = false;
			$scope.submitButton = false;
		}
	/*	if ($rootScope.isHistoryChecked == true) {
			$scope.saveButton = true;
			$scope.submitButton = true;
		} else if ($rootScope.isHistoryChecked == "reassign") {}
		else if ($rootScope.TaskData == false) {}
		else if ($rootScope.TaskData) {}
		else {
			$scope.saveButton = false;
			$scope.submitButton = false;
		}*/
	} else {
		$scope.saveButton = false;
		$scope.submitButton = true;
	}

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
	$ionicPopover.fromTemplateUrl('templates/viewVideoPreview.html', {
		scope : $scope
	}).then(function (popover) {
		$scope.videoPopover = popover;
	});
	$scope.openVideoPopover = function (targetPath) {
		$scope.targetPath=targetPath;
	//	$scope.targetPath= targetPath.substring(targetPath.indexOf('s'))
	//	$scope.targetPath="file://storage/emulated/0/DCIM/Camera/VID_20180130_182127879.mp4"
	//	$scope.targetPath="/Internal Storage/DCIM/Camera/VID_20180130_183250142.mp4"
		console.log($scope.targetPath)
		$scope.videoPopover.show();
	};
	$scope.closeVideoPopover = function () {
		$scope.videoPopover.hide();
	};
	$scope.openPopover = function ($event, id, index) {
		$scope.selectedImageIndex = index;
		$scope.selectedId = id;
		$scope.popover.show($event);
	};

	$scope.startSpeech = function (voiceSearchToggle) {
    	if(!voiceSearchToggle.value){
			$scope.stopVoiceRecong = false;
	    	voiceSearchToggle.value = false; 
			$scope.voiceRecogIncrementForGroupOrSection = 0;
			$scope.voiceRecogIncrementForGroupInSection = 0;
			$scope.voiceRecogIncrement = 0;
			mapComponentServices.startSpeech($scope);
  		}
  		else{
			$scope.stopVoiceRecong = true;
  		}
  		voiceSearchToggle.value = !voiceSearchToggle.value;
	};

	$scope.openellipsePopover = function () {
		$scope.elipsePopover.show();
	};
	$scope.closeellipsePopover = function () {
		$scope.elipsePopover.hide();
	};
	$scope.closePopover = function () {
		$scope.popover.hide();
	};


	$scope.closeModal = function () {
		mapComponentServices.closeModal($scope);
	};

	$scope.$on('closePopoversInViewForm', function () {
		if($ionicSideMenuDelegate.isOpen()){
			openMenu();
		}
		else if($scope.elipsePopoverInForms != undefined && $scope.elipsePopoverInForms._isShown){
			mapComponentServices.closeellipsePopoverInForms($scope);
		}
   		else if ($scope.modal != undefined && $scope.modal._isShown) {
			mapComponentServices.closeModal($scope);
   		}else if($scope.modalForSketchings != undefined && $scope.modalForSketchings._isShown){
			mapComponentServices.closeModalOfSketchings($scope);
   		}
   		else{		
//			commonService.resetSketchingData();
			$scope.stopVoiceRecong = true;
			$ionicHistory.goBack();
		}
  	});

 	/**
     * @desc 
        For showing work instructions on popup  
     * @modified by Santhosh Kumar Gunti
 	*/

	$scope.workInstructions = function () {
		mapComponentServices.workInstructions($scope,setGetObj.getTaskHisotryForm().FormWorkInstruction);
	};

 	/**
     * @desc 
        For showing existing sketchings  
     * @modified by Santhosh Kumar Gunti
 	*/
	$scope.sketchings = function(){
//		$scope.getSketchings();
		mapComponentServices.sketchings($scope);
	}

 	/**
     * @desc 
        For showing references  
     * @modified by Santhosh Kumar Gunti
 	*/
	$scope.references = function(){
		mapComponentServices.references($scope,setGetObj.getTaskHisotryForm().references);
	}

	$scope.openellipsePopoverInForms = function () {
		mapComponentServices.openellipsePopoverInForms($scope);
	};
	$scope.closeellipsePopoverInForms = function () {
		mapComponentServices.closeellipsePopoverInForms($scope);
	};
	
	$scope.closeModalOfSketchings = function(){
		mapComponentServices.closeModalOfSketchings($scope);
	}

	$scope.closeModalOfReferences = function(){
		mapComponentServices.closeModalOfReferences($scope);
	}

	$scope.goToReferences = function(url){
		window.open(url, '_system', 'location=yes');
	}

	$scope.editSketching = function(sketchingData){
		mapComponentServices.editSketching($scope,sketchingData,$rootScope.condition);
	}

	$scope.deleteSketching = function($index){
		mapComponentServices.deleteSketching($scope,$index);
	}

	$scope.addSketching = function () {
		mapComponentServices.addSketching($scope);
		openMenu();
	};

	//Cleanup the popover when we're done with it!
	$scope.$on('$destroy', function () {
		$scope.popover.remove();
	});

	$scope.fileds = {};
	$scope.Barcode = {};
	$scope.Location = {},
	$scope.selected = [];
	$scope.checkLength;
	$scope.video={};
	$scope.toggleSelection = function (id, item) {
		if (!$scope.selectedFormRecordFields) {
			$scope.selectedFormRecordFields = [];
		}
		if ($scope.selectedFormRecordFields && ($scope.selectedFormRecordFields.length > 0 || !$scope.selectedFormRecordFields[id] || $scope.selectedFormRecordFields[id] === "")) {
			$scope.selectedFormRecordFields[id] = [];
		} else if (!angular.isArray($scope.selectedFormRecordFields[id])) {
			var string = $scope.selectedFormRecordFields[id];
			$scope.selectedFormRecordFields[id] = string.split(',');
		}
		var items = [];
		if ($scope.selected[id]) {
			var idx = $scope.selected[id].indexOf(item);
			if (idx > -1) {
				$scope.selected[id].splice(idx, 1);
			} else {
				if ($scope.selected[id].length >= 1) {
					angular.forEach($scope.selected[id], function (value, key) {
						items.push(value);
					})
				}
				items.push(item);
				$scope.selected[id] = items;
			}
		} else {
			items.push(item);
			$scope.selected[id] = items;
		}
		$scope.fileds[id] = $scope.selected[id];
	};

	$scope.isContains = function (collection, item) {
		if (collection && collection.length > 0 && collection.indexOf(item) != -1) {
			return true;
		} else {
			return false;
		}
	},
$scope.isVideoAvailable=function(videoFieldStatus){
	console.log(videoFieldStatus)
	$scope.videoFieldStatus=videoFieldStatus;
}
	/**
     * @description This for form saving
     * @param {string} record id
     * @update by Venkatesh Bendi for tatapower 
     * @update for finding calculation fields are excetued with latest values of dependent fieldds if not then auto formula excection
    */
	$scope.saveForm = function (isValid, type) {
		commonService.LoaderShow(strings.pleasewait);
		commonService.getLatLong(function (geoLocation) {
			if (geoLocation.netstatus == "success") {
				commonService.LoaderShow(strings.pleasewait);

				$scope.lat = geoLocation.latlong[0];
				$scope.long = geoLocation.latlong[1];

			}
			if (geoLocation.netstatus == "error") {
				commonService.Loaderhide();
				alertService.showToast(geoLocation.message);
			}

			$scope.status = commonService.checkConnection();

			if ($rootScope.isGridRecodsShow == false) {
				if (isValid) {
					//modified by venkatesh bendi for auto calculations in math field start
					var invalidCalculationsFieldList = [];
					calculatonFrmulaExcecutorService.isCalculationsFieldsAreStoresValidValues($scope.recordInfo,invalidCalculationsFieldList,$scope);
					//End

					// conditon to check for any fields are exceuted after calculation is executed
					if(invalidCalculationsFieldList.length == 0)
					{
						commonService.LoaderShow(strings.submitting);
						var url = config.url + "/api/v1/formszDetails/create";
						var obj={};
						var arryfinal=[];
						arryfinal.push($scope.recordInfo);
						obj.record = arryfinal;
						obj.lat = $scope.lat;
						obj.long = $scope.long;
						obj.formId =$localstorage.getObject("formId");
						obj.taskId = $localstorage.getObject("TaskId");
						var datenow = new Date();
						var isoDate = datenow.toISOString();
						obj.updatedTime = isoDate;
						obj.updatedBy = $localstorage.getObject("username");
						obj.UUID=$localstorage.getObject("deviceInfo").uuid;
						obj.generatedId=Date.now();
						console.log(obj)
						promisingMethods.createRecord(url,obj,securityHeaders).then(function(result){
									console.log(result)
									promises.push(result)
						});			
									console.log($scope.videoFieldStatus)

							if($scope.videoFieldStatus){
								console.log($scope.options)
								if($scope.options){
									promisingMethods.uploadVideo($scope.url,$scope.path,$scope.options,obj.generatedId).then(function(res){
											console.log(res)
											promises.push(res)
											$q.all(promises).then(function(results){
												console.log(results)
												commonService.Loaderhide();
												$state.transitionTo("sidemenu.taskformhistory");
											//		commonService.resetSketchingData();
													alertService.doAlert(strings.submitted);
											});
									});
								}else{
										$q.all(promises).then(function(results){
										console.log(results)
										commonService.Loaderhide();
										$state.transitionTo("sidemenu.taskformhistory");
									//	commonService.resetSketchingData();
										alertService.doAlert(strings.submitted);
									});
								}
							}else{
								$q.all(promises).then(function(results){
									console.log(results)
									commonService.Loaderhide();
									$state.transitionTo("sidemenu.taskformhistory");
									//	commonService.resetSketchingData();
										alertService.doAlert(strings.submitted);
								});
							}
							
					//	});
						
					}
					else{
						alertService.doAlert("Please recheck listed calulation fileds :"+invalidCalculationsFieldList.join());
						commonService.Loaderhide();
					}

				} else {
					commonService.Loaderhide();
					alertService.doAlert(strings.fillMandetory);
				}
			} else {
				if (type == "submit") {
			//		$scope.objectFormPreparationOffline(type, function (data, isFailed) {
						console.log(isValid)
						if (isValid) {
							var arryfinal=[];
							var valueObject={};
						//	inobj["sketching"] = $scope.selectedFormRecordFields['sketching'];
							arryfinal.push($rootScope.selectedFormRecordFields);
							valueObject.record = arryfinal;
							valueObject.formId = $localstorage.getObject("formId");
							valueObject.taskId = $localstorage.getObject("TaskId");
							valueObject.lat = $scope.lat;
							valueObject.long = $scope.long;
							var datenow = new Date();
							var isoDate = datenow.toISOString();
							valueObject.updatedTime = isoDate;
							valueObject.updatedBy = $localstorage.getObject("username");
							valueObject.status = false;
							valueObject.generatedId=Date.now();
							valueObject.UUID=$localstorage.getObject("deviceInfo").uuid;
							commonService.LoaderShow(strings.submitting);
							if ($rootScope.isHistoryChecked == "reassign" || $rootScope.prepopDataShow) {
								console.log($scope.videoFieldStatus)
								var a1=promisingMethods.updatePrepopRecord(valueObject,securityHeaders).then(function(result){
									console.log(result)
								});
								if($scope.videoFieldStatus){
									console.log($scope.path);
									if($scope.options){
										var a2=promisingMethods.uploadVideo($scope.url,$scope.path,$scope.options,valueObject.generatedId).then(function(result){
											console.log(result)
										});
									$q.all([a1, a2]).then(function (result) {
										console.log(result)
										var query = 'DELETE FROM FormData_table WHERE uniqueID=?';
										$cordovaSQLite.execute(db, query, [$localstorage.getObject("offlineRecordId")]).then(function (res) {});
										
										commonService.Loaderhide();
										alertService.doAlert(strings.submitted, function (res) {
											$state.transitionTo("sidemenu.taskformhistory");
										});

									});
								} else {
									$q.all([a1]).then(function (result) {
										console.log(result)
										var query = 'DELETE FROM FormData_table WHERE uniqueID=?';
										$cordovaSQLite.execute(db, query, [$localstorage.getObject("offlineRecordId")]).then(function (res) {});
									commonService.Loaderhide();
									alertService.doAlert(strings.submitted, function (res) {
										$state.transitionTo("sidemenu.taskformhistory");
									});
								   
										});
									}
								}else{
										$q.all([a1]).then(function(result){
									console.log(result)
									var query = 'DELETE FROM FormData_table WHERE uniqueID=?';
										$cordovaSQLite.execute(db, query, [$localstorage.getObject("offlineRecordId")]).then(function (res) {});
									commonService.Loaderhide();
									alertService.doAlert(strings.submitted, function (res) {
										$state.transitionTo("sidemenu.taskformhistory");
									});
								   
								});
							}

						} else {
							var url = config.url + "/api/v1/formszDetails/create";
					//		console.log(valueObject)
							var recordId = $localstorage.getObject("offlineRecordId");
							promisingMethods.createRecord(url, valueObject, securityHeaders).then(function (result) {
					//			console.log(result)
								promises.push(result)
							});
					//		console.log($scope.videoFieldStatus)
							if ($scope.videoFieldStatus) {
								var url = config.url + "/api/v1/gridFS/addvideo/";
								var query = 'SELECT * FROM FormData_table WHERE uniqueID=?';
								$cordovaSQLite.execute(db, query, [recordId]).then(function (res) {
									for (var i = 0; i < res.rows.length; i++) {
										var videoOptions = res.rows.item(i).videoOptions;
										var videoPath = res.rows.item(i).videoPath;
										var recordId = res.rows.item(i).recordId;
									/*	console.log(videoOptions)
										console.log(videoPath)
										console.log( JSON.parse(videoOptions))*/
										if (videoOptions != null) {
											promisingMethods.uploadVideo(url, videoPath, JSON.parse(videoOptions), valueObject.generatedId).then(function (res) {
									//			console.log(res)
												promises.push(res)
											});
											$q.all(promises).then(function (results) {
							//					console.log(results)
												var query = 'DELETE FROM FormData_table WHERE uniqueID=?';
												$cordovaSQLite.execute(db, query, [$localstorage.getObject("offlineRecordId")]).then(function (res) {});
												commonService.Loaderhide();
												$state.transitionTo("sidemenu.taskformhistory");
												//		commonService.resetSketchingData();
												alertService.doAlert(strings.submitted);
											});
										} else {
											$q.all(promises).then(function (results) {
							//					console.log(results)
												var query = 'DELETE FROM FormData_table WHERE uniqueID=?';
												$cordovaSQLite.execute(db, query, [$localstorage.getObject("offlineRecordId")]).then(function (res) {});
												commonService.Loaderhide();
												$state.transitionTo("sidemenu.taskformhistory");
												//		commonService.resetSketchingData();
												alertService.doAlert(strings.submitted);
											});
											//	}
										}
									}
								});
							} else {
					//			console.log("no videoooooooooooooo")
								$q.all(promises).then(function (results) {
									console.log(results)
									var query = 'DELETE FROM FormData_table WHERE uniqueID=?';
									$cordovaSQLite.execute(db, query, [$localstorage.getObject("offlineRecordId")]).then(function (res) {});
									commonService.Loaderhide();
									$state.transitionTo("sidemenu.taskformhistory");
									//		commonService.resetSketchingData();
									alertService.doAlert(strings.submitted);

								});
							}
						}

					} else {
						commonService.Loaderhide();
						alertService.doAlert(strings.fillMandetory);
					}
					//		}); //call back loop ends

				} else {
					$scope.saveOfflineForm(obj, type);
				}
			}

		});

	},

	/**
	 * @desc : Modification, added star rating in rating widget
	 * @author Santhosh Kumar Gunti
	*/


	$scope.prepareFormObject = function (type) {
		var finalrecord = {};
		var obj = {};
		var breakCheck = false;
		var record = [];
		angular.forEach($scope.fields, function (value, key) {
			if (value.type.view == "group") {
				angular.forEach(value.type.fields, function (value, key) {
					var obvalue,
					fieldId;
					var obLabelkey = "";
					angular.forEach(value, function (val, key) {

						var inobj = {};
						var obkey;
						var keyflag = "";
						var valueflag = "";

						if (key == "id") {
							fieldId = val;
							if (val.indexOf("Image") > -1) {
								keyflag = "Image";
								var image = $scope.imgeasSet[$scope.recordInfo[val]]
									obvalue = image;
								valueflag = obvalue;
							} else if (val.indexOf("Signature") > -1) {
								keyflag = "Image";
								var img = $scope.sign[$scope.recordInfo[val]];
								obvalue = img;
								valueflag = obvalue;

							} else if (val.indexOf("Checkbox") > -1) {
								obvalue = $scope.fileds[val];
								valueflag = obvalue;

								if (!valueflag)
									valueflag = [];

							} else if (val.indexOf("Rating") > -1) {
								keyflag = "Rating";
								if(value.inputType == "Star Rating"){
									obvalue = $scope.recordInfo[val];
									  	valueflag = obvalue;
								}
								else{
									obvalue = document.getElementById(val).value;
									valueflag = obvalue;
								}
								finalrecord[fieldId] = obvalue;

							} else {
								obvalue = $scope.recordInfo[val];
							}
						}

						if (key == "lable") {
							obLabelkey = value;
						}
						if (key == "required" && keyflag == "Image" && value == true && valueflag == undefined) {

							commonService.Loaderhide();
							if ($scope.status == true && type != 'save') {
								alertService.doAlert(strings.fillMandetory);
								breakLoop = true;
							}

						}
						if (key == "required" && keyflag == "Signature" && value == true && valueflag == undefined) {

							commonService.Loaderhide();

							if ($scope.status == true && type != 'save') {
								alertService.doAlert(strings.fillMandetory);
								breakLoop = true;
							}
						}
						if (key == "isPrimary") {
							if (obvalue == undefined) {
								finalrecord[fieldId] = "";
							} else {
								finalrecord[fieldId] = obvalue;
							}
						}

					});
				});
			} else if (value.type.view == "section") {
				var obvalue,
				fieldId;
				var obkey;
				var keyflag = "";
				var valueflag = "";
				var obLabelkey = "";
				angular.forEach(value.type.fields, function (value, key) {
					if (value.type == "group") {
						angular.forEach(value.data.type.fields, function (value, key) {
							var obvalue,
							fieldId;
							var obLabelkey = "";
							angular.forEach(value, function (val, key) {
								var inobj = {};
								var obkey;
								var keyflag = "";
								var valueflag = "";

								if (breakCheck == false) {
									if (key == "id") {
										fieldId = val;
										if (val.indexOf("Image") > -1) {
											keyflag = "Image";
											var image = $scope.imgeasSet[$scope.recordInfo[val]];
											obvalue = image;
											valueflag = obvalue;

										} else if (val.indexOf("Signature") > -1) {
											keyflag = "Image";
											var img = $scope.sign[$scope.recordInfo[val]];
											obvalue = img;
											valueflag = obvalue;

										} else if (val.indexOf("Checkbox") > -1) {
											obvalue = $scope.fileds[val];
											valueflag = obvalue;
											if (!valueflag)
												valueflag = [];

										} else if (val.indexOf("Rating") > -1) {
											keyflag = "Rating";
											if(value.inputType == "Star Rating"){
												obvalue = $scope.recordInfo[val];
												  	valueflag = obvalue;
											}
											else{
												obvalue = document.getElementById(val).value;
												valueflag = obvalue;
											}
											finalrecord[fieldId] = obvalue;

										} else {
											obvalue = $scope.recordInfo[val];
										}
									}

									if (key == "lable") {
										obLabelkey = value;
									}
									if (key == "required" && keyflag == "Image" && value == true && valueflag == undefined) {

										commonService.Loaderhide();
										if ($scope.status == true && type != 'save') {
											alertService.doAlert(strings.fillMandetory);
											breakLoop = true;
										}

									}
									if (key == "required" && keyflag == "Signature" && value == true && valueflag == undefined) {

										commonService.Loaderhide();

										if ($scope.status == true && type != 'save') {
											alertService.doAlert(strings.fillMandetory);
											breakLoop = true;
										}
									}
									if (key == "isPrimary") {
										if (obvalue == undefined) {
											finalrecord[fieldId] = "";
										} else {
											finalrecord[fieldId] = obvalue;
										}
									}
								}

							});
						});

					} else {
						angular.forEach(value.data, function (val, key) {
							var obkey;
							var keyflag = "";
							var valueflag = "";
							if (breakCheck == false) {
								if (key == "id") {
									fieldId = val;

									if (val.indexOf("Image") > -1) {
										keyflag = "Image";
										var image = $scope.imgeasSet[$scope.recordInfo[val]]
											obvalue = image;
										valueflag = obvalue;

									} else if (val.indexOf("Signature") > -1) {
										keyflag = "Image";
										var img = $scope.sign[$scope.recordInfo[val]];
										obvalue = img;
										valueflag = obvalue;
									} else if (val.indexOf("Checkbox") > -1) {
										obvalue = $scope.fileds[val];
										valueflag = obvalue;

										if (!valueflag)
											valueflag = [];

									} else if (val.indexOf("Rating") > -1) {
										keyflag = "Rating";
										if(value.data.inputType == "Star Rating"){
											obvalue = $scope.recordInfo[val];
											  	valueflag = obvalue;
										}
										else{
											obvalue = document.getElementById(val).value;
											valueflag = obvalue;
										}
										finalrecord[fieldId] = obvalue;

									} else {
										obvalue = $scope.recordInfo[val];
									}
								}

								if (key == "lable") {
									obLabelkey = value;
								}
								if (key == "required" && keyflag == "Image" && value == true && valueflag == undefined) {

									commonService.Loaderhide();
									if ($scope.status == true && type != 'save') {
										alertService.doAlert(strings.fillMandetory);
										breakLoop = true;
									}

								}
								if (key == "required" && keyflag == "Signature" && value == true && valueflag == undefined) {

									commonService.Loaderhide();

									if ($scope.status == true && type != 'save') {
										alertService.doAlert(strings.fillMandetory);
										breakLoop = true;
									}
								}
								if (key == "isPrimary") {
									if (obvalue == undefined) {
										finalrecord[fieldId] = "";
									} else {
										finalrecord[fieldId] = obvalue;
									}
								}
							} //break false
						});
					}
				});
			} else {
				var obvalue,
				fieldId;
				var obkey;
				var keyflag = "";
				var valueflag = "";
				var obLabelkey = "";
				angular.forEach(value, function (val, key) {
					commonService.Loaderhide();
					if (breakCheck == false) {
						if (key == "id") {
							fieldId = val;
							if (val.indexOf("Image") > -1) {
								keyflag = "Image";
								var image = $scope.imgeasSet[$scope.recordInfo[val]]

									obvalue = image;
								valueflag = obvalue;
								finalrecord[fieldId] = obvalue;
							} else if (val.indexOf("Signature") > -1) {
								keyflag = "Image";
								var img = $scope.sign[$scope.recordInfo[val]];
								obvalue = img;
								valueflag = obvalue;
								finalrecord[fieldId] = obvalue;
							} else if (val.indexOf("Checkbox") > -1) {
								obvalue = $scope.fileds[val];
								finalrecord[fieldId] = obvalue;

								if (!finalrecord[fieldId])
									finalrecord[fieldId] = [];

							} else if (val.indexOf("Rating") > -1) {
								keyflag = "Rating";
								if(value.inputType == "Star Rating"){
									obvalue = $scope.recordInfo[val];
									  	valueflag = obvalue;
								}
								else{
									obvalue = document.getElementById(val).value;
									valueflag = obvalue;
								}
								finalrecord[fieldId] = obvalue;
							} else {
								obvalue = $scope.recordInfo[val];
								finalrecord[fieldId] = obvalue;
							}

						}
						if (key == "lable") {
							obLabelkey = value;
						}

						if (key == "required" && keyflag == "Image" && value == true && valueflag == undefined) {

							commonService.Loaderhide();
							if ($scope.status == true && type != 'save') {
								alertService.doAlert(strings.fillMandetory);
								breakLoop = true;
							}

						}
						if (key == "required" && keyflag == "Signature" && value == true && valueflag == undefined) {

							commonService.Loaderhide();

							if ($scope.status == true && type != 'save') {
								alertService.doAlert(strings.fillMandetory);
								breakLoop = true;
							}
						}

					} //break false

				});
			}
		}); // for loop $scope.field.length
		var arryfinal = [];

		finalrecord["sketching"] = $scope.recordInfo['sketching'];

		arryfinal.push(finalrecord);
		obj.record = arryfinal;
		obj.lat = $scope.lat;
		obj.long = $scope.long;

		if (breakCheck == false) {
			$scope.formId = $localstorage.getObject("formId");
			obj.formId = $scope.formId;
			if ($rootScope.TaskData) {
				obj.taskId = $localstorage.getObject("TaskId");
			} else {
				obj.taskId = "form";
			}
			var datenow = new Date();
			var isoDate = datenow.toISOString();
			obj.updatedTime = isoDate;
			obj.updatedBy = $localstorage.getObject("username");

		}
		commonService.Loaderhide();
		return obj;
	},
	/**
     * @description storing calculations in form
     * @param {Objce} 
     * @developer venkatesh bendi
    */ 
	$scope.storeCalculationFields = function(field)
	{
		var calfieldInfo = {};
		calfieldInfo.id = field.id;
		calfieldInfo.formula =  field.formula;
		$scope.calculationFieldsList.push(calfieldInfo)
	},
	
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
	},
	

	/**
	 * Params {JSON Object}
     * @desc 
        For setting the map interaction field values which was selected on map 
     * @modified by Santhosh Kumar Gunti
 	*/
	$scope.setMapInteractionFieldValue = function(data){
		if($rootScope.isNetworkOn){
			mapComponentServices.setMapInteractionFieldValue($scope,data);
		}else{
			alertService.showToast("You are in offline, cannot perform this action");			
		}
	},
	/**
	 * Params {JSON Object}
     * @desc 
        Goto field, when user click on icon of goto field in form, it takes user to the location of feature of giveninput   
     * @modified by Santhosh Kumar Gunti
 	*/
	$scope.gotoField = function(data){
		var fieldDetails;
		if($rootScope.isNetworkOn){
			if ("data" in data){
				if ($rootScope.isGridRecodsShow == false) {
					fieldDetails = $scope.recordInfo[data.id];
				}else{
					fieldDetails = $scope.selectedFormRecordFields[data.data.id];
				}
			}else{
				if ($rootScope.isGridRecodsShow == false) {
					fieldDetails = $scope.recordInfo[data.id];
				}else{
					fieldDetails = $scope.selectedFormRecordFields[data.id];
				}
			}

			mapComponentServices.gotoField($scope,fieldDetails);
		}else{
			alertService.showToast("You are in offline, cannot perform this action");			
		}
	},
	$scope.getLocation = function (id, index) {
		commonService.LoaderShow(strings.pleasewait);
		$scope.locationIndex = index;
		commonService.getLatLong(function (geoLocation) {
			if (geoLocation.netstatus == "success") {
				var lat = geoLocation.latlong[0];
				var long = geoLocation.latlong[1];
			//	$scope.latLong = "  Lat , Long : " + lat + " , " + long;
				 $scope.latLong= lat + " , " + long;

			//$scope.Location[id] = "  Lat , Long : " + lat + " , " + long;

				if ($scope.recordInfo) {
                    $scope.recordInfo[id] = $scope.latLong;
                }

				if ($scope.selectedFormRecordFields) {
					$scope.selectedFormRecordFields[id] = $scope.latLong;
				}
				commonService.Loaderhide();
			}
			if (geoLocation.netstatus == "error") {
				commonService.Loaderhide();
				alertService.showToast(geoLocation.message);
			}
		});
	},
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

                    if (!$scope.selectedFormRecordFields) {
                        $scope.selectedFormRecordFields = [];
                    }
                    if (!$scope.selectedFormRecordFields[id]) {
                        $scope.selectedFormRecordFields[id] = "";
                    }
                    $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    $scope.imgeasSet[id] = $scope.imgURI;
                    $scope.closePopover();

		}, function (err) {
			$scope.closePopover();
		});
	},
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
            if (!$scope.selectedFormRecordFields) {
                $scope.selectedFormRecordFields = [];
            }
		if (!$scope.selectedFormRecordFields[id]) {
                        $scope.selectedFormRecordFields[id] = "";
                    }
			$scope.imgURI = "data:image/jpeg;base64," + imageData;
			$scope.imgeasSet[id] = $scope.imgURI;
			$scope.closePopover();
		}, function (err) {
			$scope.closePopover();
		});
	},

	$scope.scanBarcode = function (index, id) {
		$scope.barCodeIndex = index;
		$cordovaBarcodeScanner.scan().then(function (imageData) {
			$scope.codeURI = imageData.text;
			$scope.Barcode[id] = $scope.codeURI;

			if ($scope.selectedFormRecordFields)
				$scope.selectedFormRecordFields[id] = $scope.Barcode[id];
		}, function (error) {});
	},

	$scope.back = function () {
		//	$scope.closePopover();
	//	$scope.closeSignaturePadPopover();
	console.log($rootScope.isSignaturePadEnabled)
	if ($rootScope.isSignaturePadEnabled) {
		$scope.closeSignaturePadPopover();
	}
        $ionicHistory.goBack();
		$localstorage.set("mapHistory", '');
//		commonService.resetSketchingData([]);
		$scope.stopVoiceRecong = true;
	},
	 $scope.closeSignaturePadPopover = function() {
        $rootScope.isSignaturePadEnabled = false;
        $scope.sigpopover.remove();
    };
	$scope.closesigPopup = function () {
		$scope.closeSignaturePadPopover();
	},
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
	},
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
                        	console.log("saveeee")
                            if (signaturePad.isEmpty()) {
                                signaturePad.clear();
                            } else {
                                if (!$scope.selectedFormRecordFields) {
                                    $scope.selectedFormRecordFields = [];
                                }
                                if (!$scope.selectedFormRecordFields[id])
                                    $scope.selectedFormRecordFields[id] = "";

                                var sigImg = signaturePad.toDataURL();
                               
                                var smallsig = $scope.imageToDataUri(sigImg, 100, 60);

						$scope.signatureimage = smallsig;
						console.log($scope.signatureimage)
						console.log("venkiiiiiii")
						//$scope.sign[id] = $scope.signatureimage;
						$scope.sign[id] = sigImg;
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
	},
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

	$scope.saveOfflineForm = function (isValid, type) {
		var options;
		var videoPath;
		//modified by venkatesh bendi for auto calculations in math field start
		var invalidCalculationsFieldList = [];
		calculatonFrmulaExcecutorService.isCalculationsFieldsAreStoresValidValues($scope.recordInfo, invalidCalculationsFieldList, $scope);
		//End

		// conditon to check for any fields are exceuted after calculation is executed
		if(invalidCalculationsFieldList.length == 0)
		{		
		//	var formId = $localstorage.getObject("formId");
			var userId = $localstorage.getObject("userId");
		//	var recordId = $localstorage.getObject("offlineRecordId");
			commonService.LoaderShow(strings.saving);
			$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormData_table(uniqueID integer primary key autoincrement,FormId integer,userId integer ,FormValues text,FormStatus text,TaskId text,recordId text,isRequired text,displayValues text,recordComments text,IsReassign text,lat text,long text,insertDate text,isVideoAvailable text,videoOptions text,videoPath text)').then(function (res) {}, function (err) {
				alert(JSON.stringify(err));
			});
			
		//		var len = res.rows.length;
				var query
				if ($rootScope.isView) {
					var obj={};
						var arryfinal=[];
						arryfinal.push($scope.recordInfo);
						obj.record = arryfinal;
						obj.lat = $scope.lat;
						obj.long = $scope.long;
						obj.formId =$localstorage.getObject("formId");
						obj.taskId = $localstorage.getObject("TaskId");
						var datenow = new Date();
						var currentDatestring = datenow.toISOString();
						obj.updatedTime = currentDatestring;
						obj.updatedBy = $localstorage.getObject("username");
						console.log($scope.recordInfo)
			var query = 'SELECT * FROM FormSkeleton_table WHERE FormId=?';
			$cordovaSQLite.execute(db, query, [obj.formId]).then(function (res) {
				var len = res.rows.length;
				console.log(len);
				var keys = [];
				var recordDpval = [];
				if(len>0){
						
						var recordsdata = {};
							var dpvalues = res.rows.item(0).requiredFields;
							console.log(dpvalues);
							var fetchedVals = JSON.parse(dpvalues);
							console.log(fetchedVals)
							keys = Object.keys(fetchedVals[0]);
							console.log(keys);
					for (var i = 0; i < keys.length; i++) {
						var fieldName = obj.record[0][keys[i]];
						recordDpval.push(fieldName);
					}
						console.log(recordDpval+[])
						var recordDispVals=recordDpval+[];
				}else{
					console.log($scope.requiredField)
					keys = Object.keys($scope.requiredField[0]);
					for (var i = 0; i < keys.length; i++) {
						var fieldName = obj.record[0][keys[i]];
						recordDpval.push(fieldName);
					}
						console.log(recordDpval+[])
						var recordDispVals=recordDpval+[];
				//	alert("no required fields")
				}
				
					var values = JSON.stringify(obj);
					if ($scope.videoFieldStatus) {
						if ($scope.targetPath != undefined || $scope.targetPath != null) {
							options = JSON.stringify($scope.options)
								videoPath = $scope.targetPath
						} else {
							options = null;
							videoPath = null;
						}
					}else{
						options = null;
							videoPath = null;
					}
/*					console.log(options)
					console.log(videoPath)
					console.log( $scope.videoFieldStatus)*/
					query = 'INSERT INTO FormData_table (FormId,userId, FormValues,FormStatus,TaskId,recordId,isRequired,displayValues,recordComments,IsReassign,lat,long,insertDate,isVideoAvailable,videoOptions,videoPath) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
					$cordovaSQLite.execute(db, query, [obj.formId, userId, values, "saved", obj.taskId, "", isValid, recordDispVals, "", false, "", "", currentDatestring, $scope.videoFieldStatus, options, videoPath]).then(function (res) {
						$state.transitionTo("sidemenu.taskformhistory");
						commonService.Loaderhide();
						alertService.doAlert(strings.formSaved);
					}, function (e) {
						alert("error " + JSON.stringify(e));
					});
				}, function (e) {
					alert("error " + JSON.stringify(e));
				});
			} else {
/*				console.log($scope.videoFieldStatus);
				console.log($scope.targetPath)
				console.log($scope.options)
				console.log("////////////////////////////////////")
				console.log($rootScope.selectedFormRecordFields)*/
				var arryfinal = [];
				var valueObject = {};
				arryfinal.push($rootScope.selectedFormRecordFields);
				valueObject.record = arryfinal;
				valueObject.formId = $localstorage.getObject("formId");
				valueObject.taskId = $localstorage.getObject("TaskId");
				var datenow = new Date();
				var isoDate = datenow.toISOString();
				valueObject.updatedTime = isoDate;
				valueObject.updatedBy = $localstorage.getObject("username");
				valueObject.status = false;
				console.log(valueObject)
				var recordId = $localstorage.getObject("offlineRecordId");
				var updatedValues = JSON.stringify(valueObject);
				if ($scope.videoFieldStatus) {
					options = JSON.stringify($scope.options)
						videoPath = $scope.targetPath;
				}else{
					options = null;
							videoPath = null;
				}
				if ($rootScope.prepopDataShow == false) {
					console.log("editedddddddddddddddddddddddd")
					var query = "UPDATE FormData_table SET FormValues=? ,isRequired=?,videoOptions=?,videoPath=? where uniqueID=? ";
					$cordovaSQLite.execute(db, query, [updatedValues, isValid, options, videoPath, recordId]).then(function (res) {
						commonService.Loaderhide();
						alertService.doAlert(strings.formupdated);
						$state.transitionTo("sidemenu.taskformhistory");

					}, function (e) {
						alert("error update " + JSON.stringify(e));
					});
				} else {
					console.log("insert prepopppppppppppppp")
					//			if($scope.status){
					$scope.insertNewPrepopRecord(valueObject, isValid);
					//			}else
					//			{

					//			}
				}
			}
		} else {
			alertService.doAlert("Please recheck listed calulation fileds :" + invalidCalculationsFieldList.join());
		}
	};
	$scope.insertNewPrepopRecord = function (obj, isValid) {
		var options;
		var videoPath;
		if ($scope.videoFieldStatus) {
			if ($scope.targetPath != undefined || $scope.targetPath != null) {
				options = JSON.stringify($scope.options)
					videoPath = $scope.targetPath
			} else {
				options = null;
				videoPath = null;
			}
		}else{
			options = null;
			videoPath = null;
		}
		var userId = $localstorage.getObject("userId");
		var query = 'SELECT * FROM FormSkeleton_table WHERE FormId=?';
		$cordovaSQLite.execute(db, query, [obj.formId]).then(function (res) {
			var len = res.rows.length;
			var keys = [];
			var recordDpval = [];
			if (len > 0) {
				var recordsdata = {};
				var dpvalues = res.rows.item(0).requiredFields;
				var fetchedVals = JSON.parse(dpvalues);
				keys = Object.keys(fetchedVals[0]);
				for (var i = 0; i < keys.length; i++) {
					var fieldName = obj.record[0][keys[i]];
					recordDpval.push(fieldName);
				}
				var recordDispVals = recordDpval + [];
			} else {
				keys = Object.keys($scope.requiredField[0]);
				for (var i = 0; i < keys.length; i++) {
					var fieldName = obj.record[0][keys[i]];
					recordDpval.push(fieldName);
				}
				var recordDispVals = recordDpval + [];
			}
			if ($scope.status) {
				var query = 'INSERT INTO FormData_table (FormId,userId, FormValues,FormStatus,TaskId,recordId,isRequired,displayValues,recordComments,IsReassign,lat,long,insertDate,isVideoAvailable,videoOptions,videoPath) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
				$cordovaSQLite.execute(db, query, [obj.formId, userId, JSON.stringify(obj), "saved", obj.taskId, $localstorage.getObject("reassignedRecordId"), isValid, recordDispVals, "", false, "", "", obj.updatedTime, $scope.videoFieldStatus, options, videoPath]).then(function (res) {
					$state.transitionTo("sidemenu.taskformhistory");
					alertService.doAlert(strings.formSaved);
					commonService.Loaderhide();

				}, function (e) {
					alert("error " + JSON.stringify(e));
				});
			} else {
				var recordId = $localstorage.getObject("offlineRecordId");
				var updatedValues = JSON.stringify(obj);
				var query = "UPDATE FormData_table SET FormValues=? ,FormStatus=?,isRequired=?,displayValues=? where recordId=?";
				$cordovaSQLite.execute(db, query, [updatedValues, "saved", isValid, recordDispVals, recordId]).then(function (res) {
					alertService.doAlert(strings.formupdated);
					$state.transitionTo("sidemenu.taskformhistory");
					commonService.Loaderhide();
				}, function (e) {
					alert("error update " + JSON.stringify(e));
				});
			}
		}, function (e) {
			alert("error " + JSON.stringify(e));
		});
	}
	$scope.getBarcode = function (barcode) {
		return barcode;
	};

	/**
	 * @desc : Modification, added star rating in rating widget
	 * @author Santhosh Kumar Gunti
	*/

	$scope.objectFormPreparationOffline = function (type, callback) {
		var valueObject = {};
		var keyflag;
		var requiredField;
		var arryfinal = [];
		var obvalue,
		fieldId;
		var breakLoop = false;
		var obkey;
		var inobj = {};
		angular.forEach($scope.fields, function (value, key) {
			requiredField = value.required;

			if (value.type.view == "group") {
				angular.forEach(value.type.fields, function (v, k) {
					fieldId = v.id;
					angular.forEach($scope.selectedFormRecordFields, function (obvalue, obkey) {
						if (breakLoop == false) {
							if (obkey == fieldId) {
								if (v.type.view == "camera") {
									//			if (value.indexOf("Image")) {
									keyflag = "camera";
									var objLen = Object.keys($scope.imgeasSet).length;
									if (objLen == 0) {
										inobj[fieldId] = obvalue;
									} else {
										obvalue = $scope.imgeasSet[fieldId];
										inobj[fieldId] = obvalue;
									}
								} else if (v.type.view == "sign") {
									var objLen = Object.keys($scope.sign).length;
									if (objLen == 0) {
										inobj[fieldId] = obvalue;
									} else {
										obvalue = $scope.sign[fieldId];
										inobj[fieldId] = obvalue;
									}
								} else if (v.type.view == "checkbox") {
									
									var objLen = Object.keys(obvalue).length;
									if (objLen == 0) {
										angular.forEach($scope.fileds[fieldId], function (fieldValue, fieldKey) {

											if (obvalue.indexOf(fieldValue) === -1) {
												obvalue.push(fieldValue);
											} else {
												obvalue.splice(obvalue.indexOf(fieldValue), 1);
											}
										});

										inobj[fieldId] = obvalue;
									} else {

										angular.forEach($scope.fileds[fieldId], function (fieldValue, fieldKey) {

											if (obvalue.indexOf(fieldValue) === -1) {
												obvalue.push(fieldValue);
											} else {
												obvalue.splice(obvalue.indexOf(fieldValue), 1);
											}
										});
									}
                                            inobj[fieldId] = obvalue;
                                        } else if (v.type.view == "barcode") {
                                            var objLen = Object.keys($scope.Barcode).length;
                                            if (objLen == 0) {
                                                inobj[fieldId] = obvalue;
                                            } else {
                                                obvalue = $scope.Barcode[fieldId];
                                                inobj[fieldId] = obvalue;
                                            }
                                        } else if (v.type.view == "rating") {
                                        	if(v.inputType == "Star Rating"){
												  	inobj[fieldId] = obvalue;
												}
												else{
	                                                obvalue = document.getElementById(v.id).value;
                                            		inobj[fieldId] = obvalue;
												}

                                            
                                        } else if (value.type.view == "map") {
                                            if ($scope.latLong)
                                                obvalue = $scope.latLong;
                                            inobj[fieldId] = obvalue;
                                        }  else {
                                            inobj[fieldId] = obvalue;

								}

								if (requiredField == true && inobj[fieldId] == null) {
									commonService.Loaderhide();
									if ($scope.status == true && type != 'save') {
									alertService.doAlert(strings.fillMandetory);
									breakLoop = true;
								}
								}
							} // obkey=feildId
						} //break loop
					});
				});

			} else if (value.type.view == "section") {

				angular.forEach(value.type.fields, function (v, k) {

					if (v.data.type.view == "group") {
						angular.forEach(v.data.type.fields, function (fieldObject, fieldkey) {
							fieldId = fieldObject.id;
							angular.forEach($scope.selectedFormRecordFields, function (obvalue, obkey) {
								if (breakLoop == false) {
									if (obkey == fieldId) {
										if (fieldObject.type.view == "camera") {
											keyflag = "camera";
											var objLen = Object.keys($scope.imgeasSet).length;
											if (objLen == 0) {
												inobj[fieldId] = obvalue;
											} else {
												obvalue = $scope.imgeasSet[fieldId];
												inobj[fieldId] = obvalue;
											}
										} else if (fieldObject.type.view == "sign") {
											var objLen = Object.keys($scope.sign).length;
											if (objLen == 0) {
												inobj[fieldId] = obvalue;
											} else {
												obvalue = $scope.sign[fieldId];
												inobj[fieldId] = obvalue;
											}
										} else if (fieldObject.type.view == "checkbox") {
											var objLen = Object.keys(obvalue).length;
											if (objLen == 0) {
												angular.forEach($scope.fileds[fieldId], function (fieldValue, fieldKey) {

													if (obvalue.indexOf(fieldValue) === -1) {
														obvalue.push(fieldValue);
													} else {
														obvalue.splice(obvalue.indexOf(fieldValue), 1);
													}
												});

												inobj[fieldId] = obvalue;
												//   inobj[fieldId] = $scope.fileds[value.id];
											} else {

												angular.forEach($scope.fileds[fieldId], function (fieldValue, fieldKey) {

													if (obvalue.indexOf(fieldValue) === -1) {
														obvalue.push(fieldValue);
													} else {
														obvalue.splice(obvalue.indexOf(fieldValue), 1);
													}
												});

                                                        //objvalue = $scope.fileds[value.id];
                                                        inobj[fieldId] = obvalue;
                                                    }
                                                } else if (fieldObject.type.view == "barcode") {
                                                    var objLen = Object.keys($scope.Barcode).length;
                                                    if (objLen == 0) {
                                                        inobj[fieldId] = obvalue;
                                                    } else {
                                                        obvalue = $scope.Barcode[fieldId];
                                                        inobj[fieldId] = obvalue;
                                                    }

	                                            } else if (fieldObject.type.view == "rating") {
	                                            	console.log(fieldObject);
	                                            	if(fieldObject.inputType == "Star Rating"){
													  	inobj[fieldId] = obvalue;
													}
													else{
		                                                obvalue = document.getElementById(value.id).value;
		                                                inobj[fieldId] = obvalue;
													}


                                                } else if (value.type.view == "map") {
                                                    if ($scope.latLong)
                                                        obvalue = $scope.latLong;
                                                    inobj[fieldId] = obvalue;
                                                }  else {
                                                    inobj[fieldId] = obvalue;

										}

										if (requiredField == true && inobj[fieldId] == null) {
											commonService.Loaderhide();
											if ($scope.status == true && type != 'save') {
									alertService.doAlert(strings.fillMandetory);
									breakLoop = true;
								}
										}
									} // obkey=feildId
								} //break loop
							});
						});
					} else {
						fieldId = v.data.id;
						angular.forEach($scope.selectedFormRecordFields, function (obvalue, obkey) {
							if (breakLoop == false) {
								if (obkey == fieldId) {
									if (v.data.type.view == "camera") {
										keyflag = "camera";
										var objLen = Object.keys($scope.imgeasSet).length;
										if (objLen == 0) {
											inobj[fieldId] = obvalue;
										} else {
											obvalue = $scope.imgeasSet[fieldId];
											inobj[fieldId] = obvalue;
										}
									} else if (v.data.type.view == "sign") {
										var objLen = Object.keys($scope.sign).length;
										if (objLen == 0) {
											inobj[fieldId] = obvalue;
										} else {
											obvalue = $scope.sign[fieldId];
											inobj[fieldId] = obvalue;
										}
									} else if (v.data.type.view == "checkbox") {
										
										var objLen = Object.keys(obvalue).length;
										if (objLen == 0) {
											angular.forEach($scope.fileds[fieldId], function (fieldValue, fieldKey) {

												if (obvalue.indexOf(fieldValue) === -1) {
													obvalue.push(fieldValue);
												} else {
													obvalue.splice(obvalue.indexOf(fieldValue), 1);
												}
											});

											inobj[fieldId] = obvalue;
											//   inobj[fieldId] = $scope.fileds[value.id];
										} else {

											angular.forEach($scope.fileds[fieldId], function (fieldValue, fieldKey) {

                                                        if (obvalue.indexOf(fieldValue) === -1) {
                                                            obvalue.push(fieldValue);
                                                        } else {
                                                            obvalue.splice(obvalue.indexOf(fieldValue), 1);
                                                        }
                                                    });
                                                }
                                                //objvalue = $scope.fileds[value.id];
                                                inobj[fieldId] = obvalue;
                                            } else if (v.data.type.view == "barcode") {
                                                var objLen = Object.keys($scope.Barcode).length;
                                                if (objLen == 0) {
                                                    inobj[fieldId] = obvalue;
                                                } else {
                                                    obvalue = $scope.Barcode[fieldId];
                                                    inobj[fieldId] = obvalue;
                                                }
                                            } else if (v.data.type.view == "rating") {
                                            	if(v.data.inputType == "Star Rating"){
												  	inobj[fieldId] = obvalue;
												}
												else{
	                                                obvalue = document.getElementById(fieldId).value;
	                                                inobj[fieldId] = obvalue;
												}
                                            } else if (value.type.view == "map") {
                                                if ($scope.latLong)
                                                    obvalue = $scope.latLong;
                                                inobj[fieldId] = obvalue;
                                            }  else {
                                                inobj[fieldId] = obvalue;

									}

									if (requiredField == true && inobj[fieldId] == null) {
										commonService.Loaderhide();
									if ($scope.status == true && type != 'save') {
									alertService.doAlert(strings.fillMandetory);
									breakLoop = true;
								}
									}
								} // obkey=feildId
							} //break loop
						}); //for each value
					}
				});
			} else {
				fieldId = value.id;
				angular.forEach($scope.selectedFormRecordFields, function (obvalue, obkey) {

					if (breakLoop == false) {
						if (obkey == fieldId) {
							if (value.type.view == "camera") {
								keyflag = "camera";
								var objLen = Object.keys($scope.imgeasSet).length;
								if (objLen == 0) {
									inobj[fieldId] = obvalue;
								} else {
									obvalue = $scope.imgeasSet[fieldId];
									inobj[fieldId] = obvalue;
								}
							} else if (value.type.view == "sign") {
								var objLen = Object.keys($scope.sign).length;
								if (objLen == 0) {
									inobj[fieldId] = obvalue;
								} else {
									obvalue = $scope.sign[fieldId];
									inobj[fieldId] = obvalue;
								}
							} else if (value.type.view == "checkbox") {
								
								var objLen = Object.keys(obvalue).length;
								if (objLen == 0) {
									angular.forEach($scope.fileds[fieldId], function (fieldValue, fieldKey) {

										if (obvalue.indexOf(fieldValue) === -1) {
											obvalue.push(fieldValue);
										} else {
											obvalue.splice(obvalue.indexOf(fieldValue), 1);
										}
									});

									inobj[fieldId] = obvalue;
									//   inobj[fieldId] = $scope.fileds[value.id];
								} else {

									angular.forEach($scope.fileds[fieldId], function (fieldValue, fieldKey) {

										if (obvalue.indexOf(fieldValue) === -1) {
											obvalue.push(fieldValue);
										} else {
											obvalue.splice(obvalue.indexOf(fieldValue), 1);
										}
									});
								}
								//objvalue = $scope.fileds[value.id];
								inobj[fieldId] = obvalue;

                                    } else if (value.type.view == "barcode") {
                                        var objLen = Object.keys($scope.Barcode).length;
                                        if (objLen == 0) {
                                            inobj[fieldId] = obvalue;
                                        } else {
                                            obvalue = $scope.Barcode[fieldId];
                                            inobj[fieldId] = obvalue;
                                        }

									} else if (value.type.view == "rating") {
										if(value.inputType == "Star Rating"){
											  	inobj[fieldId] = obvalue;
										}
										else{
											obvalue = document.getElementById(value.id).value;
                                        	inobj[fieldId] = obvalue;
										}
                                    } else if (value.type.view == "map") {
                                        if ($scope.latLong)
                                            obvalue = $scope.latLong;
                                        inobj[fieldId] = obvalue;
                                    } else {
                                        inobj[fieldId] = obvalue;
							}

							if (requiredField == true && (inobj[fieldId] == null || !inobj[fieldId])) {
								commonService.Loaderhide();
								if ($scope.status == true && type != 'save') {
									alertService.doAlert(strings.fillMandetory);
									breakLoop = true;
								}
							}
						} // obkey=feildId
					} //break loop
				});
			}

		});
		if (breakLoop == false) {
			inobj["sketching"] = $scope.selectedFormRecordFields['sketching'];
			arryfinal.push(inobj);
			$scope.formId = $localstorage.getObject("formId");
			valueObject.record = arryfinal;
			valueObject.formId = $scope.formId;
			if ($rootScope.TaskData) {
				valueObject.taskId = $localstorage.getObject("TaskId");
			} else {
				valueObject.taskId = "form";
			}
			valueObject.lat = $scope.lat;
			valueObject.long = $scope.long;
			var datenow = new Date();
			var isoDate = datenow.toISOString();
			valueObject.updatedTime = isoDate;
			valueObject.updatedBy = $localstorage.getObject("username");
			valueObject.status = false;
		}
		callback(valueObject, breakLoop);
	},
	$scope.captureVideo = function (id) {
		//	console.log(id)
		console.log($scope.recordInfo)
		if ($rootScope.selectedFormRecordFields != {}
			 || $rootScope.selectedFormRecordFields != undefined) {
			$rootScope.selectedFormRecordFields[id] = id;
		}
		if ($scope.recordInfo != {}
			 || $scope.recordInfo != undefined) {
			$scope.recordInfo[id] = id;
		}
		console.log($rootScope.selectedFormRecordFields)

		cordova.plugins.diagnostic.requestExternalStorageAuthorization(
			function (status) {}, function (error) {
			console.error("The following error occurred: " + error);
		}, true);
		$scope.url = config.url + "/api/v1/gridFS/addvideo/";
		//	$scope.videoFieldId=id;
		//      console.log(cordova.file.externalRootDirectory);
		var options = {
			limit: 1,
			duration: 20,
			quality: 0
		};
		$cordovaCapture.captureVideo(options).then(function (result) {
			var targetPath = result[0].fullPath;
			console.log(targetPath)
			$scope.targetPath = targetPath;
			//	$scope.recordInfo[id] = targetPath;
			if ($rootScope.selectedFormRecordFields != {}
				 || $rootScope.selectedFormRecordFields != undefined) {
				$rootScope.selectedFormRecordFields[id] = targetPath;
			}
			if ($scope.recordInfo != {}
				 || $scope.recordInfo != undefined) {
				$scope.recordInfo[id] = targetPath;
			}
			$scope.path = targetPath.substring(8);
			//	console.log($scope.path);
			$scope.videoPath[id] = targetPath;
			var filename = targetPath.split("/").pop();
			console.log(filename)
			$scope.options = {
				fileKey: "video",
				fileName: filename,
				chunkedMode: false,
				mimeType: "video/mp4",
				params: {
					fieldId: id
				}

			};
			//	console.log(options)
			$scope.config = {
				sources: [{
						src: $sce.trustAsResourceUrl(targetPath),
						type: "video/mp4"
					},
				],

				theme: "lib/videogular-themes-default/videogular.css",
				plugins: {
					poster: "http://www.videogular.com/assets/images/videogular.png"
				}
			};
		});
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
	      mapComponentServices.removeSketching($scope);
        }
	});

	$scope.$on("disablePullover", function () {
		if($scope.pullOverCheck.value == true){
			$scope.pullOverCheck.value = false;
			$scope.openMenu();
		}
	});

	$scope.$on("setSketchingDataInTask", function () {
		if ($rootScope.isGridRecodsShow == false) {
            $scope.recordInfo['sketching'] = $rootScope.sketchingData;
		}else{
			$scope.selectedFormRecordFields['sketching'] = $rootScope.sketchingData;
		}
	});

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
	$rootScope.openMap = function () {
		openMenu();
/*		$rootScope.NavigatedFrom = "form";
		var result = $scope.prepareFormObject('save');
		$localstorage.set("mapHistory", JSON.stringify(result));
		$state.go("sidemenu.map");
*/	};

	$scope.formValuesInMap = function (result) {
		angular.forEach(result.record, function (value, key) {
			angular.forEach(value, function (val, key) {
				$scope.recordInfo[key] = val;

			});

		});
	},
	$scope.getformSkeleton = function () {
		commonService.LoaderShow(strings.loading);
		$scope.status = commonService.checkConnection();
		var itemId = $rootScope.skeletonId;
		console.log(itemId)
		if ($scope.status == true) {

			var url = config.url + "/api/v1/formsz/" + itemId;

			formsService.navigateToForms(url, securityHeaders, function (status, response) {
				console.log(response)
				if (response.isAllowMap === true && hidemapIcon == true) {
					$scope.mapAllowed = true;
				} else {
					$scope.mapAllowed = false;
				}
				if (response.name == "read only") {
					$scope.readonly = true;
				}
				commonService.LoaderShow(strings.loading);
				if (status) {
					var obj = {};
					obj["formId"] = response._id;
					obj["formSkeleton"] = response.FormSkeleton;
					formskeletonStorage.push(obj);
					$scope.formSkeleton = response.FormSkeleton;
					$scope.formId = response._id;
					$scope.requiredField = response.requiredField;
					$localstorage.setObject("formId", $scope.formId);
					$localstorage.setObject("data", $scope.formSkeleton);
					if ($scope.status == true) {
						$scope.obj = $localstorage.getObject("data");
					} else {

						$scope.obj = $localstorage.getObject("offlineData");
					}
					$scope.fields = $scope.obj;
					window.setTimeout(function () {
						commonService.Loaderhide();
					}, 600);
					commonService.Loaderhide();
				}
				var mapHistoryValues = $localstorage.get("mapHistory");
				if (mapHistoryValues && mapHistoryValues.length != 0) {
					var mapValues = JSON.parse(mapHistoryValues);
					$localstorage.set("mapHistory", '');
					$scope.formValuesInMap(mapValues);
				}
			});
			// }
		} else {
			/*$scope.obj = $localstorage.getObject("offlineData");
			$scope.mapAllowed = $localstorage.getObject("isMapAllowed")
			try {
				$scope.fields = JSON.parse($scope.obj);
			} catch (err) {
				$scope.fields = $scope.obj;
			}
			commonService.Loaderhide();*/
			taskDownloadAndSync.getLocalDbSkeleton(itemId,$scope);
		}
	};

/*	$scope.$on('onSketchingCreation', function () {
		if ($rootScope.isGridRecodsShow == false) {
			$scope.recordInfo['sketching'] = commonService.getSketchingData();
		}else{
			$scope.selectedFormRecordFields['sketching'] = commonService.getSketchingData();
		}
	});
*/

/*	$scope.getSketchings = function () {
		if ($rootScope.isGridRecodsShow == false) {
			$scope.recordInfo['sketching'] = commonService.getSketchingData();
		}else{
			$scope.selectedFormRecordFields['sketching'] = commonService.getSketchingData();
		}
	}
*/
	$scope.$on('closeSignaturePad', function () {

		if ($rootScope.isSignaturePadEnabled) {
			$scope.closeSignaturePadPopover();
		}
	});

	var initLoadFormsSkeleton = function () {
		$scope.getformSkeleton();
	};
	initLoadFormsSkeleton();

})
