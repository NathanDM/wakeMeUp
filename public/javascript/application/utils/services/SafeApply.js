/**
* SafeApply Service 
*
* @module spaceo
* @class SafeApply
*/
WMU.factory('SafeApply', function($rootScope){
  
  return function() {
      var phase = $rootScope.$$phase;
      if (phase != '$apply' && phase != '$digest') {
            $rootScope.$apply();
      }
  }
});

