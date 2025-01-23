import { render } from "noodle";
import IGraphics from "./contract/IGraphics";

export enum Weight
{
    THIN = "Thin",
    EXTRA_LIGHT = "Extra Light",
    LIGHT = "Light",
    REGULAR = "Regular",
    MEDIUM = "Medium",
    SEMI_BOLD = "Semi Bold",
    BOLD = "Bold",
    ITALIC = "Italic",
    EXTRA_BOLD = "Extra Bold",
    BLACK = "Black",
    EXTRA_BLACK = "Extra Black"
}

export enum Style
{
    FILL,
    STROKE,
    FILL_AND_STROKE
}

export default class Text implements IGraphics
{
    public _text : string[] = [""];

    public fillColor   : string = "white";
    public strokeColor : string = "black";

    public strokeWidth : number = 4;

    private _config : string = "";

    private _font   : string = "Arial";
    private _size   : number = 16;
    private _weight : Weight = Weight.REGULAR;

    private _maxWidth : number = 200;
    private _lineHeight : number = 24;

    private _style : Style = Style.FILL;
    
    private _styleCallback : DrawFunction = this._fillText;
    
    public set text(value : string)
    {
        this._text = value.split('\n');
    }

    public get text() : string[]
    {
        return this._text;
    }

    public set style(value : Style)
    {
        this._style = value;

        switch(value)
        {
            case Style.FILL:
                this._styleCallback = this._fillText;
                break;
            case Style.STROKE:
                this._styleCallback = this._strokeText;
                break;
            case Style.FILL_AND_STROKE:
                this._styleCallback = this._fillStrokeText;
                break;
        }
    }

    public get style() : Style
    {
        return this._style;
    }

    public get weight () : Weight
    {
        return this._weight;
    }

    public set weight(value : Weight)
    {
        this._weight = value;
        this.setConfig();
    }

    public get font() : string
    {
        return this._font;
    }

    public set font(value : string)
    {
        this._font = value;
        this.setConfig();
    }

    public get size() : number
    {
        return this._size;
    }

    public set size(value : number)
    {
        this._size = value;
        this.setConfig();
    }

    public get maxWidth() : number
    {
        return this._maxWidth;
    }

    public set maxWidth(value : number)
    {
        this._maxWidth = value;
    }

    public get lineHeight() : number
    {
        return this._lineHeight;
    }

    public set lineHeight(value : number)
    {
        this._lineHeight = value;
    }

    public get height() : number
    {
        return this._lineHeight * this._text.length;
    }

    public get width() : number
    {
        const longest = this._text.reduce(
            function (a, b) {
                return a.length > b.length ? a : b;
            }
        );

        return this._testStringWidth(longest);
    }

    private setConfig()
    {
        this._config = `${this._weight} ${this._size}px ${this._font}`;
    }

    public draw(ctx : RenderContext) : void 
    {
        ctx.miterLimit=2;

        ctx.font = this._config;
        ctx.textBaseline = "top";

        this._styleCallback(ctx);
    }

    private _strokeText(ctx : RenderContext)
    {
        const lines = this._text;

        ctx.strokeStyle = this.fillColor;
        ctx.lineWidth   = this.strokeWidth;

        for (var i = 0; i < lines.length; i++)
            ctx.strokeText(lines[i], 0, i * this._lineHeight);
    }

    private _fillText(ctx : RenderContext)
    {
        const lines = this._text;

        ctx.fillStyle = this.fillColor;

        for (let i = 0; i < lines.length; i++)
            ctx.fillText(lines[i], 0, i * this._lineHeight);
    }

    private _fillStrokeText(ctx : RenderContext)
    {
        this._strokeText(ctx);
        this._fillText(ctx);
    }
    
    // private _testStringHeight(value : string) : number
    // {
    // 	const context = render.context;

    // 	context.font = this._config;

    // 	const metrics = context.measureText(value);

    // 	return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    // }

    private _testStringWidth(value : string) : number
    {
        const context = render.context;

        context.font = this._config;

        return context.measureText(value).width;
    }
}