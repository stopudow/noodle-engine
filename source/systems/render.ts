import { loop, sys } from "noodle";

export default class Render
{
    public context : CanvasRenderingContext2D;

    public constructor()
    {
        this.context =  sys.canvas.getContext("2d") as CanvasRenderingContext2D;

        loop.addSystem(this._clear.bind(this));

        console.log("Init Render (Clear)");
    }

    private _clear()
    {
        const ctx = this.context;

        ctx.resetTransform();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}