/**
 * Define action to for template
 */
(function () {
    const template = function () {
        const _self = this;
        const baseURL = 'api/index.php';
        const selector = document.querySelector("#selectTemplate");

        const getTemplate = (async () => {
            await fetch(`${baseURL}?action=getTemplate`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    data?.templates.forEach((item, i) => {
                        $(`${this.containerSelector} #topbar #selectTemplate`).append(
                            `<option  data-attribute="${item}">${item.split('.json')[0]}</option>`
                        );
                    });
                })
                .catch((error) => {
                    console.error('Fetch error: ' + error.message);
                });

        })()

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

        const loadTemplate = (name) => {
            fetch(`${baseURL}?action=getTemplateData&name=${name}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    _self.canvas.clear();
                    _self.canvas.loadFromJSON(data, () => {
                        _self.canvas.setWidth(_self.canvas.width);
                        _self.canvas.setHeight(_self.canvas.height);
                        _self.canvas.originalW = _self.canvas.width;
                        _self.canvas.originalH = _self.canvas.height;
                        animationMovements = data.animationMovementData;
                        _self.canvas.renderAll()
                    });
                    // gif load if data has gif
                    if (data.objects.length) {
                        data.objects.forEach(async (item, i) => {
                            if (item.objType == "gif") {
                                let src = item.svgPath;
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
                                        }, null, function (img) {
                                            img.set({
                                                top: item.top,
                                                left: item.left,
                                            });
                                            img.setCoords();
                                            _self.canvas.renderAll();
                                        });
                                        toggleFullScreenLoader(false);
                                        _self.canvas.renderAll();
                                    });
                                    return false;
                                }
                            }
                        });
                    }
                })
                .catch(error => {
                    console.error('Fetch error: ' + error.message);
                });
        }

        _self.saveTemplate = (name = 'latest') => {
            _self.canvas.animationMovementData = animationMovements
            const currentState = _self.canvas.toJSON(_self.propsToSave);
            const payload = {
                name,
                currentState
            };
            fetch(`${baseURL}?action=saveTemplate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                })
                .catch((error) => {
                    console.error('Fetch error: ' + error.message);
                });
        }

        selector.addEventListener("change", (event) => {
            const selectedOption = selector.options[selector.selectedIndex];
            const attribute = selectedOption.getAttribute("data-attribute");
            attribute && loadTemplate(attribute)
        });
    };
    window.ImageEditor.prototype.initializeTemplate = template;
})()
