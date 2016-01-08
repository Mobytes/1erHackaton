// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'starter.controllers',
    'starter.services',
    'ngCordova',
    'uiGmapgoogle-maps'
  ])
  .run(Run)
  .config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyC4ePgGP9SO9bX6LGQMrQpdYYrrA1Lekts',
      //libraries: 'weather,geometry,visualization',
      v: '3.20'
    });
  })
  .config(Config);

Run.$inject = ['$ionicPlatform'];
Config.$inject = ['$stateProvider', '$urlRouterProvider'];

function Run($ionicPlatform) {
  $ionicPlatform.ready(function () {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}

function Config($stateProvider, $urlRouterProvider) {

  $stateProvider

  // setup an abstract state for the tabs directive
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('app.map', {
      url: '/map',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-map.html',
          controller: 'MapCtrl'
        }
      }
    })

    .state('app.sites', {
      url: '/sites',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-sites.html',
          controller: 'SitesCtrl'
        }
      }
    })
    .state('app.site-detail', {
      url: '/site/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/site-detail.html',
          controller: 'SiteDetailCtrl'
        }
      }
    })

    .state('app.config', {
      url: '/config',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-config.html',
          controller: 'ConfigCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/map');
}
