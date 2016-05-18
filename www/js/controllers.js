angular.module('starter.controllers', [])

.controller('WorkCtrl', function($scope, $ionicModal) {
  $ionicModal.fromTemplateUrl('templates/new-work.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.createWork = function(u) {        
    
    $scope.modal.hide();
  };

  $scope.selectDate = function() {        
    var options = {
            date: new Date(),
            mode: 'date'
        };
    datePicker.show(options, function(date){
        if(date != 'Invalid Date') {
            console.log("Date came" + date);
        } else {
            console.log(date);
        }
    });
  };
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
