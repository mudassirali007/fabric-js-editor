/**
 * Canvas section management of image editor
 */
(function () {
  'use strict';
  var canvas = function () {
    try {
      $(`${this.containerSelector} .main-panel`).append(`<div class="canvas-holder" id="canvas-holder"><div class="content"><canvas id="c"></canvas></div></div>`);
      const fabricCanvas = new fabric.Canvas('c').setDimensions({
        width: 1920,
        height: 1080,
        preserveObjectStacking: true
      })

      fabricCanvas.originalW = fabricCanvas.width;
      fabricCanvas.originalH = fabricCanvas.height;

      // set up selection style
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerStyle = 'circle';
      fabric.Object.prototype.borderColor = '#C00000';
      fabric.Object.prototype.cornerColor = '#C00000';
      fabric.Object.prototype.cornerStrokeColor = '#FFF';
      fabric.Object.prototype.padding = 0;
      fabric.Canvas.prototype.getItemById = function (name) {
        var object = null,
            objects = this.getObjects();
        for (var i = 0, len = this.size(); i < len; i++) {
          if (objects[i].get("type") == "group") {
            if (objects[i].get("id") && objects[i].get("id") === name) {
              object = objects[i];
              break;
            }
            var wip = i;
            for (var o = 0; o < objects[i]._objects.length; o++) {
              if (
                  objects[wip]._objects[o].id &&
                  objects[wip]._objects[o].id === name
              ) {
                object = objects[wip]._objects[o];
                break;
              }
            }
          } else if (objects[i].id && objects[i].id === name) {
            object = objects[i];
            break;
          }
        }
        return object;
      };

      // retrieve active selection to react state
      fabricCanvas.on('selection:created', (e) => this.setActiveSelection(e.selected[0]))
      fabricCanvas.on('selection:updated', (e) => this.setActiveSelection(e.selected[0]))
      fabricCanvas.on('selection:cleared', (e) => this.setActiveSelection(null))

      fabricCanvas.on('selection:created', function (e) {
        addNewObject = true;
      });


      fabricCanvas.on('object:added', function (event) {
        let addedObject = event.target;
        addLayer(addedObject)
        if (addedObject.type == "textbox") {
          let text = addedObject.text;
          $(".canvas-text-edit").val(text);
        }
      });

      fabricCanvas.on('text:changed', function (event) {
        // object
        let text = event.target.text;
        $(".canvas-text-edit").val(text);
      });
      fabricCanvas.on('mouse:down', (e) => {

        let activeOBj = e.target;
        $(".animation-steps-container").html('');
        // Update movement animation
        if (activeOBj) {
          let activeObjId = activeOBj.id;
          if (activeOBj.animationMovements ) {
            let movements = activeOBj.animationMovements;
            $(".animation-steps-container").empty();
            movements.forEach((movement, index) => {
              let movementHTML = objectAnimationMovementHTML(activeObjId, index, movement);
              $(".animation-steps-container").append(movementHTML);
            });
          } else {
            $(".animation-steps-container").empty();
          }
        }

        // textarea value update
        if (activeOBj && activeOBj.type === 'textbox') {
          let text = activeOBj.text;
          $(".canvas-text-edit").val(text);
        }
      });
      // update
      fabricCanvas.on('selection:updated', (e) => {
        let activeOBj = e.selected[0];
        if (activeOBj) {
          if (activeOBj.objType == 'gif') {
            $(".gif-img-loop-controller").show();
          } else {
            $(".gif-img-loop-controller").hide();
          }
          // active object with layer
          let layer = $(`.layer-container .single-layer[data-object-id="${activeOBj.id}"]`);
          layer.addClass('active').siblings().removeClass('active');


          // properties set
          let lockMovementX = activeOBj.lockMovementX,
            lockMovementY = activeOBj.lockMovementY;
          $(".lockMovementSel").find("option[value='lockMovementX']").attr("selected", lockMovementX);
          $(".lockMovementSel").find("option[value='lockMovementY']").attr("selected", lockMovementY);

          // Update movement animation
          let activeObjId = activeOBj.id;
          if (activeOBj.animationMovements) {
            let movements = activeOBj.animationMovements;
            $(".animation-steps-container").empty();
            movements.forEach((movement, index) => {
              let movementHTML = objectAnimationMovementHTML(activeObjId, index, movement);
              $(".animation-steps-container").append(movementHTML);
            });
          } else {
            $(".animation-steps-container").empty();
          }
        }
      });

      // snap to an angle on rotate if shift key is down
      fabricCanvas.on('object:rotating', (e) => {
        if (e.e.shiftKey) {
          e.target.snapAngle = 15;
        } else {
          e.target.snapAngle = false;
        }
      })

      // Snap Grid
      let grid = 50,
        showGrid = true; // Initially, the grid is shown.

      // Add Grid snap
      $(document).ready(function () {
        $(".anim-container").append(`<div class="snap-grid-container"><span class="label">Snap Grid</span><input type="checkbox" title="Snap Grid" id="showGridCheckbox"></div>`);
        // Initial setup
        toggleGrid(fabricCanvas, true);
      });

      // Checkbox change event
      $(document).on('change', '#showGridCheckbox', function () {
        showGrid = !this.checked;
        toggleGrid(fabricCanvas, showGrid);
      });


      fabricCanvas.on('object:modified', (e) => {
        let currentState = this.canvas.toJSON(this.propsToSave);
        this.history.push(JSON.stringify(currentState));

        if (addNewObject) {
          addNewObject = false;
          $(".layer-container").html("");
          fabricCanvas._objects.forEach((obj, index) => {
            addLayer(obj);
          });
        }
        layerPositionChange(this.canvas);
      })

      const initSize = () => {
        fabricCanvas.setZoom(saveInBrowser.load('canvasSetting')?.zoom ?? 1);
        fabricCanvas.setWidth(saveInBrowser.load('canvasSetting')?.width ?? 1920);
        fabricCanvas.setHeight(saveInBrowser.load('canvasSetting')?.height ?? 1080);
        fabricCanvas.originalW = fabricCanvas.width;
        fabricCanvas.originalH = fabricCanvas.height;
      };

      const savedCanvas = saveInBrowser.load('canvasEditor');
      if (savedCanvas) {
        fabricCanvas.loadFromJSON(savedCanvas, () => {
          initSize()
          fabricCanvas.renderAll()
        });
      } else {
        initSize()
      }

      // move objects with arrow keys
      (() => document.addEventListener('keydown', (e) => {
        const key = e.which || e.keyCode;
        let activeObject;

        if (document.querySelectorAll('textarea:focus, input:focus').length > 0) return;

        if (key === 37 || key === 38 || key === 39 || key === 40) {
          e.preventDefault();
          activeObject = fabricCanvas.getActiveObject();
          if (!activeObject) {
            return;
          }
        }

        if (key === 37) {
          activeObject.left -= 1;
        } else if (key === 39) {
          activeObject.left += 1;
        } else if (key === 38) {
          activeObject.top -= 1;
        } else if (key === 40) {
          activeObject.top += 1;
        }

        if (key === 37 || key === 38 || key === 39 || key === 40) {
          activeObject.setCoords();
          fabricCanvas.renderAll();
          fabricCanvas.fire('object:modified');
        }
      }))();

      // delete object on del key
      (() => {
        document.addEventListener('keydown', (e) => {
          const key = e.which || e.keyCode;
          if (
            key === 46 &&
            document.querySelectorAll('textarea:focus, input:focus').length === 0
          ) {

            fabricCanvas.getActiveObjects().forEach(obj => {
              fabricCanvas.remove(obj);
            });

            fabricCanvas.discardActiveObject().requestRenderAll();
            fabricCanvas.fire('object:modified')
          }
        })
      })();

      setTimeout(() => {
        let currentState = fabricCanvas.toJSON(this.propsToSave);
        this.history.push(JSON.stringify(currentState));

      }, 1000);

      return fabricCanvas;
    } catch (_) {
      console.error("can't create canvas instance");
      return null;
    }

  }
  window.ImageEditor.prototype.initializeCanvas = canvas;
})();