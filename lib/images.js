/**
 * Define action to add images to canvas
 */
(function () {
    "use strict";
    const defaultImages = [
        `<img src="editor-images/play-icon.png" width="100" height="" alt="image" />`,
        `<img src="editor-images/gif-animated.gif" width="100" height="" alt="image" />`,
    ];

    function getFileExtension(url) {
        return url.split('.').pop();
    }
    // Get blob from canvas
    async function getBlobFromCanvas(canvas) {
        return new Promise(resolve => {
            canvas.toBlob(resolve, 'images/png');
        });
    }
    let loadedGifFrames = {};
    async function getGIFFrames(url) {
        if (url in loadedGifFrames)
            return loadedGifFrames[url];
        return new Promise(resolve => {
            let $img = $(`<img src="${url}" />`);
            let rub = new SuperGif({
                gif: $img.get(0),
            });
            rub.load(async function () {
                // Get all frames
                let frames = [];
                for (let i = 0; i < rub.get_length(); i++) {
                    rub.move_to(i);
                    let blob = await getBlobFromCanvas(rub.get_canvas());
                    frames.push(URL.createObjectURL(blob));
                }
                loadedGifFrames[url] = frames;
                resolve(frames);
            });
        });
    }
    // Toggle Full Screen Loader
    function toggleFullScreenLoader(show = true) {
        if (show) {
            $(".full-screen-loader").css("display", "flex");
        } else {
            $(".full-screen-loader").css("display", "none");
        }
    }

    const images = function () {
        const _self = this;

        let ImagesList = defaultImages;
        if (Array.isArray(this.images) && this.images.length)
            ImagesList = this.images;
        $(`${this.containerSelector} .main-panel`).append(
            `<div class="toolpanel" id="Images-panel"><div class="content"><p class="title">Images</p></div></div>`
        );

        ImagesList.forEach((svg) => {
            $(`${this.containerSelector} .toolpanel#Images-panel .content`).append(
                `<div class="button">${svg}</div>`
            );
        });

        $(
            `${this.containerSelector} .toolpanel#Images-panel .content .button`
        ).click(async function () {
            let src = $(this).find('img').attr('src');
            let srcExt = getFileExtension(src);
            if (srcExt === 'gif') {
                toggleFullScreenLoader(true);
                // Load frames
                let frames = await getGIFFrames(src);
                urlToImage(frames, _self.canvas).then(data => {
                    addGif(_self.canvas, data, {
                        speed: 50,
                        type: 'gif',
                        fileType: 'gif',
                        id: ++objectId,
                        target: ++gifImageTarget,
                        orgSrc: src,
                    }, null, {
                        svgPath: src,
                    });
                    toggleFullScreenLoader(false);
                    _self.canvas.renderAll();
                });
                return false;
            }
            try {
                fabric.Image.fromURL(src, (newImage) => {
                    newImage.scaleToHeight(300)
                    newImage.scaleToWidth(300)
                    newImage.set({
                        left: (_self.canvas.width - 300) / 2,
                        top: (_self.canvas.height - 300) / 4,
                        id: Math.floor(Math.random() * 10000000),
                        svgPath: src,
                    })
                    _self.canvas.add(newImage)
                    _self.canvas.renderAll()
                    _self.canvas.fire('object:modified')
                }, {
                    crossOrigin: 'anonymous'  // Set cross-origin property
                })
            } catch (_) {
                console.error("can't add image");
            }
        });
        // active gif image loop true or false 
        $(document).on('change', ".gif-img-loop-controller .gif-img-control", async function () {
            let activeObj = _self.canvas.getActiveObject();
            if (activeObj && activeObj.objType == "gif") {
                let top = activeObj.top;
                let left = activeObj.left;
                let isChecked = $(this).prop('checked');
                let originalSrc = activeObj.originalItem.orgSrc;
                let srcExt = getFileExtension(originalSrc);

                // active 
                if (srcExt === 'gif') {
                    // Load frames
                    let frames = await getGIFFrames(originalSrc);
                    // remove active object
                    _self.canvas.remove(activeObj);
                    // add gif image
                    urlToImage(frames, _self.canvas).then(data => {
                        addGif(_self.canvas, data, {
                            speed: 50,
                            type: 'gif',
                            fileType: 'gif',
                            id: ++objectId,
                            target: ++gifImageTarget,
                            orgSrc: originalSrc,
                            svgPath: originalSrc,
                        }, null, {}, isChecked ? null : frames.length * 1, function (gif) {
                            gif.set({
                                top: top,
                                left: left,
                                svgPath: originalSrc,
                            });
                            gif.setCoords();
                            _self.canvas.setActiveObject(gif);
                            _self.canvas.renderAll();
                        });
                        _self.canvas.renderAll();
                    });
                    setTimeout(() => {
                        $(".layer-container").find(`.single-layer[data-object-id="${activeObj.id}"]`).remove();
                    }, 500);
                }
            }
        });
    };

    window.ImageEditor.prototype.initializeImages = images;
})();
