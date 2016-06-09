angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaToast,MQTTSocket) {
  $scope.connectionError = false;

  $scope.labels = ["", "", "", "", "", "", "","", "", "", "", "", "", ""];
  $scope.series = ['Temperature'];
  $scope.data = [
    [65, 59, 70, 71, 56, 55, 60,65, 59, 70, 71, 56, 55, 60]
  ];

  $scope.settings = {
    livingRoomLight: true
  };
  $scope.commandLight = function(){

   /* $cordovaToast.showShortTop('Here is a message').then(function(success) {
      // success
    }, function (error) {
      // error
    });*/
    var command="";
    if( $scope.settings.livingRoomLight){
      command ="on";
    }else{
      command="off";
    }
    MQTTSocket.publish('topic/lamp/action',command);
  }

  $scope.login = function(){

      MQTTSocket.connect('xxx','xxx',function(err,connected){

          if(err ){
            if( !$scope.connectionError){
              console.log("Login failed");

              $scope.$apply(function(){
                $scope.connectionError = true;
              });

            }


          }else {
            console.log("**connnected");
            $scope.$apply(function(){
              $scope.connected = true;
              $scope.connectionError = false;
            });

          }

      });
  }
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
});
