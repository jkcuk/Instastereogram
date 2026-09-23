import {
    createButton,
    createSmallButton,
    createSelect,
    createSection
}
from "./elements.js";

export function createScenePanel({
    root,
    scenes,
    sceneManager,
    renderScene,
    rebuildGui,
    duplicateCurrentScene,
    deleteCurrentScene,
    addSceneObject,
    removeSceneObject,
    nextObjectIdRef,
    nextSceneIdRef,
    Vector3
}) {

    // --------------------------------------------------
    // Scene
    // --------------------------------------------------

    const sceneGroup =
        createSection(
            root,
            "Scenes",
            true
        );

    // const sceneSelectOptions =
    //     scenes.map(
    //         (scene, index) => ({

    //             label:
    //                 scene.name,

    //             value:
    //                 String(index)
    //         })
    //     );

    // createSelect(
    //     sceneGroup,
    //     "Scene",
    //     sceneSelectOptions,
    //     String(
    //         sceneManager.currentSceneIndex
    //     ),
    //     value => {

    //         sceneManager.selectScene(
    //             Number(value)
    //         );
    //     },
    //     renderScene,
    //     rebuildGui
    // );


    for (
        let i = 0;
        i < scenes.length;
        i++
    ) {

        const scene =
            scenes[i];

        const row =
            document.createElement(
                "div"
            );

        row.style.display =
            "flex";

        row.style.gap =
            "6px";

        row.style.alignItems =
            "center";

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.textContent =
            scene.name;

        button.style.flex =
            "1";

        button.style.textAlign =
            "left";

        button.style.padding =
            "0.5rem";

        button.style.borderRadius =
            "8px";

        button.style.cursor =
            "pointer";

        button.style.color =
            "#fff";

        button.style.border =
            i ===
            sceneManager.currentSceneIndex

                ? "2px solid #66ccff"

                : "1px solid rgba(255,255,255,0.15)";

        button.style.background =
            i ===
            sceneManager.currentSceneIndex

                ? "rgba(102,204,255,0.15)"

                : "rgba(255,255,255,0.05)";

        button.addEventListener(
            "click",
            () => {

                sceneManager.selectScene(
                    i
                );

                renderScene();
                rebuildGui();
            }
        );

        // button.addEventListener(
        //     "dblclick",
        //     e => {

        //         e.stopPropagation();

        //         const input =
        //             document.createElement(
        //                 "input"
        //             );

        //         input.type =
        //             "text";

        //         input.value =
        //             scene.name;

        //         input.style.flex =
        //             "1";

        //         input.style.padding =
        //             "0.5rem";

        //         row.replaceChild(
        //             input,
        //             button
        //         );

        //         input.focus();
        //         input.select();

        //         function finish() {

        //             const newName =
        //                 input.value.trim();

        //             if (newName) {

        //                 scene.name =
        //                     newName;
        //             }

        //             rebuildGui();
        //             renderScene();
        //         }

        //         input.addEventListener(
        //             "keydown",
        //             e => {

        //                 if (
        //                     e.key === "Enter"
        //                 ) {
        //                     finish();
        //                 }

        //                 if (
        //                     e.key === "Escape"
        //                 ) {
        //                     rebuildGui();
        //                 }
        //             }
        //         );

        //         input.addEventListener(
        //             "blur",
        //             finish
        //         );
        //     }
        // );

        const renameBtn =
            document.createElement(
                "button"
            );

        renameBtn.textContent =
            "✎";

        renameBtn.title =
            "Rename scene";

        renameBtn.style.width =
            "20px";

        renameBtn.style.height =
            "20px";

        // renameBtn.addEventListener(
        //     "click",
        //     e => {

        //         e.stopPropagation();

        //         const newName =
        //             prompt(
        //                 "Scene name:",
        //                 scene.name
        //             );

        //         if (
        //             newName &&
        //             newName.trim()
        //         ) {

        //             scene.name =
        //                 newName.trim();

        //             rebuildGui();
        //         }
        //     }
        // );

        renameBtn.addEventListener(
            "click",
            e => {

                e.stopPropagation();

                button.disabled = true;

                button.textContent = "";

                const input =
                    document.createElement(
                        "input"
                    );

                input.type =
                    "text";

                input.value =
                    scene.name;

                input.style.width =
                    "100%";

                input.style.boxSizing =
                    "border-box";

                button.appendChild(
                    input
                );

                input.focus();
                input.select();

                function finish() {

                    const newName =
                        input.value.trim();

                    if (newName) {

                        scene.name =
                            newName;
                    }

                    rebuildGui();
                }

                input.addEventListener(
                    "keydown",
                    e => {

                        if (
                            e.key === "Enter"
                        ) {

                            finish();
                        }

                        if (
                            e.key === "Escape"
                        ) {

                            rebuildGui();
                        }
                    }
                );

                input.addEventListener(
                    "blur",
                    finish
                );
            }
        );

        const upBtn =
            document.createElement(
                "button"
            );

        upBtn.textContent =
            "↑";

        upBtn.title =
            "Move scene up";

        upBtn.style.width =
            "20px";

        upBtn.style.height =
            "20px";

        upBtn.style.borderRadius =
            "1px";

        upBtn.style.border =
            "1px solid rgba(255,255,255,0.2)";

        upBtn.style.background =
            "rgba(200,200,255,0.15)";

        upBtn.style.color =
            "#fff";

        upBtn.style.cursor =
            "pointer";

        upBtn.addEventListener(
            "click",
            e => {

                e.stopPropagation();

                sceneManager.moveSceneUp(
                    i
                );

                renderScene();
                rebuildGui();
            }
        );

        const downBtn =
            document.createElement(
                "button"
            );

        downBtn.textContent =
            "↓";

        downBtn.title =
            "Move scene down";

        downBtn.style.width =
            "20px";

        downBtn.style.height =
            "20px";

        downBtn.style.borderRadius =
            "1px";

        downBtn.style.border =
            "1px solid rgba(255,255,255,0.2)";

        downBtn.style.background =
            "rgba(200,200,255,0.15)";

        downBtn.style.color =
            "#fff";

        downBtn.style.cursor =
            "pointer";

        downBtn.addEventListener(
            "click",
            e => {

                e.stopPropagation();

                sceneManager.moveSceneDown(
                    i
                );

                renderScene();
                rebuildGui();
            }
        );

        row.append(
            button,
            renameBtn,
            upBtn,
            downBtn
        );

        sceneGroup.appendChild(
            row
        );
    }


    const sceneControls =
        document.createElement("div");

    sceneControls.style.display =
        "flex";

    sceneControls.style.gap =
        "6px";

    createButton(
        sceneControls,
        "New",
        () => {

            scenes.push({

                id:
                    nextSceneIdRef.value++,

                name:
                    `Scene ${
                        scenes.length + 1
                    }`,

                objects: []
            });

            sceneManager.selectScene(
                scenes.length - 1
            );

            renderScene();
            rebuildGui();
        }
    );

    createButton(
        sceneControls,
        "Duplicate",
        duplicateCurrentScene
    );

    createButton(
        sceneControls,
        "Delete",
        deleteCurrentScene
    );

    sceneGroup.appendChild(
        sceneControls
    );

    // --------------------------------------------------
    // Scene Object List
    // --------------------------------------------------

    const sceneObjectsGroup =
        createSection(
            root,
            "Scene Objects",
            true
        );

    for (
        const object of
        sceneManager
            .getCurrentScene()
            .objects
    ) {

        const row =
            document.createElement(
                "div"
            );

        row.style.display =
            "flex";

        row.style.gap =
            "6px";

        row.style.alignItems =
            "center";

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.textContent =
            `${object.name} (${object.kind})`;

        button.style.flex =
            "1";

        button.style.textAlign =
            "left";

        button.style.padding =
            "0.5rem";

        button.style.borderRadius =
            "8px";

        button.style.cursor =
            "pointer";

        button.style.color =
            "#fff";

        button.style.border =
            object.id ===
            sceneManager.selectedObjectId

                ? "2px solid #66ccff"

                : "1px solid rgba(255,255,255,0.15)";

        button.style.background =
            object.id ===
            sceneManager.selectedObjectId

                ? "rgba(102,204,255,0.15)"

                : "rgba(255,255,255,0.05)";

        button.addEventListener(
            "click",
            () => {

                sceneManager
                    .selectObject(
                        object.id
                    );

                rebuildGui();
            }
        );

        const renameBtn =
            document.createElement(
                "button"
            );

        renameBtn.textContent =
            "✎";

        renameBtn.title =
            "Rename object";

        renameBtn.style.width =
            "20px";

        renameBtn.style.height =
            "20px";

        renameBtn.style.borderRadius =
            "1px";

        renameBtn.style.border =
            "1px solid rgba(255,255,255,0.2)";

        renameBtn.style.background =
            "rgba(255,255,255,0.08)";

        renameBtn.style.color =
            "#fff";

        renameBtn.style.cursor =
            "pointer";
            
        renameBtn.addEventListener(
            "click",
            e => {

                e.stopPropagation();

                button.disabled =
                    true;

                const oldLabel =
                    button.textContent;

                button.textContent =
                    "";

                const input =
                    document.createElement(
                        "input"
                    );

                input.type =
                    "text";

                input.value =
                    object.name;

                input.style.width =
                    "100%";

                input.style.boxSizing =
                    "border-box";

                button.appendChild(
                    input
                );

                input.focus();
                input.select();

                function finish() {

                    const newName =
                        input.value.trim();

                    if (newName) {

                        object.name =
                            newName;
                    }

                    rebuildGui();
                }

                input.addEventListener(
                    "keydown",
                    e => {

                        if (
                            e.key === "Enter"
                        ) {

                            finish();
                        }

                        if (
                            e.key === "Escape"
                        ) {

                            button.textContent =
                                oldLabel;

                            rebuildGui();
                        }
                    }
                );

                input.addEventListener(
                    "blur",
                    finish
                );
            }
        );

        const upBtn =
            document.createElement(
                "button"
            );

        upBtn.textContent = "↑";

        upBtn.title =
            "Move up";

        upBtn.style.width =
            "20px";

        upBtn.style.height =
            "20px";

        upBtn.style.borderRadius =
            "1px";

        upBtn.style.border =
            "1px solid rgba(255,255,255,0.2)";

        upBtn.style.background =
            "rgba(200,200,255,0.15)";

        upBtn.style.color =
            "#fff";

        upBtn.style.cursor =
            "pointer";

        upBtn.addEventListener(
            "click",
            e => {

                e.stopPropagation();

                sceneManager
                    .moveObjectUp(
                        object.id
                    );

                renderScene();
                rebuildGui();
            }
        );

        const downBtn =
            document.createElement(
                "button"
            );

        downBtn.textContent =
            "↓";

        downBtn.title =
            "Move down";

        downBtn.style.width =
            "20px";

        downBtn.style.height =
            "20px";

        downBtn.style.borderRadius =
            "1px";

        downBtn.style.border =
            "1px solid rgba(255,255,255,0.2)";

        downBtn.style.background =
            "rgba(200,200,255,0.15)";

        downBtn.style.color =
            "#fff";

        downBtn.style.cursor =
            "pointer";

        downBtn.addEventListener(
            "click",
            e => {

                e.stopPropagation();

                sceneManager
                    .moveObjectDown(
                        object.id
                    );

                renderScene();
                rebuildGui();
            }
        );

        const duplicateBtn =
            document.createElement(
                "button"
            );

        duplicateBtn.textContent =
            "x2";

        duplicateBtn.title =
            "Duplicate object";

        duplicateBtn.style.width =
            "26px";

        duplicateBtn.style.height =
            "20px";

        duplicateBtn.style.borderRadius =
            "1px";

        duplicateBtn.style.border =
            "1px solid rgba(255,255,255,0.2)";

        duplicateBtn.style.background =
            "rgba(80,180,255,0.15)";

        duplicateBtn.style.color =
            "#fff";

        duplicateBtn.style.cursor =
            "pointer";

        duplicateBtn.style.fontSize =
            "12px";

        duplicateBtn.style.lineHeight =
            "1";

        duplicateBtn.addEventListener(
            "click",
            e => {

                e.stopPropagation();

                sceneManager.duplicateObject(
                    object.id,
                    nextObjectIdRef.value++
                );

                renderScene();
                rebuildGui();
            }
        );

        const deleteBtn =
            document.createElement(
                "button"
            );

        deleteBtn.textContent =
            "−";

        deleteBtn.title =
            "Delete object";

        deleteBtn.style.width =
            "20px";

        deleteBtn.style.height =
            "20px";

        deleteBtn.style.borderRadius =
            "1px";

        deleteBtn.style.border =
            "1px solid rgba(255,255,255,0.2)";

        deleteBtn.style.background =
            "rgba(255,80,80,0.15)";

        deleteBtn.style.color =
            "#fff";

        deleteBtn.style.cursor =
            "pointer";

        deleteBtn.style.fontSize =
            "16px";

        deleteBtn.style.lineHeight =
            "1";

        deleteBtn.addEventListener(
            "click",
            e => {

                e.stopPropagation();

                removeSceneObject(
                    object.id
                );
            }
        );

        row.append(
            button,
            renameBtn,
            upBtn,
            downBtn,
            duplicateBtn,
            deleteBtn
        );

        sceneObjectsGroup
            .appendChild(
                row
            );
    }

    const addRow =
        document.createElement(
            "div"
        );

    addRow.style.display =
        "flex";

    addRow.style.gap =
        "6px";

    addRow.style.alignItems =
        "center";

    const select =
        document.createElement(
            "select"
        );

    select.style.flex =
        "1";

    const options = [

        {
            label: "Cone",
            value: "cone"
        },

        {
            label: "Cylinder",
            value: "cylinder"
        },

        {
            label: "Cuboid",
            value: "cuboid"
        },

        {
            label: "Disc",
            value: "disc"
        },

        {
            label: "Parallelogram",
            value: "parallelogram"
        },

        {
            label: "Rectangle",
            value: "rectangle"
        },

        {
            label: "Plane",
            value: "plane"
        },

        {
            label: "Sphere",
            value: "sphere"
        },

        {
            label: "Text",
            value: "text"
        }
    ];

    for (const opt of options) {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            opt.value;

        option.textContent =
            opt.label;

        select.appendChild(
            option
        );
    }

    addRow.append(
        select
    );

    createSmallButton(
        addRow,
        "+",
        () => {

            addSceneObject(
                select.value
            );
        }
    );

    sceneObjectsGroup
        .appendChild(
            addRow
        );
}