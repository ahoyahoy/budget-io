import Ember from 'ember'

export default Ember.Route.extend({
  beforeModel: function() {
    return this.get('session').fetch().then(() => {
      const user = this.store.find('user', this.get('session.uid'))
      this.set('session.content.user', user)
    }).catch(function(err) {
      //console.log('app before model', err)
    })
  },
  actions: {
    signIn: function(provider) {
      this.get('session').open('firebase', { provider: provider }).then((data) => {
        const user = data.currentUser
        this.store.find('user', user.uid).then(() => {
          const user = this.store.find('user', user.uid)
          user.setProperties(user).save()
          this.set('session.content.user', user)
        }).catch((err) => {
          const newUser = this.get('store').push({
            data: {
              id: user.uid,
              type: 'user',
              attributes: user
            }
          })
          newUser.save()
          this.set('session.content.user', newUser)
        })
      }).catch(function(err) {
        console.log('app signIn', err)
      })
    },
    signOut: function() {
      this.get('session').close()
    }
  }
})
