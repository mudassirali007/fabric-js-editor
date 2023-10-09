/**
 * Define action to animate objects
 */
(function () {
  const animate = function (canvas) {

    let maxDelay = 0;
    const selector = document.querySelector("#selectAnimation");
    const delay = document.querySelector("#anim-delay");
    const duration = document.querySelector("#anim-duration");
    const download = document.querySelector("#downloadBtn");
    const downloadVideoBtn = document.querySelector("#downloadVideoBtn");
    const preview = document.querySelector("#previewBtn");
    const writtenText = document.querySelector("#fileName");
    let counter = 0;
    let totalTimeouts = 0;


    const allTimeoutsCompleted = () => {
      preview.classList.remove("disabled");
      download.classList.remove("disabled");
      downloadVideoBtn.classList.remove("disabled");
      counter = 0;
      totalTimeouts = 0;
      maxDelay = 0;
    }
    const incrementCounter = () => {
      counter += 1;
      if (counter === totalTimeouts) {
        allTimeoutsCompleted();
      }
    }
    // Animation Functions
    const fadeIn = (object) => {
      const originalTop = object.top; // Store the original top value
      const distanceToMove = 0; // Set a fixed distance

      object.opacity = 0;
      object.top -= distanceToMove;

      setTimeout(() => {
        fabric.util.animate({
          startValue: 0,
          endValue: 1,
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            object.opacity = value; // Update the opacity based on the current animation value
            // Calculate the new top position based on the animation progress
            object.top = originalTop + distanceToMove * (1 - value);
            canvas.renderAll();
          },
          onComplete: function () {
            object.top = originalTop; // Restore the original top value after animation
            canvas.renderAll();
          },
          easing: fabric.util.ease.easeInCubic, // This might need to be changed if you want to replicate the exact cubic-bezier curve
        });
        incrementCounter();
      }, object.animation.delay * 1000); // Convert delay from seconds to milliseconds for setTimeout
    }

    const fadeInFromBottom = (object) => {
      const originalTop = object.top; // Store the original top value
      const distanceToMove = 70; // Set a fixed distance

      object.opacity = 0;
      object.top -= distanceToMove;

      setTimeout(() => {
        fabric.util.animate({
          startValue: 0,
          endValue: 1,
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            object.opacity = value; // Update the opacity based on the current animation value
            // Calculate the new top position based on the animation progress
            object.top = originalTop + distanceToMove * (1 - value);
            canvas.renderAll();
          },
          onComplete: function () {
            object.top = originalTop; // Restore the original top value after animation
            canvas.renderAll();
          },
          easing: fabric.util.ease.easeInCubic, // This might need to be changed if you want to replicate the exact cubic-bezier curve
        });
        incrementCounter();
      }, object.animation.delay * 1000); // Convert delay from seconds to milliseconds for setTimeout
    }
    const scaleInCenter = (object) => {
      const originalScaleX = object.scaleX;
      const originalScaleY = object.scaleY;
      const originalLeft = object.left;
      const originalTop = object.top;
      const scaleXDiff = (object.width * (originalScaleX - 1)) / 2;
      const scaleYDiff = (object.height * (originalScaleY - 1)) / 2;
      object.scaleX = 0;
      object.scaleY = 0;
      object.opacity = 0;
      setTimeout(() => {
        fabric.util.animate({
          startValue: 0,
          endValue: 1,
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            object.scaleX = originalScaleX * value;
            object.scaleY = originalScaleY * value;
            object.opacity = value;
            const adjustedScaleXDiff = (object.width * (object.scaleX - 1)) / 2;
            const adjustedScaleYDiff =
                (object.height * (object.scaleY - 1)) / 2;
            object.left = originalLeft - adjustedScaleXDiff + scaleXDiff;
            object.top = originalTop - adjustedScaleYDiff + scaleYDiff;
            canvas.renderAll();
          },
          // Easing function
          easing: fabric.util.ease.easeOutQuart,
        });
        incrementCounter();
      }, object.animation.delay * 1000);
    }

    const tiltInTopV = (object) => {
      // Store original properties
      const originalAngle = object.angle; // equivalent to rotateY in 2D
      const originalTop = object.top;
      const originalSkewY = object.skewY;
      const originalOpacity = object.opacity;

      // Set initial states based on the 0% keyframe
      object.angle = 30; // rotateY(30deg) - in 2D we can just use angle
      object.top = originalTop - 300; // translateY(-300px)
      object.skewY = -30; // skewY(-30deg)
      object.opacity = 0;

      setTimeout(() => {
        fabric.util.animate({
          startValue: 0,
          endValue: 1,
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            object.angle = originalAngle + 30 * (1 - value);
            object.top = originalTop - 300 * (1 - value);
            object.skewY = originalSkewY - 30 * (1 - value);
            object.opacity = originalOpacity + value;

            canvas.renderAll();
          },
          easing: fabric.util.ease.easeOutQuart, // Closest approximation to the provided bezier curve
        });
        incrementCounter();
      }, object.animation.delay * 1000);
    }
    const tiltInTopH = (object) => {
      // Store original properties
      const originalAngle = object.angle; // equivalent to rotateY in 2D
      const originalTop = object.top;
      const originalSkewY = object.skewY;
      const originalOpacity = object.opacity;

      // Set initial states based on the 0% keyframe
      object.angle = -30; // rotateY(-30deg) - in 2D we can just use angle
      object.top = originalTop - 300; // translateY(-300px)
      object.skewY = 30; // skewY(30deg)
      object.opacity = 0;

      setTimeout(() => {
        fabric.util.animate({
          startValue: 0,
          endValue: 1,
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            object.angle = originalAngle + -30 * (1 - value);
            object.top = originalTop - 300 * (1 - value);
            object.skewY = originalSkewY + 30 * (1 - value);
            object.opacity = originalOpacity + value;

            canvas.renderAll();
          },
          easing: fabric.util.ease.easeOutQuart, // Closest approximation to the provided bezier curve
        });
        incrementCounter();
      }, object.animation.delay * 1000);
    }
    const tiltInBottomH = (object) => {
      // Store original properties
      const originalAngle = object.angle; // equivalent to rotateY in 2D
      const originalTop = object.top;
      const originalSkewY = object.skewY;
      const originalOpacity = object.opacity;

      // Set initial states based on the 0% keyframe
      object.angle = 30; // rotateY(30deg) - in 2D we can just use angle
      object.top = originalTop + 300; // translateY(300px)
      object.skewY = -30; // skewY(-30deg)
      object.opacity = 0;

      setTimeout(function () {
        fabric.util.animate({
          startValue: 0,
          endValue: 1,
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            object.angle = originalAngle + 30 * (1 - value);
            object.top = originalTop + 300 * (1 - value);
            object.skewY = originalSkewY - 30 * (1 - value);
            object.opacity = originalOpacity + value;

            canvas.renderAll();
          },
          easing: fabric.util.ease.easeOutQuart, // Closest approximation to the provided bezier curve
        });
        incrementCounter();
      }, object.animation.delay * 1000);
    }
    const tiltInBottomV = (object) => {
      // Store original properties
      const originalAngle = object.angle; // equivalent to rotateY in 2D
      const originalTop = object.top;
      const originalSkewY = object.skewY;
      const originalOpacity = object.opacity;

      // Set initial states based on the 0% keyframe
      object.angle = -30; // rotateY(-30deg) - in 2D we can just use angle
      object.top = originalTop + 300; // translateY(300px)
      object.skewY = 30; // skewY(30deg)
      object.opacity = 0;

      setTimeout(function () {
        fabric.util.animate({
          startValue: 0,
          endValue: 1,
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            object.angle = originalAngle + -30 * (1 - value);
            object.top = originalTop + 300 * (1 - value);
            object.skewY = originalSkewY + 30 * (1 - value);
            object.opacity = originalOpacity + value;

            canvas.renderAll();
          },
          easing: fabric.util.ease.easeOutQuart, // Closest approximation to the provided bezier curve
        });
        incrementCounter();
      }, object.animation.delay * 1000);
    }

    const SlideInRight = (object) => {
      const originalOpacity = object.opacity;
      object.opacity = 0;
      const zoom = canvas.getZoom();

      setTimeout(() => {
        // Adjusted startValue based on zoom
        const adjustedStartValue = (canvas.width - object.width * zoom) / zoom;
        // Animate position
        fabric.util.animate({
          startValue: adjustedStartValue,
          endValue: object.left,
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            object.set({left: value}); // Update the left position of the object
            canvas.renderAll(); // Render the canvas to show the updated position
          }
        });

        // Animate opacity
        fabric.util.animate({
          startValue: 0,
          endValue: originalOpacity,
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            object.set({opacity: value});
            canvas.renderAll();
          }
        });

        incrementCounter();
      }, object.animation.delay * 1000);
    }
    const SlideInLeft = (object) => {
      const originalOpacity = object.opacity;
      object.opacity = 0;

      setTimeout(() => {
        // Animate position
        fabric.util.animate({
          startValue: -object.width,  // Start outside the canvas on the left
          endValue: object.left,
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            object.set({left: value}); // Update the left position of the object
            canvas.renderAll(); // Render the canvas to show the updated position
          }
        });

        // Animate opacity
        fabric.util.animate({
          startValue: 0,
          endValue: originalOpacity,  // End at full opacity
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            object.set({opacity: value});
            canvas.renderAll();
          }
        });

        incrementCounter();
      }, object.animation.delay * 1000);
    }

    const ScaleVerticalBottom = (object) => {
      // Store the original scale, opacity, and position settings
      const originalScaleY = object.scaleY;
      const originalOpacity = object.opacity;
      const originalTop = object.top;

      // Set the initial states
      object.scaleY = 0;
      object.opacity = 0;

      setTimeout(() => {
        fabric.util.animate({
          startValue: 0,
          endValue: 1,
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            object.scaleY = originalScaleY * value;
            object.opacity = originalOpacity * value;
            const newTop =
                originalTop + object.height * (originalScaleY - object.scaleY);
            object.top = newTop;
            canvas.renderAll();
          },
          // Easing function
          easing: fabric.util.ease.easeOutQuart,
        });
        incrementCounter();
      }, object.animation.delay * 1000);
    }
    const ScaleVerticalTop = (object) => {
      // Store the original scale, opacity, and origin settings
      const originalScaleY = object.scaleY;
      const originalOpacity = object.opacity;
      const originalTop = object.top;

      // Set the initial states
      object.scaleY = 0;
      object.opacity = 0;

      setTimeout(() => {
        fabric.util.animate({
          startValue: 0,
          endValue: 1,
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            // Adjusting scale and opacity based on the animation value
            object.scaleY = originalScaleY * value;
            object.opacity = originalOpacity * value;
            // Adjust the position to create the effect of scaling from the center

            object.top = originalTop;

            canvas.renderAll();
          },
          // Easing function
          easing: fabric.util.ease.easeOutQuart,
        });
        incrementCounter();
      }, object.animation.delay * 1000);
    }
    const ScaleHorizontal = (object) => {
      const originalScaleX = object.scaleX;
      const originalOpacity = object.opacity;
      const originalTop = object.top;
      object.scaleX = 0;
      object.opacity = 0;

      setTimeout(() => {
        fabric.util.animate({
          startValue: 0,
          endValue: 1,
          duration: object.animation.duration * 1000,
          onChange: function (value) {
            object.scaleX = originalScaleX * value;
            object.opacity = originalOpacity * value;
            object.top = originalTop;
            canvas.renderAll();
          },
          easing: fabric.util.ease.easeOutQuart,
        });
        incrementCounter();
      }, object.animation.delay * 1000);
    }

    const rollInFromLeftWithCenteredRotation = (object) => {
      const originalAngle = object.angle;
      const originalLeft = object.left;
      const originalTop = object.top;
      const halfWidth = object.width * object.scaleX / 2;
      const halfHeight = object.height * object.scaleY / 2;

      setTimeout(() => {
        fabric.util.animate({
          startValue: originalLeft - 800,
          endValue: originalLeft,
          duration: object.animation.duration * 1000,
          onChange: function (leftValue) {
            // Calculate rotation angle based on horizontal movement
            const angle = (leftValue - (originalLeft - 800)) / 800 * 540 - 540;

            // Adjust the object's position to make it appear rotating around its center
            const rotationPoint = new fabric.Point(leftValue + halfWidth, originalTop + halfHeight);
            const rotatedPoint = fabric.util.rotatePoint(
                new fabric.Point(leftValue, originalTop),
                rotationPoint,
                fabric.util.degreesToRadians(angle)
            );

            object.set({
              left: rotatedPoint.x,
              top: rotatedPoint.y,
              angle: angle
            });

            canvas.renderAll();
          },
          onComplete: function () {
            object.set({
              left: originalLeft,
              top: originalTop,
              angle: originalAngle
            });
            canvas.renderAll();
          },
          easing: fabric.util.ease.easeOutCubic,
        });
        incrementCounter();
      }, object.animation.delay * 1000);

    }
    const rollInFromRightWithCenteredRotation = (object) => {
      const originalAngle = object.angle;
      const originalLeft = object.left;
      const originalTop = object.top;
      const halfWidth = object.width * object.scaleX / 2;
      const halfHeight = object.height * object.scaleY / 2;

      setTimeout(() => {
        fabric.util.animate({
          startValue: originalLeft + 800,
          endValue: originalLeft,
          duration: object.animation.duration * 1000,
          onChange: function (leftValue) {
            // Calculate rotation angle based on horizontal movement
            const angle = -540 + ((originalLeft + 800 - leftValue) / 800 * 540);

            // Adjust the object's position to make it appear rotating around its center
            const rotationPoint = new fabric.Point(leftValue + halfWidth, originalTop + halfHeight);
            const rotatedPoint = fabric.util.rotatePoint(
                new fabric.Point(leftValue, originalTop),
                rotationPoint,
                fabric.util.degreesToRadians(angle)
            );

            object.set({
              left: rotatedPoint.x,
              top: rotatedPoint.y,
              angle: angle
            });

            canvas.renderAll();
          },
          onComplete: function () {
            object.set({
              left: originalLeft,
              top: originalTop,
              angle: originalAngle
            });
            canvas.renderAll();
          },
          easing: fabric.util.ease.easeOutCubic,
        });
        incrementCounter();
      }, object.animation.delay * 1000);
    }
    const rollInFromTopWithCenteredRotation = (object) => {
      const originalAngle = object.angle;
      const originalLeft = object.left;
      const originalTop = object.top;
      const halfWidth = object.width * object.scaleX / 2;
      const halfHeight = object.height * object.scaleY / 2;

      setTimeout(() => {
        fabric.util.animate({
          startValue: originalTop - 800,
          endValue: originalTop,
          duration: object.animation.duration * 1000,
          onChange: function (topValue) {
            // Calculate rotation angle based on vertical movement
            const angle = -540 + ((originalTop - 800 - topValue) / 800 * 540);

            // Adjust the object's position to make it appear rotating around its center
            const rotationPoint = new fabric.Point(originalLeft + halfWidth, topValue + halfHeight);
            const rotatedPoint = fabric.util.rotatePoint(
                new fabric.Point(originalLeft, topValue),
                rotationPoint,
                fabric.util.degreesToRadians(angle)
            );

            object.set({
              left: rotatedPoint.x,
              top: rotatedPoint.y,
              angle: angle
            });

            canvas.renderAll();
          },
          onComplete: function () {
            object.set({
              left: originalLeft,
              top: originalTop,
              angle: originalAngle
            });
            canvas.renderAll();
          },
          easing: fabric.util.ease.easeOutCubic,
        });
        incrementCounter();
      }, object.animation.delay * 1000);
    }
    const rollInFromBottomWithCenteredRotation = (object) => {
      const originalAngle = object.angle;
      const originalLeft = object.left;
      const originalTop = object.top;
      const halfWidth = object.width * object.scaleX / 2;
      const halfHeight = object.height * object.scaleY / 2;

      setTimeout(() => {
        fabric.util.animate({
          startValue: originalTop + 800,
          endValue: originalTop,
          duration: object.animation.duration * 1000,
          onChange: function (topValue) {
            // Calculate rotation angle based on vertical movement
            const angle = 540 - ((originalTop + 800 - topValue) / 800 * 540);

            // Adjust the object's position to make it appear rotating around its center
            const rotationPoint = new fabric.Point(originalLeft + halfWidth, topValue + halfHeight);
            const rotatedPoint = fabric.util.rotatePoint(
                new fabric.Point(originalLeft, topValue),
                rotationPoint,
                fabric.util.degreesToRadians(angle)
            );

            object.set({
              left: rotatedPoint.x,
              top: rotatedPoint.y,
              angle: angle
            });

            canvas.renderAll();
          },
          onComplete: function () {
            object.set({
              left: originalLeft,
              top: originalTop,
              angle: originalAngle
            });
            canvas.renderAll();
          },
          easing: fabric.util.ease.easeOutCubic,
        });
        incrementCounter();
      }, object.animation.delay * 1000);
    }

    const animationFunctions = {
      dissolve: fadeIn,
      fade: fadeInFromBottom,
      scale: scaleInCenter,
      tiltTopV: tiltInTopV,
      tiltTopH: tiltInTopH,
      tiltBottomV: tiltInBottomH,
      tiltBottomH: tiltInBottomV,
      SlideInRightV: SlideInRight,
      SlideInLeftV: SlideInLeft,
      ScaleVerticalTopV: ScaleVerticalTop,
      ScaleVerticalBottomV: ScaleVerticalBottom,
      ScaleHorizontalV: ScaleHorizontal,
      RollInLeft: rollInFromLeftWithCenteredRotation,
      RollInRight: rollInFromRightWithCenteredRotation,
      RollInTop: rollInFromTopWithCenteredRotation,
      RollInBottom: rollInFromBottomWithCenteredRotation,
    };

    const callAnimationOnChange = ({delay = 0.5, duration = 0.8}) => {

      const selectedOption = selector.options[selector.selectedIndex];
      const attribute = selectedOption.getAttribute("data-attribute");
      const object = canvas.getActiveObject();
      if (!attribute || !object) return
      object.animation = {
        style: attribute,
        delay,
        duration,
      };
      preview.classList.add("disabled");
      const animFunc = animationFunctions[object?.animation?.style];
      if (animFunc) {
        totalTimeouts += 1;
        animFunc(object)
      }
    }

    const animatingObjects = () => {
      canvas.getObjects().forEach((item) => {
        const animDelay = item?.animation?.delay || 0; // Get the animation delay or default to 0
        if (animDelay > maxDelay) {
          maxDelay = animDelay; // Update maxDelay if the current delay is greater
        }
        const animFunc = animationFunctions[item?.animation?.style];
        if (animFunc) {
          totalTimeouts += 1;
          animFunc(item)
        }
      });
      return maxDelay
    }

    const delayChange = (e) => {
      const selectedValue = parseFloat(e.target.value);
      e.target.nextSibling.textContent = selectedValue.toString();
      callAnimationOnChange({delay: selectedValue, duration: parseFloat(duration.value)})
    }
    const durationChange = (e) => {
      const selectedValue = parseFloat(e.target.value);
      e.target.nextSibling.textContent = selectedValue.toString();
      callAnimationOnChange({delay: parseFloat(delay.value), duration: selectedValue})
    }

    selector.addEventListener("change", () => {
      callAnimationOnChange({delay: parseFloat(delay.value), duration: parseFloat(duration.value)})
    });
    delay.addEventListener("change", delayChange);
    duration.addEventListener("change", durationChange);

    //Download
    const captureFrame = async () => {
      return new Promise((resolve) => {
        canvas.renderAll();
        const dataURL = canvas.toDataURL({format: "png"});
        const img = new Image();
        img.src = dataURL;
        img.onload = () => resolve(img);
      });
    }
    const downloadZip = async (progressCallback) => {
      const zip = new JSZip();
      const fps = 1000 / 24;
      animatingObjects();
      const totalSeconds = maxDelay * 1000;
      const newFrameCount = (totalSeconds / 1000) * 24;
      let newFrame = newFrameCount < 30 ? 30 : newFrameCount;
      for (let i = 0; i < newFrame; i++) {
        await new Promise((resolve) => setTimeout(resolve, 42));
        const frameImage = await captureFrame(i);
        const frameDataURL = frameImage.src;
        const fileName = `frame${i}.png`;
        zip.file(fileName, frameDataURL.split(",")[1], {base64: true});
        const percentComplete = (i / newFrame) * 100;
        progressCallback(percentComplete);
      }

      const zipBlob = await zip.generateAsync({type: "blob"});
      const fileURL = URL.createObjectURL(zipBlob);
      // IE doesn't allow using a blob object directly as link href
      // instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file);
        return;
      }
      const link = document.createElement("a");
      link.href = fileURL;
      const fileName =
          (writtenText.value && writtenText.value.trim()) || "animation_frames";
      link.download = `${fileName}.zip`;
      link.click();
      setTimeout(() => {
        // for Firefox it is necessary to delay revoking the ObjectURL
        URL.revokeObjectURL(fileURL);
      }, 60);
    }

    //Video Download


    const determineBitrate = (quality) => {
      switch (quality) {
        case 'low':
          return 1000000; // 1 Mbps
        case 'medium':
          return 5000000; // 5 Mbps
        case 'high':
          return 10000000; // 10 Mbps
        default:
          return 5000000; // Default to 5 Mbps
      }
    }
    let recordedBlobs = [];
    const desiredQuality = 'medium';
    let animationCompleted = false;
    const canvasElement = canvas.getElement();
    const canvasStream = canvasElement.captureStream(30); // 24 fps

    const dynamicBitrate = determineBitrate(desiredQuality);

    const mediaRecorderOptions = {mimeType: 'video/webm; codecs=vp9', bitsPerSecond: dynamicBitrate}; // 10 Mbps

    const mediaRecorder = new MediaRecorder(canvasStream, mediaRecorderOptions);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
      }
      if (animationCompleted) {
        // Stop the MediaRecorder only after the animation completes
        mediaRecorder.stop();
        animationCompleted = false;

      }
    };
    mediaRecorder.onstop = () => {

      const blob = new Blob(recordedBlobs, {type: 'video/webm'});
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      const fileName = (writtenText.value && writtenText.value.trim()) || "animation";
      link.download = `${fileName}.webm`;
      link.click();

      setTimeout(() => {
        URL.revokeObjectURL(url);
        recordedBlobs = [];
      }, 60);
    };
    mediaRecorder.onerror = (error) => {
      console.error('MediaRecorder Error:', error);
    };

    const downloadVideo = async (progressCallback) => {
      animatingObjects();
      const totalSeconds = maxDelay * 1000;
      const newFrameCount = (totalSeconds / 1000) * 24;
      let newFrame = newFrameCount < 30 ? 30 : newFrameCount;
      // Start the MediaRecorder
      mediaRecorder.start(1);
      for (let i = 0; i < newFrame; i++) {
        await new Promise((resolve) => setTimeout(resolve, 42));
        await captureFrame();

        const percentComplete = (i / newFrame) * 100;
        progressCallback(percentComplete);
      }

      animationCompleted = true;
    };

    download.addEventListener("click", async () => {
      download.classList.add('loading')
      download.classList.remove('finished')
      preview.classList.add("disabled");
      downloadVideoBtn.classList.add("disabled");
      await downloadZip((progress) => {
        // Update the width of the loading bar
        if (download.classList.contains('loading')) {
          download.style.setProperty('--loader-width', `${progress}%`);
        }
      });
      download.classList.add('finished','disabled')
      download.classList.remove('loading')
      download.innerHTML = 'Complete';

    });
    downloadVideoBtn.addEventListener("click", async () => {
      downloadVideoBtn.classList.add('loading')
      downloadVideoBtn.classList.remove('finished')
      preview.classList.add("disabled");
      download.classList.add("disabled");
      await downloadVideo((progress) => {
        // Update the width of the loading bar
        if (downloadVideoBtn.classList.contains('loading')) {
          downloadVideoBtn.style.setProperty('--loader-width', `${progress}%`);
        }
      });
      downloadVideoBtn.classList.add('finished','disabled')
      downloadVideoBtn.classList.remove('loading')
      downloadVideoBtn.innerHTML = 'Complete';
    });
    preview.addEventListener("click", async () => {
      download.classList.remove('finished','disabled')
      download.innerHTML = 'SEKVENS';
      downloadVideoBtn.classList.remove('finished','disabled')
      downloadVideoBtn.innerHTML = 'Video';

      preview.classList.add("disabled");
      const isAnim = animatingObjects();
      if(!isAnim) preview.classList.remove("disabled");
    });


  };

  window.ImageEditor.prototype.initializeAnimation = animate;
})()
