angular.module('starter.controllers', [])
  .controller('DashCtrl', DashCtrl)
  .controller('ChatsCtrl', ChatsCtrl)
  .controller('ChatDetailCtrl', ChatDetailCtrl)
  .controller('AccountCtrl', AccountCtrl);

DashCtrl.$inject = ['$scope', '$ionicLoading', 'uiGmapGoogleMapApi', '$timeout', '$cordovaGeolocation', '$ionicModal'];
AccountCtrl.$inject = ['$scope'];
ChatsCtrl.$inject = ['$scope', 'Chats'];
ChatDetailCtrl.$inject = ['$scope', '$stateParams', 'Chats'];

function DashCtrl($scope, $ionicLoading, uiGmapGoogleMapApi, $timeout, $cordovaGeolocation, $ionicModal) {


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
          $scope.marker.options = {
            draggable: true,
            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
            labelAnchor: "100 0",
            labelClass: "marker-labels"
          };
        },
        dblclick: function (marker, eventName, args) {
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();

          //open modal
          $scope.modal.show();

        }
      }
    };

    $ionicModal.fromTemplateUrl('modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal
    });

    //Yelp.search(position).then(function (data) {
    //  console.log(data);
    //  for (var i = 0; i < 10; i++) {
    //    var business = data.data.businesses[i];
    //    $scope.markers.push({
    //      id: i,
    //      name: business.name,
    //      url: business.url,
    //      location: {
    //        latitude: business.location.coordinate.latitude,
    //        longitude: business.location.coordinate.longitude
    //      }
    //    });
    //  }
    //}, function (error) {
    //  console.log("Unable to access yelp");
    //  console.log(error);
    //});
  };

  $ionicLoading.show({
    template: 'Loading...'
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

  // Deal with case where user does not make a selection
  $timeout(function () {
    if (!$scope.map) {
      console.log("No confirmation from user, using fallback");
      initializeMap();
    }
  }, 5000);
}

function ChatsCtrl($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function (chat) {
    Chats.remove(chat);
  };
}

function ChatDetailCtrl($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
}

function AccountCtrl($scope) {
  $scope.settings = {
    enableFriends: true
  };
}
