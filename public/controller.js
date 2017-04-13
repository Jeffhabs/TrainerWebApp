angular.module("MyFitnessApp").controller("MainController", function ($scope, ClientService, $mdDialog) {
var imagePath = "avatar-1.png"

/* REGISTER/LOGIN PAGE */
$scope.loginSelected = false;
// Using ng-show/hide with trainer
//$scope.trainer;
ClientService.getTrainer(function (trainer) {
  if(trainer) {
    $scope.trainer = trainer
  }
});

$scope.showLoginPage = function () {
  $scope.loginSelected = true;
};

$scope.login = function (ev) {
  var isValid = $scope.registerLoginForm.$valid;
  if (isValid) {
    ClientService.loginTrainer({
      email: $scope.email,
      password: $scope.password
    }, function (trainer) {
        if (trainer != null) {
          $scope.trainer = trainer;
          console.log("login call back trainer ", $scope.trainer);
        } else {
          $mdDialog.show(
            $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('Error invalid email/password')
            .textContent('Sorry, the email/password was incorrect.')
            .ariaLabel('Invalid Form Alert')
            .ok('Got it!')
            .targetEvent(ev)
          );
        }
    });
  } else {
    $mdDialog.show(
      $mdDialog.alert()
      .clickOutsideToClose(true)
      .title('Error invalid form')
      .textContent('Please fill in all required form fields.')
      .ariaLabel('Invalid Form Alert')
      .ok('Got it!')
      .targetEvent(ev)
    );
    console.log("error invalid registration form");
  }
  console.log("logging in trainer");
};

$scope.showRegisterPage = function () {
  $scope.loginSelected = false;
};

$scope.register = function (ev) {
  console.log("registering trainer");
  var isValid = $scope.registerLoginForm.$valid;
  if (isValid) {
    ClientService.registerTrainer({
      firstname: $scope.firstname,
      lastname: $scope.lastname,
      email: $scope.email,
      password: $scope.password
    });
  } else {
    $mdDialog.show(
      $mdDialog.alert()
      .clickOutsideToClose(true)
      .title('Error invalid form')
      .textContent('Please fill in all required form fields.')
      .ariaLabel('Invalid Form Alert')
      .ok('Got it!')
      .targetEvent(ev)
    );
    console.log("error invalid registration form");
  }
};

/* MAIN PAGE */
$scope.clients;
ClientService.getClients(function (clients) {
  if (clients) {
    $scope.clients = clients
  }
});

$scope.clientID;
$scope.clickedClient;
$scope.workouts;

// bio page
$scope.navBtnIsBio = false;
// workouts page
$scope.navBtnIsWorkouts = false;

  $scope.goto = function (page) {
    if ( page == 'workouts') {
      $scope.navBtnIsBio = false;
      $scope.navBtnIsWorkouts = true;
    } else {
      $scope.navBtnIsBio = true;
      $scope.navBtnIsWorkouts = false;
    }
  }

  $scope.showAdd = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      template: '<md-dialog> <md-content class="md-padding"> <form name="clientForm"> <div layout layout-sm="column"> <md-input-container flex> <label>First Name</label> <input ng-model="firstname" required> </md-input-container> <md-input-container flex> <label>Last Name</label> <input ng-model="lastname" required> </md-input-container> </div> <md-input-container flex> <label>Email</label> <input ng-model="email" required> </md-input-container> <md-input-container flex> <label>Phone</label> <input ng-model="phonenumber" required> </md-input-container> <md-input-container flex> <label>Age</label> <input ng-model="age" required> </md-input-container> <div layout layout-sm="column"> <md-input-container flex> <label>Weight</label> <input ng-model="weight" required> </md-input-container> <md-input-container flex> <label>Body Fat %</label> <input ng-model="bodyfat" required> </md-input-container></div> <div layout layout-sm="column"> <md-input-container flex> <label>Address</label> <input ng-model="address"> </md-input-container></div> <div layout layout-sm="column"> <md-input-container flex> <label>City</label> <input ng-model="city"> </md-input-container> <md-input-container flex> <label>State</label> <input ng-model="state"> </md-input-container> <md-input-container flex> <label>Postal Code</label> <input ng-model="postalCode"> </md-input-container> </div> <md-input-container flex> <label>Summary</label> <textarea ng-model="summary" columns="1" md-maxlength="500" required></textarea> </md-input-container> </form> </md-content> <div class="md-dialog-actions" layout="row"> <span flex></span> <md-button ng-click="hide()"> Cancel </md-button> <md-button class="md-raised md-accent" ng-disabled="clientForm.$invalid" ng-click="addClient()">Add Client</md-button> </div></md-dialog>',
      targetEvent: ev,
    });
  };

  $scope.showEdit = function(ev) {
    $mdDialog.show({
      locals: { parent: $scope},
      controller: EditDialogController,
      controllerAs: 'ctrl',
      bindToController: true,
      template: '<md-dialog> <md-content class="md-padding"> <form name="editForm"> <div layout layout-sm="column"> <md-input-container flex> <label>First Name</label> <input  ng-model="ctrl.parent.clickedClient.firstname" required> </md-input-container> <md-input-container flex> <label>Last Name</label> <input ng-model="ctrl.parent.clickedClient.lastname" required> </md-input-container> </div> <md-input-container flex> <label>Email</label> <input ng-model="ctrl.parent.clickedClient.email" required> </md-input-container> <md-input-container flex> <label>Phone</label> <input ng-model="ctrl.parent.clickedClient.phonenumber" required> </md-input-container> <md-input-container flex> <label>Age</label> <input  ng-model="ctrl.parent.clickedClient.age" required> </md-input-container> <div layout layout-sm="column"> <md-input-container flex> <label>Weight</label> <input ng-model="ctrl.parent.clickedClient.weight" required> </md-input-container> <md-input-container flex> <label>Body Fat %</label> <input ng-model="ctrl.parent.clickedClient.bodyfat" required> </md-input-container></div> <div layout layout-sm="column"> <md-input-container flex> <label>Address</label> <input ng-model="ctrl.parent.clickedClient.address"> </md-input-container></div> <div layout layout-sm="column"> <md-input-container flex> <label>City</label> <input ng-model="ctrl.parent.clickedClient.city"> </md-input-container> <md-input-container flex> <label>State</label> <input ng-model="ctrl.parent.clickedClient.state"> </md-input-container> <md-input-container flex> <label>Postal Code</label> <input ng-model="ctrl.parent.clickedClient.postalCode"> </md-input-container> </div> <md-input-container flex> <label>Summary</label> <textarea ng-model="ctrl.parent.clickedClient.summary" columns="1" md-maxlength="500" required></textarea> </md-input-container> </form> </md-content> <div class="md-dialog-actions" layout="row"> <span flex></span> <md-button ng-click="hide()"> Cancel </md-button> <md-button class="md-raised md-accent" ng-disabled="editForm.$invalid" ng-click="updateClient(ctrl.parent.clickedClient._id, ctrl.parent.clickedClient)">Update Client</md-button> </div></md-dialog>',
      targetEvent: ev,
    });
  };

  $scope.showWorkoutEdit = function(ev) {
    $mdDialog.show({
      locals: { parent: $scope },
      controller: EditWorkoutDialogController,
      controllerAs: 'ctrl',
      bindToController: true,
      template: '<md-dialog> <md-content class="md-padding"> <form name="editWorkoutForm"> <div layout layout-sm="column"> <md-input-container flex> <label>Excersise Name</label> <input  ng-model="title" required> </md-input-container> <md-input-container flex> <label>Sets</label> <input ng-model="sets" required> </md-input-container> </div> <md-input-container flex> <label>Reps</label> <input ng-model="reps" required> </md-input-container> <md-input-container flex> <label>Rest</label> <input ng-model="rest" required> </form> </md-content> <div class="md-dialog-actions" layout="row"> <span flex></span> <md-button ng-click="hide()"> Cancel </md-button> <md-button class="md-raised md-accent" ng-click="addWorkout(ctrl.parent.clickedClient._id)">Add Workout</md-button> </div></md-dialog>',
      targetEvent: ev,
    });
  };

  function EditWorkoutDialogController ($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.addWorkout = function (id) {
      console.log("addWorkout id: ", id);
      var isValid = $scope.editWorkoutForm.$valid;
      if (isValid) {
        ClientService.createWorkout(id, {
          id: id,
          title: $scope.title,
          sets: $scope.sets,
          reps: $scope.reps,
          rest: $scope.rest
        });
        console.log("success adding workout");
        $mdDialog.hide();
      } else {
        console.log("error adding workout");
      }
    }
  }

  function EditDialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.updateClient = function(id, client) {
      var isValid = $scope.editForm.$valid;
      if (isValid) {
        ClientService.updateClient(id, {
          firstname: $scope.ctrl.parent.clickedClient.firstname,
          lastname: $scope.ctrl.parent.clickedClient.lastname,
          email: $scope.ctrl.parent.clickedClient.email,
          age: $scope.ctrl.parent.clickedClient.age,
          weight: $scope.ctrl.parent.clickedClient.weight,
          bodyfat: $scope.ctrl.parent.clickedClient.bodyfat,
          address: $scope.ctrl.parent.clickedClient.address,
          city: $scope.ctrl.parent.clickedClient.city,
          state: $scope.ctrl.parent.clickedClient.state,
          postalCode: $scope.ctrl.parent.clickedClient.postalCode,
          summary: $scope.ctrl.parent.clickedClient.summary,
          phonenumber: $scope.ctrl.parent.clickedClient.phonenumber,
          avatar: imagePath
        });
        console.log("form is valid");
        $mdDialog.hide();
      } else {
        console.log("form is invalid");
      }
    }
  }

  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.addClient = function() {
      var isValid = $scope.clientForm.$valid;
      if (isValid) {
        ClientService.createClient({
          firstname: $scope.firstname,
          lastname: $scope.lastname,
          email: $scope.email,
          age: $scope.age,
          weight: $scope.weight,
          bodyfat: $scope.bodyfat,
          address: $scope.address,
          city: $scope.city,
          state: $scope.state,
          postalCode: $scope.postalCode,
          summary: $scope.summary,
          phonenumber: $scope.phonenumber,
          avatar: imagePath
        })
        console.log("Form is valid");
        ClientService.getClients( function (clients) {
          if(clients) {
            $scope.clients = clients;
          }
        });
        $mdDialog.hide();
      } else {
        console.log("Form is invalid!");
      }
    }
  };

  $scope.clickItem = function (client) {
    console.log("client clicked was", client);
    //console.log("client firstname ", client.firstname);
    $scope.currentNavItem = 'bio';

    // THIS IS FOR CAPTURING A GLOBAL CLIENT OBJECT WHEN CLICKED
    // I USE THIS TO PRE-FILL MY FORM DIALOG (SEE showEdit())
    id = client._id;
    $scope.clientID = id;

    $scope.client = ClientService.getClient(id);
    $scope.workouts = ClientService.getWorkouts(id);
    console.log("workouts.clickItem: ", $scope.workouts)

    $scope.clickedClient = client;

    $scope.navBtnIsBio = true;
    $scope.navBtnIsWorkouts = false;

    //GRAB DATA IN LOCAL VARIABLE FIRST
    firstname = client.firstname;
    lastname = client.lastname;
    summary = client.summary;
    email = client.email;
    age = client.age;
    weight = client.weight;
    bodyfat = client.bodyfat;
    address = client.address;
    state = client.state;
    city = client.city;
    postalCode = client.postalCode;

    //BIND DATA TO BIO CONTENT SCREEN
    $scope.clientFirstName = firstname;
    $scope.clientLastName = lastname;
    $scope.clientSummary = summary;
    $scope.clientEmail = email;
    $scope.clientAge = age;
    $scope.clientWeight = weight;
    $scope.clientBodyfat = bodyfat;
    $scope.clientAddress = address;
    $scope.clientState = state;
    $scope.clientCity = city;
    $scope.clientPostalCode = postalCode;
  };

  $scope.deleteClient = function (ev) {
    // Appending dialog to document.body to cover sidenav in docs app
   var confirm = $mdDialog.confirm()
         .title('Would you like to delete this client?')
         .textContent('Deleting is a permanent action and cannot be undone.')
         .ariaLabel('delete client')
         .targetEvent(ev)
         .ok('Yes, delete client')
         .cancel('Cancel');

   $mdDialog.show(confirm).then(function() {
     console.log("deleting client")
     ClientService.deleteClient($scope.clientID);
     $scope.navBtnIsBio = false;
   }, function() {
     console.log("errror deleting client");
   });
  };

  $scope.deleteWorkouts = function (id) {
    var confirm = $mdDialog.confirm()
    .title('Would you like to delete this workout?')
    .textContent('Deleting is a permanent action and connot be undone.')
    .ariaLabel('delete workout')
    .targetEvent(id)
    .ok('Yes, delete workout')
    .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
      console.log("deleting workouts");
      ClientService.deleteWorkouts(id, $scope.clientID);
    }, function () {
      console.log("error deleting workouts");
    });
  };

  $scope.deleteMe = function () {
    ClientService.deleteClient();
  };
});
