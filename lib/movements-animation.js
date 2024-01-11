/**
 * Define Movements Animation
 */
(function () {
    "use strict";
    // movememnts animation
    const movementsAnimation = function () {
        const _self = this;

        $(document).on('click', ".add-object-movement", function () {
            let $movementContainer = $(".animation-steps-container"),
                type = $(this).data("type");
            let activeObj = _self.canvas.getActiveObject();
            if (!activeObj) return false;
            activeObj.animationMovements = activeObj.animationMovements || [];

            // $container empty if not Object id exist
            if (!$movementContainer.find(`.single-movement[data-object-id="${activeObj.id}"]`).length) {
                $movementContainer.empty();
            }
            if (type == "default") {
                // Create default animation properties for the object
                let animationMovement = {
                    "title": "Movement",
                    "delay_start": 0,
                    "delay_complete": 0,
                    "duration": 500,
                    "top": 0,
                    "left": 0,
                    opacity: activeObj.opacity || 1,
                    angle: activeObj.angle || 0,
                    scaleX: activeObj.scaleX || 1,
                    scaleY: activeObj.scaleY || 1,
                };
                let objectId = activeObj.id;
                if (!animationMovements[objectId]) {
                    animationMovements[objectId] = [];
                }
                animationMovements[objectId].push(animationMovement);
                activeObj.animationMovements.push(animationMovement);
                // Get the index based on the length of the array
                let index = animationMovements[objectId].length - 1;
                let defaultMovementHTMl = objectAnimationMovementHTML(objectId, index, animationMovement);
                $movementContainer.append(defaultMovementHTMl);
            } else {
                let activeObjId = activeObj.id;
                if (!animationMovements[activeObjId]) {
                    animationMovements[activeObjId] = [];
                }
                let animationMovement = {
                    "title": "Movement",
                    "delay_start": 0,
                    "delay_complete": 0,
                    "duration": 500,
                    "top": activeObj.top,
                    "left": activeObj.left,
                    opacity: activeObj.opacity || 1,
                    angle: activeObj.angle || 0,
                    scaleX: activeObj.scaleX || 1,
                    scaleY: activeObj.scaleY || 1,
                }

                animationMovements[activeObjId].push(animationMovement);
                activeObj.animationMovements.push(animationMovement);
                // Get the index based on the length of the array
                // let index = animationMovements[activeObjId].length - 1;
                let index = activeObj.animationMovements.length - 1;
                let defaultMovementHTMl = objectAnimationMovementHTML(activeObjId, index, animationMovement);
                $movementContainer.append(defaultMovementHTMl);
            }
        });

        // change movement fields value with active object id movement
        // change movement fields value with active object id movement
        // change movement fields value with active object id movement
        $(document).on('change', ".animation-steps-container .movement-fields input", function () {
            let activeObj = _self.canvas.getActiveObject();
            if (!activeObj) return false;

            let objectId = activeObj.id;
            let $input = $(this);
            let fieldName = $input.attr("name"); // Assuming the input field has a 'name' attribute
            let inputType = $input.attr('type');

            // Find the corresponding movement objects for the active object
            let movementIndex = $input.closest('.single-movement').index();
            // let movementArray = animationMovements[objectId];
            let movementArray = activeObj.animationMovements;
            if (movementArray && movementIndex < movementArray.length) {
                // Update the field value in the correct movement object
                let movement = movementArray[movementIndex];

                if (fieldName in movement) {
                    movement[fieldName] = inputType === 'number'? parseFloat($input.val()) : $input.val();

                    // Update the canvas if needed
                    if (fieldName === 'top' || fieldName === 'left') {
                        activeObj.set({ [fieldName]: movement[fieldName] });
                        _self.canvas.renderAll();
                    }
                }
            }

        });

        // title click detected
        $(document).on('click', '.animation-steps-container .movement-fields input[name="title"]', function () {
            // This will only trigger when an input with name="title" changes
            let $titleInput = $(this);

            let $parentMovement = $titleInput.closest('.single-movement');

            // Extract the data-object-id and data-index attributes
            let objectId = $parentMovement.data('object-id');
            let dataIndex = $parentMovement.data('index');

            let activeObj = _self.canvas.getActiveObject();
            if (!activeObj || !objectId) return false;
            let step = activeObj.animationMovements[dataIndex];
            animateObjectProperties(activeObj, step);
            // ... your code for handling the change event for this specific input
        });

        // delete movement
        $(document).on('click', ".delete-duration-btn", function () {
            let activeObj = _self.canvas.getActiveObject();
            if (!activeObj) return false;

            let $movementContainer = $(".animation-steps-container");
            let objectId = activeObj.id;

            // Remove the clicked duration element
            $(this).closest(".single-movement").remove();

            // Update animationMovements data structure (assuming each movement has an index)
            let movementIndex = $(this).closest(".single-movement").data("index");
            // let movementArray = animationMovements[objectId];
            let movementArray = activeObj.animationMovements;
            if (movementArray && movementIndex < movementArray.length) {
                movementArray.splice(movementIndex, 1);
            }

            // Remove the animationMovements object if there are no more movements
            if (movementArray.length === 0) {
                delete animationMovements[objectId];
            }
            activeObj.animationMovements = movementArray;
        });


        // when delete object then delete movemen key delete
        $(document).on('keydown', function (e) {
            if (e.keyCode == 46) {
                let activeObj = _self.canvas.getActiveObject();
                if (!activeObj) return false;
                let $movementContainer = $(".animation-steps-container");
                let objectId = activeObj.id;
                // Remove the clicked duration element
                $movementContainer.find(`.single-movement[data-object-id="${objectId}"]`).remove();
            }
        });

        // Play Object Movements
        // function playObjectMovement(objectId) {
        //     let animationSteps = animationMovements[objectId];
        //     if (!animationSteps || animationSteps.length === 0) {
        //         return;
        //     }

        //     let stepIndex = 0;
        //     let canvas = _self.canvas; // Replace with your canvas reference

        //     function animate() {
        //         if (stepIndex < animationSteps.length) {
        //             let step = animationSteps[stepIndex];
        //             let activeObj = canvas.getObjects().find(obj => obj.id === objectId);

        //             if (activeObj) {
        //                 let animationDuration = step.duration,
        //                     delayStart = step.delay_start || 0,
        //                     delayComplete = step.delay_complete || 0,
        //                     totalDelay = delayStart + delayComplete,
        //                     startTime = performance.now() + delayStart;

        //                 function stepAnimation(currentTime) {
        //                     let elapsedTime = currentTime - startTime;

        //                     if (elapsedTime >= 0) {
        //                         let progress = Math.min(1, elapsedTime / (animationDuration + totalDelay));

        //                         if (progress < 1) {
        //                             let easingProgress = easeInOutQuad(progress);

        //                             let newPosition = {
        //                                 top: activeObj.top + (step.top - activeObj.top) * easingProgress,
        //                                 left: activeObj.left + (step.left - activeObj.left) * easingProgress,
        //                             };

        //                             // Update object position
        //                             activeObj.set(newPosition);
        //                             canvas.renderAll();

        //                             if (progress < 1) {
        //                                 // Continue animation
        //                                 requestAnimationFrame(stepAnimation);
        //                             } else {
        //                                 // Animation completed
        //                                 stepIndex++;
        //                                 setTimeout(animate, 0); // Immediate next step
        //                             }
        //                         } else {
        //                             // Animation completed
        //                             activeObj.set({ top: step.top, left: step.left });
        //                             canvas.renderAll();
        //                             stepIndex++;
        //                             setTimeout(animate, 0); // Immediate next step
        //                         }
        //                     } else {
        //                         // Continue waiting for delayStart
        //                         requestAnimationFrame(stepAnimation);
        //                     }
        //                 }

        //                 requestAnimationFrame(stepAnimation);
        //             }
        //         }
        //     }

        //     // Ease in-out quadratic function
        //     function easeInOutQuad(t) {
        //         return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        //     }

        //     animate();
        // }
        // Play Object Movements with Opacity
        function playObjectMovement(objectId) {
            // let animationSteps = animationMovements[objectId];
            let animationSteps = _self.canvas.getItemById(objectId).animationMovements;
            if (!animationSteps || animationSteps.length === 0) return;

            let stepIndex = 0;
            let canvas = _self.canvas; // Replace with your canvas reference
            let activeObj = canvas.getItemById(objectId); // Or any other method to get your object
            console.time("animate");
            l("START")
            function animateNextStep() {
                if (stepIndex < animationSteps.length) {
                    let step = animationSteps[stepIndex];
                    animateObjectProperties(activeObj, step, () => {
                        stepIndex++;
                        animateNextStep(); // Proceed to next step
                    });
                } else {
                    console.timeEnd("animate");
                    l("END")
                }
            }

            animateNextStep();
        }
        function animateObjectProperties(object, step, onComplete = () => {}) {
            let propertiesToAnimate = ['left', 'top', 'opacity', 'angle', 'scaleX', 'scaleY']; // Add other properties as needed
            let completedAnimations = 0;

            propertiesToAnimate.forEach(property => {
                setTimeout(() => {
                    fabric.util.animate({
                        startValue: object[property],
                        endValue: step[property],
                        duration: step.duration,
                        onChange: function(value) {
                            object.set(property, value);
                            _self.canvas.renderAll();
                        },
                        onComplete: () => {
                            setTimeout(() => {
                                completedAnimations++;
                                if (completedAnimations === propertiesToAnimate.length) {
                                    onComplete(); // Call only when all animations are complete
                                }
                                object.setCoords();
                            }, step.delay_complete);
                        },
                        easing: fabric.util.ease.easeOutQuart,
                    });
                }, step.delay_start);
            });
        }

        function setAnimationMovementsObjectLeftORTop() {
            let objects = _self.canvas._objects;
            if (!objects) return false;
            objects.forEach(function (object) {
                let objectId = object.id;
                // let objectMovements = animationMovements[objectId];
                let objectMovements = object.animationMovements;
                if (!objectMovements) return false;
                let movement = objectMovements[0];
                object.set({ top: movement.top, left: movement.left });
                _self.canvas.renderAll();
            });
        }


        // play movement animation
        $(document).on('click', ".play-movement-btn", function () {
            let activeObj = _self.canvas.getActiveObject();
            if (!activeObj) return false;
            let objectId = activeObj.id;
            playObjectMovement(objectId);
        });

        // All movement animation
        $(document).on('click', ".all-movement-btn", function () {
            _self.canvas.discardActiveObject().requestRenderAll();
            let objects = _self.canvas.getObjects();
            if (!objects) return false;

            let maxCombinedTime = 0; // Variable to store the maximum total time (delay + duration)

            objects.forEach(function (object) {
                let objectId = object.id;

                let animationMovements = object.animationMovements || []; // Get the animationMovements array

                // Find the max combined time (delay_start + duration) for this object
                let objectMaxCombinedTime = animationMovements.reduce((maxTime, movement) => {
                    let combinedTime = movement.delay_start + movement.duration;
                    return Math.max(maxTime, combinedTime);
                }, 0);

                // Update maxCombinedTime if this object's max combined time is greater
                if (objectMaxCombinedTime > maxCombinedTime) {
                    maxCombinedTime = objectMaxCombinedTime;
                }
                playObjectMovement(objectId);
            });
            _self.maxDuration = _self.maxDuration > maxCombinedTime ? _self.maxDuration : maxCombinedTime / 1000;

        });

        // Object Start Point
        $(document).on('click', ".obj-start-btn", function () {
            let activeObj = _self.canvas.getActiveObject();
            if (!activeObj) {
                console.error("No active object found.");
                return false;
            }

            let objectId = activeObj.id;
            // let objectMovements = animationMovements[objectId];
            let objectMovements = activeObj.animationMovements;
            if (!objectMovements) {
                console.error("No movements found for the object.");
                return false;
            }

            let movement = objectMovements[0];
            activeObj.set({
                top: parseInt(movement.top),
                left: parseInt(movement.left),
                opacity: movement.opacity,
                angle: movement.angle,
                scaleX: movement.scaleX,
                scaleY: movement.scaleY,
                selectable: true,
            });

            // Log object state for debugging
            console.log("Object state after movement:", activeObj);
            activeObj.setCoords(); // Ensure coordinates are updated
            _self.canvas.setActiveObject(activeObj);
            _self.canvas.renderAll();
        });


        // Object End Point
        $(document).on('click', ".obj-end-btn", function () {
            let activeObj = _self.canvas.getActiveObject();
            if (!activeObj) {
                console.error("No active object found.");
                return false;
            }

            let objectId = activeObj.id;
            // let objectMovements = animationMovements[objectId];
            let objectMovements = activeObj.animationMovements;
            if (!objectMovements) {
                console.error("No movements found for the object.");
                return false;
            }

            let movement = objectMovements[objectMovements.length - 1];
            activeObj.set({
                top: parseInt(movement.top),
                left: parseInt(movement.left),
                opacity: movement.opacity,
                angle: movement.angle,
                scaleX: movement.scaleX,
                scaleY: movement.scaleY,
                selectable: true,
            });

            // Log object state for debugging
            console.log("Object state after movement:", activeObj);
            activeObj.setCoords(); // Ensure coordinates are updated
            _self.canvas.setActiveObject(activeObj);
            _self.canvas.renderAll();
        });
    }
    window.ImageEditor.prototype.initializeMovementsAnimation = movementsAnimation;
})();
