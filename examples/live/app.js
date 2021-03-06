'use strict';

angular.module('app', [
  'pouchdb'
])
  .controller('ExampleCtrl', function($log, $scope, pouchDB) {
    var db = pouchDB('example');

    $scope.remote = 'local-test';

    function updateStatus(response) {
      $log.info(response.$event, response);
      $scope.status = JSON.stringify(response);
    }

    $scope.post = function() {
      db.post({
        date: new Date().toJSON()
      });
    };

    var replicate;
    $scope.start = function() {
      var opts = {
        live: true
      };

      replicate = db.replicate.to($scope.remote, opts);
      replicate.$promise
        .then(null, null, updateStatus)
        .then(updateStatus)
        .catch(updateStatus);
    };

    $scope.stop = function() {
      replicate.cancel();
    };

  });
