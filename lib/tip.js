/**
 * Define actions to manage tip section
 */
(function () {
  'use strict';

  function tipPanel() {
    const defaultTips = [
      'Tip: Brug arrows for at flytte valgte objekt med 1 pixel!',
      'Tip: Shift + Click for at vælge flere objekter!',
      'Tip: hold Shift for at rotere et objekt med 15° grader!',
      'Tip: Du kan bruge Zoom nederst til højre',
      'Tip: Ctrl +/-, Ctrl + wheel for zoom ind og zoom ud!',
    ]
    const _self = this;
    $(`${this.containerSelector} .canvas-holder .content`).append(`
    <div id="tip-container">${defaultTips[parseInt(Math.random() * defaultTips.length)]}</div>`)
    this.hideTip = function () {
      $(`${_self.containerSelector} .canvas-holder .content #tip-container`).hide();
    }

    this.showTip = function () {
      $(`${_self.containerSelector} .canvas-holder .content #tip-container`).show();
    }

    this.updateTip = function (str) {
      typeof str === 'string' && $(`${_self.containerSelector} .canvas-holder .content #tip-container`).html(str);
    }
  }

  window.ImageEditor.prototype.initializeTipSection = tipPanel;
})();