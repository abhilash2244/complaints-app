var SyncUtility = {

 	syncTasks: function(successCallback, failureCallback,options){
 		cordova.exec(successCallback, failureCallback, 'SyncUtilityPlugin',
 			'syncTasks', options);
 	},
 	syncForms: function(successCallback, failureCallback,options){
   		cordova.exec(successCallback, failureCallback, 'SyncUtilityPlugin',
   			'syncForms', options);
   	},
  syncProjectForms: function(successCallback, failureCallback,options){
      cordova.exec(successCallback, failureCallback, 'SyncUtilityPlugin',
        'syncProjectForms', options);
    },
  syncRecords: function(successCallback, failureCallback,options){
     		cordova.exec(successCallback, failureCallback, 'SyncUtilityPlugin',
     			'syncRecords', options);
     	},
   syncVideos: function(successCallback, failureCallback,options){
       		cordova.exec(successCallback, failureCallback, 'SyncUtilityPlugin',
       			'syncVideos', options);
       	}


 };

 module.exports = SyncUtility;