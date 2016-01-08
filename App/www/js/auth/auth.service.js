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
  angular.module('app.auth.service', [])
    .factory('AuthFactory', AuthFactory);

  AuthFactory.$inject = [];

  function AuthFactory() {
    var token = {
      getToken: getToken,
      setToken: setToken,
      getUser: getUser,
      setUser: setUser,
      getUserId: getUserId,
      setUserId: setUserId
    };
    return token;

    function getUserId(){
      return (window.localStorage.user_id) ? window.localStorage.user_id : null;
    }

    function setUserId(user_id){
      window.localStorage.user_id = user_id;
    }

    function getToken() {
      return (window.localStorage.token) ? window.localStorage.token : null;
    }

    function setToken(token) {
      window.localStorage.token = token;
    }

    function setUser(user) {
      window.localStorage.user = JSON.stringify(user);
    }

    function getUser() {
      return (window.localStorage.user) ?
        JSON.parse(window.localStorage.user) : null;
    }
  }
})();
