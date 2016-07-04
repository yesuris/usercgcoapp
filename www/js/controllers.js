angular.module('ciudadgourmetco.controllers', [])

.controller('LoginCtrl', function ($scope, $http, $ionicSideMenuDelegate) {
    localStorage.centinela = "false";
    $scope.cliente = {
        correo: "",
        contrasena: ""
    };
    $scope.login = function () {
        console.log($scope.cliente);
        $http({
            method: "POST",
            url: "http://www.ciudadgourmet.co/api-cg/sesion",
            data: $scope.cliente,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function mySucces(response) {
            var respuesta = response.data;
            if (respuesta.cliente) {
                location.href = "#/app/restaurante";
                $ionicSideMenuDelegate.toggleLeft();
                localStorage.id_cliente = respuesta.cliente.id;
                localStorage.correo_cliente = respuesta.cliente.correo;
                localStorage.telefono = respuesta.cliente.telefono;
                localStorage.nombre = respuesta.cliente.nombre;
                localStorage.centinela = "true";
            } else {
                alert("Verifica tus datos.");
            }
        }, function myError(response) {
            console.log(response);
        });
    };
})

.controller('RegistrarclienteCtrl', function ($scope, $http, $ionicPopup, $ionicSideMenuDelegate) {

    $scope.registroCliente = {
        nombre: "",
        correo: "",
        telefono: "",
        contrasena: ""
    };

    $scope.registrarCliente = function () {
        $http({
            method: "POST",
            url: "http://www.ciudadgourmet.co/api-cg/registrosClientes",
            data: $scope.registroCliente,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function mySucces(response) {
            var respuesta = response.data;
            var alertPopup = $ionicPopup.alert({
                title: 'Genial!',
                template: 'Tu registro fue todo un exito, ahora debes iniciar sesion'
            });
            location.href = "#/app/restaurante";
            $ionicSideMenuDelegate.toggleLeft(true);
        }, function myError(response) {
            alert("Eror en el servidor, intente nuevamente.");
        });
    };
})

.controller('ReservasCtrl', function ($scope, $http, $ionicModal, $ionicPopup, $cacheFactory, $ionicSideMenuDelegate) { 
    
    $scope.timePickerObject12Hour = {
        inputEpochTime: (0 * 60 * 60), //Optional
        step: 30, //Optional
        format: 12, //Optional
        closeLabel: 'Cancelar', //Optional
        setLabel: 'Aceptar', //Optional
        setButtonType: 'button-positive', //Optional
        closeButtonType: 'button-stable', //Optional
        callback: function (val) { //Mandatory
            timePicker12Callback(val);
        }
    };
    var toner;
    var strhora;
    var strminuto;
   $scope.nnm = "";
    function timePicker12Callback(val) {
        if (typeof (val) === 'undefined') {
            console.log('Time not selected');
            
            
        } else {
            $scope.timePickerObject12Hour.inputEpochTime = val;
            var selectedTime = new Date(val * 1000);
            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
            var hor = selectedTime.getUTCHours(); // obtengo solo la hora
            var min = selectedTime.getUTCMinutes(); // obtengo solo los minutos
            
            $scope.hhh = hor;
            
            strhora = hor.toString(); // convierto a string la hora obtenida
            strminuto = min.toString(); // convierto a string los mintos obtenidos
            toner = strhora.concat(" : ", strminuto); // concateno la hora con los minutos
            console.log("aca myvariable", toner);
        }
    }
    
    
    
    var platosSeleccionados = [];
    $scope.currentDate = new Date();
    $scope.reserva = { //ng-model en los input
        id_cliente: localStorage.id_cliente,
        id_restaurante: 1,
        fecha: "",
        hora: "",
        numero_personas: "",
        estado: "por confirmar",
        observacion: "",
        correo_restaurante: "ciudadgourmetco@gmail.com",
        telefono: localStorage.telefono,
        nombre: localStorage.nombre,
        correo_cliente: localStorage.correo_cliente,
        platos: []
    };
    
    $scope.checkQuestions=function() {
        $scope.Menssagedecampo = "";
        if (toner == null) {
            return true;
        }
        if ($scope.reserva.fecha == "") {
            return true;
        }
        if (strhora == 12 || strhora == 13 || strhora == 0 || strhora == 1 || strhora == 2 || strhora == 3 || strhora == 4 || strhora == 5 || strhora == 6 || strhora == 7) {
            $scope.Menssagedecampo = "*El horario que escogiste no esta disponible, elige otro.";
            return true;
        }
        if ($scope.reserva.numero_personas == null || $scope.reserva.numero_personas == "") {
            return true;
        } else {
            $scope.Menssagedecampo = "";
            return false;
        }
    }
    
    
    

    $scope.reservar = function () {
        //console.log($scope.cacheReserva.get("algo"));


       /* $scope.mostrarPlatos();
        $scope.reserva.platos = platosSeleccionados;*/
        console.log($scope.reserva.hora);
        $scope.reserva.hora=toner;
        console.log(toner);
        console.log($scope.reserva.hora);

        $http({
            method: "POST",
            url: "http://www.ciudadgourmet.co/api-ncg/reservas",
            data: $scope.reserva,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function mySucces(response) {
            var respuesta = response.data;
            var alertPopup = $ionicPopup.alert({
                title: 'Genial!',
                template: 'Tu reserva ha sido exitosa'
            });
            console.log("esta es la hora ");
            console.log($scope.reserva.hora);
        }, function myError(response) {
            alert("Eror en el servidor, intente nuevamente.");
        })
    };

    var id_restaurante = 1; //fijo por ahora
    //var id_restaurante = localStorage.id_restaurante; //Dinámico
    //Cargar los platos
    //Esta sería la de platos fuertes...
    $scope.listarMenu = function () {
        $http({
            method: "GET",
            url: "http://www.ciudadgourmet.co/api-cg/restaurantes/" + id_restaurante + "/platos"
        }).then(function mySucces(response) {
            var respuesta = response.data;
            $scope.groups = respuesta.result;
        }, function myError(response) {
            alert("Eror en el servidor, intente nuevamente.");
        });
    };

    $scope.mostrarPlatos = function () {
        //console.log($scope.platosBooleanos);
        console.log("Seleccionados: ", platosSeleccionados);
    };

    $scope.agregarPlato = function (plato) {
        //$scope.cacheReserva.put("algo", [1, 2, 3]);
        var indice = platosSeleccionados.indexOf(plato);
        if (indice == -1) {
            //El plato no está agregado. Proceder a agregar.
            var cantidad = platosSeleccionados.push(plato);
            console.log("Agregado ", cantidad);
        } else {
            //El plato ya está agregado... quiere decir que fue deseleccionado y debe eliminarse.
            var eliminado = platosSeleccionados.splice(indice, 1);
            console.log("Eliminado: ", eliminado);
        }
    };

    //Instancia de platos seleccionados
    $scope.platosBooleanos = [];
    //$scope.platosSeleccionados = [];
    $ionicModal.fromTemplateUrl('templates/platos_menu.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    //    var checkpopup = this;
    //    checkpopup.activo = false;


    $scope.showPopup = function (i, j, plato) {
        console.log("Pop");
        //if (checkpopup.activo == true) {
        if ($scope.platosBooleanos[i][j] == true) {
            $scope.data = {};

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="number" ng-model="data.wifi" placeholder="Numero platos">',
                title: 'Numero de platos',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>Pedir</b>',
                        type: 'button-dark',
                        onTap: function (e) {
                            if (!$scope.data.wifi) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.data.wifi;
                            }
                        }
      }
    ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
                if (res) {
                    //Si está definido, tiene valor, es decir, se ingresó una cantidad de platos...
                    plato.cantidad_platos = res;
                    $scope.agregarPlato(plato);
                } else {
                    //Si presionó cancelar...
                    $scope.platosBooleanos[i][j] = false;
                }
            });
        } else {}
    };

    $scope.groups = [];

    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };



})

.controller('RestauranteCtrl', function ($scope, $ionicPopup, $ionicSideMenuDelegate) {
    $scope.centinealalogin = function () {
        if (localStorage.centinela == "true") {

            location.href = "#/app/reservar_mesas";

        } else {

            var alertPopup = $ionicPopup.alert({
                title: 'Importante!',
                template: 'Debes iniciar sesión para poder reservar.'
            });
            alertPopup.then(function (res) {
                location.href = "#/app/restaurante";
                $ionicSideMenuDelegate.toggleLeft(true);
            });


        }
    }
})

.controller('Descrip_restauranteCtrl', function ($scope, $ionicPopup, $ionicSideMenuDelegate) {
    $scope.centinealalogin = function () {
        if (localStorage.centinela == "true") {

            location.href = "#/app/reservar_mesas";

        } else {

            var alertPopup = $ionicPopup.alert({
                title: 'Importante!',
                template: 'Debes iniciar sesión para poder reservar.'
            });
            alertPopup.then(function (res) {
                location.href = "#/app/restaurante";
                $ionicSideMenuDelegate.toggleLeft(true);
            });
        }
    }
})

.controller('RegistroCtrl', function ($scope, $ionicPopup) {


});