import {
    createSlider,
    createSelect,
    createSection
}
from "./elements.js";

export function createObjectPanel({

    root,

    sceneManager,

    renderScene,

    rebuildGui,

    Vector3,

    createTextInput,

    createColorPicker

}) {

    const object =
        sceneManager.getSelectedObject();

    if (!object)
        return;

    const editor =
        createSection(
            root,
            `Edit: ${object.name}`,
            true
        );

    // createTextInput(
    //     editor,
    //     "Name",
    //     object.name,
    //     value => {

    //         object.name =
    //             value;
    //     }
    // );

    createSlider(
        editor,
        "x",
        -0.2,
        0.2,
        0.001,
        object.position?.x ?? 0,
        value => {

            object.position =
                new Vector3(
                    value,
                    object.position?.y ?? 0,
                    object.position?.z ?? -0.1
                );
        },
        renderScene
    );

    createSlider(
        editor,
        "y",
        -0.2,
        0.2,
        0.001,
        object.position?.y ?? 0,
        value => {

            object.position =
                new Vector3(
                    object.position?.x ?? 0,
                    value,
                    object.position?.z ?? -0.1
                );
        },
        renderScene
    );

    createSlider(
        editor,
        "z",
        -1,
        -0.01,
        0.001,
        object.position?.z ?? -0.1,
        value => {

            object.position =
                new Vector3(
                    object.position?.x ?? 0,
                    object.position?.y ?? 0,
                    value
                );
        },
        renderScene
    );

    if (
        object.kind === "sphere"
        ||
        object.kind === "disc"
    ) {

        createSlider(
            editor,
            "Radius",
            0.01,
            0.1,
            0.001,
            object.radius ?? 0.01,
            value => {

                object.radius =
                    value;
            },
            renderScene
        );
    }

    if (
        object.kind === "cylinder"
        ||
        object.kind === "cone"
    ) {

        createSlider(
            editor,
            "Axis x",
            -1,
            1,
            0.01,
            object.axis?.x ?? 0,
            value => {

                object.axis =
                    new Vector3(
                        value,
                        object.axis?.y ?? 1,
                        object.axis?.z ?? 0
                    );
            },
            renderScene
        );

        createSlider(
            editor,
            "Axis y",
            -1,
            1,
            0.01,
            object.axis?.y ?? 1,
            value => {

                object.axis =
                    new Vector3(
                        object.axis?.x ?? 0,
                        value,
                        object.axis?.z ?? 0
                    );
            },
            renderScene
        );

        createSlider(
            editor,
            "Axis z",
            -1,
            1,
            0.01,
            object.axis?.z ?? 0,
            value => {

                object.axis =
                    new Vector3(
                        object.axis?.x ?? 0,
                        object.axis?.y ?? 1,
                        value
                    );
            },
            renderScene
        );
    }

    if (object.kind === "cylinder") {

        createSlider(
            editor,
            "Radius",
            0.01,
            0.1,
            0.001,
            object.radius ?? 0.1,
            value => {

                object.radius =
                    value;
            },
            renderScene
        );

        createSlider(
            editor,
            "Length",
            0,
            0.5,
            0.001,
            object.length ?? 0.1,
            value => {

                object.length =
                    value;
            },
            renderScene
        );
    }

    if (object.kind === "cone") {

        createSlider(
            editor,
            "Angle [°]",
            0,
            90,
            1,
            (object.angle ?? 0.45)
            * 180
            / Math.PI,
            value => {

                object.angle =
                    value *
                    Math.PI /
                    180;
            },
            renderScene
        );

        createSlider(
            editor,
            "Height",
            0,
            1,
            0.01,
            object.coneHeight ?? 0.1,
            value => {

                object.coneHeight =
                    value;
            },
            renderScene
        );
    }

    if (
        object.kind === "plane"
        ||
        object.kind === "disc"
    ) {

        createSlider(
            editor,
            "Normal X",
            -1,
            1,
            0.01,
            object.normal?.x ?? 0,
            value => {

                object.normal =
                    new Vector3(
                        value,
                        object.normal?.y ?? 1,
                        object.normal?.z ?? 0
                    );
            },
            renderScene
        );

        createSlider(
            editor,
            "Normal Y",
            -1,
            1,
            0.01,
            object.normal?.y ?? 1,
            value => {

                object.normal =
                    new Vector3(
                        object.normal?.x ?? 0,
                        value,
                        object.normal?.z ?? 0
                    );
            },
            renderScene
        );

        createSlider(
            editor,
            "Normal Z",
            -1,
            1,
            0.01,
            object.normal?.z ?? 0,
            value => {

                object.normal =
                    new Vector3(
                        object.normal?.x ?? 0,
                        object.normal?.y ?? 1,
                        value
                    );
            },
            renderScene
        );
    }

    if (
        object.kind === "parallelogram"
        ||
        object.kind === "rectangle"
    ) {

        createSlider(
            editor,
            "hAxis x",
            -1,
            1,
            0.01,
            object.hAxis?.x ?? 1,
            value => {

                object.hAxis =
                    new Vector3(
                        value,
                        object.hAxis?.y ?? 0,
                        object.hAxis?.z ?? 0
                    );
            },
            renderScene
        );

        createSlider(
            editor,
            "hAxis y",
            -1,
            1,
            0.01,
            object.hAxis?.y ?? 0,
            value => {

                object.hAxis =
                    new Vector3(
                        object.hAxis?.x ?? 0.05,
                        value,
                        object.hAxis?.z ?? 0
                    );
            },
            renderScene
        );

        createSlider(
            editor,
            "hAxis z",
            -1,
            1,
            0.01,
            object.hAxis?.z ?? 0,
            value => {

                object.hAxis =
                    new Vector3(
                        object.hAxis?.x ?? 0.05,
                        object.hAxis?.y ?? 0,
                        value
                    );
            },
            renderScene
        );

        createSlider(
            editor,
            "vAxis x",
            -1,
            1,
            0.01,
            object.vAxis?.x ?? 0,
            value => {

                object.vAxis =
                    new Vector3(
                        value,
                        object.vAxis?.y ?? 0.05,
                        object.vAxis?.z ?? 0
                    );
            },
            renderScene
        );

        createSlider(
            editor,
            "vAxis y",
            -1,
            1,
            0.01,
            object.vAxis?.y ?? 0.05,
            value => {

                object.vAxis =
                    new Vector3(
                        object.vAxis?.x ?? 0,
                        value,
                        object.vAxis?.z ?? 0
                    );
            },
            renderScene
        );

        createSlider(
            editor,
            "vAxis z",
            -1,
            1,
            0.01,
            object.vAxis?.z ?? 0,
            value => {

                object.vAxis =
                    new Vector3(
                        object.vAxis?.x ?? 0,
                        object.vAxis?.y ?? 0,
                        value
                    );
            },
            renderScene
        );
    }

    if (object.kind === "rectangle") {

        createSlider(
            editor,
            "Width",
            0.01,
            1,
            0.01,
            object.width ?? 0.1,
            value => {

                object.width =
                    value;
            },
            renderScene
        );

        createSlider(
            editor,
            "Height",
            0.01,
            1,
            0.01,
            object.height ?? 0.1,
            value => {

                object.height =
                    value;
            },
            renderScene
        );
    }

    if (object.kind === "cuboid") {

        for (const corner of ["min", "max"]) {

            for (const component of ["x", "y", "z"]) {

                createSlider(
                    editor,
                    `${corner} ${component}`,
                    -1,
                    1,
                    0.01,
                    object[corner]?.[component] ?? 0,
                    value => {

                        object[corner] =
                            new Vector3(
                                object[corner]?.x ?? 0,
                                object[corner]?.y ?? 0,
                                object[corner]?.z ?? 0
                            );

                        object[corner][component] =
                            value;
                    },
                    renderScene
                );
            }
        }
    }

    if (object.kind === "text") {

        createTextInput(
            editor,
            "Text",
            object.text ?? "Hello",
            value => {

                object.text =
                    value;

                renderScene();
            }
        );

        createTextInput(
            editor,
            "Font",
            object.font ??
            "bold 64px sans-serif",
            value => {

                object.font =
                    value;

                renderScene();
            }
        );

        createSlider(
            editor,
            "Width",
            0.01,
            0.5,
            0.001,
            object.rectWidth ?? 0.1,
            value => {

                object.rectWidth =
                    value;
            },
            renderScene
        );

        createSlider(
            editor,
            "Height",
            0.01,
            0.5,
            0.001,
            object.rectHeight ?? 0.05,
            value => {

                object.rectHeight =
                    value;
            },
            renderScene
        );
    }

    createSelect(
        editor,
        "Material",
        [
            {
                label: "Colour",
                value: "colour"
            },
            {
                label: "Metal",
                value: "metal"
            },
            {
                label: "Phong",
                value: "phong"
            },
            {
                label: "Dielectric",
                value: "dielectric"
            }
        ],
        object.material,
        value => {

            object.material =
                value;
        },
        renderScene,
        rebuildGui
    );

    if (
        object.material ===
        "dielectric"
    ) {

        createSlider(
            editor,
            "Refractive Index",
            1.0,
            2.5,
            0.01,
            object.ior ?? 1.5,
            value => {

                object.ior =
                    value;
            },
            renderScene
        );
    }

    if (
        object.material !==
        "dielectric"
    ) {

        createColorPicker(
            editor,
            "Color",
            object.color ??
            "#ffffff",
            value => {

                object.color =
                    value;
            }
        );
    }
}