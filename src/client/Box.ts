import { mat4 } from "gl-matrix";
import { gl } from "./WebGLContext";
import * as Matter from "matter-js";

export default class Box
{
    private _program: WebGLProgram;
    private _x: number;
    private _y: number;
    private _w: number;
    private _h: number;
    private _color: number[];
    private _body: Matter.Body;
    private _aPositionLocation: number;
    private _vbo: WebGLBuffer;
    private _uColorLocation: WebGLUniformLocation;
    private _uMvpMatrixLocation: WebGLUniformLocation;
    private _modelMatrix: mat4;
    private _mvpMatrix: mat4;
    private _radians: number;

    public constructor(x: number, y: number, w: number, h: number, radians: number, color: number[],
        program: WebGLProgram, isStatic: boolean, matterEngine: Matter.Engine)
    {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this._radians = radians;
        this._color = color;
        this._program = program;        

        const vertices = new Float32Array([
            -0.5, 0.5,
            0.5, 0.5,
            -0.5, -0.5,
            0.5, -0.5
        ]);

        this._vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        this._modelMatrix = mat4.create();
        this._mvpMatrix = mat4.create();

        this._aPositionLocation = gl.getAttribLocation(program, "aPosition");
        this._uColorLocation = gl.getUniformLocation(program, "uColor");
        this._uMvpMatrixLocation = gl.getUniformLocation(this._program, "uMvpMatrix");

        this._body = Matter.Bodies.rectangle(x, y, w, h, { isStatic: isStatic });
        Matter.World.add(matterEngine.world, this._body);
    }

    public draw(projViewMatrix: mat4): void
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.vertexAttribPointer(this._aPositionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._aPositionLocation);

        mat4.fromTranslation(this._modelMatrix, [this._x, this._y, 0]);
        mat4.rotateZ(this._modelMatrix, this._modelMatrix, this._radians);
        mat4.scale(this._modelMatrix, this._modelMatrix, [this._w, this._h, 1]);
        mat4.mul(this._mvpMatrix, projViewMatrix, this._modelMatrix);

        gl.uniformMatrix4fv(this._uMvpMatrixLocation, false, this._mvpMatrix);
        gl.uniform3fv(this._uColorLocation, this._color);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    public update(): void
    {
        this._x = this._body.position.x;
        this._y = this._body.position.y;
        this._radians = this._body.angle;
    }
}
