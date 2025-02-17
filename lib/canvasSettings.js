/**
 * initialize canvas setting panel
 */
(function () {
  'use strict';
  var canvasSettings = function () {
    const _self = this;
    $(`${this.containerSelector} .main-panel`).append(`<div class="toolpanel" id="background-panel"><div class="content"><p class="title">Canvas Settings</p></div></div>`);

    // set dimension section
    (() => {
      $(`${this.containerSelector} .toolpanel#background-panel .content`).append(`
      <div class="canvas-size-setting">
        <p>Canvas Size</p>
        <div class="input-container">
          <label>Width</label>
          <div class="custom-number-input">
          <button class="decrease">-</button>
          <input type="number" min="100" id="input-width" value="${saveInBrowser.load('canvasSetting')?.width ?? 1920}" />
          <button class="increase">+</button>
          </div>
        </div>
        <div class="input-container">
          <label>Height</label>
          <div class="custom-number-input">
          <button class="decrease">-</button>
          <input type="number" min="100" id="input-height" value="${saveInBrowser.load('canvasSetting')?.height ?? 1080}" />
          <button class="increase">+</button>
          </div>
        </div>
      </div>
    `);

      var setDimension = () => {
        try {
          let width = parseInt($(`${this.containerSelector} .toolpanel#background-panel .content #input-width`).val());
          let height = parseInt($(`${this.containerSelector} .toolpanel#background-panel .content #input-height`).val());
          _self.canvas.setWidth(width)
          _self.canvas.originalW = width
          _self.canvas.setHeight(height)
          _self.canvas.originalH = height
          _self.canvas.renderAll()
          _self.saveSettings()
          _self.canvas.fire('object:modified')
        } catch (_) { }
      }

      $(`${this.containerSelector} .toolpanel#background-panel .content #input-width`).change(setDimension)
      $(`${this.containerSelector} .toolpanel#background-panel .content #input-height`).change(setDimension)
    })();
    // end set dimension section

    // set selection preserve
    (() => {
      $(`${this.containerSelector} .toolpanel#background-panel .content`).append(`
      <div class="input-container">
          <label>Object Stack</label>
          <input id="object-stack" type="checkbox" ${_self?.canvas?.preserveObjectStacking ? 'checked' : ''} />
        </div>
    `);

      var toggleObjectStacking = () => {
        try {
          let objectStack = $(`${this.containerSelector} .toolpanel#background-panel .content #object-stack`).is(":checked");
          _self.canvas.preserveObjectStacking = objectStack
          _self.canvas.renderAll()
        } catch (_) { }
      }

      $(`${this.containerSelector} .toolpanel#background-panel .content #object-stack`).change(toggleObjectStacking)
    })();
    // end set selection preserve

    // background color
    (() => {
      $(`${this.containerSelector} .toolpanel#background-panel .content`).append(`
      <div class="color-settings">
        <div class="tab-container">
          <div class="tabs">
            <div class="tab-label active" data-value="color-fill">Color Fill</div>
            <div class="tab-label" data-value="gradient-fill">Gradient Fill</div>
          </div>
          <div class="tab-content" data-value="color-fill">
            <input id="color-picker" value='black'/><br>
          </div>
          <div class="tab-content" data-value="gradient-fill" style="display: none;">
            <div id="gradient-picker"></div>

            <div class="gradient-orientation-container">
              <div class="input-container">
                <label>Orientation</label>
                <select id="select-orientation">
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
              </div>
              <div id="angle-input-container" class="input-container">
                <label>Angle</label>
                <div class="custom-number-input">
                  <button class="decrease">-</button>
                  <input type="number" min="0" max="360" value="0" id="input-angle">
                  <button class="increase">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)

      $(`${this.containerSelector} .toolpanel#background-panel .content .tab-label`).click(function () {
        $(`${_self.containerSelector} .toolpanel#background-panel .content .tab-label`).removeClass('active');
        $(this).addClass('active');
        let target = $(this).data('value');
        $(this).closest('.tab-container').find('.tab-content').hide();
        $(this).closest('.tab-container').find(`.tab-content[data-value=${target}]`).show();

        if (target === 'color-fill') {
          let color = $(`${_self.containerSelector} .toolpanel#background-panel .content #color-picker`).val();
          try {
            _self.canvas.backgroundColor = color;
            _self.canvas.renderAll();
          } catch (_) {
            console.log("can't update background color")
          }
        } else {
          updateGradientFill();
        }
      })

      // $(`${this.containerSelector} .toolpanel#background-panel .content .tab-label[data-value=color-fill]`).click();

      $(`${this.containerSelector} .toolpanel#background-panel .content #color-picker`).spectrum({
        flat: true,
        // showPalette: false,
        showButtons: false,
        type: "color",
        showInput: "true",
        allowEmpty: "false",
        move: function (color) {
          let hex = 'transparent';
          color && (hex = color.toRgbString()); // #ff0000
          _self.canvas.backgroundColor = hex;
          _self.canvas.renderAll();
        }
      });

      const gp = new Grapick({
        el: `${this.containerSelector} .toolpanel#background-panel .content #gradient-picker`,
        colorEl: '<input id="colorpicker"/>' // I'll use this for the custom color picker
      });

      gp.setColorPicker(handler => {
        const el = handler.getEl().querySelector('#colorpicker');
        $(el).spectrum({
          showPalette: false,
          showButtons: false,
          type: "color",
          showInput: "true",
          allowEmpty: "false",
          color: handler.getColor(),
          showAlpha: true,
          change(color) {
            handler.setColor(color.toRgbString());
          },
          move(color) {
            handler.setColor(color.toRgbString(), 0);
          }
        });
      });

      gp.addHandler(0, 'red');
      gp.addHandler(100, 'blue');

      const updateGradientFill = () => {
        let stops = gp.getHandlers();
        let orientation = $(`${this.containerSelector} .toolpanel#background-panel .content .gradient-orientation-container #select-orientation`).val();
        let angle = parseInt($(`${this.containerSelector} .toolpanel#background-panel .content .gradient-orientation-container #input-angle`).val());

        let gradient = generateFabricGradientFromColorStops(stops, _self.canvas.width, _self.canvas.height, orientation, angle);
        _self.canvas.setBackgroundColor(gradient)
        _self.canvas.renderAll()
      }

      // Do stuff on change of the gradient
      gp.on('change', complete => {
        updateGradientFill();
      })

      $(`${this.containerSelector} .toolpanel#background-panel .content .gradient-orientation-container #select-orientation`).change(function () {
        let type = $(this).val();
        if (type === 'radial') {
          $(this).closest('.gradient-orientation-container').find('#angle-input-container').hide();
        } else {
          $(this).closest('.gradient-orientation-container').find('#angle-input-container').show();
        }
        updateGradientFill();
      })

      $(`${this.containerSelector} .toolpanel#background-panel .content .gradient-orientation-container #input-angle`).change(function () {
        updateGradientFill();
      })
    })();
    // end background color

  }

  window.ImageEditor.prototype.initializeCanvasSettingPanel = canvasSettings;
})()