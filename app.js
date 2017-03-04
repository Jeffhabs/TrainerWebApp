angular.module("MyFitnessApp", ['ngMaterial'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('grey')
  .accentPalette('red');
});
