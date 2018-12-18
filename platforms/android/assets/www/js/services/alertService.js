angular.module('starter.services')
    .service('alertService', function($ionicPopup, $cordovaToast) {
        return {
            doAlert: function(content, callback) {
                $ionicPopup.alert({
                    title: 'Message',
                    content: content
                }).then(function(res) {
                    if (callback)
                        callback(res);
                });
            },
            showToast: function(message) {
                $cordovaToast.show(message, 'long', 'bottom').then(function(success) {}, function(error) {});
            }

	}

});
