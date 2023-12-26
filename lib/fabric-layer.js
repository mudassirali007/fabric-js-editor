/**
 * Define action to add images to canvas
 */
(function () {
    "use strict";

    const fabricLayer = function () {
        const _self = this;

        $(`${this.containerSelector} .main-panel`).append(
            // tab system
            `<div class="toolpanel tab-system-container visible fabric-layer">
                <div class="tabs">
                    <h4 class="tab cp active" data-tab="layers">LAYERS</h4>
                    <h4 class="tab cp" data-tab="movements-animation">Movements</h4>
                </div>
                <div class="content tab-content pt-0 active" data-tab="layers">
                    <hr>
                    <div class="layer-footer">
                        <button class="object-postion-change" data-target="bringForward" title="Bring Forward">
                             <svg t="1650442206559" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1799" width="12" height="12"><path d="M876.2 434.3L536.7 94.9c-6.6-6.6-15.5-10.3-24.7-10.3-9.3 0-18.2 3.7-24.7 10.3L147.8 434.3c-13.7 13.7-13.7 35.8 0 49.5 13.7 13.7 35.8 13.7 49.5 0L477 204.1v700.2c0 19.3 15.7 35 35 35s35-15.7 35-35V204.1l279.7 279.7c6.8 6.8 15.8 10.3 24.7 10.3s17.9-3.4 24.7-10.3c13.7-13.7 13.7-35.8 0.1-49.5z" p-id="1800"></path></svg>
                         </button>
                         <button class="object-postion-change" data-target="sendBackwards" title="Send backwards">
                             <svg t="1650442229022" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1997" width="12" height="12"><path d="M876.2 589.7L536.7 929.1c-6.6 6.6-15.5 10.3-24.7 10.3-9.3 0-18.2-3.7-24.7-10.3L147.8 589.7c-13.7-13.7-13.7-35.8 0-49.5 13.7-13.7 35.8-13.7 49.5 0L477 819.9V119.6c0-19.3 15.7-35 35-35s35 15.7 35 35v700.2l279.7-279.7c6.8-6.8 15.8-10.3 24.7-10.3s17.9 3.4 24.7 10.3c13.7 13.8 13.7 35.9 0.1 49.6z" p-id="1998"></path></svg>                        
                         </button>
                         <button class="object-postion-change" data-target="bringToFront" title="Bring to Front">
                             <svg t="1650442106652" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1839" width="11" height="11"><path d="M548.352 219.648a58.88 58.88 0 0 0-16.896-10.752 51.2 51.2 0 0 0-38.912 0 58.88 58.88 0 0 0-16.896 10.752l-256 256a51.2 51.2 0 0 0 72.704 72.704L460.8 379.392V972.8a51.2 51.2 0 0 0 102.4 0V379.392l168.448 168.96a51.2 51.2 0 0 0 72.704-72.704zM972.8 0H51.2a51.2 51.2 0 0 0 0 102.4h921.6a51.2 51.2 0 0 0 0-102.4z" p-id="1840"></path></svg>                        
                         </button>
                         <button class="object-postion-change" data-target="sendToBack" title="Send to Back">
                            <svg t="1650442146918" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2045" width="11" height="11"><path d="M548.352 804.352a58.88 58.88 0 0 1-16.896 10.752 51.2 51.2 0 0 1-38.912 0 58.88 58.88 0 0 1-16.896-10.752l-256-256a51.2 51.2 0 0 1 72.704-72.704L460.8 644.608V51.2a51.2 51.2 0 0 1 102.4 0v593.408l168.448-168.96a51.2 51.2 0 0 1 72.704 72.704zM972.8 1024H51.2a51.2 51.2 0 0 1 0-102.4h921.6a51.2 51.2 0 0 1 0 102.4z" p-id="2046"></path></svg>                         
                         </button>
                    </div>
                    <div class="layer-container">
                    </div>
                    <div class="hide-show-handler"></div>
                </div>
                <div class="content tab-content pt-0" data-tab="movements-animation">
                    <hr>
                    <h3>Animation steps</h3>
                    <div class="movement-control-btns justify-content-between">
                        <div>
                            <button class="add-object-movement" data-type="default">
                                <?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>plus-circle</title><desc>Created with Sketch Beta.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="#3f51b5" fill-rule="evenodd" sketch:type="MSPage"><g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-466.000000, -1089.000000)" fill="#3f51b5"><path d="M488,1106 L483,1106 L483,1111 C483,1111.55 482.553,1112 482,1112 C481.447,1112 481,1111.55 481,1111 L481,1106 L476,1106 C475.447,1106 475,1105.55 475,1105 C475,1104.45 475.447,1104 476,1104 L481,1104 L481,1099 C481,1098.45 481.447,1098 482,1098 C482.553,1098 483,1098.45 483,1099 L483,1104 L488,1104 C488.553,1104 489,1104.45 489,1105 C489,1105.55 488.553,1106 488,1106 L488,1106 Z M482,1089 C473.163,1089 466,1096.16 466,1105 C466,1113.84 473.163,1121 482,1121 C490.837,1121 498,1113.84 498,1105 C498,1096.16 490.837,1089 482,1089 L482,1089 Z" id="plus-circle" sketch:type="MSShapeGroup"></path></g></g></svg>
                            </button>
                            <button title="Save Movement" class="add-object-movement">
                                <?xml version="1.0" encoding="utf-8"?><svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="7" stroke="#222222"/><circle cx="12" cy="12" r="2" fill="#222222" stroke="#222222"/><path d="M12 5V3" stroke="#222222" stroke-linecap="round"/><path d="M19 12L21 12" stroke="#222222" stroke-linecap="round"/><path d="M12 21L12 19" stroke="#222222" stroke-linecap="round"/><path d="M3 12H5" stroke="#222222" stroke-linecap="round"/></svg>
                            </button>
                        </div>
                        <div>
                            <button class="obj-start-btn" title="Start">
                                <?xml version="1.0" encoding="utf-8"?><svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13 2v12S6.667 11.167 2.334 8C6.667 4.833 13 2 13 2z" fill="gray" overflow="visible" style="marker:none" color="#000000"/></svg>
                            </button>
                            <button class="obj-end-btn" title="End">
                                <?xml version="1.0" encoding="utf-8"?><svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3 2v12s6.333-2.833 10.666-6C9.333 4.833 3 2 3 2z" fill="gray" overflow="visible" style="marker:none" color="#000000"/></svg>                            
                            </button>
                        </div>
                        <div class="play-animation-btns">
                            <button class="play-movement-btn" title="Play">
                                <?xml version="1.0" encoding="utf-8"?><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Media / Play_Circle"><g id="Vector"><path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 15V9L15 12L10 15Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></g></svg>
                                <span>1</span>
                            </button>
                            <button class="all-movement-btn" title="Play All">
                                <?xml version="1.0" encoding="utf-8"?><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Media / Play_Circle"><g id="Vector"><path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 15V9L15 12L10 15Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></g></svg>
                                <span>All</span>
                            </button>
                        </div>
                    </div>
                    <div class="animation-steps-container">
                    </div>
                    <div class="hide-show-handler"></div>
                </div>
            </div>
        `);

        // active layer
        $(document).on('click', ".layer-container .single-layer", function () {
            let objectId = $(this).attr('data-object-id');
            // remove class
            $(this).addClass('active').siblings().removeClass('active');
            // active object
            if ($(this).hasClass("sub-group")) {
                let groupId = $(this).data('parent');
                let group = _self.canvas._objects.find(obj => obj.id == groupId);
                let objectArr = group._objects;
                objectArr.forEach(obj => {
                    l(obj.id)
                    l(objectId)
                    if (obj.id == objectId) {
                        _self.canvas.setActiveObject(obj);
                        _self.canvas.renderAll();
                        // if text then set value in textarea
                        if (obj && obj.type === 'textbox') {
                            let text = obj.text;
                            $(".canvas-text-edit").val(text);
                        }
                    }
                });
                return false;
            }
            let object = _self.canvas._objects.find(obj => obj.id == objectId);
            _self.canvas.setActiveObject(object);
            _self.canvas.renderAll();
            // if text then set value in textarea
            if (object && object.type === 'textbox') {
                let text = object.text;
                $(".canvas-text-edit").val(text);
            }
        });
        // object Postion change
        $(document).on('click', ".object-postion-change", function () {
            let target = $(this).data("target");
            if (!target) return false;
            let $activeLayer = $(`${_self.containerSelector} .toolpanel.fabric-layer .layer-container .single-layer.active`);
            if ($activeLayer.hasClass('sub-group')) return false;
            let activeObj = _self.canvas.getActiveObject();
            if (_self.canvas._objects.length < 1) return false;
            if (!activeObj) return false;
            $(".layer-container").html("");
            switch (target) {
                case "bringForward":
                    activeObj.bringForward();
                    break;
                case "sendBackwards":
                    activeObj.sendBackwards();
                    break;
                case "bringToFront":
                    activeObj.bringToFront();
                    break;
                case "sendToBack":
                    activeObj.sendToBack();
                    break;
            }
            _self.canvas.renderAll();
            // active class
            $(this).addClass('active').siblings().removeClass('active');
            layerPositionChange(_self.canvas);
        });

        // layer poisiton change
        function layerPositionChange(canvas, layerUpdate = false) {
            setTimeout(() => {
                let objects = canvas._objects;
                let layerContainer = $(`${_self.containerSelector} .toolpanel.fabric-layer .layer-container`);
                layerContainer.html('');
                if (objects.length < 1) return false;
                objects.forEach(obj => {
                    addLayer(obj, layerUpdate);
                });
                // active object with layer
                let activeObj = canvas.getActiveObject();
                if (activeObj) {
                    let layer = $(`.layer-container .single-layer[data-object-id="${activeObj.id}"]`);
                    layer.addClass('active').siblings().removeClass('active');
                }
            }, 100);
        }
        // delete object
        $(document).on('click', ".single-layer .deleteObj", function () {
            let objectId = $(this).attr('data-object-id');
            let object = _self.canvas._objects.find(obj => obj.id == objectId);
            _self.canvas.remove(object);
            _self.canvas.renderAll();
            layerPositionChange(_self.canvas, true);
        });
        $(document).on('click', ".object-options #group", function () {
            let activeObj = _self.canvas.getActiveObject();
            if (!activeObj) return false;
            activeObj.set({
                svgPathExt: 'group',
            });
            _self.canvas.renderAll();
            layerPositionChange(_self.canvas);
        });

        // hide object
        $(document).on('change', ".object-toggle-btn", function () {
            // let objectId = $(this).attr('data-object-id');
            // if which child ticket only show other all object hide
            let objects = _self.canvas._objects;
            objects.forEach(obj => {
                // hide all object
                obj.visible = false;
            });
            _self.canvas.renderAll();
            objectTiclet(_self.canvas);
        });
        // when delete key press then layer update
        $(document).on('keydown', function (e) {
            if (e.keyCode == 46) {
                layerPositionChange(_self.canvas, true);
            }
        });
        // Add text 
        $(document).on('click', "#textbox", function () {
            // get final rect coords and replace it with textbox
            let textbox = new fabric.IText("Skriv tekst her...     ", {
                left: _self.canvas.width / 2 - 100,
                top: 200,
                fontSize: 30,
                fontFamily: "'Myriad Pro', sans-serif",
                fill: "white",
                backgroundColor: "black",
                type: "textbox",
                textAlign: "left",
                textBaseline: "top",
            });
            _self.canvas.add(textbox).setActiveObject(textbox);
            _self.canvas.renderAll();
        });
    };

    window.ImageEditor.prototype.initializeFabricLayer = fabricLayer;
})();
