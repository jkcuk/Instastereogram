import { Vector3 } from "../core/Vector3.js"
import { Rectangle } from "../geometry/Rectangle.js"
import { Colour } from "../materials/Colour.js"
import { Screen } from "../renderer/Screen.js"
import { Ray } from "../core/Ray.js"
// Render the scene twice, once from a left-eye camera and once from a
// right-eye camera, then combine the two results into a red/cyan anaglyph.
export class RDASRenderer {
    cameraPosition; // Array of pairs of left/right camera positions for each interocular-axis direction.  Each pair is an array of two Vector3s, one for the left camera and one for the right camera.
    screen;
    // Keep one camera for each eye so the viewer gets a stereo baseline.
    screenRectangle;
    maxRecursionDepth = 20; // Maximum recursion depth for bairns
    maxDots = 200000; // Maximum number of dots
    dots = 0;
    maxClans = 20000; // Maximum number of clans (i.e. parent dots) to be drawn
    dotSigma = 1; // Gaussian width of Gaussian-shaped dots
    nextGenerationBrightnessFactor = 0.9;
    minBrightness = 0.2;
    dotSuppressionThreshold = 1; // threshold for determining if a dot is already there (in the range [0, 1])
    debug = false;
    phiAnimation = false;

    n = 0;
    m = 0;

    // Create the stereo pair and let both cameras share the same screen plane.
    constructor(
        cameraPosition = [[new Vector3(-0.03, 0, 0), new Vector3(0.03, 0, 0)]], 
        screen
    ) {
        this.cameraPosition = cameraPosition;
        this.screen = screen;
        this.screenRectangle = new Rectangle(screen.center, screen.hHalfAxis, screen.vHalfAxis, screen.hHalfAxis.length() * 2, screen.vHalfAxis.length() * 2, new Colour([1, 0, 0]) // material is not needed for the screen rectangle
        );
    }
    
    addFamilyDots(
        pParentDot, // position of parent dot
        rgbComponentIndex, // red = 0, green = 1, blue = 2
        brightness, 
        iIOD, // index of interocular-axis direction
        iCamera, // index of camera that corresponds to interocular-axis direction #iIOD; 0 or 1
        scene, // array of scenes; need at least one per interocular-axis direction
        recursionDepth // current recursion depth
    ) {
        if (recursionDepth > this.maxRecursionDepth || this.dots >= this.maxDots || brightness < this.minBrightness) {
            if(this.debug) console.log("Stopping recursion at depth " + recursionDepth + " with brightness " + brightness + " and dots " + this.dots);
            return; // Stop recursion if maximum level reached or if maximum number of dots reached
        }
        // Recursively add a family of bairn dots
        for (let iIOD2 = 0; iIOD2 < this.cameraPosition.length; iIOD2++)
            for (let iCamera2 = 0; iCamera2 < 2; iCamera2++)
                if ((iIOD2 !== iIOD) || (iCamera2 === iCamera)) {
                    if(this.debug) console.log("Adding bairn dot at depth " + recursionDepth + " with brightness " + brightness + " and dots " + this.dots);
                    this.addBairnDot(pParentDot, rgbComponentIndex, brightness, iIOD2, iCamera2, scene, recursionDepth);
                }
    }

    // calculate the position of a particular bairn dot, given the position of its parent dot, draw it, and
    // calculate repeat recursively
    addBairnDot(
        pParentDot, // position of parent dot
        rgbComponentIndex, // red = 0, green = 1, blue = 2
        brightness, 
        iIOD, // index of interocular-axis direction
        iCamera, // index of camera that corresponds to interocular-axis direction #iIOD; 0 or 1
        scene, // array of scenes; need at least one per interocular-axis direction
        recursionDepth // current recursion depth
    ) {
        if(this.debug) console.log("Adding bairn dot at depth " + recursionDepth + " with brightness " + brightness + " and dots " + this.dots);
        if (this.dots >= this.maxDots) {
            if(this.debug) console.log("Stopping recursion at depth " + recursionDepth + " with brightness " + brightness + " and dots " + this.dots);
            return; // Stop recursion if maximum number of dots reached
        }
        // construct the position that corresponds to the bairn
        // first, cast a ray from camera #parentCameraIndex of 
        // interocular-axis-direction #iod to the parent dot position, ...
        const ray1 = new Ray(this.cameraPosition[iIOD][iCamera], pParentDot.sub(this.cameraPosition[iIOD][iCamera]));
        // ... find where it intersects scene #iod, ...
        const sceneHit1 = scene[iIOD].hit(ray1);
        if (!sceneHit1) {
            if(this.debug) console.log("Skipping bairn dot at (" + pParentDot.x + ", " + pParentDot.y + ", " + pParentDot.z + ") because there is no intersection with scene " + iIOD);
            return; // No intersection with scene
        }
        // ... cast a ray from the scene-intersection position to the other camera
        // (#(1-iCamera)) of the interocular-axis direction
        const sceneHit12camera2 = this.cameraPosition[iIOD][1 - iCamera].sub(sceneHit1.p);
        const ray2 = new Ray(sceneHit1.p, sceneHit12camera2);
        // // ... cast a ray from the other camera (#1-parentCameraIndex) of 
        // // interocular-axis-direction #iod to the intersection position, ...
        // const ray2 = new Ray(
        //   this.cameraPosition[iIOD][1-iCamera], 
        //   hitRecord.p.sub(this.cameraPosition[iIOD][1-iCamera])
        // );
        // ... and find its intersection with the autostereogram screen plane.  Its position is the position of the bairn dot.
        const screenHit = this.screenRectangle.tphvHit(ray2);
        // Check that the bairn-dot position is on the screen plane and within the screen bounds
        if (!screenHit) {
            if(this.debug) console.log("Skipping bairn dot at (" + pParentDot.x + ", " + pParentDot.y + ", " + pParentDot.z + ") because there is no intersection with the screen plane");
            return; // No intersection with screen plane
        }
        // also check that there isn't some other intersection with the scene between the scene-intersection position
        // and the second eye
        const sceneHit2 = scene[iIOD].hit(ray2);
        if (sceneHit2 && sceneHit2.t < sceneHit12camera2.length()) {
            if(this.debug) console.log("Skipping bairn dot at ("+this.screen.h2i(screenHit.h)+", "+this.screen.v2j(screenHit.v)+") because of obstruction");
            return; // There is an intersection with the scene before reaching the eye
        }
        // check if there is already a dot there
        if (
            this.screen.getRGBComponent(screenHit.h, screenHit.v, rgbComponentIndex) 
            >=
            255*brightness*this.dotSuppressionThreshold
            //this.alreadyThereThreshold // 255*this.minBrightness
        ) {
            if(this.debug) console.log("Skipping bairn dot at ("+this.screen.h2i(screenHit.h)+", "+this.screen.v2j(screenHit.v)+") because there is already a dot there (brightness "+this.screen.getRGBComponent(screenHit.h, screenHit.v, rgbComponentIndex)+" >= "+255*brightness*this.dotSuppressionThreshold+")");
            return; // There is already a dot there (brightness > this.alreadyThereThreshold), so skip this bairn dot
        }
        // Draw the bairn dot at the calculated position
        // this.screen.placeGaussianDot(screenHit.h, screenHit.v, colour);
        this.screen.placeGaussianDot(screenHit.h, screenHit.v, rgbComponentIndex, brightness, this.dotSigma);
        // this.screen.placeDisc(screenHit.h, screenHit.v, rgbComponentIndex, brightness, this.dotSigma);
        this.dots++;
        this.addFamilyDots(
            screenHit.p, // position of parent dot
            rgbComponentIndex, // red = 0, green = 1, blue = 2 
            brightness * this.nextGenerationBrightnessFactor, 
            iIOD, // index of interocular-axis direction
            iCamera, // index of camera that corresponds to interocular-axis direction #iIOD; 0 or 1
            scene, // array of scenes; need at least one per interocular-axis direction
            recursionDepth + 1 // current recursion depth
        );
    }

    // render multi-angle single-image random-dot stereogram
    render(
        scene // array of scenes; need at least one per interocular-axis direction
    ) {
        if (scene.length < this.cameraPosition.length) {
            alert("Each interocular-axis direction requires its own scene.  Currently there are " + this.cameraPosition.length + " interocular-axis directions, but only " + scene.length + " scenes.");
            return;
        }
        this.dots = 0;
        // uncomment this to place first dot in centre of canvas
        // let h=0;
        // let v=0;
        for (let f = 0; f < this.maxClans && this.dots < this.maxDots; f++) {
            // comment this out to place first dot in centre of canvas
            // Randomly choose a position on the screen for the parent dot
            const h = Math.random() * 2 - 1; // horizontal position in normalized device coordinates [-1, 1]
            const v = Math.random() * 2 - 1; // vertical position in normalized device coordinates [-1, 1]

            // Randomly choose a color for the dot
            const rgbComponentIndex = Math.floor(Math.random() * 3); // 0 for red, 1 for green, 2 for blue
            // initial brightness of the dot
            const brightness = 1; // in the range [0, 1]
            // this.screen.placeGaussianDot(h, v, color, this.dotSigma);
            this.screen.placeGaussianDot(h, v, rgbComponentIndex, brightness, this.dotSigma);
            // this.screen.placeDisc(h, v, rgbComponentIndex, brightness, this.dotSigma);
            // this.screen.placeGaussianDot(h, v, color);
            if(this.debug) {
                this.n = 0;
                this.m = 0;
            }
            this.addFamilyDots(
                this.screen.hv2World(h, v), // position of parent dot
                rgbComponentIndex, // red = 0, green = 1, blue = 2 
                brightness * this.nextGenerationBrightnessFactor, // initial brightness
                -1, // -1 means no bairns excluded
                -1, // -1 means no bairns excluded
                scene, 1 // current recursion depth
            );
            // uncomment this to place first dot in centre of canvas
            // // Randomly choose a position on the screen for the parent dot
            // h = Math.random() * 2 - 1; // horizontal position in normalized device coordinates [-1, 1]
            // v = Math.random() * 2 - 1; // vertical position in normalized device coordinates [-1, 1]
        }
        this.screen.showImage();
        // ctx.putImageData(image, 0, 0);
    }
}
