(function () {
  'use strict';
  angular.module('app.controllers', [])
    .controller('MapCtrl', MapCtrl)
    .controller('SitesCtrl', SitesCtrl)
    .controller('SiteDetailCtrl', SiteDetailCtrl)
    .controller('ConfigCtrl', ConfigCtrl);

  MapCtrl.$inject = ['$scope', '$ionicLoading', 'uiGmapGoogleMapApi', '$timeout', 'AuthFactory', '$cordovaFile',
    '$cordovaGeolocation', '$ionicModal', 'RESTService', '$cordovaCamera', '$cordovaActionSheet', 'UploadFactory'];
  ConfigCtrl.$inject = ['$scope'];
  SitesCtrl.$inject = ['$scope', 'RESTService'];
  SiteDetailCtrl.$inject = ['$scope', '$stateParams', 'Chats'];

  function MapCtrl($scope, $ionicLoading, uiGmapGoogleMapApi, $timeout, AuthFactory, $cordovaFile,
                   $cordovaGeolocation, $ionicModal, RESTService, $cordovaCamera, $cordovaActionSheet, UploadFactory) {


    $scope.sites = {};

    $scope.img_site = "img/icon_digitalizame.png";

    RESTService.all('categories', null, function (response) {
      $scope.categories = response.results;
      $scope.categorySelected = response.results[0];
    });

    refresh();

    $scope.refresh = function () {
      refresh();
    };

    $scope.locate = function () {
      initMap();
    };

    $scope.search = function () {
      var search = "search=" + document.getElementById("text").value;
      refresh(search);
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
      console.log(markerModel);
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

    $scope.location = [];

    function refresh(search) {
      search = search || null;

      $ionicLoading.show({
        template: 'Actualizando...'
      });
      RESTService.all('sites', search, function (response) {
        $scope.sites_location = response.results;
        $ionicLoading.hide();
      });
    }

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

      $cordovaCamera.getPicture(imageData).then(function (imageData) {
        $scope.file_image = fileEntry;

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
        //var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
        //var sourceFileName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.length);
        //$cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, sourceFileName)
        //  .then(function (success) {
        //  $scope.file_image = imageData.file.dataDirectory + sourceFileName;
        //}, function (error) {
        //  console.dir(error);
        //});
        $scope.file_image = imageData;
        var image = document.getElementById('picture');
        image.src = "data:image/jpeg;base64," + imageData;
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
          $ionicLoading.hide();
          initializeMap(position);
        }, function (error) {
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

      $scope.sites.latitude = position.coords.latitude;
      $scope.sites.longitude = position.coords.longitude;

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
            $scope.sites.latitude = lat;
            $scope.sites.longitude = lon;
            //$scope.marker.options = {
            //  draggable: true,
            //  labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
            //  labelAnchor: "100 0",
            //  labelClass: "marker-labels"
            //};
          },
          click: function (marker, eventName, args) {
            $scope.showInfo();

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

        $ionicLoading.show({
          template: 'Guardando...'
        });

        $scope.sites.category = $scope.categorySelected.id;
        $scope.sites.creator_by = AuthFactory.getUserId();
        $scope.sites.picture = $scope.file_image;

        //UploadFactory.uploadImagePost(URL.ROOT+'/api/v1/sites', file_image, $scope.sites, function (response) {
        //  console.log(response)
        //  //success
        //}, function (evt) {
        //  //pre
        //  file_image.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        //}, function (error) {
        //  //error
        //});
        RESTService.save('sites', $scope.sites, function (response) {
          $scope.modal.hide();
          refresh();
        });
      }
    };

    //endregion

    // Deal with case where user does not make a selection
    $timeout(function () {
      if (!$scope.map) {
        console.log("No confirmation from user, using fallback");
        //initializeMap();
      }
    }, 5000);

  }


  function SitesCtrl($scope, RESTService) {

    RESTService.all('sites', null, function (response) {
      $scope.sites = response.results;
    });

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
