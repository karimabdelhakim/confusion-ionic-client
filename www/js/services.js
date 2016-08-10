'use strict';

angular.module('conFusion.services', ['ngResource'])
//for emulator, your current ip address check if it is the same
.constant("baseURL", "https://192.168.1.5:3443/")
//for ionic serve
//.constant("baseURL", "http://localhost:3000/") 

.factory('menuFactory', ['$resource', 'baseURL',
    function($resource, baseURL) {

        return $resource(baseURL + "dishes/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
    }
])

.factory('promotionFactory', ['$resource', 'baseURL',
    function($resource, baseURL) {


        return $resource(baseURL + "promotions/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

    }
])

.factory('corporateFactory', ['$resource', 'baseURL',
    function($resource, baseURL) {


        return $resource(baseURL + "leadership/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

    }
])

.service('feedbackFactory', ['$resource', 'baseURL',
    function($resource, baseURL) {


        return $resource(baseURL + "feedback/:id", null, {
            'update': {
                method: 'PUT'
            }
        });



    }
])

.factory('commentFactory', ['$resource', 'baseURL',
    function($resource, baseURL) {

        return $resource(baseURL + "dishes/:id/comments/:commentId", {
            id: "@Id",
            commentId: "@CommentId"
        }, {
            'update': {
                method: 'PUT'
            }
        });

    }
])

.factory('favoriteFactory', ['$resource', 'baseURL',
    function($resource, baseURL) {

        return $resource(baseURL + "favorites/:id", null, {
            'update': {
                method: 'PUT'
            },
            'query': {
                method: 'GET',
                isArray: false
            }
        });
    }
])
    .factory('$localStorage', ['$window',
        function($window) {
            return {
                store: function(key, value) {
                    $window.localStorage[key] = value;
                },
                get: function(key, defaultValue) {
                    return $window.localStorage[key] || defaultValue;
                },
                remove: function(key) {
                    $window.localStorage.removeItem(key);
                },
                storeObject: function(key, value) {
                    $window.localStorage[key] = JSON.stringify(value);
                },
                getObject: function(key, defaultValue) {
                    return JSON.parse($window.localStorage[key] || defaultValue);
                }
            };
        }
    ])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope',
    '$window', 'baseURL',
    function($resource, $http, $localStorage, $rootScope, $window, baseURL) {

        var authFac = {};
        var TOKEN_KEY = 'Token';
        var isAuthenticated = false;
        var username = '';
        var authToken = undefined;


        function loadUserCredentials() {
            var credentials = $localStorage.getObject(TOKEN_KEY, '{}');
            if (credentials.username != undefined) {
                useCredentials(credentials);
            }
        }

        function storeUserCredentials(credentials) {
            $localStorage.storeObject(TOKEN_KEY, credentials);
            useCredentials(credentials);
        }

        function useCredentials(credentials) {
            isAuthenticated = true;
            username = credentials.username;
            authToken = credentials.token;

            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            username = '';
            isAuthenticated = false;
            $http.defaults.headers.common['x-access-token'] = authToken;
            $localStorage.remove(TOKEN_KEY);
        }

        authFac.login = function(loginData) {

            $resource(baseURL + "users/login")
                .save(loginData,
                    function(response) {
                        storeUserCredentials({
                            username: loginData.username,
                            token: response.token
                        });
                        $rootScope.$broadcast('login:Successful');
                    },
                    function(response) {
                        isAuthenticated = false;
                        message = "Error: " +
                            response.data.err.message + " " + response.data.err.name;
                        $rootScope.$broadcast('login:notSuccessful');

                    }
            );

        };

        authFac.logout = function() {
            $resource(baseURL + "users/logout").get(
                function(response) {
                    $rootScope.$broadcast('logout:Successful');
                },
                function(response) {
                    $rootScope.$broadcast('logout:notSuccessful');
                });
            destroyUserCredentials();
        };

        authFac.register = function(registerData) {

            $resource(baseURL + "users/register")
                .save(registerData,
                    function(response) {
                        authFac.login({
                            username: registerData.username,
                            password: registerData.password
                        });
                        if (registerData.rememberMe) {
                            $localStorage.storeObject('userinfo', {
                                username: registerData.username,
                                password: registerData.password
                            });
                        }
                        //added by me to use it in comments
                        $localStorage.storeObject('fullname', {
                            firstname: registerData.firstname,
                            lastname: registerData.lastname
                        });
                        $rootScope.$broadcast('registration:Successful');
                    },
                    function(response) {

                        message = "Error: " +
                            response.data.err.message + " " + response.data.err.name;
                        $rootScope.$broadcast('registration:notSuccessful');


                    }

            );
        };

        authFac.isAuthenticated = function() {
            return isAuthenticated;
        };

        authFac.getUsername = function() {
            return username;
        };

        authFac.showError = function() {
            return message;
        };
        loadUserCredentials();

        return authFac;

    }
])

;