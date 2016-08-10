// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('conFusion', ['ionic', 'ngCordova', 'conFusion.controllers',
    'conFusion.services'
])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaSplashscreen, $timeout) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        /** for timeout func (with the help of $cordovaSplashscreen and ngCordova)
         *used for controlling the splashscreen by hiding it after 2 sec
         *you can let the config.xml controll it (the default) by removing
         *this line  <preference name="AutoHideSplashScreen" value="false" /> from there
         **/
        $timeout(function() {
            $cordovaSplashscreen.hide();
        }, 2000);

    });

    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> Loading ...'
        });
    });

    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeStart', function() {
        console.log('Loading ...');
        $rootScope.$broadcast('loading:show');
    });

    $rootScope.$on('$stateChangeSuccess', function() {
        console.log('done');
        $rootScope.$broadcast('loading:hide');
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/sidebar.html',
        controller: 'AppCtrl'
    })

    .state('app.home', {
        url: '/home',
        views: {
            'mainContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeController'
            }
        }
    })

    .state('app.aboutus', {
        url: '/aboutus',
        views: {
            'mainContent': {
                templateUrl: 'templates/aboutus.html',
                controller: 'AboutController'
            }
        }
    })

    .state('app.contactus', {
        url: '/contactus',
        views: {
            'mainContent': {
                templateUrl: 'templates/contactus.html'
            }
        }
    })

    .state('app.menu', {
        url: '/menu',
        views: {
            'mainContent': {
                templateUrl: 'templates/menu.html',
                controller: 'MenuController'                
            }
        }
    })

    .state('app.favorites', {
        cache: false,
        url: '/favorites',
        views: {
            'mainContent': {
                templateUrl: 'templates/favorites.html',
                controller: 'FavoritesController'
            }
        }
    })

    .state('app.dishdetails', {
        url: '/menu/:id',
        views: {
            'mainContent': {
                templateUrl: 'templates/dishdetail.html',
                controller: 'DishDetailController'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});