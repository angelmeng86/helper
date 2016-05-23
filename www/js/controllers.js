angular.module('starter.controllers', [])

.controller('WorkCtrl', function($scope, $ionicModal, $cordovaDatePicker, $ionicLoading, $ionicScrollDelegate) {
  $ionicModal.fromTemplateUrl('templates/new-work.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  function calWorkHours(begin, end)
  {
    var diff = end.getTime() - begin.getTime();
    if(diff < 0) {
      return 0;
    }
    var hours = Math.floor(diff / (30 * 60 * 1000)) * 0.5;
    return hours;
  }

  function getQueryMonth(date ,next)
  {
      var d = new Date(date.Format('yyyy-MM-01'));
      if(next) {
        d.setMonth(d.getMonth() + 1);
      }
      return d;
  }

  $scope.curMonth = new Date();
  $scope.totalHours = 'N';

  $scope.doRefresh = function() {
    var query = new AV.Query('Overtime');
    query.equalTo('user', 'lwz');
    query.addDescending('begin');
    query.greaterThanOrEqualTo('begin', getQueryMonth($scope.curMonth, false));
    query.lessThan('begin', getQueryMonth($scope.curMonth, true));
    query.find().then(function(results) {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.otlist = results;
      console.log('Successfully retrieved ' + results.length + ' posts.');
      // 处理返回的结果数据
      $scope.totalHours = 0;
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        if(!isNaN(object.get('hours'))) {
          $scope.totalHours += object.get('hours');
        }
        console.log(object.id + ' - ' + object.get('user'));
      }
    }, function(error) {
      $scope.$broadcast('scroll.refreshComplete');
      console.log('Error: ' + error.code + ' ' + error.message);
    });
  };

  $scope.selectMonth = function() {
    var options = {
      date: new Date(),
      mode: 'date'
    };
    $cordovaDatePicker.show(options).then(function(date){
        $scope.curMonth = date;
        $scope.totalHours = 'N';
        $scope.doRefresh();
    });
  };

  $scope.newWork = {
      date: null,
      begintime: null,
      endtime: null
  };

  $scope.showModal = function() {
    $scope.newWork['date'] = new Date();
    $scope.newWork['begintime'] = new Date();
    $scope.newWork['endtime'] = new Date();

    if($scope.newWork['date'].getDay() == 0 || $scope.newWork['date'].getDay() == 6) {
      $scope.newWork['begintime'].setHours(9, 0, 0);
      $scope.newWork['endtime'].setHours(17, 31, 0);
    }
    else {
        $scope.newWork['begintime'].setHours(17, 30, 0);
        $scope.newWork['endtime'].setHours(20, 31, 0);
    }

    $scope.modal.show();
  };

  $scope.$on('$destroy', function() {
    console.log('Destroy...');
    $scope.modal.remove();
  });

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

  $scope.remove = function remove(ot) {
    ot.destroy().then(function() {
      // 删除成功
      console.log('delete success.');
      $scope.doRefresh();
    }, function(error) {
      // 失败
      console.log('delete err:' + error.message);
    });
  }

  $scope.createWork = function(newWork) {
    // if($scope.newWork['date'] == null ||
    // $scope.newWork['begintime'] == null ||
    // $scope.newWork['endtime'] == null) {
    //   alert('请完成所有填写项');
    //   return;
    // };

    $scope.newWork['begintime'].setFullYear($scope.newWork['date'].getFullYear(),
                                            $scope.newWork['date'].getMonth(),
                                            $scope.newWork['date'].getDate());
    $scope.newWork['endtime'].setFullYear($scope.newWork['date'].getFullYear(),
                                            $scope.newWork['date'].getMonth(),
                                            $scope.newWork['date'].getDate());

    var hours = calWorkHours($scope.newWork['begintime'], $scope.newWork['endtime']);
    if(hours == 0) {
      alert('加班时间不足半小时');
      return;
    }

    $ionicLoading.show({
      template: 'Loading...'
    });
    var ot = new Overtime();
    ot.set('user', 'lwz');
    ot.set('begin', $scope.newWork['begintime']);
    ot.set('end', $scope.newWork['endtime']);
    ot.set('hours', hours);
    ot.save().then(function(obj) {
      // 成功保存之后，执行其他逻辑.
      $ionicLoading.hide();
      $scope.modal.hide();
      console.log('New object created with objectId: ' + obj.id);
      $scope.doRefresh();
    }, function(err) {
      // 失败之后执行其他逻辑
      // error 是 AV.Error 的实例，包含有错误码和描述信息.
      $ionicLoading.hide();
      console.log('Failed to create new object, with error message: ' + err.message);
    });
  };

  $scope.selectDate = function(curDate) {
    var options = {
      date: $scope.newWork[curDate],
      mode: 'date'
    };
    $cordovaDatePicker.show(options).then(function(date){
        $scope.newWork[curDate] = date;
    });
  };

  $scope.selectTime = function(curTime) {
    var options = {
      date: $scope.newWork[curTime],
      mode: 'time'
    };
    $cordovaDatePicker.show(options).then(function(time){
        $scope.newWork[curTime] = time;
    });
  };

  $scope.doRefresh();
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

.controller('AccountCtrl', function($scope, $state) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.logout = function() {
    AV.User.logOut();
    $state.go("login");
    console.log('logout ...');
  }
})
.controller('loginCtrl', function($scope, $ionicLoading, $state) {
  var user = AV.User.current();
  if(user != null) {
    console.log('user:' + user.get('username'));
    $state.go("tab.work");
  }

  $scope.login = function(username, password) {
      $ionicLoading.show({
        template: 'Loading...'
      });
      console.log('username: ' + username + ' password:' + password);
      AV.User.logIn(username, password).then(function() {
        // 成功了，现在可以做其他事情了
        $ionicLoading.hide();
        $state.go("tab.work");
      }, function(err) {
        // 失败了
        $ionicLoading.hide();
        alert(err.message);
        console.log('Failed to login, err: ' + err.message);
      });
  }
})

.controller('signupCtrl', function($scope, $ionicLoading) {
  $scope.isShow = false;

  $scope.signup = function(username, email, password, password2) {

    if(password != password2) {
      $scope.isShow = true;
      console.log('password notequal');
      return;
    }
    $scope.isShow = false;

    $ionicLoading.show({
      template: 'Loading...'
    });
    var user = new AV.User();
    user.set('username', username);
    user.set('password', password);
    user.set('email', email);

    user.signUp().then(function(user) {
      // 注册成功，可以使用了
      $ionicLoading.hide();
      console.log('sign success');
      $ionicHistory.goBack();
    }, function(error) {
      // 失败了
      $ionicLoading.hide();
      console.log('signUp Error: ' + error.code + ' ' + error.message);
    });
  }
});
