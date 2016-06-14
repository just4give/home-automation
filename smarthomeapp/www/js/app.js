// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova','chart.js','angular-svg-round-progressbar','LocalStorageModule'])

  .run(function($ionicPlatform,$rootScope) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }



    });
  })
  .run(function($rootScope,$state,MQTTSocket,localStorageService){
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, rejection) {

      if(rejection === 'not authorized') {
        $state.go('signin');
      }
    });



    if(localStorageService.get('connected')){

      var user = {
        username: localStorageService.get('username'),
        password: localStorageService.get('password')
      }
      MQTTSocket.connect(user.username,user.password,function(err,connected){

        if(err ){
          //console.log("Login failed");
          $state.go('signin');

        }else {
          //console.log("**connnected");
          $state.go('tab.dash');


        }

      });
    }




  })
  .config(function($stateProvider, $urlRouterProvider, roundProgressConfig,ChartJsProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('signin', {
        url: '/sign-in',
        templateUrl: 'templates/page-sign-in.html',
        controller: 'SignInCtrl'
      })
      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller:'TabsCtrl'
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
            ,resolve: {
              auth : function (AuthService, $q) {
                var deferred = $q.defer();

                if(AuthService.isAuthorized()){

                  deferred.resolve(true);
                } else{

                  deferred.reject('not authorized');
                }

                return deferred.promise;

              }
            }
          }
        }
      })

      .state('tab.camera', {
        url: '/camera',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/sign-in');

    //roundProgressConfig

    var authenticated = function (AuthService, $q) {
      var deferred = $q.defer();

      if(AuthService.isAuthorized()){

        deferred.resolve(true);
      } else{

        deferred.reject('not authorized');
      }

      return deferred.promise;

    }

    // Configure all charts
    ChartJsProvider.setOptions({
      colours: ['#28A54C', '#FF8A80'],
      responsive: false
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
      datasetFill: false
    });

  });
