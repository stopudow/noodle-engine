import { TypedEvent, sys } from "noodle";

export default class View
{
    public readonly changed : TypedEvent<void>;

    public designWidth  : number = 480;
    public designHeight : number = 854;

    private _pixelRatio : number = 1;
    private _scale : number = 1;

    private _fitHeight : number = 1;
    private _fitWidth  : number = 1;

    private _canvas : HTMLCanvasElement;

    public get fitHeight() : boolean
    {
        return this._fitHeight ? true : false;
    }

    public set fitHeight(value : boolean)
    {
        this._fitHeight = value ? 1 : 0;
    }

    public get fitWidth() : boolean
    {
        return this._fitWidth ? true : false;
    }

    public set fitWidth(value : boolean)
    {
        this._fitWidth = value ? 1 : 0;
    }

    public get visibleWidth() : number
    {
        return this._canvas.width / this._scale;
    }

    public get visibleHeight() : number
    {
        return this._canvas.height / this._scale;
    }

    public get canvasWidth() : number
    {
        return this._canvas.width;
    }

    public get canvasHeight() : number {
        return this._canvas.height;
    }

    public get pixelRatio() : number
    {
        return this._pixelRatio;
    }

    public get scale() : number
    {
        return this._scale;
    }

    public constructor()
    {
        this.changed = new TypedEvent<void>();
        
        this._canvas = sys.canvas;

        sys.windowResize.on(this._resize, this);
        sys.windowLoad.on(this._resize, this);

        this._resize();
    }

    private _resize()
    {
        const width  = window.innerWidth;
        const height = window.innerHeight;

        const scaleX = width  / this.designWidth;
        const scaleY = height / this.designHeight;

        const pixelRatio = Math.ceil(window.devicePixelRatio);

        const scale = Math.min(
              scaleX * this._fitWidth  * pixelRatio || 1, 
              scaleY * this._fitHeight * pixelRatio || 1);

        this._pixelRatio = pixelRatio;
        this._scale = scale;
        
        const canvas = this._canvas;

        canvas.width  = width * pixelRatio; 
        canvas.height = height * pixelRatio;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        this.changed.emit();
    }
}
