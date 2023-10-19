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
                            `<option  data-attribute="${item}">${++i}</option>`
                        );
                    });
                })
                .catch((error) => {
                    console.error('Fetch error: ' + error.message);
                });

        })()
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
                        _self.canvas.renderAll()
                    });
                })
                .catch(error => {
                    console.error('Fetch error: ' + error.message);
                });


        }

        _self.saveTemplate = () => {
            const currentState = _self.canvas.toJSON(_self.propsToSave);
            fetch(`${baseURL}?action=saveTemplate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentState),
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
