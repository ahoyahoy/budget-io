import Ember from 'ember'

const {
    Mixin,
} = Ember

export default Mixin.create({
  actions: {
    loading(transition, originRoute) {
      $('body').addClass('currentlyLoading')
      transition.promise.finally(() => {
        $('body').removeClass('currentlyLoading')
      })
    }
  }
})
