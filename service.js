angular.module("MyFitnessApp").service("ClientService", function ($http, $httpParamSerializer) {

  var clientList = [];

  //AJAX: list clients
  var getClients = function () {
    $http({
      method: 'GET',
      url: 'http://localhost:8080/clients'
    }).then(function (response) {
      console.log("success getting clients");
      var clients = response.data;
      //console.log("clients: ", clients);

      clientList.splice(0, clientList.length);
      for (var i = 0; i < clients.length; i++) {
        clientList.push(clients[i]);
      }
    }, function () {
      console.error("Error receiving clients");
    });

    return clientList;
  };

  //AJAX: create client
  var createClient = function (data) {
    $http({
      method: 'POST',
      url: 'http://localhost:8080/clients',
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
  var deleteClient = function () {
    $http({
      method: 'DELETE',
      url: 'http://localhost:8080/clients'
    }).then(function () {
      getClients();
      console.log("succesfully deleted client");
    }, function () {
      console.log("error deleting client");
    });
  };

  return {
    getClients: getClients,
    createClient: createClient,
    deleteClient: deleteClient
  };
});
