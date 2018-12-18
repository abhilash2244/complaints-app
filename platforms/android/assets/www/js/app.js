var db;
var securityHeaders = {};
var formskeletonStorage = [];
var networkstatus = true;
var toggleStatus = true;
var formids = [];
var hidemapIcon = true;

//var settingsNetworkStatus;
//var onlineTabs;
// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
    /**
     * @desc 
	Type : Modification
        Changed the app launching screen from login to home 
     * @author Santhosh Kumar Gunti
 	*/
/*
@developer :Santhosh Kumar Gunti
TPCL customization
implementaed with side menu
*/
angular.module('starter', ['ionic', 'ion-datetime-picker', 'leaflet-directive',
			 'starter.controllers', 'ionic-material', 'ionMdInput', 'starter.services','starter.factories', 'constants', 'messages', 'directives', 'jett.ionic.filter.bar', 'ngCordova', 'ionic.rating', 'ion.rangeslider','formsz-roadMap', 'ngAnimate',"com.2fdevs.videogular",
			"com.2fdevs.videogular.plugins.controls",
			"com.2fdevs.videogular.plugins.overlayplay",
			"com.2fdevs.videogular.plugins.poster",
			"ngSanitize",'ui.select','angularMoment'])

.run(function ($state, $ionicPlatform, $rootScope,$timeout, $ionicPopup, $ionicHistory, $cordovaSQLite, $cordovaStatusbar, commonService,$localstorage,$http,config) {
		$rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
	//	if (toState.name == "app.login") {
		if (toState.name == "app.login") {
			
			var loginStatus = $localstorage.getObject("loggedIn");
			if (loginStatus == true) {
				setTimeout(function() {
   							var confirmPopup = $ionicPopup.show({
//								subTitle : 'Use location?',
							   	template : '<p>Session is active. Click "YES" to continue work, "NO" to log in again</p>',
							   	buttons : [{
							    	text : "NO",
							    	onTap : function() {
							    		var url =config.url+"/logout";
							    		var data ={};
										data.username = $localstorage.getObject("username");
										data.manufacturer = $localstorage.getObject("deviceInfo").manufacturer;
										data.model = $localstorage.getObject("deviceInfo").model;
										data.platform = $localstorage.getObject("deviceInfo").platform;
										data.uuid = $localstorage.getObject("deviceInfo").uuid;
										$http.post(url, data)
										.success(function (res, status) {
											// Adde by santhosh on 27 th april2018
											$localstorage.setObject("loggedIn",false);
											console.log(res);
											cb(res);
										})
										.error(function (res) {
											console.log(res);
											cb(res);
										});
							    	}
							   	}, {
							    	text : 'YES',
							    	onTap : function() {
			                	    	$state.go('sidemenu.tabs.formTasks.assignedFormTasks');
							    	}
							    }]
							});

//        			
     		   }, 1000);
				/*$timeout(function () {
					//        event.preventDefault(); // stop current execution
					$state.go('sidemenu.tabs.assignedtasks');
					//    $state.go('tabs.assignedtasks');
				}, 300);*/
			}
/*			if (loginStatus == false) {
				$timeout(function () {
					$state.go('app.login');
				}, 300);
			}
*/		}

	});
	document.addEventListener("deviceready", function () {
		if (window.cordova) {
			db = $cordovaSQLite.openDB({
					name: "OfflineDB.db",
					location: 'default',
					androidDatabaseImplementation: 2
				}); //device

		} else {
			db = window.openDatabase("OfflineDB.db", '1', 'my', 1024 * 1024 * 100); // browser
		}
	});
	$ionicPlatform.ready(function () {
		/* Back Button handle */
		$rootScope.isNetworkOn = true;
		/* Back Button handle */

		document.addEventListener("deviceready", function() {
		    if ($localstorage.getObject("username") !== null && $localstorage.getObject("password") !== null) {
				$localstorage.setObject("deviceInfo", device);
//		        $state.go('tabs.dashboard');
		    } else {
		        $state.go('app.login');
		    }
		}, false);

		$rootScope.isSignaturePadEnabled = false;

		$ionicPlatform.registerBackButtonAction(function (event) {
			commonService.Loaderhide();
/*			if ($rootScope.backButtonPressedOnceToExit) {
				ionic.Platform.exitApp();
			} else if ($state.current.name === 'sidemenu.tabs.formTasks.assignedFormTasks') {
				window.plugins.appMinimize.minimize();
			} else if ($state.current.name === 'sidemenu.viewForm') {
					$rootScope.$broadcast('closePopoversInViewForm');
			} else if ($state.current.name === 'sidemenu.taskforms') {
					$rootScope.$broadcast('closepopupsInTaskforms');
			} else if ($state.current.name === 'sidemenu.taskformhistory') {
					$rootScope.$broadcast('closepopupsInTaskHistory');

			} else 
*/			if ($state.current.name === 'sidemenu.tabs.ProjectTasks.assignedProjectTasks' || 
						$state.current.name === 'sidemenu.tabs.ProjectTasks.assignedProjectTasksforms' || 
						$state.current.name === 'sidemenu.tabs.ProjectTasks.projectTaskRecords' || 
						$state.current.name === 'sidemenu.tabs.ProjectTasks.assignedProjectTasksformView') {
					$rootScope.$broadcast('closepopupsInProjectTask');
			} else if ($state.current.name === 'sidemenu.tabs.formTasks.assignedformTasksforms' || 
						$state.current.name === 'sidemenu.tabs.formTasks.formTaskRecords' || 
						$state.current.name === 'sidemenu.tabs.formTasks.assignedFormTasksformView') {
					$rootScope.$broadcast('closepopupsInTask');
/*			} else if ($state.current.name === 'app.map') {
					$rootScope.$broadcast('closePopoversInMap');
			} else if ($ionicHistory.backView()) {

				if ($rootScope.isSignaturePadEnabled)
					$rootScope.$broadcast('closeSignaturePad');
				else
					$ionicHistory.goBack();
*/
			}
			else if ($state.current.name === 'app.login') {
//				$state.go("app.home");
			} 
			else if ($state.current.name === 'sidemenu.tabs.notifications') {
				$state.go("sidemenu.tabs.formTasks.assignedFormTasks");
			} 
			else if ($state.current.name === 'sidemenu.tabs.settings') {
				$state.go("sidemenu.tabs.formTasks.assignedFormTasks");
			} 

			/*else {
				$rootScope.backButtonPressedOnceToExit = true;
				window.plugins.toast.showShortCenter(
					"Press back button again to exit",
					function (a) {},
					function (b) {});
				setTimeout(function () {
					$rootScope.backButtonPressedOnceToExit = false;
				}, 2000);
			}*/
		}, 999);

		/* Listen to network status */
		document.addEventListener("offline", onOffline, false);
		document.addEventListener("online", onOnline, false);

		function onOnline() {
			// Handle the online event
			$rootScope.isNetworkOn = true;
			commonService.updateNetworkStatus(true);
		}
		/**
		* @desc 
	            closing popovers and pullover map when devices turns into offline  
	         * @modified by Santhosh Kumar Gunti
	         * type : modify

		*/
		function onOffline() {
			// Handle the offline event
			$rootScope.isNetworkOn = false;
			$rootScope.$broadcast('closePopoversInMapOnOffline');
			$rootScope.$broadcast('disablePullover');
			commonService.updateNetworkStatus(false);
		}
		
		//navigator.splashscreen.hide();
		try {
			$cordovaStatusbar.styleHex('#103770');
		} catch (err) {
			alert(err);
		}

		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}

		if (window.cordova && window.cordova.logger) {
			window.cordova.logger.__onDeviceReady();
		}

		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
		 FCMPlugin.onNotification(
     function(data){
     
    if(data.wasTapped){
        //Notification was received on device tray and tapped by the user. 
    }else{
      //Notification was received in foreground. Maybe the user needs to be notified. 
    }
     },
     function(msg){
    console.log('onNotification callback successfully registered: ' + msg);
     },
     function(err){
    console.log('Error registering onNotification callback: ' + err);
     }
   );
	/*	if (window.cordova) {
			db = $cordovaSQLite.openDB({
					name : "OfflineDB.db",
					location : 'default'
				}); //device
		} else {
			db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser

		}*/

	});
})
.directive('focusMe', function ($timeout, $parse) {
	return {
		link : function (scope, element, attrs) {
			var model = $parse(attrs.focusMe);
			scope.$watch(model, function (value) {
				if (value === true) {
					$timeout(function () {
						element[0].focus();
					});
				}
			});
			element.bind('blur', function () {
				scope.$apply(model.assign(scope, false));
			})
		}
	};
})
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	$ionicConfigProvider.views.transition('none');
//		cfpLoadingBarProvider.includeSpinner = false;
//, $ionicFilterBarConfigProvider
	// Turn off caching for demo simplicity's sake
	$ionicConfigProvider.views.maxCache(0);
	/*
	// Turn off back button text
	$ionicConfigProvider.backButton.previousTitleText(false);
	 */
	$stateProvider.state('app', {
		url : '/app',
		abstract : true,
		templateUrl : 'templates/menu.html',
		controller : 'AppCtrl'
	})
	.state('sidemenu', {
		url : '/sidemenu',
		abstract : true,
		templateUrl : 'templates/sidemenu.html',
		controller : 'mapController'
	})

	.state('app.login', {
		url : '/login',
		views : {
			'menuContent' : {
				templateUrl : 'templates/login.html',
				controller : 'LoginCtrl'
			},

		}
	})
	.state('app.home', {
		url : '/home',
		views : {
			'menuContent' : {
				templateUrl : 'templates/home.html',
				controller : 'HomeCtrl'
			},

		}
	})
	.state('app.forgotpassword', {
		url : '/forgotpassword',
		views : {
			'menuContent' : {
				templateUrl : 'templates/forgotPassword.html',
				controller : 'LoginCtrl'
			},

		}
	})
	/*.state('app.search', {
	url : '/search',
	templateUrl : 'templates/sidemenu.html',
	controller : 'sidemenuController'

	})*/

	.state('app.history', {
		url : '/history',
		views : {
			'menuContent' : {
				templateUrl : 'templates/historylist.html',
				controller : 'HistoryCtrl'
			},
		}
	})
	.state('app.onlinehistory', {
		url : '/onlinehistory',
		views : {
			'menuContent' : {
				templateUrl : 'templates/onlinehistory.html',
				controller : 'HistoryCtrl'
			},
		}
	})
	.state('app.reAssignHistory', {
		url : '/reAssignHistory',
		views : {
			'menuContent' : {
				templateUrl : 'templates/reassignedHistory.html',
				controller : 'reassignedHistory'
			},
		}
	})

	.state('sidemenu.viewForm', {
		url : '/viewForm',
		views : {
			'menuContent' : {
				templateUrl : 'templates/formDetails.html',
				controller : 'formDetailsCtrl',
				// preventHomeReExecution: false
			},
		}
	})

	.state('sidemenu.tabs', {
		url : "/tab",
		views : {
			'menuContent' : {
				templateUrl : "templates/tabs.html",
				controller : 'tabsController'
		},
		}
	})

	.state('sidemenu.tabs.forms', {
		url : '/forms',
		views : {
			'forms-tab' : {
				templateUrl : 'templates/listofforms.html',
				controller : 'formsCtrl'
			}
		}
	})

	

	.state('sidemenu.tabs.dashboard', {
		url : "/dashboard",
		views : {
			'dashboard-tab' : {
				templateUrl : "templates/dashboard.html",
				controller : 'dashboardCtrl'
			}
		}
	})

	.state('sidemenu.tabs.assignedtasks', {
		url : "/assignedtasks",
		views : {
			'task-tab' : {
				templateUrl : "templates/assignedtasks.html",
				controller : 'taskCtrl'
			}
		}
	})

	
	.state('sidemenu.tabs.ProjectTasks', {
		url: "/ProjectTasks",
		templateUrl : "templates/assignedProjectTasks1.html",
		controller : 'projectCtrl'
		
		
	})

	.state('sidemenu.tabs.ProjectTasks.assignedProjectTasks', {
		url : "/assignedProjectTasks",
		/*
		Description: assignedProjectTasks.html modified(list css class changed)
		Developer: Lokesh
		*/
		templateUrl : "customization-TPCL/modified/templates/assignedProjectTasks.html"
	})
	
	.state('sidemenu.tabs.ProjectTasks.assignedProjectTasksforms', {
		url : "/assignedProjectTasksforms",
		templateUrl : "customization-TPCL/modified/templates/formsOfProjectTasks.html"
	})

	.state('sidemenu.tabs.ProjectTasks.projectTaskRecords', {
		url : "/projectTaskRecords",
		/*
		Description: projectForm.html modified for Fab button show and hide
		Developer: Lokesh
		*/
		templateUrl : "customization-TPCL/modified/templates/projectForm.html"
	})
    
    .state('sidemenu.tabs.ProjectTasks.assignedProjectTasksformView', {
		url : "/assignedProjectTasksformView",

		/*
		Description: projectTaskForm.html modified
		Developer: Santhosh Kumar Gunti
		*/

//		templateUrl : 'templates/projectTaskForm.html'
		templateUrl : "customization-TPCL/modified/templates/projectTaskForm.html"

	})

	.state('sidemenu.tabs.ProjectTasks.assignedProjectTasksformViewHistory', {
		url : "/assignedProjectTasksformViewHistory",

		/*
		Description: projectTaskFormHistory.html modified
		Developer: Santhosh Kumar Gunti
		*/
//		templateUrl : 'templates/projectTaskFormHistory.html'
		templateUrl : "customization-TPCL/modified/templates/projectTaskFormHistory.html"

	})



	//oob task states Start

	.state('sidemenu.tabs.formTasks', {
		url: "/formTasks",
		views : {
			'forms-task-tab' : {
				templateUrl : "templates/assigendFormTasks1.html",
				controller : 'formTaskCtrl'
			}
		}
	})

	.state('sidemenu.tabs.formTasks.assignedFormTasks', {
		url : "/assignedFormTasks",
		templateUrl : "customization-TPCL/modified/templates/assigendFormTasks.html"
		
	})
	
	.state('sidemenu.tabs.formTasks.assignedformTasksforms', {
		url : "/assignedFormTasksforms",
		templateUrl : "templates/formsOfDirectTask.html"
		
	})

	.state('sidemenu.tabs.formTasks.formTaskRecords', {
		url : "/formTaskRecords",
//		templateUrl : "templates/directTaskFormRecords.html"
		templateUrl : "customization-TPCL/modified/templates/directTaskFormRecords.html"
		
	})
    
    .state('sidemenu.tabs.formTasks.assignedFormTasksformView', {
		url : "/assignedFormTasksformView",
		/*
		Description: directTaskFormfiller.html modified
		Developer: Santhosh Kumar Gunti
		*/

//		templateUrl : 'templates/directTaskFormfiller.html'
		templateUrl : "customization-TPCL/modified/templates/directTaskFormfiller.html"
		
	})

	.state('sidemenu.tabs.formTasks.assignedFormTasksformViewHistory', {
		url : "/assignedFormTasksformViewHistory",
		/*
		Description: projectTaskFormHistory.html modified
		Developer: Santhosh Kumar Gunti
		*/
//		templateUrl : 'templates/projectTaskFormHistory.html'
		templateUrl : "customization-TPCL/modified/templates/projectTaskFormHistory.html"
		
	})


	//oob task states end




	/*.state('app.projectTaskRecords', {
		url : "/projectTaskRecords",
		views : {
			'menuContent' : {
				templateUrl : "templates/projectForm.html",
				controller : 'projectCtrl'
			}
		}
	})
	.state('app.assignedProjectTasksforms', {
		url : "/assignedProjectTasks",
		views : {
			'menuContent' : {
				templateUrl : "templates/formsOfProjectTasks.html",
				controller : 'projectCtrl'
			}	
		}
	})

	.state('app.assignedProjectTasksformView', {
		url : "/assignedProjectTasksformView",
		views : {
			'menuContent' : {
				templateUrl : 'templates/projectTaskForm.html',
				controller : 'projectCtrl',
				// preventHomeReExecution: false
			},
		}
		
		
	})*/
	//backporting from ue
	.state('sidemenu.tabs.notifications', {
		url: "/notifications",
		views: {
			'notification-tab': {
				templateUrl: "customization-TPCL/modified/templates/notifications.html",
				controller: 'nofification'
			}
		}
	})
	
	.state('sidemenu.taskforms', {
		url : "/taskforms",
		views : {
			'menuContent' : {
				templateUrl : "templates/formsOfTask.html",
				controller : 'taskCtrl'
			}
		}
	})
	/* .state('app.prepopulatedRecords', {
	url: "/prepopulatedRecords",
	views: {
	'menuContent': {
	templateUrl: "templates/prepopulatedRecords.html",
	controller : 'taskCtrl'
	}
	}
	})*/
	.state('sidemenu.taskformhistory', {
		url : "/taskformhistory",
		views : {
			'menuContent' : {
				templateUrl : "templates/taskformhistory.html",
				controller : 'taskHistoryCtrl'
			}
		}
	})
	.state('app.taskformOnlinehistory', {
		url : "/taskformOnlinehistory",
		views : {
			'menuContent' : {
				templateUrl : "templates/taskformOnlinehistory.html",
				controller : 'taskHistoryCtrl'
			}
		}
	})
	.state('app.mailer', {
		url : "/mailer",
		views : {
			'menuContent' : {
				templateUrl : "templates/mailer.html",
				controller : 'taskHistoryCtrl'
			}
		}
	})
	.state('sidemenu.tabs.reasign', {
		url : "/reasign",
		views : {
			'reasign-tab' : {
				templateUrl : "templates/reasign.html",
				controller : 'reassignCtrl'
			}
		}
	})
	.state('sidemenu.tabs.settings', {
		url : "/settings",
		views : {
			'settings-tab' : {
				templateUrl : "customization-TPCL/modified/templates/settings.html",
				controller : 'settingsCtrl'
			}
		}
	})
	.state('app.changePassword', {
		url : "/changePassword",
		views : {
			'menuContent' : {
				templateUrl : "templates/changepassword.html",
				controller : 'settingsCtrl'
			}
		}
	})
	.state('app.map', {
		url : "/map",
		views : {
			'menuContent' : {
				templateUrl : "templates/map.html",
				controller : 'mapController'
			}
		}
	})
	.state('app.aboutus', {
		url : "/aboutus",
		views : {
			'menuContent' : {
				templateUrl : "templates/aboutus.html",
				controller : 'settingsCtrl'
			}
		}
	})
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/login');

});
