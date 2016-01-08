(function () {
  'use strict';
  angular.module('app.controllers', [])
    .controller('MapCtrl', MapCtrl)
    .controller('SitesCtrl', SitesCtrl)
    .controller('SiteDetailCtrl', SiteDetailCtrl)
    .controller('ConfigCtrl', ConfigCtrl);

  MapCtrl.$inject = ['$scope', '$ionicLoading', 'uiGmapGoogleMapApi', '$timeout',
    '$cordovaGeolocation', '$ionicModal', 'RESTService', '$cordovaCamera', '$cordovaActionSheet'];
  ConfigCtrl.$inject = ['$scope'];
  SitesCtrl.$inject = ['$scope', 'Chats'];
  SiteDetailCtrl.$inject = ['$scope', '$stateParams', 'Chats'];

  function MapCtrl($scope, $ionicLoading, uiGmapGoogleMapApi, $timeout,
                   $cordovaGeolocation, $ionicModal, RESTService, $cordovaCamera, $cordovaActionSheet) {

    RESTService.all('categories', null, function (response) {
      $scope.categories = response.results;
      $scope.categorySelected = response.results[0];
    });

    $scope.refresh = function () {
      console.log('refresh');
    };

    $scope.locate = function () {
      initMap();
    };

    $scope.showModal = function () {
      $scope.modal.show();
    };
    //$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    $scope.markers = [];
    $scope.infoVisible = false;
    $scope.infoBusiness = {};

    // Initialize and show infoWindow for business
    $scope.showInfo = function (marker, eventName, markerModel) {
      $scope.infoBusiness = markerModel;
      $scope.infoVisible = true;
    };

    // Hide infoWindow when 'x' is clicked
    $scope.hideInfo = function () {
      $scope.infoVisible = false;
    };

    $scope.camera = function () {
      action_sheet();
    };

    initMap();

    //region TAKE AND SELECT PHOTO
    function action_sheet() {
      var options = {
        title: 'que quieres hacer?',
        buttonLabels: ['Tomar una foto', 'Escoger una foto'],
        addCancelButtonWithLabel: 'Cancelar',
        androidEnableCancelButton: true,
        winphoneEnableCancelButton: true
      };

      $cordovaActionSheet.show(options)
        .then(function (btnIndex) {
          var index = btnIndex;
          if (index == 1) {
            take_photo();
          } else if (index == 2) {
            find_photo();
          }
        });
    }

    function find_photo() {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        //targetWidth: 100,
        //targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        var image = document.getElementById('picture');
        image.src = "data:image/jpeg;base64," + imageData;
        console.log(image);
      }, function (err) {
        // error
      });
    }

    function take_photo() {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        //targetWidth: 100,
        //targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        var image = document.getElementById('picture');
        image.src = "data:image/jpeg;base64," + imageData;
        console.log(image);
      }, function (err) {
        // error
      });
    }
    //endregion

    //region INIT MAP
    function initMap() {

      $ionicLoading.show({
        template: 'Cargando...'
      });

      uiGmapGoogleMapApi.then(function (maps) {
        // Don't pass timeout parameter here; that is handled by setTimeout below
        var posOptions = {enableHighAccuracy: false};
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
          console.log("Got location: " + JSON.stringify(position));
          $ionicLoading.hide();
          initializeMap(position);
        }, function (error) {
          console.log(error);
          $ionicLoading.hide();
          initializeMap();
        });
      });
    }

    var initializeMap = function (position) {
      if (!position) {
        // Default to downtown Toronto
        position = {
          coords: {
            latitude: 43.6722780,
            longitude: -79.3745125
          }
        };
      }
      // TODO add marker on current location

      $scope.map = {
        center: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        zoom: 16
      };

      // Make info window for marker show up above marker
      $scope.windowOptions = {
        pixelOffset: {
          height: -32,
          width: 0
        }
      };

      $scope.marker = {
        id: 0,
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        options: {draggable: true},
        events: {
          dragend: function (marker, eventName, args) {
            var lat = marker.getPosition().lat();
            var lon = marker.getPosition().lng();
            //$scope.marker.options = {
            //  draggable: true,
            //  labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
            //  labelAnchor: "100 0",
            //  labelClass: "marker-labels"
            //};
          },
          dblclick: function (marker, eventName, args) {
            var lat = marker.getPosition().lat();
            var lon = marker.getPosition().lng();
          }
        }
      };

      $ionicModal.fromTemplateUrl('modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });

      $scope.saveSite = function () {
        console.log('save');
      }
    };

    //endregion

    // Deal with case where user does not make a selection
    $timeout(function () {
      if (!$scope.map) {
        console.log("No confirmation from user, using fallback");
        initializeMap();
      }
    }, 5000);

  }


  function SitesCtrl($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  }

  function SiteDetailCtrl($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  }

  function ConfigCtrl($scope) {
    $scope.settings = {
      enableFriends: true
    };
  }
})();
