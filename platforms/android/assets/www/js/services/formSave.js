angular.module('starter.services')
.service('formsSave', function ($http, alertService,commonService) {
	return {
		saveForm : function (url, data, headers, cb) {
			$http.post(url, data, headers)
			.success(function (res, status) {
				cb(res);
			})
			.error(function (err) {
				console.log(JSON.stringify(err));
				alertService.doAlert("Invalid network");
				commonService.Loaderhide();
			}); 
		},
		saveReassignedForm : function (url, data, headers, cb) {
			$http.put(url, data, headers)
			.success(function (res, status) {
				cb(res);
			})
			.error(function (err) {
				alertService.doAlert("Invalid network");
				commonService.Loaderhide();
			}); 
		},
		savePrepopDataForm:function(url,data,headers,cb){
			$http.put(url, data, headers)
			.success(function (res, status) {
				cb(res);
			})
			.error(function (err) {
				alertService.doAlert("Invalid network");
				commonService.Loaderhide();
			});
		},
		changePassword:function (url,data, headers, cb) {
			$http.post(url,data, headers)
			.success(function (res, status) {
				cb(res);
			})
			.error(function (err) {
				alertService.doAlert("Invalid network");
				console.log(JSON.stringify(err));
				commonService.Loaderhide();
			}); 
		},
		getPrepopData : function (url,headers,cb) {
			$http.get(url,headers)
			.success(function (res, status) {
				cb(res);
			})
			.error(function () {
				alertService.doAlert("Invalid network");
				commonService.Loaderhide();
			}); 
		},
		emailMobileRecords:function (url,data, headers, cb) {
			$http.post(url,data, headers)
			.success(function (res, status) {
				cb(res);
			})
			.error(function (err) {
				alertService.doAlert("Invalid network");
				console.log(JSON.stringify(err));
				commonService.Loaderhide();
			}); 
		},
		insertDownloadedFormInfo : function (url, data, headers, cb) {
			$http.post(url, data, headers)
			.success(function (res, status) {
				cb(res);
			})
			.error(function (err) {
				console.log(JSON.stringify(err));
				alertService.doAlert("Invalid network");
			}); 
		}
	}
});
