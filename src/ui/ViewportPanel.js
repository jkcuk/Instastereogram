import {
    createSlider,
    createButton,
    createSection
}
from "./elements.js";

export function createViewportPanel({
    root,
    camera,
    controls,
    requestRender,
    requestViewportUiUpdate,
    toggleFullscreen
}) {

    const viewportGroup =
        createSection(
            root,
            "Viewport",
            true
        );

    const centreXSlider =
        createSlider(
            viewportGroup,
            "Centre X",
            -1,
            1,
            0.001,
            camera.centre.x,
            value => {

                camera.setCentre(
                    value,
                    camera.centre.y,
                    camera.centre.z
                );
            },
            requestRender
        );

    const centreYSlider =
        createSlider(
            viewportGroup,
            "Centre Y",
            -1,
            1,
            0.001,
            camera.centre.y,
            value => {

                camera.setCentre(
                    camera.centre.x,
                    value,
                    camera.centre.z
                );
            },
            requestRender
        );

    const centreZSlider =
        createSlider(
            viewportGroup,
            "Centre Z",
            -1,
            1,
            0.001,
            camera.centre.z,
            value => {

                camera.setCentre(
                    camera.centre.x,
                    camera.centre.y,
                    value
                );
            },
            requestRender
        );

    const widthSlider =
        createSlider(
            viewportGroup,
            "Width",
            0.01,
            2,
            0.001,
            camera.width,
            value => {

                camera.width =
                    value;
            },
            requestRender
        );

    const euler =
        camera.getEulerAngles();

    const yawSlider =
        createSlider(
            viewportGroup,
            "Yaw",
            -180,
            180,
            1,
            euler.yaw,
            value => {

                const e =
                    camera.getEulerAngles();

                camera.setEulerAngles(
                    value,
                    e.pitch,
                    e.roll
                );
            },
            requestRender
        );

    const pitchSlider =
        createSlider(
            viewportGroup,
            "Pitch",
            -89,
            89,
            1,
            euler.pitch,
            value => {

                const e =
                    camera.getEulerAngles();

                camera.setEulerAngles(
                    e.yaw,
                    value,
                    e.roll
                );
            },
            requestRender
        );

    const rollSlider =
        createSlider(
            viewportGroup,
            "Roll",
            -180,
            180,
            1,
            euler.roll,
            value => {

                const e =
                    camera.getEulerAngles();

                camera.setEulerAngles(
                    e.yaw,
                    e.pitch,
                    value
                );
            },
            requestRender
        );
    
    const row = document.createElement( "div" );
    row.style.display = "flex";
    row.style.gap = "6px";
    row.style.alignItems = "center";

    createButton(
        row,
        "Reset view",
        () => {

            camera.reset(
                controls.screenWidth
            );

            requestViewportUiUpdate();
            requestRender();
        }
    );

    createButton(
        row,
        "Toggle full screen",
        toggleFullscreen
    );

    viewportGroup.appendChild( row );

    return {
        centreXSlider,
        centreYSlider,
        centreZSlider,
        widthSlider,
        yawSlider,
        pitchSlider,
        rollSlider
    };
}