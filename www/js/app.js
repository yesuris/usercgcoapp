angular.module('ciudadgourmetco', ['ionic', 'ciudadgourmetco.controllers', 'ionic-timepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function ($stateProvider, $urlRouterProvider) {
  
    $stateProvider
	
	.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu_login.html',
    controller: 'LoginCtrl'
  })
	
	.state('app.restaurante', {
      url: '/restaurante',
      views: {
        'menuContent': {
          templateUrl: 'templates/restaurante.html',
          controller: 'RestauranteCtrl'
        }
      }
    })
	
	.state('app.crear_cuenta', {
    url: '/crear_cuenta',
    views: {
      'menuContent': {
        templateUrl:'templates/crear_cuenta.html',
        controller: 'RegistrarclienteCtrl'
      }
    }
  })
    
	
	.state('app.reservar_mesas', {
      url: '/reservar_mesas',
      views: {
        'menuContent': {
          templateUrl: 'templates/reservar_mesas.html',
          controller: 'ReservasCtrl'
        }
      }
    })
	
	.state('app.menu', {
      url: '/menu',
      views: {
        'menuContent': {
          templateUrl: 'templates/mostrar_menu.html',
          controller: 'ReservasCtrl'
        }
      }
    })
	
	
	.state('app.descrip_restaurante', {
      url: '/descrip_restaurante',
      views: {
        'menuContent': {
          templateUrl: 'templates/descrip_restaurante.html',
          controller: 'Descrip_restauranteCtrl'
        }
      }
    });
  
  $urlRouterProvider.otherwise('/app/restaurante');
})

.directive('standardTimeMeridian', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                etime: '=etime'
            },
            template: "<div>{{stime}}</div>",
            link: function (scope, elem, attrs) {

                scope.stime = epochParser(scope.etime, 'time');

                function prependZero(param) {
                    if (String(param).length < 2) {
                        return "0" + String(param);
                    }
                    return param;
                }

                function epochParser(val, opType) {
                    if (val === null) {
                        return "00:00";
                    } else {
                        var meridian = ['AM', 'PM'];

                        if (opType === 'time') {
                            var hours = parseInt(val / 3600);
                            var minutes = (val / 60) % 60;
                            var hoursRes = hours > 12 ? (hours - 12) : hours;

                            var currentMeridian = meridian[parseInt(hours / 12)];

                            return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
                        }
                    }
                }

                scope.$watch('etime', function (newValue, oldValue) {
                    scope.stime = epochParser(scope.etime, 'time');
                });

            }
        };
    });
