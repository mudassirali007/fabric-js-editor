/**
 * The Core of Image Editor
 */
(function () {
  "use strict";
  /**
   * Image Editor class
   * @param {String} containerSelector jquery selector for image editor container
   * @param {Array} buttons define toolbar buttons
   * @param {Array} shapes define shapes
   * @param {Array} icons define icons
   * @param {Array} images define images
   *
   */
  var ImageEditor = function (containerSelector, buttons, icons, shapes, images) {
    this.containerSelector = containerSelector;
    this.containerEl = $(containerSelector);
    this.propsToSave = [
      `width`,
      `height`,
      `preserveObjectStacking`,
      `animationMovements`,
      `animation`,
      `_controlsVisibility`,
      'id',
      'name',
      'lockMovementX',
      'lockMovementY',
      'svgPath',
      'svgPathExt',
      'svgIcon',
      'type',
      "animationMovementData",
      "fileType",
      'objType'
    ];
    this.buttons = buttons;
    this.shapes = shapes;
    this.icons = icons;
    this.images = images;

    this.containerEl.addClass("default-container");

    this.canvas = null;
    this.activeTool = null;
    this.activeSelection = null;

    this.maxDuration = 0;

    /**
     * Get current state of canvas as object
     * @returns {Object}
     */
    this.getCanvasJSON = () => {
      return this.canvas.toJSON();
    };

    /**
     * Set canvas status by object
     * @param {Object} current the object of fabric canvas status
     */
    this.setCanvasJSON = (current) => {
      current &&
        this.canvas.loadFromJSON(
          JSON.parse(current),
          this.canvas.renderAll.bind(this.canvas)
        );
    };


    /**
     * Event handler to set animation selection
     */
    this.setActiveAnimation = () => {

      const selector = document.querySelector("#selectAnimation");
      const delay = document.querySelector("#anim-delay");
      const duration = document.querySelector("#anim-duration");
      const animation = this.activeSelection?.animation;
      try {
        const dataAttribute = animation?.style;
        const optionToSelect = selector.querySelector(`option[data-attribute="${dataAttribute}"]`);
        optionToSelect.selected = true;
        delay.value = animation?.delay ?? 0.5;
        delay.nextSibling.textContent = delay.value.toString();
        duration.value = animation?.duration ?? 2.5;
        duration.nextSibling.textContent = duration.value.toString();
      } catch (_) {
        selector.value = "none";
        delay.value = 0.5;
        delay.nextSibling.textContent = delay.value.toString();
        duration.value = 2.5;
        duration.nextSibling.textContent = duration.value.toString();
      }


    };

    /**
     * Event handler to set active tool
     * @param {String} id tool id
     */
    this.setActiveTool = (id) => {
      this.activeTool = id;
      if (id !== "select" || (id == "select" && this.activeSelection)) {
        $(`${containerSelector} .toolpanel:not(.fabric-layer)`).removeClass("visible");
        $(`${containerSelector} .toolpanel:not(.fabric-layer)`).removeClass("closed");
        $(`${containerSelector} .toolpanel#${id}-panel`).addClass("visible");
        if (id === "select") {
          $(`${containerSelector} .toolpanel#${id}-panel`).attr(
            "class",
            `toolpanel visible type-${this.activeSelection.type}`
          );
        }
      }

      if (id !== "select" && this.activeSelection?.id !== 'ogImage' && this.activeSelection?.type !== 'image') {
        this.canvas.discardActiveObject().requestRenderAll();
        this.activeSelection = null;
      }

      this.canvas.isDrawingLineMode = false;
      this.canvas.isDrawingPathMode = false;
      this.canvas.isDrawingMode = false;
      this.canvas.isDrawingTextMode = false;

      this.canvas.defaultCursor = "default";
      this.canvas.selection = true;
      this.canvas.forEachObject((o) => {
        o.selectable = true;
        o.evented = true;
      });

      switch (id) {
        case "draw":
          this.canvas.isDrawingMode = true;
          break;
        case "line":
          this.canvas.isDrawingLineMode = true;
          this.canvas.defaultCursor = "crosshair";
          this.canvas.selection = false;
          this.canvas.forEachObject((o) => {
            o.selectable = false;
            o.evented = false;
          });
          break;
        case "path":
          this.canvas.isDrawingPathMode = true;
          this.canvas.defaultCursor = "crosshair";
          this.canvas.selection = false;
          this.canvas.forEachObject((o) => {
            o.selectable = false;
            o.evented = false;
          });
          this.updateTip(
            "Tip: click to place points, press and pull for curves! Click outside or press Esc to cancel!"
          );
          break;
        case "textbox":
          // this.canvas.isDrawingTextMode = true;
          // this.canvas.defaultCursor = "crosshair";
          // this.canvas.selection = false;
          // this.canvas.forEachObject((o) => {
          //   o.selectable = false;
          //   o.evented = false;
          // });
          break;
        case "upload":
          this.openDragDropPanel();
          break;
        default:
          this.updateTip(
            "Tip: hold Shift when drawing a line for 15° angle jumps!"
          );
          break;
      }
    };

    /**
     * Event handler when perform undo
     */
    this.undo = () => {
      console.log("undo");
      try {
        let undoList = this.history.getValues().undo;
        if (undoList.length) {
          let current = undoList[undoList.length - 1];
          this.history.undo();
          current &&
            this.canvas.loadFromJSON(
              JSON.parse(current),
              this.canvas.renderAll.bind(this.canvas)
            );
        }
      } catch (_) {
        console.error("undo failed");
      }
    };

    /**
     * Event handler when perform redo
     */
    this.redo = () => {
      console.log("redo");
      try {
        let redoList = this.history.getValues().redo;
        if (redoList.length) {
          let current = redoList[redoList.length - 1];
          this.history.redo();
          current &&
            this.canvas.loadFromJSON(
              JSON.parse(current),
              this.canvas.renderAll.bind(this.canvas)
            );
        }
      } catch (_) {
        console.error("redo failed");
      }
    };

    /**
     * Event handler when select objects on fabric canvas
     * @param {Object} activeSelection fabric js object
     */
    this.setActiveSelection = (activeSelection) => {
      this.activeSelection = activeSelection;
      this.setActiveTool("select");
      this.setActiveAnimation()
    };

    /**
     * Initialize undo/redo stack
     */
    this.configUndoRedoStack = () => {
      this.history = window.UndoRedoStack();
      const ctrZY = (e) => {
        const key = e.which || e.keyCode;

        if (
          e.ctrlKey &&
          document.querySelectorAll("textarea:focus, input:focus").length === 0
        ) {
          if (key === 90) this.undo();
          if (key === 89) this.redo();
        }
        // Adding event for Alt + T
        if (e.altKey && key === 84) {
          console.log("Alt + T pressed");
          $('#template').click()

          // Add the action you want to perform when Shift + T is pressed
        }
      };
      document.addEventListener("keydown", ctrZY);
    };

    /**
     * Initialize zoom events
     */
    this.initializeZoomEvents = () => {
      this.applyZoom = (zoom) => {
        this.canvas.setZoom(zoom);
        this.canvas.setWidth(this.canvas.originalW * this.canvas.getZoom());
        this.canvas.setHeight(this.canvas.originalH * this.canvas.getZoom());
        $(`${this.containerSelector} .toolpanel#background-panel .content #input-width`).val(this.canvas.getWidth())
        $(`${this.containerSelector} .toolpanel#background-panel .content #input-height`).val(this.canvas.getHeight())
        this.saveSettings()
      };

      this.saveSettings = () => {
        saveInBrowser.save("canvasSetting", {
          width: this.canvas.getWidth(),
          height: this.canvas.getHeight(),
          zoom: this.canvas.getZoom(),
        });
      }

      // zoom out/in/reset (ctr + -/+/0)
      const keyZoom = (e) => zoomWithKeys(e, this.canvas, this.applyZoom);
      document.addEventListener("keydown", keyZoom);

      // zoom out/in with mouse
      const mouseZoom = (e) => zoomWithMouse(e, this.canvas, this.applyZoom);
      document.addEventListener("wheel", mouseZoom, {
        passive: false,
      });

    };

    /**
     * Initialize image editor
     */
    this.init = () => {
      this.configUndoRedoStack();

      this.initializeToolbar();
      this.initializeMainPanel();

      this.initializeShapes();
      this.initializeIcons();
      this.initializeImages();
      this.initializeFabricLayer();
      this.initializeMovementsAnimation();

      this.initializeFreeDrawSettings();
      this.initializeSelectionSettings();

      this.canvas = this.initializeCanvas();
      window.main = this;

      this.initializeCanvasSettingPanel();
      this.initializeLineDrawing(this.canvas);
      this.initializeClipPath(this.canvas);
      this.initializePathDrawing(this.canvas);
      // this.initializeTextBoxDrawing(this.canvas);
      this.initializeUpload(this.canvas);
      this.initializeCopyPaste(this.canvas);
      this.initializeAnimation(this.canvas);
      this.initializeTemplate();

      this.initializeTipSection();

      this.initializeZoomEvents();
      this.extendHideShowToolPanel();
      this.extendNumberInput();
    };

    /**
     * Initialize main panel
     */
    this.initializeMainPanel = () => {
      $(`${containerSelector}`).append('<div class="main-panel"></div>');
    };

    /**
     * Add features to hide/show tool panel
     */
    this.extendHideShowToolPanel = () => {
      $(`${this.containerSelector} .toolpanel .content`).each(function () {
        $(this).append(`<div class="hide-show-handler"></div>`);
      });

      $(
        `${this.containerSelector} .toolpanel .content .hide-show-handler`
      ).click(function () {
        let panel = $(this).closest(".toolpanel");
        panel.toggleClass("closed");
      });
    };

    /**
     * Extend custom number input with increase/decrease button
     */
    this.extendNumberInput = () => {
      $(`${containerSelector} .decrease`).click(function () {
        let input = $(this)
          .closest(".custom-number-input")
          .find("input[type=number]");
        let step = input.attr("step");
        if (!step) step = 1;
        else {
          step = parseFloat(step);
        }
        let val = parseFloat(input.val());
        input.val((val - step).toFixed(step.countDecimals()));
        input.change();
        layerPositionChange(this.canvas);
      });
      $(`${containerSelector} .increase`).click(function () {
        let input = $(this)
          .closest(".custom-number-input")
          .find("input[type=number]");
        let step = input.attr("step");
        if (!step) step = 1;
        else {
          step = parseFloat(step);
        }
        let val = parseFloat(input.val());
        input.val((val + step).toFixed(step.countDecimals()));
        input.change();
        layerPositionChange(this.canvas);
      });
    };

    this.init();
  };

  window.ImageEditor = ImageEditor;
})();
