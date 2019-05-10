import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: [ 'type', 'value', 'placeholder', 'data-stripe', 'name' ],
  _sanitizedValue: Ember.computed.oneWay('value'),

  _processNewValue(rawValue) {
    let value = this.sanitizeInput(rawValue);

    if (this._sanitizedValue !== value) {
      this._sanitizedValue = value

      if (this.get('value') !== value) {
        this.attrs.update(value)
      }
    }
  },

  sanitizeInput: function(input) {
    console.log('__timm sanitizeInput', input)
    input = moment.utc(input).unix() + moment().utcOffset()
    return input
  },

  didReceiveAttrs: function() {
    if (!this.attrs.update) {
      throw new Error(`You must provide an \`update\` action to \`{{${this.templateName}}}\`.`);
    }

    this._processNewValue.call(this, this.get('value'));
  },

  dateValue: Ember.computed('value', function () {
    console.log('__tim_ dateValue', this.get('value'))
    return moment.unix(this.get('value')).format('YYYY-MM-DD')
  }),

  actions: {
    changeValue(d) {
      console.log('__tim### changevalue ', d)
      this._processNewValue.call(this, d);
    }
  }
});