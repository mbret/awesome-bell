angular
    .module("ring", ["ngTouch", "btford.socket-io"])
    .factory('socket', function (socketFactory) {
        var socket = socketFactory({
            ioSocket: io.connect("/server", {
                query: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
            })
        });
        socket.on("connect", function() {
            console.log("connected");
        });
        socket.on("connect_error", function(err) {
            console.error(err);
        });
        return socket;
    })
    .controller("mainController", function($scope, $http, socket) {
        $scope.ringBusy = false;
        $scope.available = false;

        $scope.ring = function() {
            //$scope.ringBusy = true;
            $http.post("/ring", {})
                .then(function() {
                    console.log("end");
                    $scope.ringBusy = false;
                })
                .catch(function() {

                });
        };

        checkAvailability();

        function checkAvailability() {
            $http.get("/client")
                .then(function() {
                    $scope.available = true;
                });

            socket.on("client:connect", function() {
                $scope.available = true;
                console.log("connect");
            });

            socket.on("client:disconnect", function() {
                $scope.available = false;
                console.log("disconnect");
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