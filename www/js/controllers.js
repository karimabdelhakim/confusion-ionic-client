angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage,
    $ionicPlatform, $cordovaCamera, $cordovaImagePicker, $rootScope, $ionicPopup,
    AuthFactory, $state) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.loggedIn = false;
    $scope.username = '';

    if (AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
    /*
  Login Form goes down here.
   */

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo', '{}');

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };
    $scope.logout = function() {
        AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    $rootScope.$on('logout:Successful', function() {
        var alertPopup = $ionicPopup.alert({
            scope: $scope,
            title: 'You have successfully logged out',
            template: 'bye'
        });
        alertPopup.then(function(res) {
            console.log('user alerted');
        });
    });
    $rootScope.$on('logout:notSuccessful', function() {
        var alertPopup = $ionicPopup.alert({
            scope: $scope,
            title: 'Server error',
            template: 'you are not logged Out'
        });
        alertPopup.then(function(res) {
            console.log('user alerted');
        });
    });
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);
        if ($scope.rememberMe) {
            $localStorage.storeObject('userinfo', $scope.loginData);
        }
        AuthFactory.login($scope.loginData);
        $scope.closeLogin();
    };
    $rootScope.$on('login:Successful', function() {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        var alertPopup = $ionicPopup.alert({
            scope: $scope,
            title: 'You have successfully logged in',
            template: 'Welcome ' + $scope.username
        });
        alertPopup.then(function(res) {
            console.log('user alerted');
        });
    });
    $rootScope.$on('login:notSuccessful', function() {
        $scope.errorMessage = AuthFactory.showError();
        var alertPopup = $ionicPopup.alert({
            scope: $scope,
            title: 'Server Error',
            template: $scope.errorMessage
        });
        alertPopup.then(function(res) {
            console.log('user alerted');
        });
    });
    //-------------------------------------------------------------------------
    /*
  Reserve Form goes down here.
   */
    $scope.reservation = {};

    // Create the reserve modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.reserveform = modal;
    });

    // Triggered in the reserve modal to close it
    $scope.closeReserve = function() {
        $scope.reserveform.hide();
    };

    // Open the reserve modal
    $scope.reserve = function() {
        $scope.reserveform.show();
    };

    // Perform the reserve action when the user submits the reserve form
    $scope.doReserve = function() {
        console.log('Doing reservation', $scope.reservation);

        $timeout(function() {
            $scope.closeReserve();
        }, 1000);
    };
    //---------------------------------------------------------------------
    /*
     register form(modal) goes down here
     */
    $scope.registration = {};
    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function() {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function() {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function() {
        $scope.register = {};
        $scope.loginData = {};
        console.log('Doing registration', $scope.registration);
        AuthFactory.register($scope.registration);
        $scope.closeRegister();
    };
    $rootScope.$on('registration:Successful', function() {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    $rootScope.$on('registration:notSuccessful', function() {
        $scope.errorMessage = AuthFactory.showError();
        var alertPopup = $ionicPopup.alert({
            scope: $scope,
            title: 'Server Error',
            template: $scope.errorMessage
        });
        alertPopup.then(function(res) {
            console.log('user alerted');
        });
    });
    //you must use this func *$ionicPlatform.ready* whenever you need to use cordova plugin
    $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
        $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });
            $scope.registerform.show();
        };
        var options2 = {
            maximumImagesCount: 10,
            width: 100,
            height: 100,
            quality: 50
        };
        $scope.pickPicture = function() {

            $cordovaImagePicker.getPictures(options2)
                .then(function(results) {
                    for (var i = 0; i < results.length; i++) {
                        console.log('Image URI: ' + results[i]);
                        $scope.registration.imgSrc = results[i];
                    }
                }, function(error) {
                    // error getting photos
                });
            $scope.registerform.show();
        };
    });
    //----------------------------------------------------------------------
})

.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory',
    'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification',
    '$cordovaToast', '$ionicPopup', '$ionicLoading',
    function($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate,
        $ionicPlatform, $cordovaLocalNotification, $cordovaToast, $ionicPopup,
        $ionicLoading) {
        $scope.baseURL = baseURL;
        $scope.tab = 1;
        $scope.showDetails = false;
        $scope.filtText = '';
        $ionicLoading.show();

        menuFactory.query(
            function(response) {
                $ionicLoading.hide();
                $scope.dishes = response;
            },
            function(response) {
                $ionicLoading.hide();
                $scope.message = "Error: " + response.status + " " + response.statusText;
                //ionicpopup with the error
                var alertPopup = $ionicPopup.alert({
                    scope: $scope,
                    title: 'Server Error',
                    template: $scope.message
                });
                alertPopup.then(function(res) {
                    console.log('user alerted');
                });
            });
        $scope.select = function(setTab) {
            $scope.tab = setTab;
            if (setTab === 2) {
                $scope.filtText = "appetizer";
            } else if (setTab === 3) {
                $scope.filtText = "mains";
            } else if (setTab === 4) {
                $scope.filtText = "dessert";
            } else {
                $scope.filtText = "";
            }
        };
        $scope.isSelected = function(checkTab) {
            return ($scope.tab === checkTab);
        };
        $scope.toggleDetails = function() {
            $scope.showDetails = !$scope.showDetails;
        };
        $scope.addFavorite = function(dishId, dishName) {
            $ionicListDelegate.closeOptionButtons();

            favoriteFactory.save({
                _id: dishId
            })
                .$promise.then(
                    function(response) {
                        $scope.exist = response.exist;
                        if (!$scope.exist) {
                            //'Dish added to favorite list!'
                            $ionicPlatform.ready(function() {
                                $cordovaLocalNotification.schedule({
                                    id: 1,
                                    title: "Added Favorite",
                                    text: dishName
                                }).then(function() {
                                        console.log('Added Favorite ' + dishName);
                                    },
                                    function() {
                                        console.log('Failed to add Notification ');
                                    });

                                $cordovaToast
                                    .show('Added Favorite ' + dishName, 'long', 'center')
                                    .then(function(success) {
                                        // success
                                    }, function(error) {
                                        // error
                                    });
                            });

                        } else {
                            //Dish is already in favorite list!
                            $ionicPlatform.ready(function() {

                                $cordovaToast
                                    .show(dishName + '  already in favorite list!',
                                        'long', 'center')
                                    .then(function(success) {
                                        // success
                                    }, function(error) {
                                        // error
                                    });
                            });
                        }
                    },
                    function(response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                        //ionicpopup with the error
                        var alertPopup = $ionicPopup.alert({
                            scope: $scope,
                            title: 'Server Error',
                            template: $scope.message
                        });
                        alertPopup.then(function(res) {
                            console.log('user alerted');
                        });
                    }
            );


        };
    }
])



.controller('ContactController', ['$scope', 'feedbackFactory',
    function($scope, feedbackFactory) {

        $scope.sendFeedback = function() {

            feedbackFactory.getFeedback().save($scope.feedback);

            if ($scope.feedback.agree && ($scope.feedback.mychannel === "") && !$scope.feedback.mychannel) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            } else {
                $scope.invalidChannelSelection = false;
                $scope.feedback = {
                    mychannel: "",
                    firstName: "",
                    lastName: "",
                    agree: false,
                    email: ""
                };
                $scope.feedbackForm.$setPristine();
                console.log($scope.feedback);
            }

        };
    }
])

.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory',
    'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$ionicPlatform',
    '$cordovaLocalNotification', '$cordovaToast', 'commentFactory', '$ionicPopup',
    '$ionicLoading',
    function($scope, $stateParams, menuFactory, favoriteFactory, baseURL, $ionicPopover,
        $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast,
        commentFactory, $ionicPopup, $ionicLoading) {
        $scope.baseURL = baseURL;
        var dishName;
        $ionicLoading.show();
        dishQuery = function() {
            menuFactory.get({
                id: $stateParams.id
            })
                .$promise.then(
                    function(response) {
                        $scope.dish = response;
                        dishName = $scope.dish.name;
                        $ionicLoading.hide();
                    },
                    function(response) {
                        $ionicLoading.hide();
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                        var alertPopup = $ionicPopup.alert({
                            scope: $scope,
                            title: 'Server Error',
                            template: $scope.message
                        });
                        alertPopup.then(function(res) {
                            console.log('user alerted');
                        });
                    }
            );
        }
        dishQuery();

        $ionicPopover.fromTemplateUrl('templates/dishpopover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        $scope.addFavorite = function() {
            $scope.closePopover();
            favoriteFactory.save({
                _id: $stateParams.id
            })
                .$promise.then(
                    function(response) {
                        $scope.exist = response.exist;
                        if (!$scope.exist) {
                            //'Dish added to favorite list!'
                            $ionicPlatform.ready(function() {
                                $cordovaLocalNotification.schedule({
                                    id: 1,
                                    title: "Added Favorite",
                                    text: dishName
                                }).then(function() {
                                        console.log('Added Favorite ' + dishName);
                                    },
                                    function() {
                                        console.log('Failed to add Notification ');
                                    });

                                $cordovaToast
                                    .show('Added Favorite ' + dishName, 'long', 'center')
                                    .then(function(success) {
                                        // success
                                    }, function(error) {
                                        // error
                                    });
                            });

                        } else {
                            //Dish is already in favorite list!
                            $ionicPlatform.ready(function() {

                                $cordovaToast
                                    .show(dishName + '  already in favorite list!',
                                        'long', 'center')
                                    .then(function(success) {
                                        // success
                                    }, function(error) {
                                        // error
                                    });
                            });
                        }
                    },
                    function(response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                        //ionicpopup with the error
                        var alertPopup = $ionicPopup.alert({
                            scope: $scope,
                            title: 'Server Error',
                            template: $scope.message
                        });
                        alertPopup.then(function(res) {
                            console.log('user alerted');
                        });
                    }
            );


        };
        //Comment modal goes down here

        $scope.comment = {
            rating: 5,
            comment: "",
        };

        // Create the comment modal that we will use later
        $ionicModal.fromTemplateUrl('templates/addcomment.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.commentForm = modal;
        });

        // Triggered in the comment modal to close it
        $scope.closeComment = function() {
            $scope.commentForm.hide();
        };

        // Open the comment modal
        $scope.commentOpen = function() {
            $scope.commentForm.show();
            $scope.closePopover();
        };

        $scope.submitComment = function() {

            commentFactory.save({
                id: $scope.dish._id
            }, $scope.comment)

            .$promise.then(
                function(response) {
                    dishQuery();
                    $scope.commentForm.$setPristine();
                    $scope.comment = {
                        rating: 5,
                        comment: ""
                    };
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                    var alertPopup = $ionicPopup.alert({
                        scope: $scope,
                        title: 'Server Error',
                        template: $scope.message
                    });
                    alertPopup.then(function(res) {
                        console.log('user alerted');
                    });
                }
            );
        };


    }
])



.controller('HomeController', ['$scope', 'menuFactory', 'promotionFactory',
    'corporateFactory', 'baseURL',
    function($scope, menuFactory, promotionFactory, corporateFactory, baseURL) {

        $scope.baseURL = baseURL;

        var dishes = menuFactory.query({
                featured: "true"
            })
            .$promise.then(
                function(response) {
                    dishes = response;
                    $scope.dish = dishes[0];
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

        var promotions = promotionFactory.query({
                featured: "true"
            })
            .$promise.then(
                function(response) {
                    promotions = response;
                    $scope.promotion = promotions[0];
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

        var leaders = corporateFactory.query({
                featured: "true"
            })
            .$promise.then(
                function(response) {
                    leaders = response;
                    $scope.leader = leaders[0];
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

    }
])


.controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', '$ionicPopup',
    '$ionicLoading',
    function($scope, corporateFactory, baseURL, $ionicPopup, $ionicLoading) {

        $scope.baseURL = baseURL;
        $ionicLoading.show();
        $scope.leaders = corporateFactory.query(
            function(response) {
                $scope.leaders = response;
                $ionicLoading.hide();
            },
            function(response) {
                $ionicLoading.hide();
                $scope.message = "Error: " + response.status + " " + response.statusText;
                //error popup here
                var alertPopup = $ionicPopup.alert({
                    scope: $scope,
                    title: 'Server Error',
                    template: $scope.message
                });
                alertPopup.then(function(res) {
                    console.log('user alerted');
                });
            });

    }
])

.controller('FavoritesController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL',
    '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout',
    '$ionicPlatform', '$cordovaVibration', 'AuthFactory',

    function($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate,
        $ionicPopup, $ionicLoading, $timeout, $ionicPlatform, $cordovaVibration,
        AuthFactory) {

        $scope.baseURL = baseURL;
        $scope.shouldShowDelete = false;
        $ionicLoading.show();
        favorites = function() {
            favoriteFactory.query(
                function(response) {
                    $ionicLoading.hide();
                    $scope.dishes = response.dishes;
                },
                function(response) {
                    $ionicLoading.hide();
                    if (!AuthFactory.isAuthenticated()) {
                        $scope.message = "You have to be a user to have favorite list";
                        var alertPopup = $ionicPopup.alert({
                            scope: $scope,
                            title: 'Authentication required',
                            template: $scope.message
                        });
                        alertPopup.then(function(res) {});
                    } else {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                        var alertPopup = $ionicPopup.alert({
                            scope: $scope,
                            title: 'Server Error',
                            template: $scope.message
                        });
                        alertPopup.then(function(res) {});
                    }
                });
        };
        favorites();


        $scope.toggleDelete = function() {
            $scope.shouldShowDelete = !$scope.shouldShowDelete;
            console.log($scope.shouldShowDelete);
        };

        $scope.deleteFavorite = function(dishId) {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm Delete',
                template: 'Are you sure you want to delete this item?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    console.log('Ok to delete');
                    favoriteFactory.delete({
                        id: dishId
                    })
                        .$promise.then(
                            function(response) {
                                favorites();
                                $ionicPlatform.ready(function() {
                                    $cordovaVibration.vibrate(100);
                                });
                            },
                            function(response) {
                                $scope.message = "Error: " + response.status + " " + response.statusText;
                                var alertPopup = $ionicPopup.alert({
                                    scope: $scope,
                                    title: 'Server Error',
                                    template: $scope.message
                                });
                                alertPopup.then(function(res) {
                                    console.log('user alerted');
                                });
                            }
                    );

                } else {
                    console.log('Canceled delete');
                }
            });
            $scope.shouldShowDelete = false;

        };
    }
]);