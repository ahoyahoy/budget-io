/**
 * @module ember-paper
 */
import Ember from 'ember'
import { nextTick, computeTimeout } from 'ember-css-transitions/mixins/transition-mixin'

const { Mixin } = Ember

export default Mixin.create({
  calculateZoomToOrigin(element, originator) {
    let zoomStyle

    if (originator) {
      originator = $(originator).get(0)
      let originBnds = this.copyRect(originator.getBoundingClientRect())
      let dialogRect = this.copyRect(element.getBoundingClientRect())
      let dialogCenterPt = this.centerPointFor(dialogRect)
      let originCenterPt = this.centerPointFor(originBnds)

      zoomStyle = {
        centerX: originCenterPt.x - dialogCenterPt.x,
        centerY: originCenterPt.y - dialogCenterPt.y,
        scaleX: Math.min(0.5, originBnds.width / dialogRect.width),
        scaleY: Math.min(0.5, originBnds.height / dialogRect.height)
      }
    } else {
      zoomStyle = { centerX: 0, centerY: 0, /*scaleX: 0.5, scaleY: 0.5*/ }
    }

    //return `translate3d(${zoomStyle.centerX}px, ${zoomStyle.centerY}px, 0 ) scale(${zoomStyle.scaleX}, ${zoomStyle.scaleY})`
    return `translate3d(${zoomStyle.centerX}px, ${zoomStyle.centerY}px, 0 )`
  },

  calculateZoomToOriginDuration(element, originator) {
    if (originator) {
      originator = $(originator).get(0)
      let originBnds = this.copyRect(originator.getBoundingClientRect())
      let dialogRect = this.copyRect(element.getBoundingClientRect())

      return Math.min(0.1, originBnds.height / dialogRect.height)
    } else {
      return 0
    }
  },


})
