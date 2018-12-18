var app = angular.module('starter.services', [])
	app.service('loginService', function ($http, $ionicPopup, alertService,strings,commonService) {
		return {
			userData : function (url, data, callback) {
				$http.post(url, data)
				.success(function (res, status) {
					callback(res);
				})
				.error(function (err) {
					
					commonService.Loaderhide();
					callback(strings.noNetwork);
                });
			},
			getMacAddress : function (callback) {
				window.MacAddress.getMacAddress(
					function(macAddress) {
						callback(macAddress);
					},
					function(fail) {
						alert(fail);
					}
				);
			},
			forgotPassword: function (url, data, callback) {
				$http.post(url, data)
				.success(function (res, status) {
					callback(res);
				})
				.error(function (err) {
					commonService.Loaderhide();
					callback(strings.noNetwork);
                });
			},
			// Checking if Device Info exists
			checkDevice : function (url, headers, cb) {
				$http.get(url, headers)
				.success(function (res, status) {
					cb(res);
				})
				.error(function () {
					alertService.doAlert("something error");
					commonService.Loaderhide();
				});
			},
			// logout service
			logout : function (url, data,headers, cb) {
				$http.post(url, data,headers)
				.success(function (res, status) {
					console.log(res);
					cb(res);
				})
				.error(function (res) {
					console.log(res);
					cb(res);
				});
			},

			checkIsAvailable : function (url, data, headers, cb) {
				$http.put(url, data, headers)
				.success(function (res, status) {
					cb(res);
				})
				.error(function (err) {
					alertService.doAlert("Try again");
					commonService.Loaderhide();
				});
			},
			addNewDevice : function (url, data,headers, cb) {
				$http.post(url, data, headers)
				.success(function (res, status) {
					cb(res);
				})
				.error(function (err) {
					alertService.doAlert("Device not working");
					commonService.Loaderhide();
				});
			},

			addBookmark : function (url, data,headers, cb) {
				$http.post(url, data, headers)
				.success(function (res, status) {
					cb(res);
				})
				.error(function (err) {
					alertService.doAlert("Device not working");
				});
			},

			getBookmarks : function (url, headers, cb) {
				$http.get(url, headers)
				.success(function (res, status) {
					cb(res);
				})
				.error(function (err) {
					alertService.doAlert("Can not do bookmarks in offline");
				});
			},

			deleteBookmark : function (url, headers, cb) {
				$http.get(url, headers)
				.success(function (res, status) {
					cb(res);
				})
				.error(function (err) {
					alertService.doAlert("Device not working");
				});
			},

			editBookmark : function (url, headers, cb) {
				$http.get(url, headers)
				.success(function (res, status) {
					cb(res);
				})
				.error(function (err) {
					alertService.doAlert("Device not working");
				});
			},
			sendDeviceToken : function (url, data,headers, callback) {
				$http.put(url, data,headers)
				.success(function (res, status) {
				 callback(res);
				})
				.error(function (err) {
				
					console.log(JSON.stringify(err));
				 commonService.Loaderhide();
				 callback(strings.noNetwork);
				});
			}
		}
	});
