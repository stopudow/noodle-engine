import { Widget } from "noodle";

import IGraphics from "graphics/contract/IGraphics";

export class GraphicsWidget<Type extends IGraphics> extends Widget
{
    protected _renderer: Type;

    constructor(type: Type, tag: string)
    {
        super(tag);

        this._renderer = type;
    }

    protected draw(ctx: RenderContext): void 
    {
        this.applyTransform(ctx);
        
        this._renderer.draw(ctx);
    }
}