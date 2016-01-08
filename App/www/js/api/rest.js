/**
 * Created by eveR on 11/18/15.
 */
(function () {
  'use strict';
  angular.module('app.api.rest', [
    'app.api.services'
  ]).
  factory('RESTService', RESTService);

  RESTService.$inject = ['ApiService'];

  function RESTService(ApiService) {
    var module = "rest";

    var rest = {
      all: all,
      get: get,
      updated: updated,
      deleted: deleted,
      save: save
    };

    return rest;

    function all(model, action, callback) {
      var Model = ApiService.instance(module, model);
      var query = Model.query({action: action});
      query.$promise.then(function (response) {
        if (typeof callback === "function") {
          callback(response);
        }
      }).catch(function (error) {
        alert(error.data.message);
        return false;
      });
    }

    function get(model, id, callback) {
      var Model = ApiService.instance(module, model);
      var query = Model.query({id: id});
      query.$promise.then(function (response) {
        if (typeof callback === "function") {
          callback(response);
        }
      }).catch(function (error) {
        alert(error.data.message);
        return false;
      });
    }

    function updated(model, $id, $attributes, callback) {
      var Model = ApiService.instance(module, model);
      Model.update({id: $id}, $attributes).$promise.then(function (response) {
        if (typeof callback === "function") {
          callback(response);
        }
      }).catch(function (error) {
        alert(error.data.message);
        return false;
      });
    }

    function deleted(model, $id, callback, fail) {
      var Model = ApiService.instance(module, model);
      Model.delete({id: $id}).$promise.then(function (response) {
        if (typeof callback === "function") {
          callback(response);
        }
      }).catch(function (error) {
        alert(error.data.message);
        return false;
      });
    }

    function save(model, $attributes, callback) {

      var Model = ApiService.instance(module, model);

      Model.save($attributes).$promise.then(function (response) {
        if (typeof callback === "function") {
          callback(response);
        }
      }, function (error) {
        alert(error.data.message);
        return false;
      });
    }
  }

})();
