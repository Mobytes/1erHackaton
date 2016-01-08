/*
 *
 *  * Copyright (C) 2016 eveR Vásquez.
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *      http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */
(function () {
  'use strict';
  angular.module('app.auth.controllers', [])
    .controller('RegisterCtrl', RegisterCtrl)
    .controller('LoginCtrl', LoginCtrl);

  RegisterCtrl.$inject = ['$scope', '$state', 'RESTService', '$cordovaToast'];
  LoginCtrl.$inject = ['$scope', '$state', 'RESTService', 'AuthFactory', '$ionicLoading'];

  function RegisterCtrl($scope, $state, RESTService, $cordovaToast) {
    $scope.user = {};

    $scope.logo = "img/icon_digitalizame.png";

    $scope.register = function () {
      RESTService.save('accounts', $scope.user, function (response) {
        $cordovaToast
          .show('Ahora ingrese por favor', 'long', 'center')
          .then(function (success) {
            $scope.user = {};
            $state.go('login');
          });

      });
    }
  }

  function LoginCtrl($scope, $state, RESTService, AuthFactory, $ionicLoading) {
    $scope.user = {};

    $scope.logo = "img/icon_digitalizame.png";

    $scope.login = function () {
      $ionicLoading.show({
        template: 'Iniciando sesion...'
      });

      RESTService.save('login', $scope.user, function (response) {
        AuthFactory.setToken(response.token);
        AuthFactory.setUser(response.username);
        AuthFactory.setUserId(response.id);
        $ionicLoading.hide();
        $state.go('app.map')
      });
    }
  }
})();
