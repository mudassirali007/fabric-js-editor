/**
 * Define action to upload, drag & drop images into canvas
 */
(function () {
  var upload = function (canvas) {
    const _self = this;
    this.openDragDropPanel = function () {
      console.log('open drag drop panel')
      $('body').append(`<div class="custom-modal-container">
        <div class="custom-modal-content">
          <div class="drag-drop-input">
            <div>Drag & drop files<br>or click to browse.<br>JPG, PNG or SVG only!</div>
          </div>
        </div>
      </div>`)
      $('.custom-modal-container').click(function () {
        $(this).remove()
      })

      $('.drag-drop-input').click(function () {
        console.log('click drag drop')
        $(`${_self.containerSelector} #btn-image-upload`).click();
      })

      $(".drag-drop-input").on("dragover", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).addClass('dragging');
      });

      $(".drag-drop-input").on("dragleave", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('dragging');
      });

      $(".drag-drop-input").on("drop", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('dragging');
        if (event.originalEvent.dataTransfer) {
          if (event.originalEvent.dataTransfer.files.length) {
            let files = event.originalEvent.dataTransfer.files
            processFiles(files);
            $('.custom-modal-container').remove();
          }
        }
      });
    }

    const processFiles = (files) => {
      if (files.length === 0) return;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml']

      for (let file of files) {
        // check type
        if (!allowedTypes.includes(file.type)) continue

        let reader = new FileReader()

        // handle svg
        if (file.type === 'image/svg+xml') {
          reader.onload = (f) => {
            fabric.loadSVGFromString(f.target.result, (objects, options) => {
              let obj = fabric.util.groupSVGElements(objects, options)
              obj.set({
                left: (canvas.width - obj.width) / 2,
                top: (canvas.height - obj.height) / 4
              }).setCoords()
              canvas.add(obj)

              canvas.renderAll()
              canvas.trigger('object:modified')
            })
          }
          reader.readAsText(file)
          continue
        }

        // handle image, read file, add to canvas
        reader.onload = (f) => {

          fabric.Image.fromURL(f.target.result, (newImage) => {
            if(_self.activeSelection?.type === 'image'){
              const oldImage = _self.activeSelection; // Assuming there's only one image on the canvas

              // Target dimensions
              let targetWidth = oldImage.width * oldImage.scaleX;
              let targetHeight = oldImage.height * oldImage.scaleY;

             // Determine the scale based on width
              let scaleBasedOnWidth = targetWidth / newImage.width;
              let resultingHeight = newImage.height * scaleBasedOnWidth;

              resultingHeight <= targetHeight ? newImage.scale(scaleBasedOnWidth) : newImage.scale(targetHeight / newImage.height)


              // Set properties for the new image
              newImage.set({
                left: oldImage.left,
                top: oldImage.top,
                angle: oldImage.angle
              });
              // Remove the old image
              canvas.remove(oldImage);
            } else {
              newImage.scaleToHeight(300)
              newImage.scaleToWidth(300)
              newImage.set({
                left: (canvas.width - 300) / 2,
                top: (canvas.height - 300) / 4
              })

            }
            canvas.add(newImage)
            canvas.renderAll()
            canvas.trigger('object:modified')
          })
        }

        reader.readAsDataURL(file)
      }
    }

    this.containerEl.append(`<input id="btn-image-upload" type="file" accept="image/*" multiple hidden>`);
    document.querySelector(`${this.containerSelector} #btn-image-upload`).addEventListener('change', function (e) {
      if (e.target.files.length === 0) return;
      processFiles(e.target.files)
    })
  }

  window.ImageEditor.prototype.initializeUpload = upload;
})()