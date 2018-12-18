angular.module('starter.controllers')

.controller('HomeCtrl', function ($scope,$state,$timeout,ionicMaterialInk,$ionicHistory) {

	$timeout(function () {
		$scope.$parent.hideHeader();
	}, 0);
	ionicMaterialInk.displayEffect();

	$scope.agree = function () {
		$state.transitionTo("app.login");
	};

	$scope.disAgree = function () {
		ionic.Platform.exitApp();
	};

});
