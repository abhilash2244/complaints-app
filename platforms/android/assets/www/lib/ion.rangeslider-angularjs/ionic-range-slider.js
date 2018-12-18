/**
 * @Author: Geoffrey Bauduin <bauduin.geo@gmail.com>
 */

angular.module("ion.rangeslider", []);

angular.module("ion.rangeslider").directive("ionRangeSlider", [
    function () {
        
        return {
            restrict: "E",
            scope: {
                min: "=",
                max: "=",
                type: "@",
                prefix: "@",
                maxPostfix: "@",
                prettify: "@",
                grid: "@",
                gridMargin: "@",
                postfix: "@",
                step: "@",
                hideMinMax: "@",
                hideFromTo: "@",
                from: "=",
                to: "=",
                disable: "=",
                onChange: "&onChange",
                onFinish: "&",
                ratingid: "@",
            },
            replace: true,
            link: function ($scope, $element) {
                $element.ionRangeSlider({
                    min: $scope.min,
                    max: $scope.max,
                    type: $scope.type,
                    prefix: $scope.prefix,
                    maxPostfix: $scope.maxPostfix,
                    prettify: $scope.prettify,
                    grid: $scope.grid,
                    gridMargin: $scope.gridMargin,
                    postfix: $scope.postfix,
                    step: $scope.step,
                    hideMinMax: $scope.hideMinMax,
                    hideFromTo: $scope.hideFromTo,
                    from: $scope.from,
                    to: $scope.to,
                    disable: $scope.disable,
                    ratingid:$scope.ratingid,
                    onChange: function (a) {
                        console.log('$scope.ratingid '+$scope.ratingid);
                        console.log('before selectedFormRecordFields '+JSON.stringify($scope.$parent.selectedFormRecordFields));
                        $scope.$parent.selectedFormRecordFields[$scope.ratingid] = a.from
                        console.log('after selectedFormRecordFields '+JSON.stringify($scope.$parent.selectedFormRecordFields));
                        $scope.onChange && $scope.onChange({
                            a: a
                        });
                    },
                    onFinish: $scope.onFinish
                });
                var watchers = [];
                watchers.push($scope.$watch("min", function (value) {
                    $element.data("ionRangeSlider").update({
                        min: value
                    });
                }));
                watchers.push($scope.$watch('max', function (value) {
                    $element.data("ionRangeSlider").update({
                        max: value
                    });
                }));
                watchers.push($scope.$watch('from', function (value) {
                    $element.data("ionRangeSlider").update({
                        from: value
                    });
                }));
                watchers.push($scope.$watch('disable', function (value) {
                    $element.data("ionRangeSlider").update({
                        disable: value
                    });
                }));
            }
        }
        
    }
])
