angular.module('starter.controllers')
.controller('settingsCtrl', function ($scope, $rootScope, $state, $ionicPopup, commonService, $localstorage, formsSave, alertService, strings, config, $ionicHistory,deviceManagement, $cordovaNetwork) {
	var toggleCheck;
	var netCheck = commonService.checkConnection();
	var OnlineCheck = $cordovaNetwork.isOnline();
	$scope.user = $localstorage.getObject("username");
	 //console.log($localstorage.getObject("usertype"));
	if (netCheck == true) {
		$scope.pswrdChange = true;
		toggleCheck = true;
	} else {
		$scope.pswrdChange = false;
		toggleCheck = false;
	}

	$scope.version = strings.version;
	securityHeaders.headers = commonService.securityHeaders();

	$scope.pushNotification = {
		checked: toggleCheck
	};
	$scope.aboutUs = function () {
		$state.transitionTo("app.aboutus");
	}

	$scope.pushNotificationChange = function () {
		console.log(OnlineCheck);
		console.log($scope.vpnStatus);
		if (OnlineCheck == true) {	
			$scope.disableState = false;
			console.log($scope.pushNotification.checked);
				if ($scope.pushNotification.checked) {
					console.log("if loop");
					commonService.updateNetworkStatus(true);
					alertService.showToast(strings.onlinemode);
					$rootScope.isNetworkOn = true;
				//	commonService.updateVPNNetwork(true);			
				} else {
					console.log("elsee loop");
					commonService.updateNetworkStatus(false);
					alertService.showToast(strings.offlinemode);
					$rootScope.isNetworkOn = false;
					
				//	commonService.updateVPNNetwork(false);
				}
		} else {
			$scope.disableState = true;
		}
	};
	
	$scope.changePassword = function (passwordData) {
		if (!netCheck) {
			alertService.doAlert(strings.noNetwork);
		} else {
	//		var userpassword = $localstorage.getObject("password");
	//		console.log(userpassword);
			if (passwordData != undefined && passwordData.oldpassword && passwordData.oldpassword.length > 0 && passwordData.newpassword && passwordData.newpassword.length > 0 && passwordData.repwd && passwordData.repwd.length > 0) {
				if (passwordData.oldpassword === passwordData.newpassword) {
					alertService.doAlert("Old password and new password should not match");
				} else if (passwordData.newpassword === passwordData.repwd) {
					var url = config.url + "/api/v1/users/pwdchange";
					passwordData.username = $localstorage.getObject("username"); 
							console.log(passwordData)

					formsSave.changePassword(url, passwordData, securityHeaders, function (response) {
						console.log(response)
						if (response.status === 200) {
							alertService.doAlert(response.message);
							$localstorage.setObject("loggedIn", false);
							$state.transitionTo("app.login");
						} else {
							alertService.doAlert(response.message);
						}
					});
				} else {
					alertService.doAlert("Passwords didn't match");
				}
			} else {
				alertService.doAlert("All fields are mandatory");
			}
		}
	};

	$scope.changePwd = function () {
		$state.transitionTo("app.changePassword");
	};

/*
@developer :Santhosh Kumar Gunti
TPCL customization
changed transition from tabs to sidemenu
*/
	$scope.backToSettings = function () {
		if($localstorage.getObject("isFirstLogin")){
			$ionicHistory.goBack();
		}else{
			$state.transitionTo("sidemenu.tabs.settings");
		}

	}

	$scope.inputType = 'password';

	$scope.hideShowPassword = function () {
		if ($scope.inputType == 'password')
			$scope.inputType = 'text';
		else
			$scope.inputType = 'password';
	};
	$scope.goToSite = function () {
		window.open('http://formsz.com', '_system', 'location=yes');
	};
	$scope.logout = function () {
		$localstorage.setObject("loggedIn", false);
		deviceManagement.logout($localstorage.getObject("username"),$localstorage.getObject("deviceInfo").manufacturer,$localstorage.getObject("deviceInfo").model,$localstorage.getObject("deviceInfo").platform,$localstorage.getObject("deviceInfo").uuid,$localstorage.getObject("deviceInfo").version);
	};

});
