import Ember from 'ember'

const {
  Component
} = Ember

export default Component.extend({
  tagName: 'section',
  classNames: 'flex-auto'.w(),

  settings: {},
  
  actions: {
    closeDialog (reason) {
      this.set('showDialog', false)
    },

		dialog () {
			this.set('showDialog', true)
		},

    save () {
      const widget = this.get('widget')
      let settings = this.get('settings')
      settings = JSON.parse(JSON.stringify(settings))
      widget.set('settings', settings)
      widget.save()
      this.send('closeDialog', 'done')
    },

		destroy() {
			this.get('widget').destroyRecord().then(() => {
				this.get('budget').save()
			})
		},
  }
})
