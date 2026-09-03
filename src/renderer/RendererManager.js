import { Renderer } from "./Renderer.js";
import { AnaglyphRenderer } from "./AnaglyphRenderer.js";
import { RDASRenderer } from "./RDASRenderer.js";
import { Screen } from "./Screen.js";

export class RendererManager {

    render({
        camera,
        controls,
        canvas,
        ctx,
        scenes,
        getSelectedStereo,
        meanIPD
    }) {

        const hw =
            0.5 * camera.width;

        const hh =
            hw *
            canvas.height /
            canvas.width;

        const screen =
            new Screen(
                camera.centre,
                camera.u.mul(hw),
                camera.v.mul(hh),
                canvas.width,
                canvas.height,
                ctx
            );

        if (
            controls.renderer ===
            "standard"
        ) {

            const renderer =
                new Renderer(
                    camera.n.mul(
                        // -camera.centre.z // 
                        controls.screenDistance
                    ),
                    screen
                );

            renderer.render(
                ctx,
                canvas.width,
                canvas.height,
                scenes[0]
            );

            return;
        }

        if (
            controls.renderer ===
            "anaglyph"
        ) {

            const stereo =
                getSelectedStereo();

            const sep = controls.ipd;
                // stereo?.eyeSeparation
                // ?? meanIPD;

            const angle =
                stereo?.angle
                ?? 0;

            const h =
                sep / 2 *
                Math.cos(angle);

            const v =
                sep / 2 *
                Math.sin(angle);

            const renderer =
                new AnaglyphRenderer(
                    [
                        camera.u.mul(-h)
                            .add(
                                camera.v.mul(-v)
                            )
                            .add(
                                camera.n.mul(
                                    controls
                                    .screenDistance
                                )
                            ),

                        camera.u.mul(+h)
                            .add(
                                camera.v.mul(+v)
                            )
                            .add(
                                camera.n.mul(
                                    controls
                                    .screenDistance
                                )
                            )
                    ],
                    screen
                );

            renderer.render(
                ctx,
                canvas.width,
                canvas.height,
                scenes[0]
            );

            return;
        }

        // rds renderer

        const pairs =
            controls.useAllStereoPairs
                ? controls.stereoPairs
                : [getSelectedStereo()]
                    .filter(Boolean);   // removes null if getSelectedStereo() returns null 

        const eyeSets =
            pairs.map(stereo => {

                const h = controls.ipd / 2 * Math.cos( stereo.angle );
                const v = controls.ipd / 2 * Math.sin( stereo.angle );

                return [
                    camera.u.mul(-h)
                        .add( camera.v.mul(-v) )
                        .add( camera.n.mul( controls.screenDistance ) ),
                    camera.u.mul(+h)
                        .add( camera.v.mul(+v) )
                        .add( camera.n.mul( controls.screenDistance ) )
                ];
            });
        
        const renderer =
            new RDASRenderer(
                eyeSets,
                screen
            );

        renderer.dotSigma = controls.rdasDotSigma;
        renderer.maxDots = controls.rdasMaxDots;
        renderer.maxClans = controls.rdasMaxClans;
        renderer.maxRecursionDepth = controls.rdasMaxRecursionDepth;
        renderer.nextGenerationBrightnessFactor = controls.rdasNextGenerationBrightnessFactor;
        renderer.minBrightness = controls.rdasMinBrightness;
        renderer.dotSuppressionThreshold = controls.rdasDotSuppressionThreshold;
        renderer.debug = controls.debug;

        renderer.render( scenes );
    }
}