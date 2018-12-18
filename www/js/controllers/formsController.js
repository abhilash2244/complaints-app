angular.module('starter.controllers')
.controller('formsCtrl', function ($scope, $rootScope, $state, $ionicPopover, $ionicListDelegate, config, commonMethod, $cordovaSQLite, $ionicLoading, formsService, $ionicPopup, $timeout, $ionicFilterBar, $localstorage, commonService, alertService, setGetObj, strings, dashboardService) {
	$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS downloads_Form_collection(Username text,FormId integer)');
	var user = $localstorage.getObject("username");
	var idArry = [];
	$scope.status = commonService.checkConnection();
	securityHeaders.headers = commonService.securityHeaders();
	$rootScope.offlineReData = false;
	$rootScope.prepopDataShow = false;
	$scope.searchBarShow = false;
	$scope.searchIcon = true;
	$scope.showSearchBar = function () {
		$scope.searchBarShow = true;
		$scope.searchIcon = false;
	}
	$scope.hideSearchbar = function () {
		$scope.search = {};
		$scope.searchBarShow = false;
		$scope.searchIcon = true;
	}
	if ($scope.status == true) {
		$scope.hide_download = false;
		$scope.view_hide = true;

	} else {
		$scope.hide_download = true;
		$scope.view_hide = false;
	}
	var filterBarInstance;
	$scope.notifications = function () {
		alertService.showToast(strings.unavailable);
	},
	$scope.getFormsMethod = function () {
		commonService.LoaderShow(strings.pleasewait);
		if ($scope.status == true) {
			$scope.loadForms();
		} else {
			$scope.inProgressForms();
		}
	},

	$scope.checkDownloads = function (callback) {
		var query = 'SELECT * FROM downloads_Form_collection where Username=?';
		$cordovaSQLite.execute(db, query, [user]).then(function (res) {
			var len = res.rows.length;
			for (var i = 0; i < len; i++) {
				var FormId = res.rows.item(i).FormId;

				idArry.push(FormId);
			}
			callback(idArry);
		});
	},
	$scope.loadForms = function () {
		$scope.checkDownloads(function (idArry) {
			$scope.arrVals = idArry;
			var id = $localstorage.getObject("userId");
			var groupid = $localstorage.getObject("groupid");

			if ($scope.status == true) {
				var url = config.url + "/api/v1/formsz/getformszlist/" + user + "/" + groupid + "";
				dashboardService.listOfForms(url, securityHeaders, function (response, status) {
					commonService.Loaderhide();
					if (response.status == 204) {
						var arr = [];
						$rootScope.formObjects = arr;
						$scope.getItems();
					} else {

						$scope.formObjects = response.formslist;
						$scope.getItems();

					}

				});
			} else {
				commonService.Loaderhide();
			}
		});
	},
	$scope.inProgressForms = function () {

		var username = $localstorage.getObject("username");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS FormsList (FormId integer, FormName text ,id integer,Username text,version text,category text,description text)").then(function (res) {}, function (err) {});

		var query = "SELECT * FROM FormsList WHERE Username=?";
		$cordovaSQLite.execute(db, query, [username]).then(function (res) {
			var len = res.rows.length;
			var arr = [];
			for (var i = 0; i < len; i++) {
				var obj = {};
				obj.name = res.rows.item(i).FormName;
				obj._id = res.rows.item(i).FormId;
				obj.version = res.rows.item(i).version;
				obj.category = res.rows.item(i).category;
				obj.description = res.rows.item(i).description;
				arr.push(obj);
			}
			$scope.formObjects = arr;
			$scope.getItems();
			commonService.Loaderhide();
			//	$state.transitionTo("tabs.forms");
		}, function (err) {
			$ionicLoading.hide();

		});

	};
	/**
     * @desc 
        Added the work instruction,references to existing array 
     * @author Santhosh Kumar Gunti
 	*/
	$scope.getItems = function () {

		var items = [];
		for (var x = 0; x < $scope.formObjects.length; x++) {
			items.push({
				FormName : $scope.formObjects[x].name,
				version : $scope.formObjects[x].version,
				category : $scope.formObjects[x].category,
				description : $scope.formObjects[x].description,
				workInstruction : $scope.formObjects[x].workInstruction,
				references : $scope.formObjects[x].references,
				alternativeMailid : $scope.formObjects[x].alternativeMailid,
				id : $scope.formObjects[x]._id
			});
		}
		$scope.items = items;

	};

	$scope.downloadForm = function (item) {

		$scope.status = commonService.checkConnection();

		if ($scope.status == true) {
			var name = $localstorage.getObject("username");
			var id = $localstorage.getObject("userId");
			var FormName = item.FormName;
			var FormId = item.id;
			var version = item.version;
			var category = item.category;
			var description = item.description;
			if (!description || description === null || description === "null")
				description = "";
			$localstorage.setObject("FormId", FormId);
			$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS FormsList (FormId integer, FormName text ,id integer,Username text,version text,category text,description text)").then(function (res) {});
			var query = "SELECT * FROM FormsList WHERE FormId=?";
			$cordovaSQLite.execute(db, query, [FormId]).then(function (res) {
				var query = 'INSERT INTO downloads_Form_collection (Username,FormId) VALUES (?,?)';
				$cordovaSQLite.execute(db, query, [name, FormId]).then(function (res) {});
				if (res.rows.length <= 0) {
					var query = 'INSERT INTO FormsList (FormId, FormName, id,Username,version,category,description) VALUES (?,?,?,?,?,?,?)';
					$cordovaSQLite.execute(db, query, [FormId, FormName, id, name, version, category, item.description]).then(function (res) {
						var url = config.url + "/api/v1/formsz/" + FormId;
						formsService.navigateToForms(url, securityHeaders, function (status, response) {
							if (status) {
								$scope.formSkeleton = JSON.stringify(response.FormSkeleton);
								$scope.formId = response._id;
								$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormSkeleton_table(FormId integer,Username text,id integer, FormName text ,FormSkeleton text)');
								var query = 'INSERT INTO FormSkeleton_table (FormId,Username, id, FormName, FormSkeleton) VALUES (?,?,?,?,?)';
								$cordovaSQLite.execute(db, query, [FormId, name, id, FormName, $scope.formSkeleton]).then(function (res) {
									$scope.loadForms();
									alertService.doAlert(strings.formdownloaded, function (res) {
										$ionicListDelegate.closeOptionButtons();
									});
								}, function (err) {
									alert(JSON.stringify(err));
									$ionicListDelegate.closeOptionButtons();
								});
							}
						});
					}, function (err) {
						alert(JSON.stringify(err));
						$ionicListDelegate.closeOptionButtons();
					});
				} else {
					alertService.doAlert(strings.formExists, function (res) {
						$ionicListDelegate.closeOptionButtons();
					});
				}
			}, function (err) {
				alert(err);
				$ionicListDelegate.closeOptionButtons();
			});
		} else {
			$scope.inProgressForms();
		}
	};

	$scope.showRecordPopup = function (data) {
		$localstorage.setObject("emailId", data.alternativeMailid);

        if (!data.FormName)
            data.FormName = "";

        if (!data.description)
            data.description = "";

        if (!data.category)
            data.category = "";

		var alertPopup = $ionicPopup.alert({
				template : "<div>Form Name : " + data.FormName + " </br><hr>Description : " + data.description + "</br><hr> Category : " + data.category + "</div>",
			});
		alertPopup.then(function (res) {
			$ionicListDelegate.closeOptionButtons();
		});
	};

	$scope.showFilterBar = function () {
		filterBarInstance = $ionicFilterBar.show({
				items : $scope.items,
				update : function (filteredItems, filterText) {
					$scope.items = filteredItems;
					if (filterText) {
						$rootScope.scrollMainToTop();
					}
				}
			}, $rootScope.scrollMainToTop());
	};

	$scope.refreshItems = function () {
		$scope.netCheck = commonService.checkConnection();
		if (filterBarInstance) {
			filterBarInstance();
			filterBarInstance = null;
		}
		if ($scope.netCheck == true) {
			$scope.loadForms();
		} else {
			$scope.hide_download = true;
			$scope.inProgressForms();
		}

		$timeout(function () {
			if ($scope.netCheck == true) {
				$scope.loadForms();
			} else {
				$scope.inProgressForms();
			}
			$scope.$broadcast('scroll.refreshComplete');
		}, 1000);
	};

	$scope.deleteForm = function (item) {
		var formId = item.id;
		var query = "SELECT * FROM FormsList WHERE FormId=?";
		$cordovaSQLite.execute(db, query, [formId]).then(function (res) {
			if (res.rows.length > 0) {
				$cordovaSQLite.execute(db, "DELETE FROM FormsList WHERE FormId=?", [formId])
				.then(function (res) {

					alertService.doAlert(strings.formDelete);
					$scope.refreshItems();
					$state.transitionTo("tabs.OfflineForms");
				},
					function (err) {});
			}
		}, function (err) {
			commonService.Loaderhide();
		});
	},
	$rootScope.$on("getListOfOfflineRecords", function () {
		$scope.getOfflineRecords(setGetObj.getHistoryOfForms());
	});

	$scope.getOfflineRecords = function (item) {
		setGetObj.setHistoryOfForms(item);
		$state.transitionTo("app.history");
	};

});
