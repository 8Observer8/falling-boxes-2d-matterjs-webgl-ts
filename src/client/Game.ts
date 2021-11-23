import { mat4 } from "gl-matrix";
import * as Matter from "matter-js";
import Box from "./Box";
import { gl, WebGLContext } from "./WebGLContext";

export default class Game
{
    private _matterEngine: Matter.Engine;
    private _bigBox: Box;
    private _smallBox: Box;
    private _ground: Box;
    private _projViewMatrix: mat4;

    public constructor()
    {
        if (!WebGLContext.Init("renderCanvas")) return;

        var vertexShaderSource =
            `attribute vec2 aPosition;
            uniform mat4 uMvpMatrix;
            
            void main()
            {
                gl_Position = uMvpMatrix * vec4(aPosition, 0.0, 1.0);
            }`;

        var fragmentShaderSource =
            `precision mediump float;
        
            uniform vec3 uColor;

            void main()
            {
                gl_FragColor = vec4(uColor, 1.0);
            }`;

        var vShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vShader, vertexShaderSource);
        gl.compileShader(vShader);

        var fShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fShader, fragmentShaderSource);
        gl.compileShader(fShader);

        var program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        gl.clearColor(0.8, 0.937, 0.937, 1.0);

        const projMatrix = mat4.create();
        const viewMatrix = mat4.create();
        this._projViewMatrix = mat4.create();

        mat4.ortho(projMatrix, 0, 500, 500, 0, 100, -100);
        mat4.lookAt(viewMatrix, [0, 0, 50], [0, 0, 0], [0, 1, 0]);

        this._matterEngine = Matter.Engine.create();

        this._smallBox = new Box(225, 100, 50, 50, 0, [0.447, 0.631, 0.149], program, false, this._matterEngine);
        this._bigBox = new Box(250, 200, 50, 100, 0, [0.631, 0.368, 0.149], program, false, this._matterEngine);
        this._ground = new Box(250, 475, 500, 50, 0, [0.149, 0.631, 0.352], program, true, this._matterEngine);
        mat4.mul(this._projViewMatrix, projMatrix, viewMatrix);

        this.createPhysicsSimulation();
        this.draw();
    }

    private draw(): void
    {
        gl.clear(gl.COLOR_BUFFER_BIT);
        this._smallBox.draw(this._projViewMatrix);
        this._bigBox.draw(this._projViewMatrix);
        this._ground.draw(this._projViewMatrix);
        requestAnimationFrame(() => this.draw());
    }

    private createPhysicsSimulation(): void
    {
        setInterval(
            () =>
            {
                this.updatePhysics();
            }, 15);
    }

    private updatePhysics(): void
    {
        Matter.Engine.update(this._matterEngine);
        this._smallBox.update();
        this._bigBox.update();
    }
}
