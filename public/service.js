angular.module("MyFitnessApp").service("ClientService", function ($http, $httpParamSerializer) {

  //var url = "http://localhost:8080";
  var url = "https://desolate-oasis-69696.herokuapp.com"

  var clientList = [];
  var workoutList = [];
  var trainer;

  //AJAX: list clients
  var getClients = function () {
    $http({
      method: 'GET',
      url: url+'/clients'
    }).then(function (response) {
      console.log("success getting clients");
      var clients = response.data;
      console.log(clients.length);
      clientList.splice(0, clientList.length);
      for (var i = 0; i < clients.length; i++) {
        clientList.push(clients[i]);
      }
      console.log(clientList);
    }, function () {
      console.error("Error receiving clients");
    });
    return clientList;
  };

  var getClient = function(id) {
    $http({
      method: 'GET',
      url: url+'/clients/'+id,
      data: $httpParamSerializer(id),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response) {
      var client = response.data;
      console.log("Success getting client: ", client);
      return client;
    }, function() {
      console.error("Error retrieving client");
    });
  }

  //AJAX: create client
  var createClient = function (data) {
    $http({
      method: 'POST',
      url: url+'/clients',
      data: $httpParamSerializer(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function () {
      getClients();
      console.log("Created client");
    }, function () {
      console.log("Error creating client.");
    });
  };
  //AJAX: delete clients
  //fix with preflight options
  var deleteClient = function (id) {
    $http({
      method: 'DELETE',
      url: url+'/clients/'+id,
      data: $httpParamSerializer(id),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function () {
      getClients();
      console.log("succesfully deleted client");
    }, function () {
      console.log("error deleting client");
    });
  };

  var updateClient = function (id, data) {
    $http({
      method: 'PUT',
      url: url+'/clients/'+id,
      data: $httpParamSerializer(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response) {
      var updatedClient = response.data;
      getClients();
      return updatedClient;
      console.log("Client updated");
    }, function () {
      console.log("error updating client.");
    });
  };

  var getWorkouts = function (id) {
    $http({
      method: 'GET',
      data: $httpParamSerializer(id),
      url: url+'/clients/'+id+'/workouts'
    }).then(function (response) {
      console.log("success getting workouts");
      var workouts = response.data;
      workoutList.splice(0, workoutList.length);
      for (var i = 0; i < workouts.length; i++) {
          workoutList.push(workouts[i]);
      }
      console.log("Service.getWorkouts: ", workoutList);
    }, function () {
      console.log("error retrieving workouts")
    });
    return workoutList;
  };

  var createWorkout = function (id, data) {
    $http({
      method: 'POST',
      url: url+'/clients/'+id+'/workouts',
      data: $httpParamSerializer(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response) {
      getWorkouts(id);
      var workout = response.data;
      console.log("workout created!");
      return workout;
    }, function () {
      console.log("error creating workout")
    });
  };

  var deleteWorkouts = function (id, clientId) {
    $http({
      method: 'DELETE',
      url: url+'/workouts/'+id,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then (function () {
      getWorkouts(clientId);
      console.log("success deleting workouts");
    }, function () {
      console.log("error deleting workouts");
    });
  };

  var registerTrainer = function (data, cb) {
    $http({
      method: 'POST',
      url: url+'/trainers',
      data: $httpParamSerializer(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response) {
      cb(response);
      console.log("Created trainer");
    }, function (response) {
      if(response.status === 422) {
        cb(response)
      }
      console.log("Error creating trainer.");
    });
  };

  var getTrainer = function (cb) {
    $http({
      method: 'GET',
      url: url+'/me',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response) {
       trainer = response.data;
       console.log("Service.getTrainer(): ", trainer);
       cb(trainer);
    }, function () {
      console.log("error retrieving trainer");
    });
  };


  var loginTrainer = function (data, cb) {
    $http({
      method: 'POST',
      url: url+'/sessions',
      data: $httpParamSerializer(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response) {
      toSend = response.data
      cb(toSend);
    }, function () {
      cb(null);
      console.log("Error logging in trainer.");
    });
  };

  var logoutTrainer = function (cb) {
    $http({
      method: 'GET',
      url: url+'/logout',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then( function (response) {
      console.log("success logging out trainer.");
      cb(response);
    }, function () {
      console.log("error logging out trainer.");
    });
  };

  return {
    getClients: getClients,
    createClient: createClient,
    deleteClient: deleteClient,
    getClient: getClient,
    updateClient: updateClient,
    getWorkouts: getWorkouts,
    createWorkout: createWorkout,
    deleteWorkouts: deleteWorkouts,
    registerTrainer: registerTrainer,
    loginTrainer: loginTrainer,
    getTrainer: getTrainer,
    logoutTrainer: logoutTrainer
  };
});
