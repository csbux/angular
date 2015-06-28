(function(angular) {
  'use strict';

  angular.module('dtsApp', ['ui.bootstrap', 'csbux.directives.dts'])
  .controller('MainCtrl', ['$scope', '$window', '$modal', function($scope, $window, $modal) {

    $scope.tabsSample = [{title:"Tab1",content:"templates/template1.html", order:0}, {title:"Tab2",content:"templates/template2.html",active:true,order:1}, 
    {title:"Tab3",content:"templates/template3.html",order:2}, {title:"Tab4",content:"templates/template4.html",order:3}];
  }]) 

  .controller('TestCtrl', ['$scope', '$window', '$modal', '$log', function($scope, $window, $modal, $log) {
    $scope.testVar = "testVar";

    $scope.doSomethingHere = function() {
		$log.warn("You entered: " + $scope.testVar);
    }
  }])

})(window.angular);