angular.module("MyFitnessApp", ['ngMaterial'])
.config(function($mdThemingProvider, $mdIconProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('grey')
  .accentPalette('red');

  $mdIconProvider.iconSet('test', 'avatar-1.svg', 23);
});
