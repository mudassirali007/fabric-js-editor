// Load Gif
async function loadGif(imageSrc, canvasObjIndex, loopCount = null) {
    let frames = await getGIFFrames(imageSrc);
    urlToImage(frames).then(data => {
        addGif(data, {}, canvasObjIndex, loopCount);
    });
}
// ADd Gif
function addGif(canvas, frames, originalItems = {}, canvasObjIndex = null, options = {}, loopCount = null, cb = null) {
    let currentFrame = 0;
    let frameImg = frames[0];
    currentFrame++;
    // add image set width and height
    let img,
        speed = 50;
    if (typeof canvasObjIndex === 'number') {
        img = canvas._objects[canvasObjIndex];
    } else {
        img = new fabric.Image(frameImg);
        img.set({
            left: 0,
            top: 0,
            objType: 'gif',
            id: Math.floor(Math.random() * 1000000),
            originalItem: {
                speed,
                ...originalItems
            },
            ...options
        });
        if (originalItems.type == "grain") {
            img.set({
                top: 0,
                left: 0,
                scaleX: 7,
                scaleY: 6
            })
        } else {
            img.scaleToWidth(150);
            img.scaleToHeight(150);
        }
        canvas.add(img);
        canvas.centerObject(img);
        canvas.renderAll();
        if (typeof cb === 'function') cb(img);
    }

    let startTime = null;
    let loop = 0; // Add this variable to count loops

    function animateGif(timestamp) {
        time = new Date().getTime(); //millisecond-timstamp

        var progress = time - startTime;
        if (currentFrame > (frames.length - 1))
            currentFrame = 0;
        loop++;
        if (loopCount !== null && loop >= loopCount) return;
        let frameImg = frames[currentFrame];
        currentFrame++;
        img.setSrc(frameImg.src, () => {
            img.set('dirty', true);
            canvas.requestRenderAll();
        }, { crossOrigin: 'annonymous' });
        // Calculate gif duration
        img.originalItem.duration = frames.length * speed;
        setTimeout(animateGif, img.originalItem.speed);
    }
    animateGif();
}
let loadedImages = {};
const loadImage = (url, canvas) => {
    if (url in loadedImages) {
        return new Promise(resolve => {
            let img = loadedImages[url];
            resolve(img)
        });
    }
    const img = new Image()
    return new Promise(resolve => {
        img.onload = () => {
            loadedImages[url] = img;
            resolve(img)
        }
        img.src = url;
    })
}

async function urlToImage(images, canvas) {
    let output = [];
    for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        const img = await loadImage(imageUrl, canvas);
        output.push(img);
    }
    return output;
}
