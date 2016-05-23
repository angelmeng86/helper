angular.module('starter.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
// setup an abstract state for the tabs directive
  .state('tab', {
  url: '/tab',
  abstract: true,
  templateUrl: 'templates/tabs.html'
})

// Each tab has its own nav history stack:

.state('tab.work', {
  url: '/work',
  views: {
    'tab-work': {
      templateUrl: 'templates/tab-work.html',
      controller: 'WorkCtrl'
    }
  }
})

.state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'ChatsCtrl'
      }
    }
  })
  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })

.state('tab.account', {
  url: '/account',
  views: {
    'tab-account': {
      templateUrl: 'templates/tab-account.html',
      controller: 'AccountCtrl'
    }
  }
})
.state('login', {
  url: '/login',
  templateUrl: 'templates/login.html',
  controller: 'loginCtrl'
})

.state('signup', {
  url: '/signup',
  templateUrl: 'templates/signup.html',
  controller: 'signupCtrl'
})

$urlRouterProvider.otherwise('/login');

});
