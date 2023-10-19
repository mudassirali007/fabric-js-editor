/**
 * Define action to add images to canvas
 */
(function () {
    "use strict";
    const defaultImages = [
        `<img src="https://picsum.photos/seed/picsum/600/600" width="100" height="100" alt="image" />`,
    ];

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
        ).click(function () {
            let src = $(this).find('img').attr('src');
            try {
                fabric.Image.fromURL(src, (newImage) => {
                    newImage.scaleToHeight(300)
                    newImage.scaleToWidth(300)
                    newImage.set({
                        left: (_self.canvas.width - 300) / 2,
                        top: (_self.canvas.height - 300) / 4
                    })
                    _self.canvas.add(newImage)
                    _self.canvas.renderAll()
                    _self.canvas.trigger('object:modified')
                }, {
                    crossOrigin: 'anonymous'  // Set cross-origin property
                })
            } catch (_) {
                console.error("can't add image");
            }
        });
    };

    window.ImageEditor.prototype.initializeImages = images;
})();
