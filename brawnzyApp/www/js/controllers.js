angular.module('starter.controllers', [])

.controller('WorkoutIdCtrl', function($scope) {

})
.controller('DashCtrl', function($scope, WorkoutApi,store, $http,$httpParamSerializerJQLike) {
    $scope.response = null;

    // WorkoutApi.get(function success(d) {
    //   $scope.response = d;
    // }, function error(d) {
    //   $scope.response = d;
    // });
  $scope.weekday = null;
  $scope.convertDate = function(date){
    return new Date(date).getMonth().toString() + "/"+ new Date(date).getDate().toString() + "/" + new Date(date).getUTCFullYear().toString()
  }
$http({
    method: "POST",
    url: "https://rocky-oasis-8496.herokuapp.com/api/stats",
    headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
    data: $httpParamSerializerJQLike({name: store.get('profile').name})
    }).success(
        function(responseData) {
          $scope.response = responseData;
          console.log(responseData)
          // console.log(new Date(responseData.weekday))
          // $scope.weekday = new Date(responseData.weekday).getUTCDay().toString() + "/" + new Date(responseData.weekday).getUTCFullYear().toString()
          $scope.$broadcast('scroll.refreshComplete');

        }
    );
$scope.doRefresh = function() {
$http({
    method: "POST",
    url: "https://rocky-oasis-8496.herokuapp.com/api/stats",
    headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
    data: $httpParamSerializerJQLike({name: store.get('profile').name})
    }).success(
        function(responseData) {
          $scope.response = responseData;
          $scope.$broadcast('scroll.refreshComplete');

        }
    );
};
  
})

.controller('workoutFormCtrl', function($scope, $state, WorkoutApi, $http, $httpParamSerializerJQLike, store) {

  $scope.formData = { 'set_amount' : 0,
                      'day_index' : 0};
  $scope.formData['personName'] = store.get('profile').name;
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
       && $scope.formData['weekday'] && $scope.formData['weight'] != undefined

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
.controller('MapCtrl', function($scope, $ionicLoading, $http, $httpParamSerializerJQLike) {

  $scope.loadMap = function(){
     if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      }else {
        console.log('Error');
      }
      function showPosition(position) {
        console.log(position)
        $http({
          method: "POST",
          url: 'http://localhost:4040/api/gyms/nearme', 
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
          data: $httpParamSerializerJQLike({lat: position.coords.latitude, lon: position.coords.longitude})
        }).success(
            function(data) {
            console.log(data)
            initMap(data, position.coords);
          }
        );
      };

  // google.maps.event.addDomListener(window, 'load', function() {

    function initMap(markers,coords){
    var myLatLng = {lat:coords.latitude, lng:coords.longitude};

    var mapOptions = {
      center: myLatLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var infoWindow = new google.maps.InfoWindow();

      for(i = 0; i < markers.results.length; i++){
      var latLon = {
        lat: markers.results[i].geometry.location.lat,
        lng: markers.results[i].geometry.location.lng
      };
      var marker = new google.maps.Marker({
         map: map,
         position: latLon,
         title: "title"
        });
      var names = markers.results[i].name == undefined ? "Sorry no name here" : markers.results[i].name;
      var ratings = markers.results[i].rating == undefined ? "No rating Available" :  markers.results[i].rating;
      var hours = markers.results[i].opening_hours == undefined ? "No info Available" : markers.results[i].opening_hours.open_now;

      (function(marker, name, rating, hours) {
        google.maps.event.addListener(marker, "click", function (e) {
          var open = "";
          open = hours ? "We are open now" : "We are closed";
        infoWindow.setContent("<div style = 'width:200px;min-height:40px'>" + name + "<br>" + rating + "<br>" + open + "</div>");
            infoWindow.open(map, marker);
      });
    })(marker, names,ratings, hours);


    navigator.geolocation.getCurrentPosition(function(pos) {
      map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      var myLocation = new google.maps.Marker({
        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        map: map,
        title: 'My Location'
      });
    }); 
    $scope.map = map;
  // });
  }
}};
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
.controller('LoginCtrl', function($scope, auth, $state, store, $http, $httpParamSerializerJQLike) {
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


    $http({
    method: "POST",
    url: "https://rocky-oasis-8496.herokuapp.com/api/users/create",
    headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
    data: $httpParamSerializerJQLike(profile)
    }).success(
        function(responseData) {
          store.set('response',responseData);
          $state.go('tab.home');
        }
    );

    $state.go('tab.dash');
  }, function(error) {
    // Oops something went wrong during login:
    console.log("There was an error logging in", error);
  });
});