angular.module('starter.controllers', [])

.controller('SignInCtrl', function($scope, $state,MQTTSocket,localStorageService) {



  $scope.signIn = function(user){

    MQTTSocket.connect(user.username,user.password,function(err,connected){

      if(err ){
         console.log("Login failed");
         $scope.$apply(function(){
            $scope.error = err.message;
          });

      }else {
        console.log("**connnected");
        $scope.$apply(function(){

          $scope.error = '';
          $state.go('tab.dash');

        });

      }

    });
  }


  //on load check if user was logged in before
  if(localStorageService.get('connected')){
    console.log("user was connected before");
    var user = {
      username: localStorageService.get('username'),
      password: localStorageService.get('password')
    }
    $scope.signIn(user);
  }
})
.controller('DashCtrl', function($scope,$rootScope, $cordovaToast,MQTTSocket) {
  $rootScope.connectionError = false;
  $rootScope.temperature=90;
  $rootScope.labels = [];
  $rootScope.series = ['Temperature'];
  $rootScope.data = [
    []
  ];
  $scope.tempColor = "#00ff00";
  $scope.settings = {
    livingRoomLight: true
  };

  $rootScope.$watch('temperature',function(newValue,oldValue){
      if(newValue > 80){
          $scope.tempColor="#E42112";
      }else if(newValue >40){
          $scope.tempColor="#F7885E";
      }else{
        $scope.tempColor="#0A9DC7";
      }
  })
  $scope.commandLight = function(){

   /* $cordovaToast.showShortTop('Here is a message').then(function(success) {
      // success
    }, function (error) {
      // error
    });*/
    var command="";
    if( $scope.settings.livingRoomLight){
      command ="on1";
    }else{
      command="off1";
    }
    MQTTSocket.publish('topic/lamp/action',command);
  }


})


.controller('TabsCtrl', function($scope, $state, localStorageService) {

    $scope.logout = function(){
      localStorageService.clearAll();
      $state.go('signin');
    }
});
