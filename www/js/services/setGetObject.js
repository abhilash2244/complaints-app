angular.module('starter.services')
.service('setGetObj', function (alertService) {
	var formsData;
	var taskformsData;
	var historyData;
	var formObject;
	var userData;
	// var FormNamesarray=[];
	return {
		setNotificationItem : function (formData) {
			formsData = formData;
		},
		getNotificationItem : function () {
			return formsData;
		},
		setHisotryForm: function(formData){
	//		console.log("formData");
			formsData = formData;
		},
		setUserData: function(data){
			userData = data;
		},
		getUserData: function(){
			return userData;
		},
		getHisotryForm:function(){
			return formsData;
		},
		
		setHistoryOfForms:function(item){
			historyData=item;
		},

		getHistoryOfForms:function(){
	//		console.log(historyData);
			return historyData;
		},
		setFormObject:function(item){
	//		console.log(item);
			formObject=item;
		},

		getFormObject:function(){
	//		console.log(formObject);
			return formObject;
		},
		setTaskHisotryForm:function(taskFormData){
			taskformsData=taskFormData;
		},
		getTaskHisotryForm:function(){
			return taskformsData;
		},
		licenseValidation:function(response){
			if(response.status==202){
				alertService.doAlert("Your license has expired, please contact your admin");
			}
		},
		/*setFormNamesArray:function(FormNames){
			FormNamesarray=FormNames;
			console.log(FormNamesarray);
		},
		getFormNamesArray:function(){
			console.log(FormNamesarray);
		return FormNamesarray;
		}*/
	}
	});
