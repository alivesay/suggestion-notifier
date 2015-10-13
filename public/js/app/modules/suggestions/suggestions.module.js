(function(){
  'use strict';

  angular.module('app.suggestions', [
    'ngResource',
    'ngAnimate',
    'ui.router',
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.autoResize',
    'ui.grid.resizeColumns',
    'ngDialog',
    'app.config',
    'app.shared',
    'app.console',
    'app.notifier',
    'ui.on-long-press'
  ]);

})();
