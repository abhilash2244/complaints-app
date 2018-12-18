angular.module('starter.controllers')

.controller('LoginCtrl', function ($scope, $rootScope, $state, $timeout, ionicMaterialInk, $ionicHistory, $cordovaNetwork, loginService, config, $localstorage, alertService, commonService, $cordovaSQLite, $cordovaDevice, strings,setGetObj,deviceManagement,$ionicPopup,formsSave) {
	securityHeaders.headers = commonService.securityHeaders();
	var filterBarInstance;
	$rootScope.imgeasSet = {};
	$rootScope.sign = {};
	$scope.login = function (user) {
		alert("custum login")
		if (user) {
			if (user.username != "" && user.password != "" && user.username != undefined && user.password != undefined) {
				if (commonService.checkConnection()) {
				    commonService.LoaderShow();
					commonService.getLatLong(function (geoLocation) {
						if (geoLocation.netstatus == "success") {
							$scope.lat = geoLocation.latlong[0];
							$scope.long = geoLocation.latlong[1];
							$scope.validateUser(user);
						    commonService.Loaderhide();
						}
						else if (geoLocation.netstatus == "error") {
   							commonService.Loaderhide();
   							var confirmPopup = $ionicPopup.show({
								subTitle : 'Use location?',
							   	template : '<p>This app wants to enable Location services with high accuracy location mode(GPS) on your device </p><br><span> Use wifi or cellular networks for location</span>',
							   	buttons : [{
							    	text : "DON'T ALLOW",
							    	onTap : function() {
										$scope.lat = "GPS coordinate detection failed";
										$scope.long = "GPS coordinate detection failed";
										$scope.validateUser(user);
							    	}
							   	}, {
							    	text : 'ALLOW',
							    	onTap : function() {
			                	    	cordova.plugins.diagnostic.switchToLocationSettings();
							    	}
							    }]
							});
						}
					});
				} 
				else {
					commonService.Loaderhide();
					alertService.showToast(strings.offlinemode);
				}
			} 
			else {
				commonService.Loaderhide();
				alertService.doAlert(strings.mandetory);
			}
		} 
		else {
			commonService.Loaderhide();
			alertService.doAlert(strings.mandetory);
		}
	},

	$scope.validateUser = function(user){
		console.log('am here')
		loginService.getMacAddress(function(MacAddress){
			var deviceData = $localstorage.getObject("deviceInfo");
			user.manufacturer = deviceData.manufacturer;
			user.model = deviceData.model;
			user.platform = deviceData.platform;
			user.UUID = deviceData.uuid;
			user.version = deviceData.version;
			user.macAddress = MacAddress;
			$scope.status = commonService.checkConnection();
			commonService.LoaderShow(strings.pleasewait);
			var url = config.url + "/login";
		//	var url="http://10.231.1.183:3001/login"

			user.type = 2;
			console.log(url)
			loginService.userData(url, user, function (response) {
				if (response.status == 200) {
					if(response.user[0].type =='2'){
						console.log("enteredd")
						$localstorage.setObject("token", response.token);
						response.user[0].groupid =  response.user[0].groupname[0]._id;
						response.user[0].groupname =  response.user[0].groupname[0].name;
						$localstorage.setObject("userId", response.user[0]._id);
						$localstorage.setObject("username", response.user[0].username);
						$localstorage.setObject("password", response.user[0].password);
						$localstorage.setObject("groupid", response.user[0].groupid);
						$localstorage.setObject("usertype", response.user[0].usertype);
						console.log(response.user[0].zone)
						if(response.user[0].groupname==undefined){
							console.log("if loop")
						}else{
						$localstorage.setObject("groupname", response.user[0].groupname);
						}
						$localstorage.setObject("assignedLayers", response.user[0]);
						$localstorage.setObject("isFirstLogin", response.user[0].isFirstLogin);
//						$scope.registerFCM();
//						$scope.getPenalty();
//						$scope.getCssForm();
						$scope.onOnline(response.user[0]);
					}else{
						commonService.Loaderhide();
						alertService.doAlert(strings.invalidCredentials);
					}
				}else if(response.status == 201){
					commonService.Loaderhide();
					alertService.doAlert(response.message);
				} else if (response == "Please check your network !") {
					commonService.Loaderhide();
					alertService.doAlert(strings.noNetwork + "/" + strings.invalidCredentials);
				} else {
					alertService.doAlert(strings.invalidCredentials);
					commonService.Loaderhide();
				}
			});
		});		
	}

	$scope.onOnline = function (user) {
		if(user.isFirstLogin){
			commonService.Loaderhide();
			$state.transitionTo("app.changePassword");
		}else{
			$localstorage.setObject("loggedIn", true);
				var username = $localstorage.getObject("username");
				var password = $localstorage.getObject("password");
				$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS loginInfo_table (Username text, Password text)");
				var query = "SELECT * FROM loginInfo_table WHERE Username=?";
				$cordovaSQLite.execute(db, query, [user.username]).then(function (res) {
					if (res.rows.length <= 0) {
						var query = "INSERT INTO loginInfo_table (Username, Password) VALUES (?,?)";
						$cordovaSQLite.execute(db, query, [user.username, user.password]).then(function (res) {}, function (err) {
							alert(err);
							//	commonService.Loaderhide();
						});
					}
					commonService.Loaderhide();
					$state.go('sidemenu.tabs.formTasks.assignedFormTasks');
				});
		}
	},
	  $scope.registerFCM=function(){
	securityHeaders.headers = commonService.securityHeaders();
//	  	console.log(securityHeaders);
		var token=$localstorage.getObject("FCMToken");
		var usr=$localstorage.getObject("username");
		console.log(token.length);
		console.log(token);
		//if(token.length===undefined || $scope.username!=usr){
			FCMPlugin.getToken(
			  function(token){
				console.log(token);
				$localstorage.setObject("FCMToken",token);
//				        console.log(ionic.Platform.device().platform);
				        var data={};
				        data.deviceKey = $localstorage.getObject("FCMToken");
						data.deviceType =ionic.Platform.device().platform;
						data.userId = $localstorage.getObject("userId");
						console.log(data);
						var url = config.url + "/api/v1/pushNotifications/add-editDiviceinfo/"+data.userId;
						loginService.sendDeviceToken(url,data,securityHeaders, function (response) {
							console.log(response);
							if (response.status == 200) {
								
							} 
						});
			  },
			  function(err){
//				console.log('error retrieving token: ' + err);
			  }
			);
	//	}
				
	}
	/*
	Description: Saving penalty form in local db
	Developer: Lokesh
	Date: 04-07-2018
	*/
	$scope.getPenalty = function(){
		db.executeSql("CREATE TABLE IF NOT EXISTS penaltyForm(id integer primary key autoincrement,description text,severity text,occurrence text,penalty integer,remarks text,selected text)", [], function(tx, res){
        	$cordovaSQLite.execute(db, "SELECT * FROM penaltyForm").then(function (res) {
	          	if(res.rows.length == 0)
	            {
	            	var url = config.url + "/api/v1/lookup/fetchPenalty";
					securityHeaders.headers = commonService.securityHeaders();
					formsSave.getPrepopData(url,securityHeaders, function (response) {
						console.log(response);
						if (response.status == 200) {
							var insertQuery = "INSERT INTO penaltyForm (description,severity,occurrence,penalty,remarks,selected) VALUES";
				
	                    	for (var i = 0; i < response.data.length; i++) {
								if(i < response.data.length-1)
									insertQuery += "('"+response.data[i].description+"','"+response.data[i].severity+"','"+''+"','"+response.data[i].penalty+"','','"+response.data[i].selected+"'),"
								else if(i == response.data.length-1)
									insertQuery += "('"+response.data[i].description+"','"+response.data[i].severity+"','"+''+"','"+response.data[i].penalty+"','','"+response.data[i].selected+"')"
							}
							$cordovaSQLite.execute(db, insertQuery).then(function (res) {
						        
						    }, function (err) {
						   		console.dir(err);
						    }); 
						} 
					});
	            }
	        });
	    });    
	}
	/*
	Description: Saving CssForm in local db
	Developer: Lokesh
	Date: 04-07-2018
	*/
	$scope.getCssForm = function(){
		db.executeSql("CREATE TABLE IF NOT EXISTS CssForm(id integer primary key autoincrement,functionalLocation text,measurementPointDescription text,selected text)", [], function(tx, res){
        	$cordovaSQLite.execute(db, "SELECT * FROM cssForm").then(function (res) {
	          	if(res.rows.length == 0)
	            {
					var url = config.url + "/api/v1/lookup/fetchCSS";
					config.log(url)
					securityHeaders.headers = commonService.securityHeaders();
					formsSave.getPrepopData(url,securityHeaders, function (response) {
						console.log(response);
						if (response.status == 200) {
								
			            	var insertQuery = "INSERT INTO cssForm (functionalLocation,measurementPointDescription,selected) VALUES";
				
			            	for (var i = 0; i < response.data.length; i++) {
								if(i < response.data.length-1)
									insertQuery += "('"+response.data[i].functionalLocation+"','"+JSON.stringify(response.data[i].measurementPointDescription)+"','false'),"
								else if(i == response.data.length-1)
									insertQuery += "('"+response.data[i].functionalLocation+"','"+JSON.stringify(response.data[i].measurementPointDescription)+"','false')"
							}
							$cordovaSQLite.execute(db, insertQuery).then(function (res) {
						        
						    }, function (err) {
						   		console.dir(err);
						    }); 
				   
						} 
					});
                }
            })
		});
	}
	/**
	 * Module: 1.Check to identify IMEI is available in collection  
	 *         2.capturing the device info using Cordova
	 *		   3.Updating the device info in the collection if Identifier is found
	 * query Parameter : Identifier(IMEI/MAC)
	 * @Developer: Phani kumar Narina
	**/
	$scope.checkIsAvailable = function(user){
		deviceManagement.checkDeviceExists($scope,user)
	}

	/*
@developer :Santhosh Kumar Gunti
TPCL customization
Transition changed from tabs to sidemenu
*/

	$scope.onOffline = function (user) {
		var query = "SELECT Username,Password FROM loginInfo_table WHERE Username=?";
		$cordovaSQLite.execute(db, query, [user.username]).then(function (res) {
			var len = res.rows.length;
			if (len <= 0) {
				alertService.doAlert(strings.loginrequired);
				commonService.Loaderhide();
			} else {
				for (var i = 0; i <= len; i++) {
					alertService.showToast(strings.offlinemode);
					//		$scope.inProgressForms();
        			$state.go('sidemenu.tabs.formTasks.assignedFormTasks');
				}
			}
		}, function (err) {
			alertService.doAlert(strings.loginrequired);
			commonService.Loaderhide();
		});

	},

	$scope.forgotPassword = function () {
		$state.transitionTo("app.forgotpassword");
	};
	$scope.getPassword = function (user) {
		if (user != undefined) {
			var url = config.url + "/forgotpwd";
			loginService.forgotPassword(url, user, function (response, status) {
				if (response.status == 200) {
					alertService.doAlert(response.message);
					user.emailid = '';
				} else {
					alertService.doAlert(strings.InvldUnEm);
					user.emailid = '';
				}
			});

		} else {
			alertService.doAlert(strings.fieldMandetory);
		}
	};
	$scope.backTologin = function () {
		$state.transitionTo("app.login");
	};

	$timeout(function () {
		$scope.$parent.hideHeader();
	}, 0);
	ionicMaterialInk.displayEffect();

	$scope.$on("$ionicView.enter", function () {
		if ($state.current.name === 'app.login') {
			$ionicHistory.clearCache();
			$ionicHistory.clearHistory();
		}
	});

});
