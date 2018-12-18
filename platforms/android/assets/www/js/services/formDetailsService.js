angular.module('starter.services')
.service('formsService', function ($http, $ionicLoading, commonService,alertService,strings) {
	return {
		navigateToForms : function (url, headers, cb) {
			$http.get(url, headers)
			.success(function (res) {
				cb(true, res);
			})
			.error(function () {
				commonService.Loaderhide();

			});
		},
		getRecords : function (url, headers, cb) {
			$http.get(url, headers)
			.success(function (res, status) {
				cb(res);
			})
			.error(function () {
				cb("error");
				commonService.Loaderhide();

			});
		},
		deleteRecord : function (url, headers, cb) {
			$http.delete (url, headers)
			.success(function (res, status) {
				cb(res);
			})
			.error(function (res) {
				alert("failed" + JSON.stringify(res));
			});
		},
		assignedtask : function (url,headers, cb) {
			$http.get(url,headers)
			.success(function (res, status) {
				cb(res);
			})
			.error(function (err) {
				commonService.Loaderhide();

			});
		},
		reassignedForm : function (url,headers, cb) {
			$http.get(url,headers)
			.success(function (res, status) {
				cb(res);
			})
			.error(function () {
				cb("error");
				alert("service error");
				commonService.Loaderhide();

			});
		},
		getReassignedRecords : function (url,headers, cb) {
			$http.get(url,headers)
			.success(function (res, status) {
				cb(res);
			})
			.error(function () {
				cb("error");
				alert("service error");
				commonService.Loaderhide();

			});
		},
		syncAddresses:function (url, data, headers, cb) {
			$http.post(url, data, headers)
			.success(function (res) {
				cb(res);
			})
			.error(function (err) {
                 alertService.doAlert(strings.invalidresponse);
				commonService.Loaderhide();
			});
		}

	}

});
