angular
    .module("ring", ["ngTouch"])
    .controller("mainController", function($scope, $http) {
        $scope.ringBusy = false;

        $scope.ring = function() {
            //$scope.ringBusy = true;
            $http.post("/ring", {})
                .then(function() {
                    console.log("end");
                    $scope.ringBusy = false;
                })
                .catch(function() {

                });
        }
    })
    .directive('btnBusy', [function () {
        return {
            restrict: 'A',
            scope: {
                btnBusy: "=?",
                btnBusyText: "=?",
                ngDisabled: "=?ngDisabled"
            },
            link: function (scope, elem) {

                var oldContent = elem.text();
                scope.$watch("btnBusy", function(newValue) {
                    if ((typeof newValue !== "boolean") || newValue) {
                        setBusy();
                    } else {
                        setNotBusy();
                    }
                });

                function setBusy()
                {
                    elem.attr('disabled', 'disabled');
                    if (scope.btnBusyText) {
                        elem.text(scope.btnBusyText);
                    }
                    elem.addClass('is-loading');
                }

                function setNotBusy()
                {
                    // Only re-enable element if it is not disabled by external condition
                    if (scope.ngDisabled !== true) {
                        elem.removeAttr('disabled');
                    }
                    if (scope.btnBusyText) {
                        elem.text(oldContent);
                    }
                    elem.removeClass('is-loading');
                }
            }
        };
    }]);