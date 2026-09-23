import { Scene } from "./Scene.js";

import { Sphere } from "../geometry/Sphere.js";
import { Cylinder } from "../geometry/Cylinder.js";
import { Cone } from "../geometry/Cone.js";
import { Plane } from "../geometry/Plane.js";
import { Parallelogram } from "../geometry/Parallelogram.js";
import { Cuboid } from "../geometry/Cuboid.js";
import { Disc } from "../geometry/Disc.js";
import { Rectangle } from "../geometry/Rectangle.js";
import { Text } from "../geometry/Text.js";

import { Vector3 } from "../core/Vector3.js";

import { Colour } from "../materials/Colour.js";
import { Metal } from "../materials/Metal.js";
import { Phong } from "../materials/Phong.js";
import { Dielectric } from "../materials/Dielectric.js";

function parseColor(hexColor) {

    const value =
        hexColor.replace("#", "");

    const chunk =
        value.length === 3
            ? value
                .split("")
                .map(
                    p => p + p
                )
                .join("")
            : value;

    const red =
        parseInt(
            chunk.slice(0, 2),
            16
        ) / 255;

    const green =
        parseInt(
            chunk.slice(2, 4),
            16
        ) / 255;

    const blue =
        parseInt(
            chunk.slice(4, 6),
            16
        ) / 255;

    return [
        red,
        green,
        blue
    ];
}

export function buildScene(sceneData) {

    const builtScene =
        new Scene();

    for (const object of sceneData.objects) {

        const material =
            object.material === "metal"
                ? new Metal(
                    parseColor(
                        object.color ?? "#ffffff"
                    ),
                    object.fuzz ?? 0
                )

            : object.material === "phong"
                ? new Phong(
                    parseColor(
                        object.color ?? "#0000ff"
                    ),
                    new Vector3(
                        -1,
                        -1,
                        -1
                    )
                )

            : object.material === "colour"
                ? new Colour(
                    parseColor(
                        object.color ?? "#ffffff"
                    )
                )

            : new Dielectric(
                object.ior ?? 1.3
            );

        if (object.kind === "cone") {

            builtScene.add(
                new Cone(
                    object.position,
                    object.axis ??
                    new Vector3(
                        0,
                        1,
                        0.25
                    ),
                    object.angle ?? 0.45,
                    material,
                    object.coneHeight ?? 1.3
                )
            );

            continue;
        }

        if (object.kind === "cylinder") {

            builtScene.add(
                new Cylinder(
                    object.position,
                    object.axis ??
                    new Vector3(
                        1,
                        1,
                        0.5
                    ),
                    object.radius ?? 0.1,
                    material,
                    object.length ?? 0.1
                )
            );

            continue;
        }

        if (object.kind === "cuboid") {

            builtScene.add(
                new Cuboid(
                    object.min ??
                    new Vector3(-0.05, -0.05, -0.15),
                    object.max ??
                    new Vector3(0.05, 0.05, -0.05),
                    material
                )
            );

            continue;
        }

        if (object.kind === "disc") {

            builtScene.add(
                new Disc(
                    object.position,
                    object.normal ?? new Vector3(0, 0, 1),
                    object.radius ?? 0.05,
                    material
                )
            );

            continue;
        }

        if (object.kind === "rectangle") {

            builtScene.add(
                new Rectangle(
                    object.position,
                    object.hAxis ?? new Vector3(1, 0, 0),
                    object.vAxis ?? new Vector3(0, 1, 0),
                    object.width ?? 0.1,
                    object.height ?? 0.1,
                    material
                )
            );

            continue;
        }

        if (
            object.kind ===
            "parallelogram"
        ) {

            builtScene.add(
                new Parallelogram(
                    object.position,
                    object.hAxis ??
                    new Vector3(
                        0.05,
                        0,
                        0
                    ),
                    object.vAxis ??
                    new Vector3(
                        0,
                        0.05,
                        0
                    ),
                    material
                )
            );

            continue;
        }

        if (object.kind === "plane") {

            builtScene.add(
                new Plane(
                    object.position,
                    object.normal ??
                    new Vector3(
                        0,
                        0,
                        1
                    ),
                    material
                )
            );

            continue;
        }

        if (object.kind === "sphere") {

            builtScene.add(
                new Sphere(
                    object.position,
                    object.radius ?? 0.5,
                    material
                )
            );

            continue;
        }

        if (object.kind === "text") {

            builtScene.add(
                new Text(
                    object.position,
                    object.hAxis ??
                    new Vector3(
                        0.05,
                        0,
                        0
                    ),
                    object.vAxis ??
                    new Vector3(
                        0,
                        0.05,
                        0
                    ),
                    object.rectWidth ?? 0.1,
                    object.rectHeight ?? 0.05,
                    object.text ?? "Text",
                    object.font ??
                    "bold 64px sans-serif",
                    material
                )
            );
        }
    }

    return builtScene;
}