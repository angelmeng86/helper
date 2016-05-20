angular.module('starter.controllers', [])

.controller('WorkCtrl', function($scope, $ionicModal, $cordovaDatePicker, $ionicLoading) {
  $ionicModal.fromTemplateUrl('templates/new-work.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.doRefresh = function() {
    var query = new AV.Query('Overtime');
    query.equalTo('user', 'lwz');
    query.find().then(function(results) {
      $scope.$broadcast('scroll.refreshComplete');
      console.log('Successfully retrieved ' + results.length + ' posts.');
      // 处理返回的结果数据
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        console.log(object.id + ' - ' + object.get('begintime'));
      }
    }, function(error) {
      $scope.$broadcast('scroll.refreshComplete');
      console.log('Error: ' + error.code + ' ' + error.message);
    });
  };

  $scope.newWork = {
      date: null,
      begintime: null,
      endtime: null
  };

  $scope.showModal = function() {
    $scope.newWork['date'] = null;
    $scope.newWork['begintime'] = null;
    $scope.newWork['endtime'] = null;
    $scope.modal.show();
  };

  $scope.test = function() {
    var TestObject = AV.Object.extend('TestObject');
    var testObject = new TestObject();
    testObject.save({
      words: 'Hello World!'
    }, {
      success: function(object) {
        alert('LeanCloud Rocks!');
      }
    });
  };

  $scope.createWork = function(newWork) {
    if($scope.newWork['date'] == null ||
    $scope.newWork['begintime'] == null ||
    $scope.newWork['endtime'] == null) {
      alert('请完成所有填写项');
      return;
    };

    $scope.newWork['begintime'].setFullYear($scope.newWork['date'].getFullYear(),
                                            $scope.newWork['date'].getMonth(),
                                            $scope.newWork['date'].getDate());
    $scope.newWork['endtime'].setFullYear($scope.newWork['date'].getFullYear(),
                                            $scope.newWork['date'].getMonth(),
                                            $scope.newWork['date'].getDate());

    if($scope.newWork['begintime'] > $scope.newWork['endtime']) {
      alert('起始时间和结束时间不正确');
      return;
    }

    $ionicLoading.show({
      template: 'Loading...'
    });
    var ot = new Overtime();
    ot.set('user', 'lwz');
    ot.set('begin', $scope.newWork['begintime']);
    ot.set('end', $scope.newWork['endtime']);
    ot.save().then(function(obj) {
      // 成功保存之后，执行其他逻辑.
      $ionicLoading.hide();
      $scope.modal.hide();
      alert('New object created with objectId: ' + obj.id);
    }, function(err) {
      // 失败之后执行其他逻辑
      // error 是 AV.Error 的实例，包含有错误码和描述信息.
      $ionicLoading.hide();
      alert('Failed to create new object, with error message: ' + err.message);
    });
  };

  $scope.selectDate = function(curDate) {
    var options = {
      date: new Date(),
      mode: 'date'
    };
    $cordovaDatePicker.show(options).then(function(date){
        $scope.newWork[curDate] = date;
    });
  };

  $scope.selectTime = function(curTime) {
    var options = {
      date: new Date(),
      mode: 'time'
    };
    $cordovaDatePicker.show(options).then(function(time){
        $scope.newWork[curTime] = time;
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
