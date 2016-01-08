(function () {
  'use strict';

  angular.module('app', [
      'ionic',
      'app.api.constants',
      'app.api.services',
      'app.api.rest',
      'app.controllers',
      'app.services',
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
})();
