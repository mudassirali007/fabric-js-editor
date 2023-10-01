/**
 * Define action to draw line by mouse actions
 */
(function () {
  const clipPath = function (canvas) {
    const _self = this;
    const clipButton = document.querySelector("#addClipPath");
    clipButton.addEventListener("click", async (evt) => {
      const button = evt.target
      if(button.classList.contains('active')) {
        button.innerHTML = 'Add Clipping'
        button.classList.remove('active')
        finalizeActiveClipPath()
      } else if(_self.activeSelection.type === 'image' && !button.classList.contains('active')) {
        _self.activeSelection.id = 'ogImage';
        button.innerHTML = 'Done Clipping';
        button.classList.add('active')
        $(`${_self.containerSelector} #toolbar .main-buttons button#shapes`).click()
      }
    });
    /**
     * Event handler to finalize clipPath selection
     */
    const finalizeActiveClipPath = () => {
      const image = canvas.getItemById('ogImage')
      const clipPath = canvas.getItemById('clipPath')
      if(clipPath) canvas.remove(clipPath)
      const clipBounds = canvas.clipPath.getBoundingRect();
      const dataURL = canvas.toDataURL({
        format: 'png',
        left: clipBounds.left,
        top: clipBounds.top,
        width: clipBounds.width ,
        height: clipBounds.height
      })
      // canvas.clear();
      canvas.clipPath = null;
      fabric.Image.fromURL(dataURL, (clippedImg) => {
        clippedImg.set({
          left: image.left,
          top: image.top,
        })
        canvas.remove(image)
        canvas.add(clippedImg).renderAll();
        canvas.trigger('object:modified')
      });
    };
    /**
     * Event handler to clear clipPath selection
     */
    this.clearActiveClipPath = () => {
      const image = this.canvas.getItemById('ogImage')
      if(image){
        image.id = null
        this.canvas.renderAll()
      }
    };
  }

  window.ImageEditor.prototype.initializeClipPath = clipPath;
})()