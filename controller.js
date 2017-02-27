angular.module("MyFitnessApp").controller("MainController", function ($scope, ClientService) {
var imagePath = "avatar-1.png"
$scope.clients = ClientService.getClients();

console.log("clients: ",$scope.clients);

  $scope.clickMe = function() {

    ClientService.createClient({
      firstname: "Jeff",
      lastname: "Haberle",
      email: "jeffrey.haberle@gmail.com",
      age: 26,
      weight: "195",
      bodyfat: "16%",
      goal: "-25lbs",
      phonenumber: "801-661-9013",
      address: "340 South 1990 East",
      avatar: imagePath
    });
  };

  $scope.clickItem = function (client) {
    console.log("client clicked was", client);
    client.class = {
      "active": true
    }
  };
  $scope.deleteMe = function () {
    ClientService.deleteClient();
  };
});
