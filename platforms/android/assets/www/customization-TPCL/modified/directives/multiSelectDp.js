var mulSel=angular.module('directives');
mulSel.directive('ionSearchSelect', ['$ionicModal', '$ionicGesture', function ($ionicModal, $ionicGesture) {
    return {
        restrict: 'E',
        require: "ngModel",
        scope: {
            modelDate: "=ngModel",
            options: "=",
            optionSelected: "="
        },
        controller: function ($scope, $element, $attrs) {
            $scope.searchSelect = {
                title: $attrs.title || "Search",
                keyProperty: $attrs.keyProperty,
                valueProperty: $attrs.valueProperty,
                templateUrl: $attrs.templateUrl || 'customization-TPCL/modified/templates/searchSelect.html',
                animation: $attrs.animation || 'slide-in-up',
                option: null,
                searchvalue: "",
                enableSearch: $attrs.enableSearch ? $attrs.enableSearch == "true" : true
            };

            $ionicGesture.on('tap', function (e) {
                if ($scope.modal) {
                    $scope.modal.remove();
                }
                if(!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty){
                  if ($scope.optionSelected) {
                    $scope.searchSelect.option = $scope.optionSelected[$scope.searchSelect.keyProperty];
                  }
                }
                else{
                  $scope.searchSelect.option = $scope.optionSelected;
                }
                $scope.OpenModalFromTemplate($scope.searchSelect.templateUrl);
            }, $element);

            $scope.saveOption = function () {
              if(!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty){
                for (var i = 0; i < $scope.options.length; i++) {
                    var currentOption = $scope.options[i];
                    if(currentOption[$scope.searchSelect.keyProperty] == $scope.searchSelect.option){
                      $scope.optionSelected = currentOption;
                      break;
                    }
                }
              }
              else{
                $scope.optionSelected = $scope.searchSelect.option;
              }
                $scope.searchSelect.searchvalue = "";
                $scope.modal.remove();
            };
          
            $scope.clearSearch = function () {
                $scope.searchSelect.searchvalue = "";
            };

            $scope.closeModal = function () {
              console.log('before '+ JSON.stringify($scope.optionSelected))
              $scope.optionSelected = [];
              $scope.modelDate = [];
              console.log(JSON.stringify($scope.options));
                angular.forEach($scope.options, function(value, key) {
                  if(value.selected){
                    $scope.optionSelected.push(value);
                    $scope.modelDate.push(value);
                  }
                });
                $scope.modal.remove();
            };
            $scope.$on('$destroy', function () {
                if ($scope.modal) {
                    $scope.modal.remove();
                }
            });
          
            $scope.OpenModalFromTemplate = function (templateUrl) {
                $ionicModal.fromTemplateUrl(templateUrl, {
                    scope: $scope,
                    backdropClickToClose :false,
                    animation: $scope.searchSelect.animation
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            };
            $scope.closeModaWithOutSave = function () {
              $scope.modal.remove();
            };
        }
    };
} ]);
