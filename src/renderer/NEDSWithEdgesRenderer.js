// Need to adapt this

// --------------------------------------------------
// COMPLETE WEBGL2 EXAMPLE
// Three RGBA textures modulated by sinusoidal
// brightness functions with independent phases.
// --------------------------------------------------

const vertexShaderSource = `#version 300 es

in vec2 position;

out vec2 vUv;

void main()
{
    vUv = 0.5 * (position + 1.0);

    gl_Position =
        vec4(
            position,
            0.0,
            1.0
        );
}
`;

const fragmentShaderSource = `#version 300 es

precision highp float;

in vec2 vUv;

uniform sampler2D tex1;
uniform sampler2D tex2;
uniform sampler2D tex3;

uniform float omegaT;   // omega * time

uniform float phase1;
uniform float phase2;
uniform float phase3;

out vec4 fragColor;

void main()
{
    vec4 c1 = texture(tex1, vUv);
    vec4 c2 = texture(tex2, vUv);
    vec4 c3 = texture(tex3, vUv);

    // the modulation factors
    float m1 = 0.5 * ( 1.0 + sin( omegaT + phase1 ) );
    float m2 = 0.5 * ( 1.0 + sin( omegaT + phase2 ) );
    float m3 = 0.5 * ( 1.0 + sin( omegaT + phase3 ) );

    vec4 result = vec4(0.0);

    // first combine phases 1 and 3 (i.e. the images for t-Delta t and t+Delta t)
    result.rgb = clamp( c1.rgb * c1.a * m1 + c3.rgb * c3.a * m3, 0.0, 1.0 );

    // then combine with phase 2 (i.e. the image for t), which takes precedence
    result.rgb = result.rgb * (1.0 - c2.a * m2) + c2.rgb * c2.a * m2; 
    result.a = 1.0;

    fragColor = clamp( result, 0.0, 1.0 );
}
`;


// --------------------------------------------------
// SHADER UTILITIES
// --------------------------------------------------

function createShader(gl, type, source)
{
    const shader =
        gl.createShader(type);

    gl.shaderSource(
        shader,
        source
    );

    gl.compileShader(
        shader
    );

    if (
        !gl.getShaderParameter(
            shader,
            gl.COMPILE_STATUS
        )
    ) {
        throw new Error(
            gl.getShaderInfoLog(
                shader
            )
        );
    }

    return shader;
}

function createProgram(
    gl,
    vertexSource,
    fragmentSource
)
{
    const vs =
        createShader(
            gl,
            gl.VERTEX_SHADER,
            vertexSource
        );

    const fs =
        createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragmentSource
        );

    const program =
        gl.createProgram();

    gl.attachShader(
        program,
        vs
    );

    gl.attachShader(
        program,
        fs
    );

    gl.linkProgram(
        program
    );

    if (
        !gl.getProgramParameter(
            program,
            gl.LINK_STATUS
        )
    ) {
        throw new Error(
            gl.getProgramInfoLog(
                program
            )
        );
    }

    return program;
}


// --------------------------------------------------
// TEXTURE LOADING
// --------------------------------------------------

function loadTexture(gl, url)
{
    return new Promise(
        (resolve, reject) =>
        {
            const image =
                new Image();

            image.onload =
                () =>
                {
                    const texture =
                        gl.createTexture();

                    gl.bindTexture(
                        gl.TEXTURE_2D,
                        texture
                    );

                    gl.texParameteri(
                        gl.TEXTURE_2D,
                        gl.TEXTURE_WRAP_S,
                        gl.CLAMP_TO_EDGE
                    );

                    gl.texParameteri(
                        gl.TEXTURE_2D,
                        gl.TEXTURE_WRAP_T,
                        gl.CLAMP_TO_EDGE
                    );

                    gl.texParameteri(
                        gl.TEXTURE_2D,
                        gl.TEXTURE_MIN_FILTER,
                        gl.LINEAR
                    );

                    gl.texParameteri(
                        gl.TEXTURE_2D,
                        gl.TEXTURE_MAG_FILTER,
                        gl.LINEAR
                    );

                    gl.texImage2D(
                        gl.TEXTURE_2D,
                        0,
                        gl.RGBA,
                        gl.RGBA,
                        gl.UNSIGNED_BYTE,
                        image
                    );

                    resolve(texture);
                };

            image.onerror =
                reject;

            image.src =
                url;
        }
    );
}


// --------------------------------------------------
// MAIN
// --------------------------------------------------

async function main()
{
    const canvas =
        document.querySelector(
            "canvas"
        );

    const gl =
        canvas.getContext(
            "webgl2"
        );

    if (!gl)
    {
        throw new Error(
            "WebGL2 not available"
        );
    }

    const program =
        createProgram(
            gl,
            vertexShaderSource,
            fragmentShaderSource
        );

    // Fullscreen quad

    const vao =
        gl.createVertexArray();

    gl.bindVertexArray(
        vao
    );

    const quad =
        new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,

            -1,  1,
             1, -1,
             1,  1
        ]);

    const buffer =
        gl.createBuffer();

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        buffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        quad,
        gl.STATIC_DRAW
    );

    const positionLocation =
        gl.getAttribLocation(
            program,
            "position"
        );

    gl.enableVertexAttribArray(
        positionLocation
    );

    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    // Load textures

    const [
        texture1,
        texture2,
        texture3
    ] =
    await Promise.all([
        loadTexture(
            gl,
            "texture1.png"
        ),
        loadTexture(
            gl,
            "texture2.png"
        ),
        loadTexture(
            gl,
            "texture3.png"
        )
    ]);

    // Uniform locations

    const uniforms = {

        tex1:
            gl.getUniformLocation(
                program,
                "tex1"
            ),

        tex2:
            gl.getUniformLocation(
                program,
                "tex2"
            ),

        tex3:
            gl.getUniformLocation(
                program,
                "tex3"
            ),

        time:
            gl.getUniformLocation(
                program,
                "time"
            ),

        frequency1:
            gl.getUniformLocation(
                program,
                "frequency1"
            ),

        frequency2:
            gl.getUniformLocation(
                program,
                "frequency2"
            ),

        frequency3:
            gl.getUniformLocation(
                program,
                "frequency3"
            ),

        phase1:
            gl.getUniformLocation(
                program,
                "phase1"
            ),

        phase2:
            gl.getUniformLocation(
                program,
                "phase2"
            ),

        phase3:
            gl.getUniformLocation(
                program,
                "phase3"
            )
    };

    function render(timeMs)
    {
        const t =
            timeMs * 0.001;

        gl.viewport(
            0,
            0,
            canvas.width,
            canvas.height
        );

        gl.clearColor(
            0.0,
            0.0,
            0.0,
            1.0
        );

        gl.clear(
            gl.COLOR_BUFFER_BIT
        );

        gl.useProgram(
            program
        );

        gl.bindVertexArray(
            vao
        );

        // texture 1

        gl.activeTexture(
            gl.TEXTURE0
        );

        gl.bindTexture(
            gl.TEXTURE_2D,
            texture1
        );

        gl.uniform1i(
            uniforms.tex1,
            0
        );

        // texture 2

        gl.activeTexture(
            gl.TEXTURE1
        );

        gl.bindTexture(
            gl.TEXTURE_2D,
            texture2
        );

        gl.uniform1i(
            uniforms.tex2,
            1
        );

        // texture 3

        gl.activeTexture(
            gl.TEXTURE2
        );

        gl.bindTexture(
            gl.TEXTURE_2D,
            texture3
        );

        gl.uniform1i(
            uniforms.tex3,
            2
        );

        // modulation parameters

        gl.uniform1f(
            uniforms.time,
            t
        );

        gl.uniform1f(
            uniforms.frequency1,
            1.0
        );

        gl.uniform1f(
            uniforms.frequency2,
            1.0
        );

        gl.uniform1f(
            uniforms.frequency3,
            1.0
        );

        gl.uniform1f(
            uniforms.phase1,
            0.0
        );

        gl.uniform1f(
            uniforms.phase2,
            2.0 * Math.PI / 3.0
        );

        gl.uniform1f(
            uniforms.phase3,
            4.0 * Math.PI / 3.0
        );

        gl.drawArrays(
            gl.TRIANGLES,
            0,
            6
        );

        requestAnimationFrame(
            render
        );
    }

    requestAnimationFrame(
        render
    );
}

main();