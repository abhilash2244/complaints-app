angular.module('starter.services')
.service('commonService', function (alertService, $localstorage, $cordovaGeolocation,$ionicLoading) {
	var slectedformId;
	var currentSelectedFeature;
	var isSketchingEnabled;
	var sketchingOfCurrentEditable = [];
	var isSketchingInEditMode;
	var isFromGOTOField;
	var dataToHighlightFeatureFromGOTOField;
	var formskeltonFields;
	var projectFromRecords;
	var setSelectedTaksId;
	var setSelectedFormId;
	var selectedProjectId;
	var selectedRecordUID;
	var selectedTakstype;
	var selecedFormId;
	var selectedFormName;
	var selecedTaskId;
	var sketchingNameInEditMode;
	var workInstructionProjectTaskForm;
	var referensesProjectTaskForm;
	var notificationTaskId;
	var notificationTaskRecordId;
	var selectedDirectTaskName;
	var selectedDirectTaskAssignedForms;
	var selectedDirectTaskFormDisplayValues;
	var selectedDirectTaskFormPrepopRecords;
	var slecetDirectTaskFormName;
	var selectedDirectTaskFormRecordId;
	var notificationDirectTaskId;
	var notificationDirectTaskRecordId;
	var formSkeltonVersionProjectTaskForm;
	var selectedDependentfield;
	var selectedDependentfieldOfTask;
	var datafields = [];
	var selectedFormFrequency;
	return {
		securityHeaders:function(){
		return{
			"Content-Type" : "application/json",
			"X-Access-Token" : $localstorage.getObject("token"),
			"X-Key" : $localstorage.getObject("username")
		}
		},

		LoaderShow :function (text) {
			$ionicLoading.show({
			       content: '<div class="custom-spinner-container">'+
                        +'<div class="custom-spinner-box"></div>'+
                  +'</div>'
    		       //noBackdrop: true
		    });
/*			$ionicLoading.show({
				template : text
			});
*/		},
		Loaderhide : function () {
			$ionicLoading.hide();
		},
		updateNetworkStatus : function (network) {
			networkstatus = network;
		},

		setDirectTaskNotifications: function(directTaskId)
		{
			notificationDirectTaskId = directTaskId;
		},
		getDirectTaskNotifications: function()
		{
			return notificationDirectTaskId;
		},
		setProjectTaskNotifications : function(taskId){
			notificationTaskId = taskId;
		},

		getProjectTaskNotifications : function(){
			return notificationTaskId;
		},
		setProjectTaskRecordNotifications: function(taskRecordId)
		{
			notificationTaskRecordId = taskRecordId;	
		},

		setDirectTaskRecordNotifications:function(directTaskRecordId)
		{
			notificationDirectTaskRecordId = directTaskRecordId;
		},

		getDirectTaskRecordNotifications:function()
		{
			return notificationDirectTaskRecordId;
		},
		
		getProjectTaskRecordNotifications: function()
		{
			return notificationTaskRecordId ;	
		},

		checkloginConnection : function () {
		 var online = navigator.onLine;
		   if(online===true){
		    settingsNetworkStatus=true;
		   }
		   if(online===false){
		    settingsNetworkStatus=false;
		   }
		   return settingsNetworkStatus;
		},
		checkSettingsConnection : function () {
		 return settingsNetworkStatus;
		},
		checkConnection : function () {
			
		   return networkstatus;
		},
		responseValidation:function(response){
			if(response.status==202){
				return response.message;
			}if(response.status==204){
				return response.message;
			}
		},
		setSelectedForm:function(formdId)
		{
			slectedformId = formdId;
		},
		getSelectedForm:function()
		{
			return slectedformId;
		},
		setCurrentSelectedFeature : function(currentFeature){
			console.log(currentFeature);
			currentSelectedFeature = currentFeature;
		},
		getCurrentSelectedFeature : function(){
			console.log(currentSelectedFeature)
			return currentSelectedFeature;
		},
		setSketchingNameInEditMode : function(name){
			sketchingNameInEditMode = name;
		},
		getSketchingNameInEditMode : function(){
			return sketchingNameInEditMode;
		},

		setSketchingNameInEditMode : function(name){
			sketchingNameInEditMode = name;
		},
		getSketchingNameInEditMode : function(){
			return sketchingNameInEditMode;
		},

		setSketchingStatus : function(data){
			isSketchingEnabled = data;
		},
		getSketchingStatus : function(){
			return isSketchingEnabled;
		},
		setSketchingInEditMode : function(data){
			isSketchingInEditMode = data;
		},
		getSketchingInEditMode : function(){
			return isSketchingInEditMode;
		},
		setSketchingOfCurrentEditable :function(data){
			sketchingOfCurrentEditable = data
		},
		getSketchingOfCurrentEditable :function(){
			return sketchingOfCurrentEditable;
		},
		setStatusFromGOTOField : function(data){
			isFromGOTOField = data;
		},
		getStatusFromGOTOField : function(){
			return isFromGOTOField;
		},
		setDataToHighlightFeatureFromGOTOField : function(data){
			dataToHighlightFeatureFromGOTOField = data;
		},
		getDataToHighlightFeatureFromGOTOField : function(){
			return dataToHighlightFeatureFromGOTOField;
		},
		getLatLong : function (callback) {
			var posOptions = {
				timeout : 10000,
				enableHighAccuracy : true,
				maximumAge: 0
			};
			$cordovaGeolocation
			.getCurrentPosition(posOptions)
			.then(function (position) {
				var successResponse = {};
				var arr = [];
				arr.push(position.coords.latitude);
				arr.push(position.coords.longitude);
				successResponse.netstatus = "success";
				successResponse["latlong"] = arr;
			
				callback(successResponse);
			}, function (err) {
				console.log(err);
				var errorResponse = {};
				errorResponse.netstatus = "error";
				errorResponse.message = "Please enable location service in your device";
				if (window.cordova) {
			/*	cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {                                               
		            if(enabled==false){
				        cordova.plugins.diagnostic.switchToLocationSettings();	
					    }else{
				        
				        }   
				    }, function(error) {
				        alert("The following error occurred: " + error);
				    });*/
				}				
				callback(errorResponse);
			});
	
		},
		setSelectedFormSkeltonFieldsFromProjectTask :  function(skeltonFields){
			formskeltonFields = skeltonFields;
		},
		getSelectedFormSkeltonFieldsFromProjectTask :  function(){
			 return formskeltonFields;
		},

		setSelectedFormWorkInstructionFromProjectTask :  function(data){
			workInstructionProjectTaskForm = data;
		},
		getSelectedFormWorkInstructionFromProjectTask :  function(){
			 return workInstructionProjectTaskForm;
		},

		setSelectedFormSkeltonVersionFromProjectTask :  function(data){
			formSkeltonVersionProjectTaskForm = data;
		},
		getSelectedFormSkeltonVersionFromProjectTask :  function(){
			 return formSkeltonVersionProjectTaskForm;
		},

		setSelectedFormReferensesFromProjectTask :  function(data){
			referensesProjectTaskForm = data;
		},
		getSelectedFormReferensesFromProjectTask :  function(){
			 return referensesProjectTaskForm;
		},

		setSelectedFormRecordsFromProjectTask : function(formRecords){
			projectFromRecords = formRecords;
		},
		getSelectedFormRecordsFromProjectTask : function(){
			return projectFromRecords;
		},
		setSelectedTaksId : function(taskId)
		{
			selecedTaskId = taskId;
		},
		getSelectedTaksId : function()
		{
			return selecedTaskId;
		},
		setSelectedFormId : function(formId)
		{
			selecedFormId = formId;
		},
		getSelectedFormId : function()
		{
			return selecedFormId;
		},
		setSelectedFormName :  function(formName){
			selectedFormName = formName;
		},
		getSelectedFormName :  function(){
			return selectedFormName ;
		},
		setSelectedProjectId : function(projectId){
			selectedProjectId = projectId;
		},
	    getSelectedProjectId : function(){
			return selectedProjectId;
		},
		setRecordUID : function(RUID){
			selectedRecordUID = RUID;
		},
		getRecordUID : function(){
			return selectedRecordUID
		},
		setSelectedTakstype: function(taskType){
			selectedTakstype = taskType
		},
		
		getSelectedTakstype: function(taskType){
			return selectedTakstype;
		},
		
		setSelectedDirectTaskName: function(selectedDirectTaskNaame){

			selectedDirectTaskName = selectedDirectTaskNaame
			console.log("selectedDirectTaskNaame")
			console.log(selectedDirectTaskNaame)
		},
		
		getSelectedDirectTaskName: function(){
			console.log(selectedDirectTaskName)
			return selectedDirectTaskName
		},

		setSelectedDirectTaskAssignedForms: function(DirectTaskAssignedForms){
			console.log("selectedDirectTaskAssignedForms")
			console.log(selectedDirectTaskAssignedForms)
			selectedDirectTaskAssignedForms = DirectTaskAssignedForms;	
		},

		getSelectedDirectTaskAssignedForms: function(){
			return selectedDirectTaskAssignedForms ;	
		},
		setSelectedDirectTaskFormDiplayValues: function(displaayValues){
			selectedDirectTaskFormDisplayValues = displaayValues;
		},

		getSelectedDirectTaskFormDiplayValues: function(){
			return selectedDirectTaskFormDisplayValues;
		},
		setDependentfields:function(datafields)
		{
			selectedDatafields = datafields;
		},
		getDependentfields:function()
		{
			return selectedDatafields;
		},
		setSelectedDirectTaskFormPrepopRecords: function(prepopRecords)
		{
			selectedDirectTaskFormPrepopRecords = prepopRecords;
		},
		
		getSelectedDirectTaskFormPrepopRecords: function()
		{
			return selectedDirectTaskFormPrepopRecords ;
		},
		setSelectedDirectTaskFormName: function(formName)
		{
			slecetDirectTaskFormName = formName;
		},
		getSelectedDirectTaskFormName: function(formName)
		{
			return slecetDirectTaskFormName ;
		},
		setSelectedDirectTaskFormRecordId: function(recordId)
		{
			selectedDirectTaskFormRecordId = recordId;
		},
		getSelectedDirectTaskFormRecordId: function()
		{
			return selectedDirectTaskFormRecordId;
		},
		setDepnddentfieldsOfForm: function(dependentfieldsData){
			selectedDependentfield = dependentfieldsData;
		},
		getDepnddentfieldsOfForm: function(){
			return selectedDependentfield;
		},
		setDepnddentfieldsOfFormOfTask :function(dependentfieldsData)
		{	
			console.log("mobileeeeeeee")
			console.log("setDepnddentfieldsOfFormOfTask")
			selectedDependentfieldOfTask = dependentfieldsData;
		},
		getDepnddentfieldsOfFormOfTask :function()
		{
			return selectedDependentfieldOfTask;
		},
		setSeletedFormFrequency :function(frequency)
		{
			selectedFormFrequency = frequency;
		},
		getSeletedFormFrequency :function()
		{
			console.log('getSeletedFormFrequency '+selectedFormFrequency);
			return selectedFormFrequency;
		},
		setSeletedAssignmntId :function(id)
		{
			formAssignmentId = id;
		},
		getSeletedAssignmntId :function()
		{
			console.log('getSeletedFormFrequency '+formAssignmentId);
			return formAssignmentId;
		}
	}
});
