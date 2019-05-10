import Ember from 'ember';

const AppView = Ember.Component.extend({
  classNames: ['my-app'],
});

export function initialize( appInstance ) {
  console.log('__C_C', appInstance)
  appInstance.register('view:toplevel', AppView);
}

export default {
  name: 'app-view',
  initialize
};