angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, WorkoutApi) {
    $scope.response = null;

    WorkoutApi.get(function success(d) {
      $scope.response = d;
    }, function error(d) {
      $scope.response = d;
    });
  
})

.controller('workoutFormCtrl', function($scope, $state, WorkoutApi, $http, $httpParamSerializerJQLike) {

  $scope.formData = { 'set_amount' : 0,
                      'day_index' : 0};
  $scope.message = "";
  $scope.data;
  $scope.response = null;

  $scope.range = function(min, max, step) {
        // parameters validation for method overloading
        if (max == undefined) {
            max = min;
            min = 0;
        }
        step = Math.abs(step) || 1;
        if (min > max) {
            step = -step;
        }
        // building the array
        var output = [];
        for (var value=min; value<max; value+=step) {
            output.push(value);
        }
        // returning the generated array
        return output;
    };

  $scope.submit = function(){
     // $state.go('tab.home');
     if( 
       $scope.formData['set_amount'] && $scope.formData['day_index'] != undefined 
       && $scope.formData['weekday'] && $scope.formData['weekly'] != undefined && $scope.formData['weight'] != undefined

      ){
     $scope.message = "sending..."
     $scope.data = $scope.formData;

      $http({
      method: "POST",
      url: "https://rocky-oasis-8496.herokuapp.com/api/workout",
      headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
      data: $httpParamSerializerJQLike($scope.data)
      }).success(
          function(responseData) {
            $scope.response = responseData;
            $state.go('tab.dash');
          }
      );
    } else {
      $scope.message = "Please fill out required forms";
    }
  }
})
.controller('MapCtrl', function($scope, $ionicLoading) {

  google.maps.event.addDomListener(window, 'load', function() {
    var myLatlng = new google.maps.Latlng(37.3000, -120.4833);

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mayTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('Map'), mapOptions);

    navigator.geolocation.getCurrentPosition(function(pos) {
      map.setCenter(new google.maps.Latlng(pos.coords.latitude, pos.coords.longitude));
      var myLocation = new google.maps.Marker({
        position: new google.maps.Latlng(pos.coords.latitude, pos.coords.longitude),
        map: map,
        title: 'My Location'
      });
    }); 
    $scope.map = map;
  });
})
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('LoginCtrl', function($scope, auth, $state, store) {
  auth.signin({
    authParams: {
      // This asks for the refresh token
      // So that the user never has to log in again
      scope: 'openid offline_access',
      // This is the device name
      device: 'Mobile device'
    },
    // Make the widget non closeable
    standalone: true
  }, function(profile, token, accessToken, state, refreshToken) {
          // Login was successful
    // We need to save the information from the login
    store.set('profile', profile);
    store.set('token', token);
    store.set('refreshToken', refreshToken);
    $state.go('tab.dash');
  }, function(error) {
    // Oops something went wrong during login:
    console.log("There was an error logging in", error);
  });
});