(function () {
    'use strict';
    angular.module('app.api.services', ['ngResource'])
        .factory('ApiService', ApiService);

    ApiService.$inject = ['$resource', 'URL', 'AuthFactory'];

    function ApiService($resource, URL, AuthFactory) {

        var service = {
            instance: instance
        };

        return service;

        function instance(module, model) {

            var url = URL.ROOT+'/api/v1/' + model + '/:id/?:action';

            return $resource(url, {id: '@id', action: ''},
                {
                    'query': {method: 'GET', isArray: false},
                    'get': {method: 'GET'},
                    'update': {method: 'PUT'},
                    'save': {method: 'POST'},
                    'remove': {method: 'DELETE'},
                    'delete': {method: 'DELETE'}
                });
        }
    }

})();
