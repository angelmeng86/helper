angular.module('starter.controllers', [])

.controller('WorkCtrl', function($scope, $ionicModal, $cordovaDatePicker) {
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
      mode: 'date', // or 'time'
      minDate: new Date() - 10000,
      allowOldDates: true,
      allowFutureDates: false,
      doneButtonLabel: 'DONE',
      doneButtonColor: '#F2F3F4',
      cancelButtonLabel: 'CANCEL',
      cancelButtonColor: '#000000'
    };    
    $cordovaDatePicker.show(options).then(function(date){
        alert(date);
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
