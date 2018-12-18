angular.module('starter.controllers')
.controller('formTaskCtrl', function ($scope,dashboardService, $rootScope, $state, config, $cordovaSQLite, setGetObj, $ionicPopup, $filter, formsService, $ionicPopover, formsSave, alertService, commonService, $localstorage, reassign, strings, $timeout, $ionicHistory, $ionicListDelegate,calculatonFrmulaExcecutorService,$ionicModal,$cordovaBarcodeScanner,$ionicPopover,$cordovaCamera,reassign,$ionicSideMenuDelegate,projectTaskServices,mapComponentServices, $ionicScrollDelegate,$q,taskDownloadAndSync,$sce,promisingMethods,$cordovaCapture,$http)
{	
//customisation by abhilash pinnenti
//open image model

$ionicPopover.fromTemplateUrl('./templates/imageModel.html', {
  scope: $scope,
}).then(function(popover) {
  $scope.popoverImage = popover;
});
$scope.closeImage=function(){
  $scope.popoverImage.hide();
  $scope.$broadcast('scroll.refreshComplete');
}
$scope.openImage1=function(image){
  $scope.imgurl=image;
  $scope.popoverImage.show();
}

$ionicPopover.fromTemplateUrl('templates/imageModal.html', {
		scope : $scope
	}).then(function (popover) {
		$scope.HistoryPopover1 = popover;
	});

	$scope.openImage = function () {
		$scope.HistoryPopover1.show();
	};

	$scope.closePopover = function () {
		$scope.HistoryPopover1.hide();
	}



//testing for visitor number
       $scope.getFilterredFromsCount=function(user, fromdate, todate, where,dept) {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        console.log(firstDay)
        console.log(firstDay)
        var d = new Date();
        var yearLast=new Date().getFullYear().toString().substr(-2);
        var monthFull=d.getMonth().toString().padStart(2, "0")
        var yearMonth= parseInt("" + yearLast + monthFull)
        var yearMonthNow=yearMonth+1;
        var url = config.url + "/api/v1/formsz/formszDetails";
        // var headers = restServices.getHeaders();
        // var config = {};
        // config.headers = headers;
        $rootScope.formIdSelected = "93cecf4f0000000000000000";
        $rootScope.taskIdSelected ="93e0d7010000000000000000"
        $scope.RecordValue = [];
        var formlistData = [];
        $scope.lableValidationField = [];

        $scope.resolelist = [];
        var widgetValuesList = [];
        var columnDefs = [];
        var sectionCategory = [];
        var groupCategory = [];
        var inserted = {};
        $rootScope.recordIdsList = [];
        $rootScope.SelectedRecordIds = [];
        $scope.formRecordsInfo = {};
        $scope.allRecords = {};
        $rootScope.reassignRecordIds = {};
        $scope.recordIdsList = [];
        var recordInsertedBy = [];
        var formDetailsForRecords = {};
      
            // formDetailsForRecords['type'] = 1,
            // formDetailsForRecords['fromDate'] = firstDay,
            // formDetailsForRecords['toDate'] = lastDay,
            // formDetailsForRecords['formId'] = $rootScope.formIdSelected;
            // formDetailsForRecords['departmentId'] = ['All'],
            // formDetailsForRecords['users'] = "user"
             formDetailsForRecords['type'] = 0,
            formDetailsForRecords['fromDate'] = firstDay,
            formDetailsForRecords['toDate'] = lastDay,
            formDetailsForRecords['formId'] = $rootScope.formIdSelected;
            formDetailsForRecords['departmentId'] = ['All'],
            formDetailsForRecords['users'] = "All"
             if ($scope.formlist == undefined) {
            console.log(formDetailsForRecords)
            dashboardService.restPostType(url, formDetailsForRecords, securityHeaders, function(res, status) {
               console.log(status)
                console.log(res)

                 if (res.status == 204) {
                 
                  var totalRecords='1';
                  var countVisitor= parseInt("" + yearMonthNow + totalRecords)
                  var visitorNo=countVisitor
                  console.log(visitorNo)
                  // var selectedFormRecordFields={}
                  // var selectedFormRecordFields.TextBox__name_2006749;
                  $scope.selectedFormRecordFields.TextBox__name_2006749=visitorNo;

                 }
                 else{
                //$rootScope.completeRecords = res.records;
                var totalRecords=res.records.length+1;
                var countVisitor= parseInt("" + yearMonthNow + totalRecords)
                var visitorNo=countVisitor
                console.log(visitorNo)
                // var selectedFormRecordFields={}
                // var selectedFormRecordFields.TextBox__name_2006749;
                $scope.selectedFormRecordFields.TextBox__name_2006749=visitorNo;
            }
            });
        }
    }


//customisation by abhilash pinnenti
$scope.name=$localstorage.getObject("username");
$scope.myFunction = function() {
	console.log($rootScope.edptoken)
	$rootScope.edptoken="";
	
	if($rootScope.edptoken == ""){
		console.log("in otp")
	}

	console.log('in cust function')
    var id = document.getElementById("TextBox__name_2003980");
    
     var url=config.url;
     if(id.value.length >= 7 && id.value.length <= 10){
       
        $http({
     method : "GET",
    
     url:url+"/api/v1/tasks/_getproduct/"+id.value
    
   }).then(function mySuccess(response) {
   		if(response.data.status == 204){
   			// var alertPopup = $ionicPopup.alert({
      // 		template: 'No Data Found '
    		// });
    		alertService.showToast("No Data Found");
   		}
   		console.log(response.data)
   		var visitorDetails=response.data;
      // $scope.selectedFormRecordFields = response.data;

       $scope.selectedFormRecordFields.TextBox__name_2003980=id.value;
       $scope.selectedFormRecordFields.TextBox__name_2008740=visitorDetails.consumerName;
       $scope.selectedFormRecordFields.Textarea__Name_2011279=visitorDetails.address;
       $scope.selectedFormRecordFields.TextBox__name_2012433=visitorDetails.phoneNo;
       $scope.selectedFormRecordFields.TextBox__name_2012571=visitorDetails.fileNo;
       $scope.selectedFormRecordFields.TextBox__name_2013567=visitorDetails.divisionName;
       $scope.selectedFormRecordFields.TextBox__name_2014095=visitorDetails.subDivisionName;
       $scope.selectedFormRecordFields.TextBox__name_2015744=visitorDetails.secName;
       $scope.selectedFormRecordFields.TextBox__name_1144009=visitorDetails.secCode;
       $scope.selectedFormRecordFields.TextBox__name_2016853=visitorDetails.circleName;


     }, function myError(response) {
     	console.log(response)
       alertService.showToast("Internal server error");
   });
        
     }
    };


	$scope.formLoderMsg = "Please wait,Form loading will take a while...";
	$scope.directTaskSavedRecordsWhileOnline = [];
	$scope.directTaskOfflineRecordsList = [];
	$scope.taskListFilterAttribute="";
	$scope.taskRecordFilterAttribute
	var arrayOps=[];
	var user = $localstorage.getObject("username");
	var objectOfMapInteraction;

	$rootScope.enableCopyForMapInteraction = false;
	$scope.pullOverCheck = {value : false};
	$scope.voiceSearchToggle = {value : false};
    $scope.targetPath ="";
    $scope.enableCheckbox = false;
	$scope.syncRecIds = [];
	var deviceData = $localstorage.getObject("deviceInfo");
	var formszTableCreationQuery = 'CREATE TABLE IF NOT EXISTS FormData_table(uniqueID integer primary key autoincrement,FormId integer,userId integer ,FormValues text,FormStatus text,TaskId text,recordId text,isRequired text,displayValues text,recordComments text,IsReassign text,lat text,long text,insertDate text,version text,videoOptions text,videoPath text,isVideoAvailable text,recordType text,AssignmentId integer)';
	$scope.$on('fillMapInteractionInTaskForm', function(event, args) {

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
    // 	$scope.selectedFormRecordFields[id]= angular.copy("");
		$scope.videoFieldStatus=videoFieldStatus;
		console.log($scope.selectedFormRecordFields)
	}

	$scope.captureVideo = function (id) {
		cordova.plugins.diagnostic.requestExternalStorageAuthorization(
			function (status) {}, function (error) {
			console.error("The following error occurred: " + error);
		}, true);
	//	$scope.url = config.url + "/api/v1/gridFS/addvideo/";		
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
						src: $sce.trustAsResourceUrl($scope.selectedFormRecordFields[id]),
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
/*	$scope.getVideo = function(id,fieldId){
		console.log($scope.selectedFormRecordFields)
		if(id !="")
		{
			$scope.id=fieldId;
			$scope.videoUrl = config.url + "/api/v1/gridFS/getvideo/" + id;
		
			$rootScope.config = {
					
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
	}*/
$scope.getVideo = function(id,fieldId){
		console.log(fieldId);
		console.log($scope.selectedFormRecordFields)
		if(id !="")
		{
			$scope.id=fieldId;
			var url = config.url + "/api/v1/gridFS/fetchVideo/"+$scope.genId +"/"+ fieldId;
			dashboardService.listOfForms(url, securityHeaders, function (response) {
				console.log(response);
				$scope.videoUrl = config.url + "/api/v1/gridFS/getvideo/" + response.data;
				$rootScope.config = {
					theme: "lib/videogular-themes-default/videogular.css",
					plugins: {
						poster: "http://www.videogular.com/assets/images/videogular.png"
					}
			};
			});
			
		}
		else
		{
			alert("No video captured")
		}
		
	
	}
	$scope.setDefinedValueForCalender = function(defalutValue,prepapulatedValue,id,selectedFormRecordFields,isNew,typeOfDateSelected)
	{		
		console.log(defalutValue)
		console.log(prepapulatedValue)
		console.log(id)
		console.log(selectedFormRecordFields)
		console.log(isNew)
		console.log(typeOfDateSelected)

		if(isNew)
		{
			if(defalutValue != "" && defalutValue != undefined && defalutValue != null)
			{
				selectedFormRecordFields[id] = new Date(defalutValue);
			}
			else if(typeOfDateSelected == 'Manual Entry')
			{
				selectedFormRecordFields[id] = ""
			}
			else{
				selectedFormRecordFields[id] = new Date();
			}
		}
		else
		{
			if(prepapulatedValue !== "" && prepapulatedValue !== undefined)
			{
					selectedFormRecordFields[id] = prepapulatedValue;
			}
			else
			{
				if(defalutValue != "" && defalutValue != undefined && defalutValue != null)
				{
					selectedFormRecordFields[id] = new Date(defalutValue);
				}
				else if(typeOfDateSelected == 'Manual Entry')
				{
					selectedFormRecordFields[id] = ""
				}
				else{
					selectedFormRecordFields[id] = new Date();
				}
			}
		}
	}

	$scope.setDefinedValueForDropdown = function(defalutValue,availableOptions,prepapulatedValue,id,selectedFormRecordFields,isNew,widgetType)
	{		
		console.log("in setDefinedValueForDropdown")
			if(isNew)
			{
				if(defalutValue == "" || defalutValue == undefined)
				{
						selectedFormRecordFields[id] = ""
				}
				else
				{
					angular.forEach(availableOptions, function (option, index) {
						if(defalutValue == option.value){
							selectedFormRecordFields[id] = option.lable;
							$scope.selectedFormRecordFields[id] = option.value;

						}
					});
				}
			}
			else
			{
				if(prepapulatedValue !== "" && prepapulatedValue !== undefined)
				{
					angular.forEach(availableOptions, function (option, index) {
						if(prepapulatedValue == option.value){
							selectedFormRecordFields[id] = option.lable;
							$scope.selectedFormRecordFields[id] = option.value;
						}
					});
				}
				else
				{
					if(defalutValue == "" || defalutValue == undefined)
					{
							selectedFormRecordFields[id] = ""
					}
					else
					{
						angular.forEach(availableOptions, function (option, index) {
							if(defalutValue == option.value){
								selectedFormRecordFields[id] = option.lable;
								$scope.selectedFormRecordFields[id] = option.value;
							}
						});
					}
				}
			}
	}

	/*
	By:LS
	Date: 26-04-2018
	Description: setDefinedValueForNumber added for number field*/
	$scope.setDefinedValueForNumber = function(defalutValue,prepapulatedValue,id,selectedFormRecordFields,isNew,widgetType)
	{		
			if(isNew)
			{
				if(defalutValue == "" || defalutValue == undefined)
				{
						selectedFormRecordFields[id] = ""
				}
				else
				{
					selectedFormRecordFields[id] = parseFloat(defalutValue);
				}
			}
			else
			{
				if(prepapulatedValue !== "" )
				{
						selectedFormRecordFields[id] = parseFloat(prepapulatedValue);
				}
				else
				{
					if(defalutValue == "" || defalutValue == undefined)
					{
							selectedFormRecordFields[id] = ""
					}
					else
					{
						selectedFormRecordFields[id] = parseFloat(defalutValue)
					}
				}
			}
	}

$scope.setDefinedValue = function(defalutValue,prepapulatedValue,id,selectedFormRecordFields,isNew,widgetType)
	{		
		console.log(defalutValue)
		console.log(prepapulatedValue)
	//	console.log(id)
		console.log(selectedFormRecordFields)
		console.log(isNew)
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
				if(prepapulatedValue !== "" && prepapulatedValue !== undefined)
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


	//video field end


	//derived field start

	$scope.isDependentField = function (fieldId) {

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
		// developer abhilash for reason code dropdown
		if(selectedOption == 'WATER SUPPLY'){
			$scope.cars = [
				{value : "53-PIPE LEAKAGE", lable : "PIPE LEAKAGE"},
		        {value : "54-VALVE LEAKAGE", lable : "VALVE LEAKAGE"},
		        {value : "6-NO WATER FOR X DAYS", lable : "NO WATER FOR X DAYS"},
		        {value : "8-LOW WATER PRESSURE", lable : "LOW WATER PRESSURE"},
				{value : "13-POLLUTED WATER SUPPLY", lable : "POLLUTED WATER SUPPLY"},
		        {value : "1-WATER LEAKAGE", lable : "WATER LEAKAGE"},
		        {value : "17-ERRATIC TIMING OF WATER SUPPLY", lable : "ERRATIC TIMING OF WATER SUPPLY"},
		        {value : "24-CHANGE OF CATEGORY OF CONSUMPTION", lable : "CHANGE OF CATEGORY OF CONSUMPTION"},			
		        {value : "14-ILLEGAL USING OF MOTOR", lable : "ILLEGAL USING OF MOTOR"},
		        {value : "26-MISSING WATER MANHOLE COVER", lable : "MISSING WATER MANHOLE COVER"},
		        {value : "55-ILLEGAL WATER CONNECTION", lable : "ILLEGAL WATER CONNECTION"}
		    ];
		}
		else if(selectedOption == 'SEWERAGE'){
			$scope.cars = [
		        {value : "7-SEWERAGE OVERFLOWS ON THE ROAD", lable : "SEWERAGE OVERFLOWS-ON THE ROAD"},
		        {value : "21-CHOKAGE CUSTOMER PREMISES", lable : "CHOKAGE CUSTOMER PREMISES"},
		        {value : "4-REPLACEMENT OF MISSING MANHOLE COVER", lable : "REPLACEMENT OF MISSING MANHOLE COVER"},
		        {value : "10-SEPTIC TANK CLEARING REQUIRED PRIVATE", lable : "SEPTIC TANK CLEARING REQUIRED PRIVATE"},
				{value : "27-SILT ON THE ROAD", lable : "SILT ON THE ROAD"},
		        {value : "56-DAMAGED/REPAIR/RAISING OF MANHOLE COVER", lable : "DAMAGED/REPAIR/RAISING OF MANHOLE COVER"}
		    ];
		}
		else if(selectedOption == 'METER'){
			$scope.cars = [
		        {value : "25-CLEANING AND MEAITENANCE OF METERS", lable : "CLEANING AND MEAITENANCE OF METERS"},
		        {value : "22-METER REPAIRS AND REPLACEMENTS DOMESTIC", lable : "METER REPAIRS AND REPLACEMENTS DOMESTIC"},
		        {value : "23-METER REPAIRS OTHER THAN DOMESTIC", lable : "METER REPAIRS OTHER THAN DOMESTIC"}
		    ];
		}
		else if(selectedOption == 'BILLING'){
			$scope.cars = [
		        {value : "28-METER READING DISPUTE", lable : "METER READING DISPUTE"},
		        {value : "29-METER READING DISPUTE", lable : "METER READING DISPUTE"},
		        {value : "30-METER READING DISPUTE", lable : "METER READING DISPUTE"},
		        {value : "32-DISPUTE OVER SEWERAGE CESS", lable : "DISPUTE OVER SEWERAGE CESS"},
		        {value : "33-NON-COMPLIANCE OF ONE TIME SETTLEMENT", lable : "NON-COMPLIANCE OF ONE TIME SETTLEMENT"},
		        {value : "34-DISPUTE OVER CATEGORY CLASSIFICATION", lable : "DISPUTE OVER CATEGORY CLASSIFICATION"},
		        {value : "35-PROTEST AGAINST THE CUSTOMER ACCOUNT NO.S", lable : "PROTEST AGAINST THE CUSTOMER ACCOUNT NO.S"},
				{value : "36-NAME CHANGE", lable : "NAME CHANGE"},
		        {value : "37-CORRECTION OF NAME", lable : "CORRECTION OF NAME"},
		        {value : "38-CORRECTION OF HOUSE NO.S", lable : "CORRECTION OF HOUSE NO.S"},
		        {value : "39-NON ISSUE OF BILLS", lable : "NON-ISSUE OF BILLS"},
		        {value : "40-REQUEST FOR DISCONNECTION OF WATER SUPPLY", lable : "REQUEST FOR DISCONNECTION OF WATER SUPPLY"},
				{value : "41-SERVICE ALREADY DC,GETTING REGULAR BILLS", lable : "SERVICE ALREADY DC,GETTING REGULAR BILLS"},
				{value : "42-REQUEST FOR THE RECONNECTION OF WATER SUPPLY", lable : "REQUEST FOR THE RECONNECTION OF WATER SUPPLY"},
				{value : "43-SETTLEMENTS OF OVER DUES", lable : "SETTLEMENTS OF OVER DUES"},
				{value : "44-ENHANCEMENT OF CONNECTIONS (GETTING TWO BILLS)", lable : "ENHANCEMENT OF CONNECTIONS (GETTING TWO BILLS)"},
				{value : "12-EXCESS BILL AND VERIFICATION", lable : "EXCESS BILL AND VERIFICATION"},
				{value : "11-NON RECEIPT OF WATER BILL", lable : "NON-RECEIPT OF WATER BILL"},
				{value : "20-OTHERS", lable : "OTHERS"},
				{value : "49-NON ISSUE OF METERED BILL", lable : "NON-ISSUE OF METERED BILL"}

			 ];
		}
		else if(selectedOption == 'REQUEST SERVICES'){
			$scope.cars = [
		        {value : "46-CHANGE OF MOBILENO", lable : "CHANGE OF MOBILENO"},
		        {value : "52-RAIN WATER HARVESTING", lable : "RAIN WATER HARVESTING"},
		        {value : "9-TANKER REQUIRED FOR ADDITIONAL SUPPLY", lable : "TANKER REQUIRED FOR ADDITIONAL SUPPLY"},
		        {value : "5-DIAL A TANKER", lable : "DIAL-A-TANKER"},
		        {value : "16-CONNECTION REQUEST", lable : "CONNECTION REQUEST"},
		        {value : "18-METER ON DIAL", lable : "METER-ON-DIAL"}


		    ];
		}
		else if(selectedOption == 'OTHERS'){
			$scope.cars = [
		        {value : "45-SWC NEW CONNECTION RELATED", lable : "SWC NEW CONNECTION RELATED"},
		        {value : "48-MISCELLANEOUS", lable : "MISCELLANEOUS"},
		        {value : "19-SPOT BILLING MACHINE REPAIRS", lable : "SPOT BILLING MACHINE REPAIRS"},
		        {value : "15-CHANGING OF LINE REQUESTED", lable : "CHANGING OF LINE REQUESTED"},
		        {value : "2-BOREWELL REPAIRS", lable : "BOREWELL REPAIRS"},
		        {value : "3-STORM WATER OVERFLOWS", lable : "STORM WATER OVERFLOWS"},
		        {value : "47-TANKER DELIVERY COMPLAINT", lable : "TANKER DELIVERY COMPLAINT"}

		    ];
		}
		else if(selectedOption == 'QAT'){
			$scope.cars = [
		        {value : "31-ABSENSE OF RESIDUAL CHLORINE", lable : "ABSENSE OF RESIDUAL CHLORINE"}
		        
		    ];
		}
		else if(selectedOption == 'AMR METER'){
			$scope.cars = [
		        {value : "50-ABNORMAL METER READING", lable : "ABNORMAL METER READING"},
		        {value : "51-NON WORKING OF METER", lable : "NON-WORKING OF METER"}
		    ];
		}		console.log("selectedOptionselectedOption")
		console.log(selectedOption)
		$scope.arr={};
		$scope.arr.lable="hi";
		$scope.arr.value="h"

		$rootScope.isFromDropdown=typeStatus;
		if (type == 'drpdwn') {
			$scope.drpdwnFieldId = field_Id;
			console.log($scope.drpdwnFieldId)
		}
		angular.forEach(avilableOptions, function (option, index) {
		if (angular.isDefined(selectedOption)) {
			if ((option.value).toLowerCase().trim() === (selectedOption).toLowerCase().trim()) {
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
								//$scope.dependentFields = JSON.parse(TempVar1);
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

				if(type == 'drpdwn'){
					selectedOption[field_Id] = option.lable;
					$scope.selectedFormRecordFields[field_Id] = option.value;
					console.log(option.lable)
					console.log(option.value)

				}
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
			$rootScope.typeOfTask = "Task";
			$rootScope.enableCopyForMapInteraction = true;
			objectOfMapInteraction = data;
			openMenu();
//			mapComponentServices.setMapInteractionFieldValue1($scope,data);

		}else{
			alertService.showToast("You are in offline, not able to perform");			
		}
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
//       return $ionicSideMenuDelegate.isOpenRight();
return $ionicSideMenuDelegate.isOpenLeft();
      },
      function (isOpen) {
        if (isOpen){
	    	$scope.pullOverCheck.value = true;
        } else{
	      $scope.pullOverCheck.value = false;
	      $rootScope.$broadcast('disableSketching');
	      mapComponentServices.removeSketching($scope);
  	      $rootScope.$broadcast('hidePrePopData');
  	      $rootScope.$broadcast('hideRoutingOnMap');
		  $rootScope.enableCopyForMapInteraction = false;
        }
	});

	$scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){ 
	    if(toState.name == "sidemenu.tabs.formTasks.assignedFormTasksformView" || toState.name == "sidemenu.tabs.formTasks.assignedformTasksforms" || toState.name == "sidemenu.tabs.formTasks.formTaskRecords" || toState.name == "sidemenu.tabs.formTasks.assignedFormTasksformViewHistory"){
		    $rootScope.hideTabs = true;
	    }else{
		    $rootScope.hideTabs = false;
	    }
	});

  	$scope.$on('closepopupsInTask', function () {
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

	$scope.openMenu = function () {
	    openMenu();
  	};

  	function openMenu(){
  		if($ionicSideMenuDelegate.isOpen()){
  			$ionicSideMenuDelegate.toggleRight(false);
  		}else{
//  			$ionicSideMenuDelegate.toggleRight();
$ionicSideMenuDelegate.toggleLeft();
  		}
  	}
 	/**
     * @desc 
        For showing existing sketchings  
     * @modified by Santhosh Kumar Gunti
 	*/
	$scope.sketchings = function(){
		$rootScope.sketchingFrom = "Task";
//		$scope.getSketchings();
		mapComponentServices.sketchingsTask($scope);
	}

	$scope.references = function(){
		mapComponentServices.references($scope,commonService.getSelectedFormReferensesFromProjectTask());
	}

	$scope.closeModalOfReferences = function(){
		mapComponentServices.closeModalOfReferences($scope);
	}

	$scope.goToReferences = function(url){
		mapComponentServices.goToReferences(url);
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
	    	voiceSearchToggle.value = false; 
			$scope.voiceRecogIncrementForGroupOrSection = 0;
			$scope.voiceRecogIncrementForGroupInSection = 0;
			$scope.voiceRecogIncrement = 0;
			projectTaskServices.startSpeech($scope);
  		}
  		else{
			$scope.stopVoiceRecong = true;
  		}
  		voiceSearchToggle.value = !voiceSearchToggle.value;
	};

	$scope.editSketching = function(sketchingData){
		mapComponentServices.editSketching($scope,sketchingData,$rootScope.isHistoryShowingAtDirectTask);
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


	$scope.$on("setSketchingDataInTask", function () {
		$scope.selectedFormRecordFields['sketching'] = $rootScope.sketchingData;
	});


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
	
	$scope.sortBy = function(propertyName) {
		console.log('sortBy')
		$scope.taskRecordFilterAttribute = '';
		$scope.taskListFilterAttribute = propertyName;
	    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
	    $scope.propertyName = propertyName;
	};

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

	$scope.applyFilter = function(){
		$scope.statusType = $scope.store;
	}

	$scope.$on("disablePullover", function () {
		if($scope.pullOverCheck.value == true){
			$scope.pullOverCheck.value = false;
			$scope.openMenu();
		}
	});

	$scope.clearFilter = function(){
		$scope.taskListFilterAttribute = '';
		$scope.statusType = null;
		$scope.propertyName = null; 
		$scope.reverse = false;
		$scope.activeMenu = null;
	}

	$scope.closeTaskFilter = function(){
		console.log('closeTaskFilter');
		$scope.modalCloseAddBookmark.remove();
	}

	$scope.closeTaskFormFilter = function(){
		console.log('closeTaskFilter');
		$scope.modalFilterTaskForms.remove();
	}

	$scope.closeTaskFormRecordsFilter = function(){
		$scope.modalFilterTasksRecords.remove();
	}

	$scope.propertyName = 'endDate';
	$scope.reverse = true;

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
                $state.transitionTo("sidemenu.tabs.formTasks.assignedFormTasksformView");
            } else {
                var query = 'SELECT * FROM FormSkeleton_table WHERE FormId=?';
                $cordovaSQLite.execute(db, query, [item.FormId]).then(function (res) {
                    var len = res.rows.length;
                    for (var i = 0; i < len; i++) {
                        var TaskFormValues = res.rows.item(i).FormSkeleton;

                        $rootScope.fields = JSON.parse(TaskFormValues);
                        $localstorage.setObject("offlineData", TaskFormValues);

                        $state.transitionTo("sidemenu.tabs.formTasks.assignedFormTasksformView");
                    }
                }, function (err) {
                    alert(JSON.stringify(err));
                });
            }
        }
//    }
	},
	/* viewing the individual submitted record online*/
	$scope.$on('ViewTaskFormRecord', function(event, item) {

//	$rootScope.ViewTaskFormRecord = function (item) {
		console.log(item);
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
/*					if (k.includes("timestamp")) {
						$scope.selectedFormRecordFields[k] = $filter('date')(response.updatedTime, "d MMM y HH:mm");
					} else if (k.includes("Location")) {
						var latlngStr = v.split(',', 2);
						var latlng = {
							lat: parseFloat(latlngStr[0]),
							lng: parseFloat(latlngStr[1])
						};

						var option = {
							serviceUrl: "http://nominatim.openstreetmap.org/",
							geocodingQueryParams: {},
							zoom: 13
						}
						var geoCoderNominate = new L.Control.Geocoder.Nominatim(option);
						geoCoderNominate.reverse(latlng, 13, function (data) {
							$scope.selectedFormRecordFields[k] = data[0].name;
						}, function (err) {
							$scope.selectedFormRecordFields[k] = v;
						})

					} else {
						$scope.selectedFormRecordFields[k] = v;
					}
*/				});
			});
		});
		hidemapIcon = false;
		$scope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
		$state.transitionTo("sidemenu.tabs.formTasks.assignedFormTasksformViewHistory");
		//sidemenu.tabs.formTasks.assignedFormTasksformViewHistory
		//only submitted record..... viewing submitted record
	});

// In map view, on click on marker a corresponding address should be viewed.
	// This method is called to view the carded or non-carded address
	$scope.$on('getPrePoprecordFromMapTask', function(event, item) {

//	$rootScope.getPrePoprecordFromMap = function (item) {
		commonService.setSelectedDirectTaskFormRecordId(item.recordId);
		console.log(item);
//		alert("getPrePoprecordFromMap")
		var query = "SELECT * FROM FormData_table WHERE recordId=?";
		$cordovaSQLite.execute(db, query, [item.recordId]).then(function (res) {
		console.log(res);
		console.log(res.rows);
		console.log(res.rows.length);
		if(res.rows.length<=0){

			$scope.isEmptyForm = false;
			$scope.isSavedRecord = false;
			$scope.ditrectTaskFillingFormtype = 'prepop';
		
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
			var url = config.url + "/api/v1/formszDetails/getprePOPRecords/" + user + "/" + item.FormId + "/" + item.recordId;
			formsSave.getPrepopData(url, securityHeaders, function (response) {
				console.log(response);
				$localstorage.setObject("reassignedRecordId", item.recordId);
				if (response.message) {}
				else {
					angular.forEach(response, function (value, key) {
						angular.forEach(value.prepopulatedData, function (recordValues, recordKeys) {
							angular.forEach(recordValues, function (v, k) {
								$scope.selectedFormRecordFields[k] = v;
							});
						});
					});
				}
				$scope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
				$state.transitionTo("sidemenu.tabs.formTasks.assignedFormTasksformView");
			});
			//		}
		} else {
			$scope.editPrepopulatedRecord(item);
		}
		}else{
			$scope.isEmptyForm = false;
			$scope.isSavedRecord = true;
			console.log(res.rows.item(0))
			$scope.directTaskSelectedRecordUniqueId = res.rows.item(0).uniqueID;
			commonService.setSelectedDirectTaskFormRecordId(item.recordId);
			$scope.directTaskSelectedRecordId =  item.recordId;
//			alert("data exists");
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
	});

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
			$state.transitionTo("sidemenu.tabs.formTasks.assignedFormTasksformView");
		});
	}

	$scope.openMap = function (item) {
		var url = config.url + "/api/v1/tasks/getRecordsOfDirectTaskForm/" + item.TaskId + "/" + item.FormId +"/"+$localstorage.getObject("username");
		reassign.getPrepopulatedData(url, securityHeaders, function (response) {
			console.log(response)
			$rootScope.directTaskDisplayValues = response.data.displayValues;
			
			//This will use while switching the tab
			commonService.setSelectedDirectTaskFormDiplayValues(response.data.displayValues)

			//$scope.dependentFields = response.data.dependentFields;
			commonService.setDepnddentfieldsOfFormOfTask(response.data.dependentFields);
			commonService.setDependentfields(response.data.dependentFields);
			commonService.setSelectedFormWorkInstructionFromProjectTask(response.data.workInstruction);
			commonService.setSelectedFormSkeltonVersionFromProjectTask(response.data.version);
			commonService.setSelectedFormReferensesFromProjectTask(response.data.references);

			commonService.setSelectedFormSkeltonFieldsFromProjectTask( response.data.formSkelton);
			
			$scope.dependentFields = commonService.getDependentfields();

			commonService.setSelectedFormId(item.FormId);
			commonService.setSelectedTaksId(item.TaskId);
			$rootScope.NavigatedFrom = "form";
		    $rootScope.$broadcast('showPrePopDataForTasks');
			$ionicListDelegate.closeOptionButtons();
		    $scope.openMenu();
		});

	};
	/*
	@Description: restricting to click card on navigate button click
	@Developer: Santhosh Kumar Gunti
	*/

	$scope.navigateToLocationFromPrepop = function (id,$event) {
		$event.stopPropagation();
		$rootScope.NavigatedFrom = "prepoprec";
		$rootScope.navigatetoRecordId = id;
	    $rootScope.$broadcast('showPrePopDataForTasks');
		$ionicListDelegate.closeOptionButtons();
	    $scope.openMenu();
	};

	$scope.backToPrePoRecords = function()
	{
		$rootScope.isHistoryShowingAtDirectTask =false;
		$rootScope.isReassignShowing = false;
		mapComponentServices.resetSketchingData();
		$scope.stopVoiceRecong = true;
	}

	$scope.enableCheckboxesForReadyToSyncTasks = function()
	{
		$scope.enableSyncTasks = true;
	}

	$scope.enableCheckboxesForReadyToSyncTaskForms = function()
	{
		$scope.enableSyncForms = true;
	}


	$scope.disableSyncTasks = function()
	{	
		$scope.syncTaskList =[]
		$scope.enableSyncTasks = false;
	}

	$scope.disableSyncForms = function()
	{	
		$scope.syncFormList =[]
		$scope.enableSyncForms = false;
	}

	$scope.getTaskIdForSyn = function(id)
	{	
		
		if($scope.syncTaskList.indexOf(id) == -1)
		{
			$scope.syncTaskList.push(id);
		}
		else
		{
			$scope.syncTaskList.splice($scope.syncTaskList.indexOf(id),1)
		}
		
	}

	$scope.getFormIdForSyn = function(id,item)
	{
		$scope.taskIdOfForm=item.TaskId;
		if($scope.syncFormList.indexOf(id) == -1)
		{
			$scope.syncFormList.push(id);
		}
		else
		{
			$scope.syncFormList.splice($scope.syncFormList.indexOf(id),1)
		}
	}
	$scope.getUniqueIdsForSyn = function(id)
	{
		console.log(id)
		console.log($scope.syncRecIds.indexOf(id))
		if($scope.syncRecIds.indexOf(id) == -1)
		{
			$scope.syncRecIds.push(id);
		}
		else
		{
			$scope.syncRecIds.splice($scope.syncRecIds.indexOf(id),1)			
		}
		if ($scope.syncRecIds.length == 0) {
				$scope.header_sync_hide = false;
		} else {
			$scope.header_sync_hide = true;
		}
		console.log($scope.syncRecIds);
	}
	$scope.checkRecords=function(){
		console.log("single selectionnnn")
		$scope.HistoryPopover.hide();
		$scope.syncRecIds = [];
		$scope.enableCheckbox = true;
	}
	$scope.checkAllRecords=function(){
		$scope.syncRecIds = [];
		$scope.HistoryPopover.hide();
		$scope.enableCheckbox = true;
		console.log($scope.directTaskSavedRecordsWhileOnline)
		angular.forEach($scope.directTaskSavedRecordsWhileOnline, function (item) {
			console.log(item)
			$scope.getUniqueIdsForSyn(item.uniqueID);
		});
	}
	$scope.clearSelection = function () {
		$scope.enableCheckbox = false;
//		$scope.selectCheckBox = false;
	},
	$scope.syncAllTasksOnline=function(selection){
		console.log(selection)
		console.log(config.url)
		console.log(deviceData.uuid)
		console.log(user)
		$scope.enableSyncTasks=false;
		SyncUtility.syncTasks(function(data){
			console.log(data)
			$scope.syncVideos(deviceData.uuid,data,"1");
		},function(){},[{"url":config.url},{"uuid":deviceData.uuid},{"username":user},{"ids":selection}])

	}	
	$scope.syncAllFormsOnline=function(selection,taskId){
	//	console.log(selection)
	//	console.log($scope.taskIdOfForm);
		$scope.enableSyncForms=false;
		SyncUtility.syncForms(function(data)
		{
			console.log("inside success");
			console.log(data)
			$scope.syncVideos(deviceData.uuid,data,"2");
		},
			function(){},[{"url":config.url},{"uuid":deviceData.uuid},{"username":user},{"taskids":[$scope.taskIdOfForm]},{"formids":selection}])

	}
	$scope.syncAllRecordsOnline=function(selection){
		console.log(selection)
		console.log(deviceData.uuid)
		console.log(user)
		console.log(config.url)
		$scope.enableCheckbox = false;
		SyncUtility.syncRecords(function(data)
		{
			console.log("inside success");
			console.log(data)
		if(data.length>0){
			$scope.syncVideos(deviceData.uuid,data,"3");
		}else{
				alertService.showToast('Failed to sync videos'); 
		}
			
		},function(){
			console.log("faileddddddddddddddddd")
		},[{"url":config.url},{"uuid":deviceData.uuid},{"username":user},{"ids":selection}])
	}
	$scope.syncVideos=function (uuid,recIds,type){
		console.log(recIds)
		if(recIds.length>0){
		SyncUtility.syncVideos(function(data)
			{
				console.log("inside success video response");
				console.log(data)
				if(data.length>0){
					$scope.deleteRecords(data,type);
				}else{
						alertService.showToast('Failed to sync videos'); 
				}
			},
				function(){},[{"url":config.url},{"uuid":uuid},{"username":user},{"ids":recIds}])
		}
	}
	$scope.deleteRecords=function(updatedRecIds,type){
		console.log(updatedRecIds)
		var convertArray = "('" + updatedRecIds + "')";
		var arr = convertArray.replace(/,/g, "','")
		var query = "SELECT * FROM FormData_table WHERE uniqueID IN " + arr
		var recordIdCount = 0;
		$cordovaSQLite.execute(db, query).then(function (res) {
			console.log(res);
			var insertQuery = "INSERT INTO submitedRecordsLog (User,taskId ,formId,recordId) VALUES";
				for (var i = 0; i < res.rows.length; i++) {
					var FormId = res.rows.item(i).FormId;
					var TaskId = res.rows.item(i).TaskId;
					var RUID = res.rows.item(i).recordId;
					if(RUID!=undefined && RUID!=null && RUID!="")
					{
						recordIdCount++;
						if(i < res.rows.length-1)
                        	insertQuery += "('"+$localstorage.getObject("username")+"','"+TaskId+"','"+FormId+"','"+RUID+"'),";
                        else if(i == res.rows.length-1)
                        	insertQuery += "('"+$localstorage.getObject("username")+"','"+TaskId+"','"+FormId+"','"+RUID+"')";
					}
				}
				console.log(insertQuery);
				if(recordIdCount > 0){
					db.executeSql("CREATE TABLE IF NOT EXISTS submitedRecordsLog(User text,taskId integer,formId integer,recordId integer)", [], function(tx, res){
			           	$cordovaSQLite.execute(db, insertQuery).then(function (res) {
					      	var query = "DELETE FROM FormData_table WHERE uniqueID IN " + arr
							$cordovaSQLite.execute(db, query).then(function (res) {
									console.log(res);
								if($state.current.name == 'sidemenu.tabs.formTasks.formTaskRecords'){
									var recObj = {FormId:commonService.getSelectedFormId(),FormName:commonService.getSelectedFormName(),TaskId:commonService.getSelectedTaksId()}
									$scope.getDirectTaksFormRecords(recObj);
								}
							}, function (err) {

								console.log(JSON.stringify(err));
							});
					    }, function (err) {
					   		console.dir(err);
					    }); 
					});
				}
				else{
					var query = "DELETE FROM FormData_table WHERE uniqueID IN " + arr
					$cordovaSQLite.execute(db, query).then(function (res) {
						if($state.current.name == 'sidemenu.tabs.formTasks.formTaskRecords'){
							var recObj = {FormId:commonService.getSelectedFormId(),FormName:commonService.getSelectedFormName(),TaskId:commonService.getSelectedTaksId()}
							$scope.getDirectTaksFormRecords(recObj);
						}
					}, function (err) {
						console.log(JSON.stringify(err));
					});
				}
		}, function (err) {
			console.log(JSON.stringify(err));
		});
		
	}
	/**
     * @description Get tasks of users  
     * @developer Venkatesh bendi
     * @Date:13/Feb/2018
    */

	$scope.getFormTask = function()
	{	
		
		$scope.NotifiedDirectTaskId = commonService.getDirectTaskNotifications()
		
		$scope.formTasks =[];
		$scope.syncTaskList =[]
		
		$scope.downloadedTaskIds = [];
		
		$scope.directTaskCountOfReadytoSyncTasks = 0;
		$scope.taskListFilterAttribute = '';
		if($rootScope.isNetworkOn)
		{	

			var userId = $localstorage.getObject("username");
			
			var departMentId = $localstorage.getObject("groupid");

			commonService.LoaderShow(strings.pleasewait);


			var url = config.url + "/api/v1/tasks/getTaksForUser/"+userId;
			console.log(url)
			console.log("urlllllllllllllllllllllll")
			$scope.getOfflineTasks(user,function(tasks){

				formsService.assignedtask(url, securityHeaders, function (response, status) {
					commonService.Loaderhide();
					$scope.formTasks = [];
					angular.forEach(response.data,function(object,index)
					{	
						var taskDownladedStatus = true;
						if($scope.downloadedTaskIds.indexOf(object._id) == -1)
						{
								taskDownladedStatus = false;
						}
						$scope.formTasks.push({
							TaskName : object.name,
							taskId   : object._id,
							startDate : object.startDate,
							endDate : object.endDate,
							createdBy : object.createdBy,
							taskDescription : object.description,
							taskType:object.taskType,
							isDownloaded:taskDownladedStatus,
							assignName:object.assignName,
						
						});	
					})

					$scope.SyncReadyTasks = []
					var loopPromises = [];
					
					angular.forEach($scope.downloadedTaskIds, function (taskId) {
				        
				        var deferred = $q.defer();
				        
				        loopPromises.push(deferred.promise);

				        db.transaction(function(tx) 
			            {
			            	//var taskId = $scope.downloadedTaskIds[i]
			        		tx.executeSql("SELECT * FROM FormData_table WHERE TaskId=? and FormStatus=?", [taskId,"saved"], function(tx, res){
			       				
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
		
	},



	$scope.getOfflineTasks = function(user,callback)
	{
		db.transaction(function(tx) {

	        //create table
	        tx.executeSql("CREATE TABLE IF NOT EXISTS DirectTaskTable(User text,TaskId integer,Details text )", [], function(tx, res){
	            tx.executeSql("SELECT * FROM DirectTaskTable WHERE User=?", [user], function(tx, res){
                   

                    //alert("found:"+res.rows.length)
                    var len = res.rows.length;
					console.log("testetsetststststststststts")
					console.log(len)
					var tasks = [];
					for (var i = 0; i < len; i++) {
						var task = JSON.parse(res.rows.item(i).Details);
						console.log(task)
						var task = JSON.parse(res.rows.item(i).Details);
						var Date1 = new Date().setHours(0,0,0,0);
						var Date2 = new Date(task.endDate).setHours(0,0,0,0);
						console.log('-----------------------');
						console.log(Date1);
						console.log(Date2);
						console.log(task.name);
						if(Date1 <= Date2)
						{
							$scope.downloadedTaskIds.push(task._id)
							$scope.formTasks.push({
								TaskName : task.name,
								taskId   : task._id,
								startDate : task.startDate,
								endDate : task.endDate,
								taskDescription : task.description,
								taskType:task.taskType,
								isDownloaded:true,
								createdBy:task.createdBy,
							});
						}
					}

					console.log($scope.formTasks)
					callback($scope.formTasks)
					
                    
                })

	            

	        });
	    

        }, function(err){
        	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
	        //errors for all transactions are reported here

    	});

	}

	/**
     * @description Get tasks of users  while re-freshing the view
     * @developer Venkatesh bendi
     * @Date:13/Feb/2018
    */
	$scope.formTasksRefresh = function()
	{
		$scope.getFormTask();
		$scope.$broadcast('scroll.refreshComplete');
	},

	$scope.refreshTaskForms = function () {
		var taskItem =  $localstorage.get("selectedTaskInfo")
		taskItem = JSON.parse(taskItem);
		$scope.getAssignedTaskForms(taskItem);
		$scope.$broadcast('scroll.refreshComplete');
	
	}
	/**
     * @description Get forms of task if form already fetched
     * @developer Venkatesh bendi
     * @Date:15/Feb/2018
    */
	$scope.getLocalStoredAssignedFormsOfTask = function()
	{
		console.log("getLocalStoredFormsOfTask")
		$scope.taskListFilterAttribute = '';
		if($scope.directTaskForms== undefined || $scope.directTaskForms.length<=0)
		{
			$scope.direcTaskName=commonService.getSelectedDirectTaskName();
			$scope.directTaskForms = commonService.getSelectedDirectTaskAssignedForms();
		}
		
	},


	/**
     * @description Get forms of task
     * @developer Venkatesh bendi
     * @Date:13/Feb/2018

     * @description : added assigneeToShowInForms scope varible to show assinee in form
     * @developer Santosh Kumar Gunti
     * @Date:14-04-2018
	 * @Type : Modify
    */

	$scope.getAssignedTaskForms = function(taskItem)
	{	

		$scope.assigneeToShowInForms = taskItem.createdBy;

		commonService.setDirectTaskNotifications("");
		//this is will usefull for refresh the page start
		/*if($scope.NotifiedDirectTaskId ==  taskItem.taskId)
		{
			commonService.setDirectTaskNotifications("");
		}*/

		console.log("taskItemtaskItemtaskItemtaskItemtaskItem")
		console.log(taskItem)

		var obj ={}
		obj.taskId = 	taskItem.taskId;
		obj.TaskName =	taskItem.TaskName;
		obj.startDate = taskItem.startDate;
		obj.taskId = 	taskItem.taskId;
		$localstorage.setObject("selectedTaskInfo",obj)
		//end 
		
		$scope.syncFormList = []		
		
		$scope.direcTaskName=taskItem.TaskName;
		
		//this will use Reintiate view while siwtching the tabs
		commonService.setSelectedDirectTaskName(taskItem.TaskName);

		var sDate = new Date(taskItem.startDate).setHours(0,0,0,0);
		var eDate = new Date(taskItem.endDate).setHours(0,0,0,0);
		var cDate = new Date().setHours(0,0,0,0);
		
		var userId = $localstorage.getObject("username");
		
		commonService.setSelectedTaksId(taskItem.taskId);
		
		commonService.LoaderShow(strings.pleasewait);
		var url = config.url + "/api/v1/tasks/getTaksFromsForUser/"+taskItem.taskId+"/"+userId;
		console.log(url)
		$scope.directTaskForms = [];
		//assignd task function call service and return the response
		$scope.getdonwLodedFormOfGivenTask(taskItem.taskId,userId,function(TaskFormsOffline){
				if($rootScope.isNetworkOn)
				{
					formsService.assignedtask(url, securityHeaders, function (response, status) {
						console.log(response)
						//customization by abhilash on click task mymd direct redirect to records
						if($localstorage.getObject("usertype") == 'GM' && config.task ==taskItem.taskId ){
							console.log("am in the task item")
							var item={};
							item.FormId=response.data[0].assigned[0].form;
							item.TaskId=taskItem.taskId;
							$scope.getDirectTaksFormRecords(item)
						}
						else{
						commonService.Loaderhide();
						$scope.directTaskForms = [];
						angular.forEach(response.data[0].assigned,function(value,index){
							var taskFormDownloadedStatus = true;
							if($scope.downloadedFormIds.indexOf(value.form) == -1)
							{
								taskFormDownloadedStatus = false
							}
							console.log(value);
							$scope.directTaskForms.push({
								FormName :value.formName,
								FormId : value.form,
								TaskId : taskItem.taskId,
								fileAssigned:value.fileAssigned,
								version:value.version,
								category:value.category,
								description:value.description,
								status:taskFormDownloadedStatus
								
							});
						})

						console.log("directTaskFormsdirectTaskFormsdirectTaskForms")
						console.log($scope.directTaskForms)
						//this will use Reintiate view while siwtching the tabs
						commonService.setSelectedDirectTaskAssignedForms($scope.directTaskForms);
						$scope.SyncReadyFormsOfTask = []
						var loopPromises = [];
						
						angular.forEach($scope.downloadedFormIds, function (formId) 
						{
					        var deferred = $q.defer();
					        loopPromises.push(deferred.promise);
					        
					        db.transaction(function(tx) 
				            {
				            	//var taskId = $scope.downloadedTaskIds[i]
				        		 //tx.executeSql("SELECT * FROM FormData_table WHERE TaskId=? and FormId=? and userId", [taskItem.taskId,formId,userId], function(tx, res)
				        		tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? and FormStatus=?", [formId, userId, taskItem.taskId,'saved'], function(tx, res)
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
						
						$state.go("sidemenu.tabs.formTasks.assignedformTasksforms")
						console.log($scope.directTaskForms);
					}
					});
				}
				else
				{	
					commonService.Loaderhide();
					//$state.go("sidemenu.tabs.formTasks.assignedformTasksforms")
				}
				
		})
		
	},


	//get downloaded forms of gevn task
	$scope.getdonwLodedFormOfGivenTask = function (taskId,userId,callback) {
		$scope.downloadedFormIds = [];
		var taskId = commonService.getSelectedTaksId();
		db.transaction(function(tx) {

	        //create table
	        tx.executeSql("CREATE TABLE IF NOT EXISTS FormszTableDirectTask(Username text,FormId integer,FormName text,category text,version text,description text, TaskId integer,Details text ,Frequency text)", [], function(tx, res){
	        	console.log("table create responseeee")
	        	console.log(res)
	            //insert data
	            tx.executeSql("SELECT * FROM FormszTableDirectTask WHERE Username=? and TaskId=?", [user,taskId], function(tx, res){
                    for(var iii = 0; iii < res.rows.length; iii++)
                    {	
                    	console.log("")

                        $scope.directTaskForms.push({
								FormName :res.rows.item(iii).FormName,
								FormId : res.rows.item(iii).FormId,
								TaskId : res.rows.item(iii).TaskId,
								category : res.rows.item(iii).category,
								version : res.rows.item(iii).version,
								description : res.rows.item(iii).description,
								status:true
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


	$scope.getLocalStroedDirectTaskFormRecords = function(){
		$scope.taskListFilterAttribute = '';
		$scope.taskRecordFilterAttribute = '';
		if($rootScope.driectTaskPrepopRecords== undefined || $rootScope.driectTaskPrepopRecords.length<=0)
		{
			$rootScope.directTaskFormname=commonService.getSelectedDirectTaskFormName();
			$rootScope.driectTaskPrepopRecords = commonService.getSelectedDirectTaskFormPrepopRecords();
			$rootScope.directTaskDisplayValues = commonService.getSelectedDirectTaskFormDiplayValues();
			$rootScope.isHistoryShowingAtDirectTask = false;	
			$rootScope.isReassignShowingAtDirectTask = false;
			$rootScope.prepopshowAtDirectTask = true;
			$rootScope.showSavedAtDirectTask = true;
			

		}
	}
	
	/**
     * @description Get records  of form
     * @developer Venkatesh bendi
     * @Date:13/Feb/2018
    */
$scope.getDirectTaksFormRecords = function (item) {
	console.log(item)
		$scope.NotifiedDirectTaskRwcordId = commonService.getDirectTaskRecordNotifications();

		$rootScope.prepopshowAtDirectTask = true;
		$rootScope.showSavedAtDirectTask = true;
		var sDate = new Date(item.startDate).setHours(0,0,0,0);
		var eDate = new Date(item.endDate).setHours(0,0,0,0);
		var cDate = new Date().setHours(0,0,0,0);
	
		$rootScope.isHistoryShowingAtDirectTask = false;	
		$rootScope.isReassignShowingAtDirectTask = false;	
		
		//$scope.progressbar.start();
		commonService.LoaderShow(strings.submitting);
		
		$rootScope.driectTaskPrepopRecords = [];

		if($rootScope.isNetworkOn)
		{
			$scope.taskType = commonService.getSelectedTakstype();
			localStorage.setItem("mapFormId", item.FormId);
			commonService.setSelectedFormId(item.FormId);
			commonService.setSelectedFormName(item.FormName);
			$rootScope.directTaskFormname = item.FormName;

			commonService.setSelectedDirectTaskFormName($rootScope.directTaskFormname);
			
			setGetObj.setTaskHisotryForm(item);
			$scope.isView = false;
			$scope.TaskData = true;
			var arr=[];
			var assignedFormOfflineData = [];
			//getting offline records after that fetch onlline records
			$scope.getSavedRecords(function(){
				//get online prepop recvords which are pendign to work
				var url = config.url + "/api/v1/tasks/getRecordsOfDirectTaskForm/" + item.TaskId + "/" + item.FormId +"/"+$localstorage.getObject("username");
				console.log(url);
				reassign.getPrepopulatedData(url, securityHeaders, function (response) {
					console.log(response)
					$rootScope.directTaskDisplayValues = response.data.displayValues;
					
					//This will use while switching the tab
					commonService.setSelectedDirectTaskFormDiplayValues(response.data.displayValues)

					console.log("pnlie skelton");
					console.log(response.data.dependentFields);
					//$scope.dependentFields = response.data.dependentFields;
					//commonService.setDepnddentfieldsOfFormOfTask(response.data.dependentFields);
					
					//commonService.setDependentfields(response.data.dependentFields);
					$localstorage.setObject("setDependentfields", response.data.dependentFields);

					commonService.setSelectedFormWorkInstructionFromProjectTask(response.data.workInstruction);
					commonService.setSelectedFormReferensesFromProjectTask(response.data.references);
					commonService.setSelectedFormSkeltonVersionFromProjectTask(response.data.version);

					commonService.setSelectedFormSkeltonFieldsFromProjectTask( response.data.formSkelton);
					
					//$scope.progressbar.set(90)
					angular.forEach(response.data.records,function(record,index){
							arr.push(record)
					})
					$rootScope.driectTaskPrepopRecords=arr;
					//This will use while switching the tab
					commonService.setSelectedDirectTaskFormPrepopRecords($rootScope.driectTaskPrepopRecords);
					//$scope.progressbar.complete();
					commonService.Loaderhide();
				
					//console.log($rootScope.driectTaskPrepopRecords[0].record[0].Dropdown__name_1818644)

// 		var commentsInfo = JSON.parse($rootScope.driectTaskPrepopRecords[0].comments);
// 		console.log(commentsInfo[0].UpdatedTime)
//         var date = $filter('date')( commentsInfo[commentsInfo.length-1].UpdatedTime, "MM-dd-yyyy");
// console.log(date)
					// var obj = JSON.parse($rootScope.driectTaskPrepopRecords[0]);
					// console.log(obj.comments)

					// console.log($rootScope.driectTaskPrepopRecords[0].comments)
					//console.log($rootScope.driectTaskPrepopRecords[0].comments.[{UpdatedTime}])
					$state.transitionTo("sidemenu.tabs.formTasks.formTaskRecords");
					/*$scope.getReassignRecords("venki",function(){
						console.log("ssssssssssssss")
						
					})*/
					
					
				});
				
			});
		}
		else
		{	
			commonService.setSelectedFormId(item.FormId);
			commonService.setSelectedFormName(item.FormName);
			$scope.getSavedRecords(function(){
				$scope.getOfflinePrepopRecords(user,item);
				commonService.Loaderhide();
			})
			
		}
	},

	//download form of given task
	$scope.downloadFormsOfTask = function (item,index) {
		var taskId = item.TaskId;
			var FormId = item.FormId;
			var isTaskDownloded = false;
			$scope.isFormALredayDownnLoad(taskId,FormId,user,function(isFormDownloded)
			{
				if(!isFormDownloded && !isTaskDownloded)
				{	
					var url = config.url + "/api/v1/tasks/downloadService/" + taskId + "/" + FormId + "/" + user;
					
					reassign.downloadProjectTask(url, securityHeaders, function (response) {
						console.log("task downloded url sucess")
						console.log(response.formInfo)
						
						$scope.saveTaskInOffline(JSON.parse(response.taskInfo),function(){
							console.log("after task saved in offline")
							var taskId = commonService.getSelectedTaksId();
		
							$scope.checkAndSaveFormInOffline(JSON.parse(response.formInfo),taskId,function(formRes){
								console.log("aftre save form in offline")
								
								if(response.prepopRecords.length>0)
								{
									$scope.savePrepopRecordsOfForm(taskId,FormId,user,response.prepopRecords,function()
									{	
										console.log("after save records")
										/*$scope.directTaskForms[index].status = true;
										$ionicListDelegate.closeOptionButtons();
										alertService.doAlert("Downloaded successfully");*/
										if(response.reassingRecords.length>0)
										{
											$scope.saveReassignRecordsOfForm(taskId,FormId,user,response.prepopRecords,function()
											{	
												$scope.insertDownloadedFormInfo(FormId, taskId, function(){
													console.log("after save records")
													$scope.directTaskForms[index].status = true;
													$ionicListDelegate.closeOptionButtons();
													alertService.doAlert("Downloaded successfully");
												});
											})
										}
										else
										{
											$scope.insertDownloadedFormInfo(FormId, taskId, function(){
												$scope.directTaskForms[index].status = true;
												$ionicListDelegate.closeOptionButtons();
												alertService.doAlert("Downloaded successfully");
											});
										}

									
									})
								}
								else if(response.reassingRecords.length>0)
								{
									$scope.saveReassignRecordsOfForm(taskId,FormId,user,response.prepopRecords,function()
									{	
										$scope.insertDownloadedFormInfo(FormId, taskId, function(){
											console.log("after save records")
											$scope.directTaskForms[index].status = true;
											$ionicListDelegate.closeOptionButtons();
											alertService.doAlert("Downloaded successfully");
										});
									})
								}
								else
								{
									$scope.insertDownloadedFormInfo(FormId, taskId, function(){
										$scope.directTaskForms[index].status = true;
										$ionicListDelegate.closeOptionButtons();
										alertService.doAlert("Downloaded successfully");
									});
								}
								
							});
						})
						
				
					});	
				}
				else
				{
					$ionicListDelegate.closeOptionButtons();
					alertService.doAlert("Form already downloaded");

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

	$scope.refreshOfflineRecords = function()
	{
		$scope.$broadcast('scroll.refreshComplete');
		if($rootScope.isHistoryShowingAtDirectTask)
		{
			$scope.TaskFormsHistory()
		}
		else{
			var formDetais = {FormId: commonService.getSelectedFormId(), FormName: commonService.getSelectedFormName(), TaskId: commonService.getSelectedTaksId()};
			$scope.getDirectTaksFormRecords(formDetais);
		}
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
				"<b>Assigne</b> : " + item.createdBy + " </br></br>"+
				"<b>Description</b> : " + item.taskDescription + "</br></br>"+
				"<b>Start Date</b> : " + startDate + "</br></br>"+
				"<b>End Date</b> : " + endDate + "</br>",
				buttons : [{
						text : 'ok',
						type : 'button-positive'
					}
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
				template : "<div><b>Form Name</b> : " + item.FormName + "</br></br>"+
				"<div><b>Description</b> : " + item.description + "</br></br>"+
				"<div><b>Category</b> : " + item.category + "</br></br>"+
				"<div><b>Version</b> : " + item.version + "</br></br>",
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


	//get assigned prepop recordds in offline
	$scope.getOfflinePrepopRecords = function(user,item,callback)
	{	
		$scope.submitedRecordsList =[];
		$scope.reassignRecordList = [];
		db.transaction(function(tx) {

	        //create table
	        tx.executeSql("CREATE TABLE IF NOT EXISTS DitectTaskPrepopRecords(User text,TaskId integer,FormId integer,Records text )", [], function(tx, res){
//	        tx.executeSql("CREATE TABLE IF NOT EXISTS DitectTaskPrepopRecords(User text,TaskId integer,Details text)", [], function(tx, res){
	            
				//get reassign record

	            tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? and FormStatus=? ", [item.FormId, user, item.TaskId,'reassign'], function(tx, res){
		 			console.log("felllooo ")
		 			console.log(res)
		 			var reassignRecordsLen = res.rows.length;
		 			for (var i = 0; i < reassignRecordsLen; i++)
		 			{	

		 				var obj= {}
						var arr =[]
						arr.push(JSON.parse(res.rows.item(i).FormValues).record)
						obj['record'] = arr;
						obj['_id'] = res.rows.item(i).recordId;
						obj['IsReassign'] = true;
						$rootScope.driectTaskPrepopRecords.push(obj)
						$scope.reassignRecordList.push(res.rows.item(i).recordId)
		 				console.log(JSON.parse(res.rows.item(i).FormValues).record);
		 				console.log(res.rows.item(i).recordId)
		 			}

	            //get prepop records
	            tx.executeSql("SELECT * FROM DitectTaskPrepopRecords WHERE User=? and TaskId=? and FormId =?", [user,item.TaskId,item.FormId], function(tx, res)
	            {
                    var len = res.rows.length;
					var records = [];
					var count =0;
					for (var i = 0; i < len; i++) {
						//var task = JSON.parse(res.rows.item(i).Details);
						console.log(JSON.parse(res.rows.item(i).Records))
						var records = JSON.parse(res.rows.item(i).Records);
						for(var i = 0; i < records.length; i++) {
							var obj= {}
							var arr =[]
							arr.push(angular.copy(records[i].record))
							obj['prepopulatedRecord'] = arr;
							obj['_id'] = angular.copy(records[i].recordId);
							obj['IsReassign'] = false;
							console.log($scope.reassignRecordList)
							if($scope.reassignRecordList.indexOf(angular.copy(records[i].recordId))==-1)
								$rootScope.driectTaskPrepopRecords.push(obj)
						};
		
						console.log($rootScope.driectTaskPrepopRecords);
					}

				
		 		
		 			//ger submited records info
		 			tx.executeSql("CREATE TABLE IF NOT EXISTS submitedRecordsLog(User text,taskId integer,formId integer,recordId integer)", [], function(tx, res){
	 		
				 		tx.executeSql("SELECT * FROM submitedRecordsLog WHERE formId =? and taskId =? and user =?", [item.FormId,item.TaskId,user], function(tx, res){
							
							var len = res.rows.length;
							for (var i = 0; i < len; i++) {
								$scope.directTaskOfflineRecordsList.push(res.rows.item(i).recordId);
							
							}

							//get form display values and required fields
							tx.executeSql("CREATE TABLE IF NOT EXISTS FormszTableDirectTask(Username text,FormId integer,FormName text,category text,version text,description text, TaskId integer,Details text,Frequency text )", [], function(tx, res){
		 		
						 		tx.executeSql("SELECT * FROM FormszTableDirectTask WHERE FormId =?", [item.FormId], function(tx, res){
									
									var len = res.rows.length;
									for (var i = 0; i < len; i++) {
										//var task = JSON.parse(res.rows.item(i).Details);
										console.log(res.rows.item(i).Details)
										console.log("res.rows.item(i).Detailsres.rows.item(i).Details")
										var formSkelton = JSON.parse(res.rows.item(i).Details);
										var arr = []
										arr.push(formSkelton.requiredField[0])
										$rootScope.directTaskDisplayValues = arr;
										
										console.log("directTaskDisplayValues")
										console.log($rootScope.directTaskDisplayValues)

										//$scope.dependentFields = formSkelton.dependentFields;
										$localstorage.setObject("setDependentfields", formSkelton.dependentFields);

										//commonService.setDepnddentfieldsOfFormOfTask(formSkelton.dependentFields);

										commonService.setSelectedFormSkeltonFieldsFromProjectTask(formSkelton.FormSkeleton)

										

									}

									$state.transitionTo("sidemenu.tabs.formTasks.formTaskRecords");

								})

			
		 					})

						})

		
	 				})
		 			//get 
		 			

				})
        	})

	            

	    });
	    

        }, function(err){
        	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
	        //errors for all transactions are reported here
	  
    	});

	}


	//check form of given task is downloaaded or not
	$scope.isFormALredayDownnLoad = function (taskId,FormId,user,callback) {
		
		var taskId = commonService.getSelectedTaksId();
		db.transaction(function(tx) {

	        //create table
	        tx.executeSql("CREATE TABLE IF NOT EXISTS FormszTableDirectTask(Username text,FormId integer,FormName text,category text,version text,description text, TaskId integer,Details text,Frequency text )", [], function(tx, res){
	            tx.executeSql("SELECT * FROM FormszTableDirectTask WHERE Username=? and TaskId=? and FormId=?", [user,taskId,FormId], function(tx, res){
                  
                   
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




	}

	$scope.getSavedRecords = function (callback) 
	{
		$scope.enableCheckbox = false;
		$scope.directTaskOfflineRecordsList =[];
		$scope.directTaskSavedRecordsWhileOnline = [];
		var arr = [];
		var formId = commonService.getSelectedFormId();
		var taskId = commonService.getSelectedTaksId()
		var userId = $localstorage.getObject("username");
		db.transaction(function(tx) {

	        //create table
	        tx.executeSql(formszTableCreationQuery, [], function(tx, res)
	        {
	        	
                  	db.transaction(function(tx) 
                    {
                    	tx.executeSql("SELECT * FROM FormData_table WHERE FormId=? and userId=? and TaskId=? and FormStatus=? ", [formId, userId, taskId,'saved'], function(tx, res){
                   		
		                  		var len = res.rows.length;
								for (var i = 0; i < len; i++) {
									var obj = {};
									var savedRecord = JSON.parse(res.rows.item(i).FormValues);
									
									obj.record =  savedRecord.record[0];
									console.log( res.rows.item(i).recordId)
									console.log(" res.rows.item(i).recordId")
									obj['recordId'] = res.rows.item(i).recordId;
									obj['uniqueID'] = res.rows.item(i).uniqueID;
									obj.isVideoAvailable = res.rows.item(i).isVideoAvailable;
									obj.videoOptions = res.rows.item(i).videoOptions;
									obj.videoPath = res.rows.item(i).videoPath
									$scope.directTaskOfflineRecordsList.push(res.rows.item(i).recordId);

									$scope.directTaskSavedRecordsWhileOnline.push(obj);
									
								}
								callback();	
                    
                   			})
                    }, function(err){

					        //errors for all transactions are reported here
					         console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					       
					 });

	        });
	    

	        }, function(err){
	        	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
		        //errors for all transactions are reported here
		        

	    	});
	 	
	}
			



	/**
     * @description open form with prepop data
     * @developer Venkatesh bendi
     * @Date:13/Feb/2018
    */

	$scope.gotoFormFilling = function (item,type,index) {
		
		console.log("itemmmm")
		console.log(item);
		$scope.targetPath ="";
		arrayOps=[];
		$scope.arrayOps=[];
		//$scope.dependentFields = commonService.getDependentfields();
		$scope.dependentFields = $localstorage.getObject("setDependentfields");

		console.log("neeeeeeeeeeeeeeee")
		console.log($scope.dependentFields)
		//$scope.selectedFormRecordFields[k] = v;
		$scope.isEmptyForm = false;
		$scope.ditrectTaskFillingFormtype = type;
		$scope.directTaskSelectedRecordId = item._id;

		commonService.setSelectedDirectTaskFormRecordId(item._id)
		$scope.isSelectedRecordIsReassign = item.IsReassign;
		$scope.isSavedRecord = false;
		$scope.dtSlectedPrepopRecordIndex =index;

		$scope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
		console.log($scope.fields)
		//delete item.record.RUID;
		if(!item.IsReassign ){
			if(item.prepopulatedRecord[0].sketching != undefined)
				$rootScope.sketchingData = item.prepopulatedRecord[0].sketching;

			$scope.selectedFormRecordFields =item.prepopulatedRecord[0];
		}
		else if(item.IsReassign){
			if(item.record[0].sketching != undefined)
				$rootScope.sketchingData = item.record[0].sketching;
			$scope.selectedFormRecordFields =item.record[0];
		}

		alertService.showToast($scope.formLoderMsg);

		$state.go("sidemenu.tabs.formTasks.assignedFormTasksformView");
	},

	/**
     * @description open form with prepop data
     * @developer Venkatesh bendi
     * @Date:13/Feb/2018

     * @description : Made isEmptyForm scope varible to false for filling up the form details in history 
     * @developer : Santhosh Kumar Gunti
     * @Date:11-04-2018
	 * @Type : Modified
    */


	$scope.gotoFormFillingHistory = function (item,type,index) {
		/*
		Developer: Lokesh Sahu
		Date: 24-05-2018
		Description: $scope.videoUrl set to null to reset previous played video
		*/
		$scope.videoUrl = null;
		$scope.isEmptyForm = false;
		$scope.genId=item.generatedId;
		$scope.targetPath ="";
		$scope.dependentFields = $localstorage.getObject("setDependentfields");
		//$scope.dependentFields = commonService.getDepnddentfieldsOfFormOfTask();

		$rootScope.slectedPrepopRecordIndex =index;


		//delete item.record.RUID;
		$scope.selectedFormRecordFields =item.record;

		$scope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();

		console.log($scope.selectedFormRecordFields)
		alertService.showToast($scope.formLoderMsg);
		$state.go("sidemenu.tabs.formTasks.assignedFormTasksformViewHistory");

	},

	/**
     * @description open form when click on + button 
     * @developer Venkatesh bendi
     * @Date:15/Feb/2018
    */
$scope.usertype=$localstorage.getObject("usertype");
   		console.log($localstorage.getObject("usertype"))

	$scope.gotoEmptyForrmfilling = function()
	{	
		console.log($localstorage.getObject("usertype"))
		console.log(arrayOps)
		console.log($scope.arrayOps)
		console.log($scope.selectedFormRecordFields)
		$scope.selectedFormRecordFields={};
		//$scope.dependentFields = commonService.getDepnddentfieldsOfFormOfTask();
		$scope.targetPath ="";
		arrayOps=[];
		$scope.arrayOps=[];
		$scope.dependentFields = $localstorage.getObject("setDependentfields");
		commonService.setSelectedDirectTaskFormRecordId(undefined);
		$scope.isEmptyForm = true;
		$scope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
				console.log($scope.fields[11])

		// console.log($scope.fields[11].type.fields[8].data.id)
		// console.log($scope.fields[11].type.fields[8].data.type.values[0])

		$scope.selectedFormRecordFields ={};
	//	console.log($rootScope.fields);
		alertService.showToast($scope.formLoderMsg);
		$state.go("sidemenu.tabs.formTasks.assignedFormTasksformView");	
		if($scope.usertype == 'COMPLAINTS UPLOAD'){
			$scope.getFilterredFromsCount();
		}
		
	},

	/**
     * @description submit the record
     * @developer Venkatesh bendi
     * @Date:14/Feb/2018
    */
	$scope.submitTaskForm =  function(isValid, type)
	{	
		console.log(isValid)
				console.log(type)

		commonService.LoaderShow(strings.submitting);
		
		commonService.getLatLong(function (geoLocation) {
			
			if (geoLocation.netstatus == "error") {
				commonService.Loaderhide();
				$ionicPopup.show({
					subTitle : 'Use location?',
				   	template : '<p>The location service is disabled, do you want to continue.</p>',
				   	buttons : [{
				    	text : "No",
				    	onTap : function() {
							//cordova.plugins.diagnostic.switchToLocationSettings();
							return;
				    	}
				   	}, {
				    	text : 'Yes',
				    	onTap : function() {
				    		commonService.LoaderShow(strings.submitting);
				    		$timeout(function() {
				    			commonService.Loaderhide();
							    console.log("Timeout occurred");
							    /*
					    		By:Ls
					    		Date: 25-04-2018
					    		Description: Form Submit confirmation added
					    		*/
	                	    	$ionicPopup.show({
									subTitle : 'Submit Form?',
								   	template : '<p>Do you really want to submit the form?</p>',
								   	buttons : [{
								    	text : "No",
								    	onTap : function() {
											//cordova.plugins.diagnostic.switchToLocationSettings();
											return;
								    	}
								   	}, {
								    	text : 'Yes',
								    	onTap : function() {
								    		commonService.LoaderShow(strings.submitting);
				                	    	$scope.lat = null;
											$scope.long = null;
											$scope.submitTaskFormData(isValid, type);
										}
								    }]
								});
							}, 1000);
				    		
						}
				    }]
				});
			} 
			else{
				commonService.Loaderhide();
				/*
	    		By:Ls
	    		Date: 25-04-2018
	    		Description: Form Submit confirmation added
	    		*/
				$ionicPopup.show({
					subTitle : 'Submit Form?',
				   	template : '<p>Do you really want to submit the form?</p>',
				   	buttons : [{
				    	text : "No",
				    	onTap : function() {
							//cordova.plugins.diagnostic.switchToLocationSettings();
							return;
				    	}
				   	}, {
				    	text : 'Yes',
				    	onTap : function() {
				    		commonService.LoaderShow(strings.submitting);
				    		$scope.lat = geoLocation.latlong[0];
							$scope.long = geoLocation.latlong[1];
							$scope.submitTaskFormData(isValid, type);
						}
				    }]
				});
			}
		});
		
	},

	/*
	Description: Location popup added
	Developer: Lokesh
	Date: 19-04-2018
	*/
	$scope.submitTaskFormData =  function(isValid, type)
	{	
		console.log(isValid)
				console.log(type)
		//commented by abhilash for demo as error showing 
		if(!isValid)
		{
			$timeout(function() {
				commonService.Loaderhide();
				console.log("here mandatory")
				alertService.doAlert(strings.fillMandetory);
			}, 1000);
			
			return;
		}
		
		var obj = {};
		var arr =[];
		console.log("in post"+$scope.selectedFormRecordFields)
		arr.push($scope.selectedFormRecordFields)
		obj.record = arr;
		obj.formId = commonService.getSelectedFormId();
		obj.taskId = commonService.getSelectedTaksId();
		
		obj.version = commonService.getSelectedFormSkeltonVersionFromProjectTask();

		var datenow = new Date();
		var isoDate = datenow.toISOString();
		obj.updatedTime = isoDate;
		obj.updatedBy = $localstorage.getObject("username");
		obj.recordId = commonService.getSelectedDirectTaskFormRecordId();
		
			//	isValid placed by 1==1 	
			if (isValid) 
			{
			//modified by venkatesh bendi for auto calculations in math field start
			var invalidCalculationsFieldList = [];
			calculatonFrmulaExcecutorService.isCalculationsFieldsAreStoresValidValues($scope.recordInfo,invalidCalculationsFieldList,$scope);
			//End

			// conditon to check for any fields are exceuted after calculation is executed

			//replaced by invalidCalculationsFieldList.length with 0
			if(invalidCalculationsFieldList.length == 0)
			{
				//commonService.LoaderShow(strings.submitting);
				
				var url = config.url + "/api/v1/tasks/addTaskRecord";
				
				obj.lat = $scope.lat;
				obj.long = $scope.long;
				
				var deferredForSaveRecord = $q.defer();
				var deferredForSaveRecordPromise;
				var generatedId= Date.now();
				/*
	    		By:Ls
	    		Date: 25-04-2018
	    		Description: To hold submitted record id
	    		*/
				var submitedRecordID;
				obj.generatedId = generatedId;
				console.log(obj)
				console.log(securityHeaders)
				formsSave.saveForm(url, obj, securityHeaders, function (response) {
					submitedRecordID = response.recordId;
					console.log("submit records responseee");
					
					if (response.status == 204) {
						commonService.Loaderhide();
						alertService.doAlert("This record alreaady submited by other user,please contact adminstratore");
					}
					else 
					{
						deferredForSaveRecord.resolve(response);
						var deferredForSaveRecordPromise = deferredForSaveRecord.promise;
						if(!$scope.videoFieldStatus && $scope.path =="" && $scope.path == undefined)
							var deferredForSaveRecordVideoPromise = deferredForSaveRecord.promise;
					}
				});

				if($scope.videoFieldStatus && $scope.arrayOps.length > 0)
				{
					var videoUrl = config.url + "/api/v1/gridFS/addRecordvideo/";

					var deferredForSaveRecordVideoPromise = promisingMethods.uploadVideo(videoUrl,$scope.path,$scope.arrayOps,obj.generatedId).then(function(result){
							console.log(result)
					});
				}
				

				$q.all([deferredForSaveRecordPromise,deferredForSaveRecordVideoPromise]).then(function(){
						$rootScope.signatureimage = "";
						commonService.Loaderhide();
						var itemObj = {};
						itemObj['FormId'] = commonService.getSelectedFormId();
						itemObj['FormName'] = commonService.getSelectedFormName();
						itemObj['TaskId'] = commonService.getSelectedTaksId();
						
						
						if($scope.isSavedRecord)
						{
								var query = 'DELETE FROM FormData_table WHERE FormId=? and uniqueID=? and TaskId=?';
								$cordovaSQLite.execute(db, query, [obj.formId, $scope.directTaskSelectedRecordUniqueId, obj.taskId]).then(function (res) {
									
									$scope.directTaskSavedRecordsWhileOnline.splice($scope.slectedSavedRecordIndex,1)
									//$state.go("sidemenu.tabs.formTasks.formTaskRecords")
								});
						}
						else
						{		
								if($scope.ditrectTaskFillingFormtype  == 'prepop'){
									console.log(":logginggg prepop")
									$rootScope.driectTaskPrepopRecords.splice($scope.dtSlectedPrepopRecordIndex,1)
								
								}
								
								//$ionicHistory.goBack();
								/*$state.go("sidemenu.tabs.formTasks.formTaskRecords")*/
						}
						//this condition check for finding  submited record is new or prepop record if its prepop record then only will add that into log
						
						if(obj.recordId!=undefined && obj.recordId!=null && obj.recordId!="")
						{

							db.transaction(function(tx) {
						        tx.executeSql("CREATE TABLE IF NOT EXISTS submitedRecordsLog(User text,taskId integer,formId integer,recordId integer)", [], function(tx, res){
					                 tx.executeSql("INSERT INTO submitedRecordsLog (User,taskId ,formId,recordId) VALUES (?,?,?,?)", [user,obj.taskId,obj.formId,obj.recordId], function(tx,res){
							            	commonService.Loaderhide();
											//alertService.doAlert(strings.submitted);
											mapComponentServices.resetSketchingData();
											//$ionicHistory.goBack();
											$scope.directTaskOfflineRecordsList.push($scope.directTaskSelectedRecordId)
											$state.go("sidemenu.tabs.formTasks.formTaskRecords")
						            });

						        });
					        	}, function(err){

						        //errors for all transactions are reported here
						         console.log("--> db query error:isFormALredayDownnLoad"+err.message)
						        //alert("Error: " + err.message)

					    	});
					    }
					    else
					    {
					    	commonService.Loaderhide();
					    	$ionicHistory.goBack();
					    }
					    /*
			    		By:Ls
			    		Date: 25-04-2018
			    		Description: Confirmation for email send.
			    		*/
						//alertService.doAlert(strings.submitted);
						mapComponentServices.resetSketchingData();

						// commented by abhilash
						// $ionicPopup.show({
						// 	subTitle : 'Send Email?',
						//    	template : '<p>Do you want to send email?</p>',
						//    	buttons : [{
						//     	text : "No",
						//     	onTap : function() {
						// 			//cordova.plugins.diagnostic.switchToLocationSettings();
						// 			return;
						//     	}
						//    	}, {
						//     	text : 'Yes',
						//     	onTap : function() {
						//     		var recordId = {'recordId' : submitedRecordID};
						//     		$scope.email(recordId);
						// 		}
						//     }]
						// });

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
//	}
		
	},

	/**
     * @description submit the record
     * @developer Venkatesh bendi
     * @Date:14/Feb/2018
    */
	$scope.TaskFormsHistory = function(){
		$scope.dThistoryRecords = []
		$rootScope.isHistoryShowingAtDirectTask =true;
		$rootScope.isReassignShowingAtDirectTask = false;
		$rootScope.prepopshowAtDirectTask = false;
		$scope.HistoryPopover.hide();
		commonService.getSelectedFormId();
		var taskId = commonService.getSelectedTaksId();
		var formId = commonService.getSelectedFormId();
		var userId = $localstorage.getObject("username");
		var url = config.url + "/api/v1/tasks/getHistroy/" + formId + "/" + taskId +"/"+userId;
		console.log(url)

		reassign.getPrepopulatedData(url, securityHeaders, function (response) {
			console.log(response)
			angular.forEach(response.data,function(record,index){
					$scope.dThistoryRecords.push(record)
					console.log($scope.dThistoryRecords[0])
			})
	
		});

	},

	/**
     * @description dispaly reassign record comments,always show last one of comment 
     * @developer Venkatesh bendi
     * @Date:15/Feb/2018
    */
	$scope.showReassignRecordInfo = function (item) {

		var commentsInfo = JSON.parse(item.comments);

	
        var date = $filter('date')( commentsInfo[commentsInfo.length-1].UpdatedTime, "MM-dd-yyyy");
		
		var alertPopup = $ionicPopup.alert({
				template : "<div><b>Comment</b> : " + commentsInfo[commentsInfo.length-1].Comment + "</br>"+
				"<hr><b>Reassiged Date</b> : " + date + "</br>",
				buttons : [{
						text : 'ok',
						type : 'button-positive'
					},
				]
			});
		alertPopup.then(function (res) {
			$ionicListDelegate.closeOptionButtons();
		});
	},


	$scope.gotoOpenSavedRecord = function(recordObjcet,type,index)
	{	
		if(recordObjcet.isVideoAvailable)
		{	
			if(recordObjcet.videoPath != undefined)
			{
				$scope.options = recordObjcet.videoOptions;
				$scope.targetPath = recordObjcet.videoPath;
				$scope.config = 
				{
					/*sources: [{
							src: $sce.trustAsResourceUrl($scope.targetPath),
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
				$scope.targetPath =""
			}
				

		}
		else
		{
			$scope.targetPath =""
		}

		$scope.dependentFields = $localstorage.getObject("setDependentfields");
		//$scope.dependentFields = commonService.getDepnddentfieldsOfFormOfTask();

		if(recordObjcet.record.sketching != undefined)
			$rootScope.sketchingData = recordObjcet.record.sketching;

		$scope.fields = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
		$scope.selectedFormRecordFields = recordObjcet.record;
		$scope.isEmptyForm = false;
		$scope.isSavedRecord = true;

		$scope.directTaskSelectedRecordId = recordObjcet.recordId;

		$scope.directTaskSelectedRecordUniqueId = recordObjcet.uniqueID;

		
		//commonService.setSelectedDirectTaskFormRecordId(item._id)

		$scope.slectedSavedRecordIndex =index;

		alertService.showToast($scope.formLoderMsg);
		$state.go("sidemenu.tabs.formTasks.assignedFormTasksformView");
	},

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

		$cordovaSQLite.execute(db, formszTableCreationQuery).then(function (res) {}, function (err) {
				alert(JSON.stringify(err));
		});
		// object preparation for record 
		var obj = {};
		var arr =[];
		arr.push($scope.selectedFormRecordFields)
		obj.record = arr;
		obj.formId = commonService.getSelectedFormId();
		obj.taskId = commonService.getSelectedTaksId()
		var index;
		
				
		

		var userId = $localstorage.getObject("username");
		obj.version = commonService.getSelectedFormSkeltonVersionFromProjectTask();

		var datenow = new Date();
		var isoDate = datenow.toISOString();
		obj.updatedTime = isoDate;
		obj.updatedBy = $localstorage.getObject("username");
		var values = JSON.stringify(obj);
			
		//if record is alreday in offline or prepop record then isempty is false
		if(!$scope.isEmptyForm)
		{	
			if(!$scope.isSavedRecord )
			{	
				//either prepo or reassign 
				if($scope.ditrectTaskFillingFormtype  == 'prepop')
				{	
					if ($scope.videoFieldStatus) {
						if ($scope.targetPath != undefined || $scope.targetPath != null || $scope.targetPath != "") {
							options = JSON.stringify($scope.arrayOps);
							videoPath = $scope.targetPath
						} else {
							options = null;
							videoPath = null;
						}
					}else{
						options = null;
						videoPath = null;
					}
					var recordId = commonService.getSelectedDirectTaskFormRecordId()
					query = 'INSERT OR REPLACE INTO FormData_table (FormId,userId, FormValues,FormStatus,TaskId,recordId,isRequired,insertDate,IsReassign,lat,long,version,isVideoAvailable,videoOptions,videoPath,recordType) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
					$cordovaSQLite.execute(db, query, [obj.formId, userId, values, "saved", obj.taskId,recordId, isValid,new Date().setHours(0, 0, 0, 0),$scope.isSelectedRecordIsReassign,lati,longi,commonService.getSelectedFormSkeltonVersionFromProjectTask(),$scope.videoFieldStatus,options,videoPath,"task"]).then(function (res) {

						alertService.doAlert(strings.formSaved);

						mapComponentServices.resetSketchingData();

						
						var obj ={}
						
						obj['record'] = $scope.selectedFormRecordFields;
						
						obj['recordId'] = recordId

						obj['uniqueID'] = res.insertId;
						
						obj.isVideoAvailable = $scope.videoFieldStatus;
						
						obj.videoOptions = JSON.stringify($scope.arrayOps);
					//	obj.videoOptions = JSON.stringify($scope.options);
						
						obj.videoPath = $scope.targetPath;

						$scope.directTaskSavedRecordsWhileOnline.push(obj);

						try
						{
							
								index = $scope.directTaskOfflineRecordsList.indexOf(recordId);
								if(index == -1)
								{
									$scope.directTaskOfflineRecordsList.push(recordId);
								}

						}
						catch(err)
						{
							console.log(err);
						}

						commonService.Loaderhide();
						$scope.targetPath ="";
						$ionicHistory.goBack();
					
					}, function (e) {
						console.log("--> db query error:isFormALredayDownnLoad"+err.message)
						//alert("error " + JSON.stringify(e));
					});
				}
				
			}
			else
			{	
				//IF RECORD ALREADY SAVED
				if ($scope.videoFieldStatus) 
				{
					if ($scope.targetPath != undefined || $scope.targetPath != null || $scope.targetPath != "") {
						options = JSON.stringify($scope.arrayOps);
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
				console.log("updateeeeee");
				console.log(values)
				console.log(options)
				var query = "UPDATE FormData_table SET FormValues=? ,isRequired=?, lat=?,long=?,videoOptions=? where uniqueID=? ";
				$cordovaSQLite.execute(db, query, [values, isValid, lati,longi,options,$scope.directTaskSelectedRecordUniqueId ]).then(function (res) {
					alertService.doAlert(strings.formupdated);

					mapComponentServices.resetSketchingData();
					var recordId = commonService.getSelectedDirectTaskFormRecordId()
					/*var obj ={}
					
					obj['record'] = $scope.selectedFormRecordFields;
					
					obj['recordId'] = recordId

					obj['uniqueID'] = res.insertId;*/

					obj['isVideoAvailable'] = $scope.videoFieldStatus;
					
					obj['videoOptions'] = JSON.stringify($scope.arrayOps);
					
					obj['videoPath'] = videoPath;

					commonService.Loaderhide();
					$scope.targetPath ="";
					$ionicHistory.goBack();
				}, function (err) {
					console.log("--> db query error:isFormALredayDownnLoad"+err.message)
					
				});	
			}
			
		}
		else
		{	
			//if insert new record this will execute
			//IF RECORD ALREADY SAVED
			if ($scope.videoFieldStatus) 
			{
				if ($scope.targetPath != undefined || $scope.targetPath != null || $scope.targetPath != "") {
					options = JSON.stringify($scope.arrayOps);
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
			query = 'INSERT OR REPLACE INTO FormData_table (FormId,userId, FormValues,FormStatus,TaskId,recordId,isRequired,insertDate,IsReassign,lat,long,version,isVideoAvailable,videoOptions,videoPath,recordType) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
   			$cordovaSQLite.execute(db, query, [obj.formId, userId, values, "saved", obj.taskId, undefined, isValid, new Date().setHours(0, 0, 0, 0),"false",lati,longi,commonService.getSelectedFormSkeltonVersionFromProjectTask(),$scope.videoFieldStatus,options,videoPath,"task"]).then(function (res) {
				
				alertService.doAlert(strings.formSaved);

				mapComponentServices.resetSketchingData();

				var obj ={}
				
				obj['record'] = $scope.selectedFormRecordFields;

				obj['recordId'] = undefined

				obj['uniqueID'] = res.insertId;

				obj.isVideoAvailable = $scope.videoFieldStatus;
				
				obj.videoOptions = JSON.stringify($scope.arrayOps);
				
				obj.videoPath = $scope.targetPath;

				$scope.directTaskSavedRecordsWhileOnline.push(obj);
				commonService.Loaderhide();
				$scope.targetPath ="";
				$ionicHistory.goBack();
			
			}, function (err) {
				 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
			});
			
		}
	
		
	}
		


	$scope.downloadProjectTaskold = function(item,index)
	{		
			console.log("downloadProjectTaskdownloadProjectTaskdownloadProjectTask")
			console.log(item.taskId);

			var url = config.url + "/api/v1/tasks/downloadDirectTask/" + item.taskId;
			console.log(securityHeaders)
			reassign.downloadProjectTask(url, securityHeaders, function (taskResponse) {
					
					console.log("tassk downloadedddd")
					console.log(taskResponse);

					$scope.saveTaskInOffline(JSON.parse(taskResponse.taskInfo),function(status)
					{

						/*if(status == 1){*/
							var formsCount =0;
							
							for(var iii = 0; iii < taskResponse.taskFormsList.length; iii++)
		                    {
	                        	var url = config.url + "/api/v1/tasks/downloadService/" + item.taskId + "/" + taskResponse.taskFormsList[iii].formId + "/" + user;

								reassign.downloadProjectTask(url, securityHeaders, function (response) 
								{
									//$scope.saveTaskInOffline(JSON.parse(response.taskInfo),function(){
										$scope.checkAndSaveFormInOffline(JSON.parse(response.formInfo),item.taskId,function()
										{
											var formId = JSON.parse(response.formInfo)._id;
											
												
												if(response.prepopRecords.length>0)
												{
													$scope.savePrepopRecordsOfForm(item.taskId,formId,user,response.prepopRecords,function()
													{	
														console.log("after save records")
														/*$scope.directTaskForms[index].status = true;
														$ionicListDelegate.closeOptionButtons();
														alertService.doAlert("Downloaded successfully");*/
														if(response.reassingRecords.length>0)
														{
															$scope.saveReassignRecordsOfForm(item.taskId,formId,user,response.reassingRecords,function()
															{	
																console.log("after save records")
																$ionicListDelegate.closeOptionButtons();
																alertService.doAlert("Downloaded successfully");
															
															})
														}
														else
														{
															$ionicListDelegate.closeOptionButtons();
															alertService.doAlert("Downloaded successfully");
														}

													
													})
												}
												else if(response.reassingRecords.length>0)
												{
													$scope.saveReassignRecordsOfForm(taskId,FormId,user,response.prepopRecords,function()
													{	
														console.log("after save records")
														//$scope.directTaskForms[index].status = true;
														$ionicListDelegate.closeOptionButtons();
														alertService.doAlert("Downloaded successfully");
													
													})
												}
												else
												{
														//$scope.directTaskForms[index].status = true;
														//$ionicListDelegate.closeOptionButtons();
														alertService.doAlert("Downloaded successfully");
												}



											/*}*/
											
										});
									//})
									
							
								});
		                    }

						
							console.log(index);
							console.log("indexxxxx")
							
							//$scope.formTasks[index].isDownloaded = true;
							$scope.$apply();
							$ionicListDelegate.closeOptionButtons();
							alertService.doAlert("Downloaded Successfully");
						/*}
						else
								alertService.doAlert("Task already downloaded")*/	
					})
					
				
			});	
	},

	$scope.downloadProjectTask = function(item,index)
	{		
			console.log("downloadProjectTaskdownloadProjectTaskdownloadProjectTask")
			console.log(item.taskId);

			var url = config.url + "/api/v1/tasks/downloadDirectTask/" + item.taskId;
			console.log(securityHeaders)
			reassign.downloadProjectTask(url, securityHeaders, function (taskResponse) {
					
					console.log("tassk downloadedddd")
					console.log(taskResponse);

					$scope.saveTaskInOffline(JSON.parse(taskResponse.taskInfo),function(status)
					{

						/*if(status == 1){*/
							var formsCount =0;
														
														
							var loopPromises = [];						
							for(var iii = 0; iii < taskResponse.taskFormsList.length; iii++)
		                    {	
		                    	var deferred = $q.defer();
	                        	var url = config.url + "/api/v1/tasks/downloadService/" + item.taskId + "/" + taskResponse.taskFormsList[iii].formId + "/" + user;

								reassign.downloadProjectTask(url, securityHeaders, function (response) 
								{
									//$scope.saveTaskInOffline(JSON.parse(response.taskInfo),function(){
										$scope.checkAndSaveFormInOffline(JSON.parse(response.formInfo),item.taskId,function(formRes)
										{
											var formId = JSON.parse(response.formInfo)._id;
											if(!formRes){
												$scope.insertDownloadedFormInfo(formId, item.taskId, function(){
													console.log("form downloaded info all")
												});
											}
												
												if(response.prepopRecords.length>0)
												{
													$scope.savePrepopRecordsOfForm(item.taskId,formId,user,response.prepopRecords,function()
													{	
														console.log("after save records")
														/*$scope.directTaskForms[index].status = true;
														$ionicListDelegate.closeOptionButtons();
														alertService.doAlert("Downloaded successfully");*/
														if(response.reassingRecords.length>0)
														{
															$scope.saveReassignRecordsOfForm(item.taskId,formId,user,response.reassingRecords,function()
															{	
																console.log("after save records")
																$ionicListDelegate.closeOptionButtons();
																loopPromises.push(deferred.promise);
																//alertService.doAlert("Downloaded successfully");
															
															})
														}
														else
														{
															$ionicListDelegate.closeOptionButtons();
															loopPromises.push(deferred.promise);
															//alertService.doAlert("Downloaded successfully");
														}

													
													})
												}
												else if(response.reassingRecords.length>0)
												{
													$scope.saveReassignRecordsOfForm(item.taskId,formId,user,response.prepopRecords,function()
													{	
														console.log("after save records")
														//$scope.directTaskForms[index].status = true;
														$ionicListDelegate.closeOptionButtons();
														loopPromises.push(deferred.promise);
														//alertService.doAlert("Downloaded successfully");
													
													})
												}
												else
												{
														//$scope.directTaskForms[index].status = true;
														//$ionicListDelegate.closeOptionButtons();
														//alertService.doAlert("Downloaded successfully");
														loopPromises.push(deferred.promise);
												}



											/*}*/
											
										});
									//})
									
							
								});
		                    }

						
							console.log(index);
							console.log("indexxxxx")
							
							//$scope.formTasks[index].isDownloaded = true;
							$scope.$apply();
							$ionicListDelegate.closeOptionButtons();
							alertService.doAlert("Downloaded Successfully");
						/*}
						else
								alertService.doAlert("Task already downloaded")*/	
					})
					
				
			});	
	},

	$scope.saveTaskInOffline = function (taskInfo,callback) {
		console.log(taskInfo)
		console.log("saveTaskInOffline")
		var userId = $localstorage.getObject("username");

		//var taskId = commonService.getSelectedTaksId();
		db.transaction(function(tx) {

	        //create table
	        tx.executeSql("CREATE TABLE IF NOT EXISTS DirectTaskTable(User text,TaskId integer,Details text )", [], function(tx, res){
	            tx.executeSql("SELECT * FROM DirectTaskTable WHERE User=? and TaskId=?", [userId,taskInfo._id], function(tx, res){
                   

                    if(res.rows.length == 0)
                    {
                    	tx.executeSql("INSERT INTO DirectTaskTable (User, TaskId ,Details) VALUES (?,?,?)", [userId,taskInfo._id,JSON.stringify(taskInfo)], function(tx,res){
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


	$scope.checkAndSaveFormInOffline = function (formInfo,taskId,callback) {
		
		console.log("formInfoformInfo")

		/*console.log(typeof formInfo)
		console.log(JSON.stringify(formInfo))*/

		db.transaction(function(tx) {

	        //create table

	        tx.executeSql("CREATE TABLE IF NOT EXISTS FormszTableDirectTask(Username text,FormId integer,FormName text,category text,version text,description text, TaskId integer,Details text, Frequency  text)", [], function(tx, res){
	             tx.executeSql("SELECT * FROM FormszTableDirectTask WHERE Username=? and TaskId=? and FormId=?", [user,taskId,formInfo._id], function(tx, res){
                  
                   
                    if(res.rows.length == 0)
                    {	

		            	//callback(false)

                    	tx.executeSql("INSERT INTO FormszTableDirectTask (Username, FormId,FormName,category,version,description, TaskId ,Details , Frequency) VALUES (?,?,?,?,?,?,?,?,?)", [user, formInfo._id, formInfo.name,formInfo.category,formInfo.version,formInfo.description, taskId,JSON.stringify(formInfo),null], function(tx,res){
		            		
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

	/*$scope.checkAndSaveFormInOffline = function (formInfo,taskId,callback) {
		
		db.transaction(function(tx) {

	        //create table

	        tx.executeSql("CREATE TABLE IF NOT EXISTS FormszTableDirectTask(Username text,FormId integer,FormName text,category text,version text,description text, TaskId integer,Details text, Frequency  text)", [], function(tx, res){
	             tx.executeSql("SELECT * FROM FormszTableDirectTask WHERE Username=? and TaskId=? and FormId=?", [user,taskId,formInfo._id], function(tx, res){
                  
                   
                    if(res.rows.length == 0)
                    {	
                    	tx.executeSql("INSERT INTO FormszTableDirectTask (Username, FormId,FormName, TaskId ,Details , Frequency) VALUES (?,?,?,?,?,?)", [user, formInfo._id, formInfo.name, taskId,JSON.stringify(formInfo),formInfo.formFrequncy], function(tx,res){
		            		
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
*/
	//store preppop records in offline (sqlite db)
	$scope.savePrepopRecordsOfForm = function (taskId,FormId,user,preporecods,callback) {
		
		//var taskId = commonService.getSelectedTaksId();
		db.transaction(function(tx) {

	        //create table
	        tx.executeSql("CREATE TABLE IF NOT EXISTS DitectTaskPrepopRecords(User text,TaskId integer,FormId integer,Records text )", [], function(tx, res){
	           tx.executeSql("INSERT INTO DitectTaskPrepopRecords (User, TaskId ,FormId, Records) VALUES (?,?,?,?)", [user,taskId,FormId,JSON.stringify(preporecods)], function(tx,res){
		            		callback(1)
	            });

	        });
	    

        }, function(err){
        	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
	        //alert("Error: " + err.message)

    	});




	},

	$scope.saveReassignRecordsOfForm = function (taskId,FormId,user,reassingRecords,callback) {
		
		var loopPromises = [];
		


		angular.forEach(reassingRecords,function(value,key)
		{
			console.log("reassingRecords")
			console.log(value)
			
			var deferred = $q.defer();
			loopPromises.push(deferred.promise);
			var obj ={}
			obj.record = value.record;

			db.transaction(function(tx){
	        	//create table
		        tx.executeSql(formszTableCreationQuery, [], function(tx, res){
		           tx.executeSql("INSERT OR REPLACE INTO FormData_table (FormId,userId,FormValues,FormStatus,TaskId,recordId,IsReassign,recordType) VALUES (?,?,?,?,?,?,?,?)", [FormId, user,JSON.stringify(obj), "reassign", taskId,value.recordId,true,"task"], function(tx,res){
			            deferred.resolve();
			            console.log(">moring mantra");
					
		            });

		        });
		    

        	}, function(err){
	        	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
	        	 //deferred.resolve();
		        //alert("Error: " + err.message)

    		});
		})
		


		$q.all(loopPromises).then(function () 
		{
			console.log('foreach loop completed. Do something after it...');
			callback()
	    });	

	   // deferred.resolve();

		

    	
		





	},


	//local action function(which are not intrect with server)
	
	/**
     * @description back to prepop records from histroy view
     * @developer Venkatesh bendi
     * @Date:14/Feb/2018
    */
	$scope.backToPrePoRecords = function()
	{
		$rootScope.isHistoryShowingAtDirectTask =false;
		$rootScope.isReassignShowingAtDirectTask = false;
		$rootScope.prepopshowAtDirectTask = true;
		mapComponentServices.resetSketchingData();
		$scope.stopVoiceRecong = true;
	}

	/**
     * @description back to forms list from records view
     * @developer Venkatesh bendi
     * @Date:14/Feb/2018
    */
	$scope.backToTaskForms = function()
	{	
		$ionicHistory.goBack();
		//$state.go("sidemenu.tabs.ProjectTasks.assignedProjectTasksforms");
	}

	/**
     * @description back to tasks list from forms view 
     * @developer Venkatesh bendi
     * @Date:14/Feb/2018
    */
	$scope.backToTasks = function()
	{	
		$ionicHistory.goBack();
		//$state.go("idemenu.tabs.formTasks.assignedformTasksforms");
	}


	$scope.backToPrepopRecords = function()
	{
		$scope.genId='';
		//$state.go("sidemenu.tabs.ProjectTasks.projectTaskRecords");
		if($scope.sigpopover != undefined && $scope.sigpopover._isShown){
            $rootScope.isSignaturePadEnabled = false;
            $scope.sigpopover.remove();
        }else{
			$ionicHistory.goBack();
			mapComponentServices.resetSketchingData();
			$scope.stopVoiceRecong = true;
        }
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
				/**
			     * @description get two decimal points
			     * @developer lokesh sahu
			     * @Date 14-05-2018
			    */ 
				$scope.selectedFormRecordFields[id] = math.eval($scope.formulaSimplifier).toFixed(2);
			}
			else
			{
				/**
			     * @description get two decimal points
			     * @developer lokesh sahu
			     * @Date 14-05-2018
			    */ 
				$scope.recordInfo[id] = math.eval($scope.formulaSimplifier).toFixed(2);	
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
				var signaturePad = new SignaturePad(canvas, { minWidth: 1, maxWidth: 1.5 });

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
						function resizeCanvas() {
						    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
						    canvas.width = canvas.offsetWidth * ratio;
						    canvas.height = (canvas.offsetHeight * ratio) * 2;
						    canvas.getContext("2d").scale(ratio, ratio);
						    signaturePad.clear(); // otherwise isEmpty() might return incorrect value
						}

						window.addEventListener("resize", resizeCanvas);
						resizeCanvas();
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
	$ionicPopover.fromTemplateUrl('templates/elipseatTaskLevelRecords.html', {
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

 	
 	$scope.deleteRecord = function (item,index) {
			console.log(item)

		$ionicPopup.show({
			subTitle : 'Delete Record?',
		   	template : '<p>Do you really want to delete the record?</p>',
		   	buttons : [{
		    	text : "No",
		    	onTap : function() {
					$ionicListDelegate.closeOptionButtons();
					return;
		    	}
		   	}, {
		    	text : 'Yes',
		    	onTap : function() {
		    		var query = "SELECT * FROM FormData_table WHERE uniqueID=?";
					$cordovaSQLite.execute(db, query, [item.uniqueID]).then(function (res) {
						if (res.rows.length > 0) {
							$cordovaSQLite.execute(db, "DELETE FROM FormData_table WHERE uniqueID=?", [item.uniqueID])
							.then(function (res) {
								commonService.Loaderhide();
								alertService.doAlert(strings.recordDelete, function (res) {
									$scope.directTaskSavedRecordsWhileOnline.splice(index,1)
									$ionicListDelegate.closeOptionButtons();
							
								});

							}, function (err) {
								alert(JSON.stringify(err));
							});
						}

					}, function (err) {
						alert(JSON.stringify(err));
					});	
				}
		    }]
		});
		//}
	}

	/*
	Description: Location popup added
	Developer: Lokesh
	Date: 19-04-2018
	*/
	$scope.sumitRecorddirectly = function(item,index)
	{	
		commonService.LoaderShow(strings.submitting);
		
		commonService.getLatLong(function (geoLocation) {
			
			if (geoLocation.netstatus == "error") {
				commonService.Loaderhide();
				$ionicPopup.show({
					subTitle : 'Use location?',
				   	template : '<p>The location service is disabled, do you want to continue.</p>',
				   	buttons : [{
				    	text : "No",
				    	onTap : function() {
							//cordova.plugins.diagnostic.switchToLocationSettings();
							$ionicListDelegate.closeOptionButtons();
							return;
				    	}
				   	}, {
				    	text : 'Yes',
				    	onTap : function() {
				    		commonService.LoaderShow(strings.submitting);
				    		/*
				    		By:Ls
				    		Date: 25-04-2018
				    		Description: Form Submit confirmation added
				    		*/
				    		$timeout(function() {
					    		commonService.Loaderhide();
	                	    	$ionicPopup.show({
									subTitle : 'Submit Form?',
								   	template : '<p>Do you really want to submit the form?</p>',
								   	buttons : [{
								    	text : "No",
								    	onTap : function() {
											//cordova.plugins.diagnostic.switchToLocationSettings();
											$ionicListDelegate.closeOptionButtons();
											return;
								    	}
								   	}, {
								    	text : 'Yes',
								    	onTap : function() {
								    		commonService.LoaderShow(strings.submitting);
								    		$scope.lat = null;
											$scope.long = null;
											$scope.sumitRecordDatadirectly(item,index);
										}
								    }]
								});
							}, 1000);
						}
				    }]
				});
			} 
			else{
				commonService.Loaderhide();
				/*
	    		By:Ls
	    		Date: 25-04-2018
	    		Description: Form Submit confirmation added
	    		*/
				$ionicPopup.show({
					subTitle : 'Submit Form?',
				   	template : '<p>Do you really want to submit the form?</p>',
				   	buttons : [{
				    	text : "No",
				    	onTap : function() {
							//cordova.plugins.diagnostic.switchToLocationSettings();
							$ionicListDelegate.closeOptionButtons();
							return;
				    	}
				   	}, {
				    	text : 'Yes',
				    	onTap : function() {
				    		commonService.LoaderShow(strings.submitting);
				    		$scope.lat = geoLocation.latlong[0];
							$scope.long = geoLocation.latlong[1];
							$scope.sumitRecordDatadirectly(item,index);
						}
				    }]
				});
			}
		});
	}

	/*
	Description: Location popup added
	Developer: Lokesh
	Date: 19-04-2018
	*/
	$scope.sumitRecordDatadirectly = function(item,index)
	{	
		commonService.Loaderhide();
		console.log(item)
		var taskId = commonService.getSelectedTaksId();
		var formId = commonService.getSelectedFormId();
		var userId = $localstorage.getObject("username");
		db.transaction(function(tx) 
        {	
        	var uId =  item.uniqueID;
            tx.executeSql("SELECT * FROM FormData_table WHERE userId=? and TaskId=? and FormId =? and uniqueID=?", [userId,taskId,formId,uId], function(tx, res)
            {
            		/*
		    		By:Lokesh Sahu
		    		Date: 12-06-2018
		    		Description: form validation
		    		*/
            		var formFieldData = commonService.getSelectedFormSkeltonFieldsFromProjectTask();
                   	var savedRecord = JSON.parse(res.rows.item(0).FormValues);
                   	for (var i = 0; i < formFieldData.length;  i++) {
                   		console.log(formFieldData[i].type.view);
                   		if(formFieldData[i].type.view == 'section') {
                   			var sectionData = formFieldData[i].type.fields;
                   			for (var k = 0; k < sectionData.length;  k++) {
                   				if(sectionData[k].type == 'group'){
                   					var groupData = sectionData[k].data.type.fields;
                   					for(var l=0; l < groupData.length;  l++){
                   						var id = groupData[l].id;
                   						console.log(id)
                   						console.log(groupData[l].required)
                   						console.log(savedRecord.record[0][id])
                   						if(groupData[l].required == true && groupData[l].required != undefined && groupData[l].required != "" && groupData[l].required != null)
				                   		{
				                   			if(savedRecord.record[0][id] == '' || savedRecord.record[0][id] == null){
				                   				alertService.doAlert(strings.fillMandetory);
				                   				$ionicListDelegate.closeOptionButtons();
				                   				return;
				                   			}
				                   		}
                   					}
                   				}
                   				else{
                   					var id = sectionData[k].data.id;
                   					if(sectionData[k].data.required == true && sectionData[k].data.required != undefined && sectionData[k].data.required != ""&& sectionData[k].data.required != null)
			                   		{
			                   			if(savedRecord.record[0][id] == '' || savedRecord.record[0][id] == null){
			                   				alertService.doAlert(strings.fillMandetory);
			                   				$ionicListDelegate.closeOptionButtons();
			                   				return;
			                   			}
			                   		}
                   				}
                   			}
	                   	} 
	                   	else if(formFieldData[i].type.view == 'group') {
	                   		var groupData = formFieldData[i].type.fields;
	                   		for (var j = 0; j < groupData.length;  j++) {
	                   			var id = groupData[j].id;
	                   			if(groupData[j].required == true && groupData[j].required != undefined && groupData[j].required != "" && groupData[j].required != null)
		                   		{
		                   			if(savedRecord.record[0][id] == '' || savedRecord.record[0][id] == null){
		                   				alertService.doAlert(strings.fillMandetory);
		                   				$ionicListDelegate.closeOptionButtons();
		                   				return;
		                   			}
		                   		}
	                   		}
	                   	}
	                   	else{
	                   		var id = formFieldData[i].id;
	                   		if(formFieldData[i].required == true && formFieldData[i].required != undefined && formFieldData[i].required != ""&& formFieldData[i].required != null)
	                   		{
	                   			if(savedRecord.record[0][id] == '' || savedRecord.record[0][id] == null){
	                   				alertService.doAlert(strings.fillMandetory);
	                   				$ionicListDelegate.closeOptionButtons();
	                   				return;
	                   			}
	                   		}
	                   	} 
                   	}
                   		
			        var len = res.rows.length;
					for (var i = 0; i < len; i++) 
					{
						var obj = {};
						console.log("get dattttttttttttttttteeeeeeee")
						console.log(res.rows.item(i));
						var savedRecord = JSON.parse(res.rows.item(i).FormValues);
						obj.record =  savedRecord.record[0];
				//		console.log(savedRecord.record[0].RUID)
				//		console.log(typeof savedRecord.record[0]);
						var isVideoAvailable=res.rows.item(i).isVideoAvailable;
						var videoOptions=res.rows.item(i).videoOptions;
						obj.recordId = item.recordId;
						obj.updatedTime = new Date();
						obj.taskId = taskId;
						obj.formId = res.rows.item(i).FormId;
						obj.lat = res.rows.item(i).lat
						obj.long = res.rows.item(i).long
						obj.updatedBy = res.rows.item(i).userId
						obj.version = commonService.getSelectedFormSkeltonVersionFromProjectTask();
						console.log(res.rows.item(i).isVideoAvailable)
						console.log(res.rows.item(i).videoOptions)
						var url = config.url + "/api/v1/tasks/addTaskRecord";
						var recordId = obj.record['RUID'];
						obj.lat = $scope.lat;
						obj.long = $scope.long;
						obj.generatedId=Date.now();
						delete obj.record['RUID']
						formsSave.saveForm(url, obj, securityHeaders, function (response) 
						{
							console.log(isVideoAvailable)
							console.log(response)
							console.log(JSON.parse(videoOptions))
							commonService.Loaderhide();
							if(response.status==200){
								if((isVideoAvailable=="true") && (JSON.parse(videoOptions).length > 0))
								{
									var videoUrl = config.url + "/api/v1/gridFS/addRecordvideo/";
									promisingMethods.uploadVideo(videoUrl,$scope.path,JSON.parse(videoOptions),obj.generatedId).then(function(result){
											console.log(result)
											var query = 'DELETE FROM FormData_table WHERE FormId=? and uniqueID=? and TaskId=?';
											$cordovaSQLite.execute(db, query, [obj.formId, uId, obj.taskId]).then(function (res) {
												$ionicListDelegate.closeOptionButtons();
												//alertService.doAlert(strings.submitted);
												$scope.directTaskSavedRecordsWhileOnline.splice(index,1)
												saveSubmittedRecordId(obj.recordId,obj.formId,obj.taskId)
												sendEmailConfirmation(response.recordId)
											});
									});
								}
								else{
									var query = 'DELETE FROM FormData_table WHERE FormId=? and uniqueID=? and TaskId=?';
									$cordovaSQLite.execute(db, query, [obj.formId, uId, obj.taskId]).then(function (res) {
										$ionicListDelegate.closeOptionButtons();
										//alertService.doAlert(strings.submitted);
										$scope.directTaskSavedRecordsWhileOnline.splice(index,1)
										saveSubmittedRecordId(obj.recordId,obj.formId,obj.taskId)
										sendEmailConfirmation(response.recordId)
									});
								}

							}
						})
										
					}

						
                    
            })

        }, function(err){
        	 console.log("--> db query error:isFormALredayDownnLoad"+err.message)
        //errors for all transactions are reported here
   	});
	}

	/*
	By:Ls
	Date: 25-04-2018
	Description: send email confirmation
	*/
	function sendEmailConfirmation(recordId){
		
		$ionicPopup.show({
			subTitle : 'Send Email?',
		   	template : '<p>Do you want to send email?</p>',
		   	buttons : [{
		    	text : "No",
		    	onTap : function() {
					//cordova.plugins.diagnostic.switchToLocationSettings();
					return;
		    	}
		   	}, {
		    	text : 'Yes',
		    	onTap : function() {
		    		var recordId = {'recordId' : recordId};
		    		$scope.email(recordId);
				}
		    }]
		});	
	}
	/*
	By:Ls
	Date: 11-06-2018
	Description: save submit record id to restrict those records in offline.
	*/
	function saveSubmittedRecordId(recordId,formId,taskId){
		if(recordId!=undefined && recordId!=null && recordId!="")
		{
			db.transaction(function(tx) {
		        tx.executeSql("CREATE TABLE IF NOT EXISTS submitedRecordsLog(User text,taskId integer,formId integer,recordId integer)", [], function(tx, res){
	                tx.executeSql("INSERT INTO submitedRecordsLog (User,taskId ,formId,recordId) VALUES (?,?,?,?)", [$localstorage.getObject("username"),taskId,formId,recordId], function(tx,res){
			        	var query = 'SELECT * FROM submitedRecordsLog';
		                $cordovaSQLite.execute(db, query).then(function (res) {
		                    console.log('-----  '+res);
		                }, function (err) {
		                    alert(JSON.stringify(err));
		                });
			        });
				});
	        }, function(err){
					console.log("--> db query error:isFormALredayDownnLoad"+err.message)
		    });
	    }
	}

	$scope.emailRecords = function(item,info,FormName){
		commonService.LoaderShow(strings.submitting);
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
	    	commonService.Loaderhide();
	      console.log(response);
	      $scope.emailModal.hide();
	      alertService.showToast(""+response.message+"");
	    }
	    else{
	    	commonService.Loaderhide();
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
	 	$scope.taskListFilterAttribute = '';
	 	$scope.taskRecordFilterAttribute = val;
		if (val == "saved") {
			$rootScope.prepopshowAtDirectTask = false;
			$rootScope.showSavedAtDirectTask = true;
			//$rootScope.directTaskFormname = false;
		}
		if (val == "new") {
			$rootScope.prepopshowAtDirectTask = true;
			$rootScope.showSavedAtDirectTask = false;
			//$rootScope.directTaskFormname = false;
		}
		if (val == "reassign") {
			$rootScope.prepopshowAtDirectTask = false;
			$rootScope.showSavedAtDirectTask = false;
			//$rootScope.directTaskFormname = true;
		}
	}

	$scope.clearTaskFormFilter = function(){
		$rootScope.prepopshowAtDirectTask = true;
		$rootScope.showSavedAtDirectTask = true;
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















