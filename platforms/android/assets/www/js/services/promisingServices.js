angular.module('starter.factories',[])
.factory('promisingMethods', [ '$localstorage','formsSave','commonService','alertService','config','$state','$q','strings','$cordovaFileTransfer',function($localstorage,formsSave,commonService,alertService,config,$state,$q,strings,$cordovaFileTransfer) {
	return{
		updatePrepopRecord:function(data,securityHeaders){
			var deferred = $q.defer();

			var rarId = $localstorage.getObject("reassignedRecordId");
				var url = config.url + "api/v1/formszDetails/" + rarId;
				data.IsReassign = false;
				formsSave.saveReassignedForm(url, data, securityHeaders, function (response) {
					deferred.resolve(response); 
					if (response.status == 204) {
						commonService.Loaderhide();
						alertService.doAlert(response.message);
					} else {
					}
				});
				return deferred.promise; 
		},
		uploadVideo:function(url,path,arrayOptions,id){
			var deferred = $q.defer();
			console.log(url)
			var videoUrl=url+id
			console.log(videoUrl)
			console.log(arrayOptions)
		angular.forEach(arrayOptions, function (value, key) {
		$cordovaFileTransfer.upload(videoUrl,value.path,value.options).then(function(result) {
            console.log("SUCCESS: " + JSON.stringify(result.response));
            deferred.resolve(result); 
        }, function(err) {
        //	 deferred.reject(err); 
         deferred.resolve(err); 
        	alertService.showToast("Please enable Permissions for storage in settings");
            console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
        	console.log("................")
        });
		});
  			return deferred.promise;
		},
		createRecord:function(url,obj,securityHeaders){
			var deferred = $q.defer();
			formsSave.saveForm(url, obj, securityHeaders, function (response) {
				deferred.resolve(response); 
				if (response.status == 203) {
					commonService.Loaderhide();
					alertService.doAlert(strings.invalidresponse);
				} else {
				}
			});
			return deferred.promise;
		}

	}
}])
