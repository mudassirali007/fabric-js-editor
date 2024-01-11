const l = console.log;

// Initialize animationMovements as an empty object
let animationMovements = {};
let addNewObject = false;

function checkboxToggleCount(canvas) {
    const totalCheckboxes = $(".layer-container .single-layer input[type='checkbox']").length;
    const uncheckedCheckboxes = $(".layer-container .single-layer input[type='checkbox']:not(:checked)").length;

    if (totalCheckboxes === uncheckedCheckboxes) {
        console.log('All checkboxes are unchecked');
        canvas._objects.forEach(obj => {
            // hide all objects
            obj.visible = true;
        });
        canvas.renderAll();
    }
}


function objectTiclet(canvas) {
    $(".layer-container .single-layer").find('.object-toggle-btn').each(function () {
        let objectId = $(this).attr('data-object-id');
        let object = canvas._objects.find(obj => obj.id == objectId);
        if (this.checked) {
            object.visible = true;
        } else {
            object.visible = false;
        }
    });
    canvas.renderAll();
    setTimeout(() => {
        checkboxToggleCount(canvas);
    }, 100);
}


// create Layer html
function createLayerHtml(object, svgIcon, id = "", subGroup = false) {
    isSubGroup = subGroup ? "sub-group" : "";
    isVisible = object.visible ? "" : "checked";
    $html = `<div class="single-layer ${isSubGroup}" data-parent="${id}" data-object-id="${object.id}">
        <div class="d-flex">
          <span class="icon">${svgIcon}</span>
          <p>Layer</p>
        </div>
        <div class="action">
         ${!isSubGroup ? `<input type="checkbox" class="checkbox-round object-toggle-btn" ${isVisible} data-object-id="${object.id}" />` : ""}
            <button class="deleteObj" data-object-id="${object.id}"><?xml version="1.0" encoding="utf-8"?><svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M960 160h-291.2a160 160 0 0 0-313.6 0H64a32 32 0 0 0 0 64h896a32 32 0 0 0 0-64zM512 96a96 96 0 0 1 90.24 64h-180.48A96 96 0 0 1 512 96zM844.16 290.56a32 32 0 0 0-34.88 6.72A32 32 0 0 0 800 320a32 32 0 1 0 64 0 33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-10.56-6.72zM832 416a32 32 0 0 0-32 32v96a32 32 0 0 0 64 0v-96a32 32 0 0 0-32-32zM832 640a32 32 0 0 0-32 32v224a32 32 0 0 1-32 32H256a32 32 0 0 1-32-32V320a32 32 0 0 0-64 0v576a96 96 0 0 0 96 96h512a96 96 0 0 0 96-96v-224a32 32 0 0 0-32-32z" fill="#231815" /><path d="M384 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM544 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM704 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0z" fill="#231815" /></svg></button>
        </div>
      </div>`;
    return $html;
}
// add Layer fn
function addLayer(object, layerUpdate = false) {
    let type = object.type;
    let svgIcon = "";
    if (object.name == "grid") return false;
    // svgPath 
    if (object.svgPath) svgIcon = object.svgPath;
    // Group
    if (type == "group" && object.svgPathExt == "group")
        svgIcon = '<?xml version="1.0" encoding="utf-8"?><svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5777 4.43152L15.5777 3.38197C13.8221 2.46066 12.9443 2 12 2C11.0557 2 10.1779 2.46066 8.42229 3.38197L6.42229 4.43152C4.64855 5.36234 3.6059 5.9095 2.95969 6.64132L12 11.1615L21.0403 6.64132C20.3941 5.9095 19.3515 5.36234 17.5777 4.43152Z" fill="#1C274C"/><path d="M21.7484 7.96435L12.75 12.4635V21.904C13.4679 21.7252 14.2848 21.2965 15.5777 20.618L17.5777 19.5685C19.7294 18.4393 20.8052 17.8748 21.4026 16.8603C22 15.8458 22 14.5833 22 12.0585V11.9415C22 10.0489 22 8.86558 21.7484 7.96435Z" fill="#1C274C"/><path d="M11.25 21.904V12.4635L2.25164 7.96434C2 8.86557 2 10.0489 2 11.9415V12.0585C2 14.5833 2 15.8458 2.5974 16.8603C3.19479 17.8748 4.27063 18.4393 6.42229 19.5685L8.42229 20.618C9.71524 21.2965 10.5321 21.7252 11.25 21.904Z" fill="#1C274C"/></svg>';
    // image
    if (type == "image") svgIcon = `<img src="${object.svgPath}" />`;
    // Drawing
    if (!object.svgPath && type == "path" || type == "line")
        svgIcon = `<?xml version="1.0" encoding="utf-8"?><svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6,7A1,1,0,0,1,7,8v8a1,1,0,0,1-2,0V8A1,1,0,0,1,6,7Zm5.293,1.627L14.919,5H4A1,1,0,0,0,3,6V18a1,1,0,0,0,1,1H20a1,1,0,0,0,1-1V10a1,1,0,0,1,2,0v8a3,3,0,0,1-3,3H4a3,3,0,0,1-3-3V6A3,3,0,0,1,4,3H16.919l1.707-1.707a1.029,1.029,0,0,1,1.414,0L22.707,3.96a1,1,0,0,1,0,1.414l-7.334,7.333a1,1,0,0,1-.707.293H12a1,1,0,0,1-1-1V9.334A1,1,0,0,1,11.293,8.627ZM13,11h1.252l6.334-6.333L19.333,3.414,13,9.748Z"/></svg>`;
    // text
    if (object.type == "textbox")
        svgIcon = '<svg id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M497,90c8.291,0,15-6.709,15-15V15c0-8.291-6.709-15-15-15h-60c-8.291,0-15,6.709-15,15v15H90V15c0-8.401-6.599-15-15-15 H15C6.599,0,0,6.599,0,15v60c0,8.399,6.599,15,15,15h15v332H15c-8.291,0-15,6.709-15,15v60c0,8.291,6.709,15,15,15h60 c8.291,0,15-6.709,15-15v-15h332v15c0,8.399,6.599,15,15,15h60c8.401,0,15-6.601,15-15v-60c0-8.401-6.599-15-15-15h-15V90H497z  M452,422h-15c-8.401,0-15,6.599-15,15v15H90v-15c0-8.291-6.709-15-15-15H60V90h15c8.401,0,15-6.601,15-15V60h332v15 c0,8.291,6.709,15,15,15h15V422z"></path></g></g><g><g><path d="M361,105H151c-8.291,0-15,6.709-15,15v60c0,6.064,3.647,11.543,9.258,13.857c5.625,2.329,12.056,1.04,16.348-3.252 L187.211,165H226v176.459l-27.48,42.221c-3.062,4.6-3.354,10.518-0.747,15.396S205.463,407,211,407h90 c5.537,0,10.62-3.047,13.228-7.925c2.608-4.878,2.314-10.796-0.747-15.396L286,341.459V165h38.789l25.605,25.605 c4.307,4.307,10.781,5.596,16.348,3.252c5.61-2.314,9.258-7.793,9.258-13.857v-60C376,111.709,369.291,105,361,105z"></path></g></g></svg>';
    // Drag and drop
    if (type == "image" && object.svgPathExt == "image") {
        svgIcon = `<img src="${object.svgPath}" />`;
    } else if (type == "path" && object.svgPathExt == "svg") {
        svgIcon = object.svgPath;
    }

    // set properties
    if (!layerUpdate && !object.id) {
        object.set({
            id: Math.floor(Math.random() * 10000000),
        });
        id = object.id;
    }
    id = object.id;

    if (!svgIcon) return false;
    let $html = createLayerHtml(object, svgIcon);
    // sub group
    if (type == "group" && object.svgPathExt == "group") {
        object._objects.forEach((object) => {
            let type = object.type;
            let svgIcon = "";
            // svgPath 
            if (object.svgPath) svgIcon = object.svgPath;
            // Group
            if (type == "group" && object.svgPathExt == "group")
                svgIcon = '<?xml version="1.0" encoding="utf-8"?><svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5777 4.43152L15.5777 3.38197C13.8221 2.46066 12.9443 2 12 2C11.0557 2 10.1779 2.46066 8.42229 3.38197L6.42229 4.43152C4.64855 5.36234 3.6059 5.9095 2.95969 6.64132L12 11.1615L21.0403 6.64132C20.3941 5.9095 19.3515 5.36234 17.5777 4.43152Z" fill="#1C274C"/><path d="M21.7484 7.96435L12.75 12.4635V21.904C13.4679 21.7252 14.2848 21.2965 15.5777 20.618L17.5777 19.5685C19.7294 18.4393 20.8052 17.8748 21.4026 16.8603C22 15.8458 22 14.5833 22 12.0585V11.9415C22 10.0489 22 8.86558 21.7484 7.96435Z" fill="#1C274C"/><path d="M11.25 21.904V12.4635L2.25164 7.96434C2 8.86557 2 10.0489 2 11.9415V12.0585C2 14.5833 2 15.8458 2.5974 16.8603C3.19479 17.8748 4.27063 18.4393 6.42229 19.5685L8.42229 20.618C9.71524 21.2965 10.5321 21.7252 11.25 21.904Z" fill="#1C274C"/></svg>';
            // image
            if (type == "image") svgIcon = `<img src="${object.svgPath}" />`;
            // Drawing
            if (!object.svgPath && type == "path" || type == "line")
                svgIcon = `<?xml version="1.0" encoding="utf-8"?><svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6,7A1,1,0,0,1,7,8v8a1,1,0,0,1-2,0V8A1,1,0,0,1,6,7Zm5.293,1.627L14.919,5H4A1,1,0,0,0,3,6V18a1,1,0,0,0,1,1H20a1,1,0,0,0,1-1V10a1,1,0,0,1,2,0v8a3,3,0,0,1-3,3H4a3,3,0,0,1-3-3V6A3,3,0,0,1,4,3H16.919l1.707-1.707a1.029,1.029,0,0,1,1.414,0L22.707,3.96a1,1,0,0,1,0,1.414l-7.334,7.333a1,1,0,0,1-.707.293H12a1,1,0,0,1-1-1V9.334A1,1,0,0,1,11.293,8.627ZM13,11h1.252l6.334-6.333L19.333,3.414,13,9.748Z"/></svg>`;
            // text
            if (object.type == "textbox")
                svgIcon = '<svg id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M497,90c8.291,0,15-6.709,15-15V15c0-8.291-6.709-15-15-15h-60c-8.291,0-15,6.709-15,15v15H90V15c0-8.401-6.599-15-15-15 H15C6.599,0,0,6.599,0,15v60c0,8.399,6.599,15,15,15h15v332H15c-8.291,0-15,6.709-15,15v60c0,8.291,6.709,15,15,15h60 c8.291,0,15-6.709,15-15v-15h332v15c0,8.399,6.599,15,15,15h60c8.401,0,15-6.601,15-15v-60c0-8.401-6.599-15-15-15h-15V90H497z  M452,422h-15c-8.401,0-15,6.599-15,15v15H90v-15c0-8.291-6.709-15-15-15H60V90h15c8.401,0,15-6.601,15-15V60h332v15 c0,8.291,6.709,15,15,15h15V422z"></path></g></g><g><g><path d="M361,105H151c-8.291,0-15,6.709-15,15v60c0,6.064,3.647,11.543,9.258,13.857c5.625,2.329,12.056,1.04,16.348-3.252 L187.211,165H226v176.459l-27.48,42.221c-3.062,4.6-3.354,10.518-0.747,15.396S205.463,407,211,407h90 c5.537,0,10.62-3.047,13.228-7.925c2.608-4.878,2.314-10.796-0.747-15.396L286,341.459V165h38.789l25.605,25.605 c4.307,4.307,10.781,5.596,16.348,3.252c5.61-2.314,9.258-7.793,9.258-13.857v-60C376,111.709,369.291,105,361,105z"></path></g></g></svg>';
            // Drag and drop
            if (type == "image" && object.svgPathExt == "image") {
                svgIcon = `<img src="${object.svgPath}" />`;
            } else if (type == "path" && object.svgPathExt == "svg") {
                svgIcon = object.svgPath;
            }
            if (!svgIcon)
                svgIcon = `<?xml version="1.0" encoding="utf-8"?><svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6,7A1,1,0,0,1,7,8v8a1,1,0,0,1-2,0V8A1,1,0,0,1,6,7Zm5.293,1.627L14.919,5H4A1,1,0,0,0,3,6V18a1,1,0,0,0,1,1H20a1,1,0,0,0,1-1V10a1,1,0,0,1,2,0v8a3,3,0,0,1-3,3H4a3,3,0,0,1-3-3V6A3,3,0,0,1,4,3H16.919l1.707-1.707a1.029,1.029,0,0,1,1.414,0L22.707,3.96a1,1,0,0,1,0,1.414l-7.334,7.333a1,1,0,0,1-.707.293H12a1,1,0,0,1-1-1V9.334A1,1,0,0,1,11.293,8.627ZM13,11h1.252l6.334-6.333L19.333,3.414,13,9.748Z"/></svg>`;
            // set properties
            object.set({
                id: Math.floor(Math.random() * 10000000),
            });
            let $html = createLayerHtml(object, svgIcon, id, true);
            $(".layer-container").prepend($html);
        });
    }
    $(".layer-container").prepend($html);
}


// layer poisiton change
function layerPositionChange(canvas, layerUpdate = false) {
    setTimeout(() => {
        let objects = canvas._objects;
        let layerContainer = $(`#image-editor-container .toolpanel.fabric-layer .layer-container`);
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

// Function to toggle the grid based on checkbox state
function toggleGrid(canvas, showGrid) {
    if (showGrid) {
        // Hide the grid
        canvas.forEachObject(function (obj) {
            if (obj.grid) {
                canvas.remove(obj);
            }
        });
        // Remove snap to grid
        canvas.off('object:moving');
    } else {
        // Show the grid
        var canvasWidth = 1920;
        var canvasHeight = 1080;
        var gridSpacing = Math.min(canvasWidth, canvasHeight) / 10; // Adjust this value to control grid density

        for (var i = 0; i < canvasWidth; i += gridSpacing) {
            canvas.add(new fabric.Line([i, 0, i, canvasHeight], { stroke: '#333', selectable: false, grid: true, name: "grid" }));
        }
        for (var j = 0; j < canvasHeight; j += gridSpacing) {
            canvas.add(new fabric.Line([0, j, canvasWidth, j], { stroke: '#333', selectable: false, grid: true, name: "grid" }));
        }

        // snap to grid
        canvas.on('object:moving', function (options) {
            options.target.set({
                left: Math.round(options.target.left / gridSpacing) * gridSpacing,
                top: Math.round(options.target.top / gridSpacing) * gridSpacing,
            });
            canvas.renderAll(); // Don't forget to render the canvas to see the changes
        });

    }
    canvas.renderAll();
}



// Object movement animation create html
function objectAnimationMovementHTML(objectId, index, props) {
    let html =
        `<div class="single-movement" data-object-id="${objectId}" data-index="${index}">
    <div class="justify-content-between">
        <b class="heading">${props.title} #${index}</b>
        <button class="delete-duration-btn">
            <?xml version="1.0" encoding="utf-8"?><svg width="20px" height="20px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M960 160h-291.2a160 160 0 0 0-313.6 0H64a32 32 0 0 0 0 64h896a32 32 0 0 0 0-64zM512 96a96 96 0 0 1 90.24 64h-180.48A96 96 0 0 1 512 96zM844.16 290.56a32 32 0 0 0-34.88 6.72A32 32 0 0 0 800 320a32 32 0 1 0 64 0 33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-10.56-6.72zM832 416a32 32 0 0 0-32 32v96a32 32 0 0 0 64 0v-96a32 32 0 0 0-32-32zM832 640a32 32 0 0 0-32 32v224a32 32 0 0 1-32 32H256a32 32 0 0 1-32-32V320a32 32 0 0 0-64 0v576a96 96 0 0 0 96 96h512a96 96 0 0 0 96-96v-224a32 32 0 0 0-32-32z" fill="red" /><path d="M384 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM544 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM704 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0z" fill="red" /></svg>
        </button>
    </div>
    <div class="movement-content mt-3">
        <div class="movement-fields">
            <div class="form-group">
                <label>Title</label>
                <input type="text" name="title" class="form-control" value="${props.title}">
            </div>
            <div class="form-group">
                <label>Delay Start</label>
                <input type="number" name="delay_start" class="form-control" value="${props.delay_start}">
            </div>
            <div class="form-group">
                <label>Delay Complate</label>
                <input type="number" name="delay_complete" class="form-control" value="${props.delay_complete}">
            </div>
            <div class="form-group">
                <label>Duration</label>
                <input type="number" name="duration" class="form-control" value="${props.duration}">
            </div>
            <div class="form-group">
                <label>To X</label>
                <input type="number" name="left" class="form-control" value="${props.left}">
            </div>
            <div class="form-group">
                <label>To Y</label>
                <input type="number" name="top" class="form-control" value="${props.top}">
            </div>
            <div class="form-group">
                <label>Opacity</label>
                <input type="number" name="opacity" step="0.1" min="0" max="1" class="form-control" value="${props.opacity}">
            </div>
            <div class="form-group">
                <label>Rotate</label>
                <input type="number" name="angle" step="1" min="0" max="360" class="form-control" value="${props.angle}">
            </div>
            <div class="form-group">
                <label>To ScaleX</label>
                <input type="number" name="scaleX" step="0.1" min="0.11" max="10" class="form-control" value="${props.scaleX}">
            </div>
            <div class="form-group">
                <label>To ScaleY</label>
                <input type="number" name="scaleY" step="0.1" min="0.1" max="10" class="form-control" value="${props.scaleY}">
            </div>
        </div>
    </div>
</div>`;
    return html;
}


