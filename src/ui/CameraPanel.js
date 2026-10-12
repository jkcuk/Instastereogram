import {
    createSlider,
    createButton,
    createNumberInput,
    createSelect,
    createSwitch,
    createSection
}
from "./elements.js";

export function createCameraPanel({
    root,
    controls,
    scenes,
    renderScene,
    rebuildGui,
    getSelectedStereo,
    nextStereoIdRef,
    createTextInput
}) {

    const stereoGroup =
        createSection(
            root,
            "Camera",
            true
        );

    createSelect(
        stereoGroup,
        "Renderer",
        [
            {
                label: "Standard",
                value: "standard"
            },
            {
                label: "Anaglyph",
                value: "anaglyph"
            },
            {
                label: "Autostereogram",
                value: "rds"
            }
        ],
        controls.renderer,
        value => {

            controls.renderer =
                value;
        },
        renderScene,
        rebuildGui
    );

    const isStereo =
        controls.renderer === "anaglyph"
        ||
        controls.renderer === "rds";

    if (isStereo) {

        const options =
            controls.stereoPairs.map(
                (p, i) => ({

                    label: p.name,

                    value:
                        String(i)
                })
            );

        createSlider(
            stereoGroup,
            "Eye separation",
            0,
            0.5,
            0.005,
            controls.ipd,    // stereo.eyeSeparation,
            value => {

                controls.ipd = // stereo.eyeSeparation =
                    value;
            },
            renderScene
        );

        if (controls.renderer === "rds" && controls.phiAnimation) {
            controls.derivatives ??= {};
            controls.derivatives.ipd ??= 0;
            createNumberInput(
                stereoGroup,
                "d(Eye separation)/dt (m/s)",
                controls.derivatives.ipd,
                value => {
                    controls.derivatives.ipd = value;
                    renderScene();
                }
            );
        }

        createSelect(
            stereoGroup,
            "Stereo pair",
            options,
            String(
                controls.stereoPairs
                    .findIndex(
                        p =>
                            p.id ===
                            controls.selectedStereoPairId
                    )
            ),
            value => {

                controls.selectedStereoPairId =
                    controls.stereoPairs[
                        Number(value)
                    ].id;
            },
            renderScene,
            rebuildGui
        );

        const stereo =
            getSelectedStereo();

        if (stereo) {

            const stereoPairGroup =
                createSection(
                    stereoGroup,
                    "Stereo pair",
                    true
                );

            // createTextInput(
            //     stereoPairGroup,
            //     "Stereo group name",
            //     stereo.name,
            //     value => {

            //         stereo.name =
            //             value;
            //     }
            // );

            createSlider(
                stereoPairGroup,
                "Axis angle",
                -180,
                180,
                1,
                stereo.angle * 180 / Math.PI,
                value => {
                    stereo.angle =
                        Math.round(value * Math.PI / 180);
                    
                    stereo.name =
                        `Interocular axis @ ${Math.round(value)}°`; 
                },
                renderScene,
                undefined,
                () => {
                    requestAnimationFrame(
                        () => rebuildGui()
                    );
                }
            );

            if (controls.renderer === "rds" && controls.phiAnimation) {
                stereo.derivatives ??= {};
                stereo.derivatives.angle ??= 0;
                createNumberInput(
                    stereoPairGroup,
                    "d(Axis angle)/dt (rad/s)",
                    stereo.derivatives.angle,
                    value => {
                        stereo.derivatives.angle = value;
                        renderScene();
                    }
                );
            }

            createSelect(
                stereoPairGroup,
                "Scene",
                scenes.map(
                    scene => ({
                        label: scene.name,
                        value: String(scene.id)
                    })
                ),
                String(
                    stereo.sceneId ??
                    scenes[0]?.id ??
                    ""
                ),
                value => {
                    stereo.sceneId = Number(value);
                    // console.log("Selected scene ID for stereo pair:", stereo.sceneId);
                },
                renderScene,
                rebuildGui
            );

            createButton(
                stereoPairGroup,
                "Delete",
                () => {

                    const idx =
                        controls.stereoPairs
                            .findIndex(
                                p =>
                                    p.id ===
                                    stereo.id
                            );

                    if (idx >= 0) {

                        controls.stereoPairs
                            .splice(idx, 1);

                        controls.selectedStereoPairId =
                            controls.stereoPairs[0]?.id
                            ?? null;

                        rebuildGui();
                        renderScene();
                    }
                }
            );
        }

        createButton(
            stereoGroup,
            "New stereo pair",
            () => {

                const newStereoPair = {
                    id: nextStereoIdRef.value++,
                    name: `Interocular axis @0°`,
                    angle: 0,
                    derivatives: { angle: 0 },
                    sceneId: scenes[0]?.id
                };

                controls.stereoPairs
                    .push(newStereoPair);

                controls.selectedStereoPairId =
                    newStereoPair.id;

                rebuildGui();
                renderScene();
            }
        );
    }

    createSlider(
        stereoGroup,
        "Screen distance",
        0.1,
        1,
        0.05,
        controls.screenDistance,
        value => {

            controls.screenDistance =
                value;
        },
        renderScene
    );

    if (controls.renderer === "rds" && controls.phiAnimation) {
        controls.derivatives ??= {};
        controls.derivatives.screenDistance ??= 0;
        createNumberInput(
            stereoGroup,
            "d(Screen distance)/dt (m/s)",
            controls.derivatives.screenDistance,
            value => {
                controls.derivatives.screenDistance = value;
                renderScene();
            }
        );
        controls.derivatives.screenWidth ??= 0;
        createNumberInput(
            stereoGroup,
            "d(Screen width)/dt (m/s)",
            controls.derivatives.screenWidth,
            value => {
                controls.derivatives.screenWidth = value;
                renderScene();
            }
        );
    }

    // createSlider(
    //     stereoGroup,
    //     "Screen width",
    //     0.02,
    //     1,
    //     0.01,
    //     controls.screenWidth,
    //     value => {

    //         controls.screenWidth =
    //             value;
    //     },
    //     renderScene
    // );

    if (controls.renderer === "rds") {

        createSlider(
            stereoGroup,
            "Dot sigma",
            0.1,
            5,
            0.1,
            controls.rdasDotSigma,
            value => {

                controls.rdasDotSigma =
                    value;
            },
            renderScene
        );

        createSlider(
            stereoGroup,
            "Max no of dots",
            0,
            6,
            0.1,
            Math.log10(
                controls.rdasMaxDots
            ),
            value => {

                controls.rdasMaxDots =
                    Math.pow(
                        10,
                        value
                    );
            },
            renderScene,
            {
                toDisplay:
                    value =>
                        String(
                            Math.round(
                                Math.pow(
                                    10,
                                    value
                                )
                            )
                        ),

                fromDisplay:
                    value =>
                        Math.log10(
                            value
                        ),

                displayStep: 1
            }
        );

        createSlider(
            stereoGroup,
            "Max dot families",
            0,
            6,
            0.1,
            Math.log10(
                controls.rdasMaxClans
            ),
            value => {

                controls.rdasMaxClans =
                    Math.pow(
                        10,
                        value
                    );
            },
            renderScene,
            {
                toDisplay:
                    value =>
                        String(
                            Math.round(
                                Math.pow(
                                    10,
                                    value
                                )
                            )
                        ),

                fromDisplay:
                    value =>
                        Math.log10(
                            value
                        ),

                displayStep: 1
            }
        );

        createSlider(
            stereoGroup,
            "Max generations",
            0,
            200,
            1,
            controls.rdasMaxRecursionDepth,
            value => {

                controls.rdasMaxRecursionDepth =
                    value;
            },
            renderScene
        );

        createSlider(
            stereoGroup,
            "Next-gen brightness factor",
            0,
            1,
            0.01,
            controls.rdasNextGenerationBrightnessFactor,
            value => {

                controls.rdasNextGenerationBrightnessFactor =
                    value;
            },
            renderScene
        );

        createSlider(
            stereoGroup,
            "Min brightness",
            0,
            1,
            0.01,
            controls.rdasMinBrightness,
            value => {

                controls.rdasMinBrightness =
                    value;
            },
            renderScene
        );

        createSlider(
            stereoGroup,
            "Dot suppression threshold",
            0,
            1,  // 255,
            0.01,
            controls.rdasDotSuppressionThreshold,
            value => {

                controls.rdasDotSuppressionThreshold =
                    value;
            },
            renderScene
        );

        createSwitch(
            stereoGroup,
            "N-Epipolar-Directions Stereogram (NEDS)",
            controls.useAllStereoPairs,
            value => {

                controls.useAllStereoPairs =
                    value;
            },
            renderScene,
            rebuildGui
        );

        createSwitch(
            stereoGroup,
            "Phi Animation",
            controls.phiAnimation,
            value => {
                controls.phiAnimation = value;
            },
            renderScene,
            rebuildGui
        );

        // createSwitch(
        //     stereoGroup,
        //     "Debug",
        //     controls.debug,
        //     value => {
        //         controls.debug = value;
        //     },
        //     renderScene,
        //     rebuildGui
        // );

    }
}