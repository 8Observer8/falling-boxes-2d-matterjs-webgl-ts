export let gl: WebGLRenderingContext;

export class WebGLContext
{
    public static Init(canvasName: string): boolean
    {
        const canvas = document.getElementById(canvasName) as HTMLCanvasElement;
        if (!canvas)
        {
            console.log("Failed to get the HTML5 canvas element");
            return false;
        }

        gl = canvas.getContext("webgl");
        if (!gl)
        {
            console.log("Failed to get WebGL 1.0 rendering context");
            return false;
        }

        return true;
    }
}
