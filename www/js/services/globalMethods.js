angular.module('starter.services')
.service('commonMethod', function ($http, alertService,commonService,setGetObj,$rootScope,$cordovaSQLite,$localstorage,$state) {
	return {
		OfflineFormsHistory : function (item) {
			console.log("ogffffffliennneeeee meeetodd in serviceee");
			console.log(item);
		//	return "yes";
		setGetObj.setHistoryOfForms(item);
		$rootScope.TaskData = false;
		$rootScope.isHistoryChecked = false;
		$rootScope.isView = false;
		$rootScope.header_delete_hide = true;
		$rootScope.header_sync_hide = true;
		$rootScope.formname=item.FormName;
		var userId = $localstorage.getObject("userId");
		var user = $localstorage.getObject("username");
		$localstorage.setObject("formId",item.id);
	    var tt = this.getOfflineDbData(item);
	    console.log("historyFormObjects");
	    console.log(tt);
		return tt
		},
		getOfflineDbData:function(item){
			console.log("offfline data base hirrtttttt");
			var userId = $localstorage.getObject("userId");
			this.createTableIfNotExists();
			console.log("offline dataaaaaaa");
			console.log(this.getRecords(item));
		},
		createTableIfNotExists : function(){
			$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS FormData_table(uniqueID integer primary key autoincrement,FormId integer,userId integer ,FormValues text,FormStatus text,TaskId text)").then(function (res) {
				console.log("success");
			}, function (err) {
				alert(JSON.stringify(err));
			});
		},

		getRecords:function(item){
			var userId = $localstorage.getObject("userId");
			var query = 'SELECT * FROM FormData_table WHERE FormId=? and userId=? and FormStatus="false" and TaskId="form";';
			$cordovaSQLite.execute(db, query, [item.id, userId]).then(function (res) {
				var len = res.rows.length;
				var historyFormObjects = [];
				for (var i = 0; i < len; i++) {
					var obj = {};
					obj.FormId = res.rows.item(i).FormId;
					obj.userId = res.rows.item(i).userId;
					obj._id = res.rows.item(i).uniqueID;
					obj.records = res.rows.item(i).FormValues;
					obj.formName=item.FormName;
					historyFormObjects.push(obj);
					console.log(obj);
				}
				var offlineRecords = this.getOfflineDbFormsRecords(historyFormObjects);
				return offlineRecords;
		
			}, function (err) {
				alert(JSON.stringify(err));
			});

		},

		getOfflineDbFormsRecords:function(historyFormObjects){
			var items = [];
			try {
				console.log("tryyy");
				for (var x = 0; x < historyFormObjects.records.length; x++) {
					items.push({
						recordId : x + 1,
						FormValues : historyFormObjects.records[x]
					});
				}
			} catch (err) {
				console.log("catch");
				for (var x = 0; x < historyFormObjects.length; x++) {
					$localstorage.setObject("offlineFormId", historyFormObjects[x].FormId);
					items.push({
						recordId :historyFormObjects[x]._id,
						FormId : historyFormObjects[x].FormId,
						FormValues : historyFormObjects[x].records
					});
				}

			}
			
			return items;
			
		
		}
	}
});
