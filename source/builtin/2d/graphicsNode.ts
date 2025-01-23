import { Node } from "noodle";

import IGraphics from "graphics/contract/IGraphics";

export class GraphicsNode<Type extends IGraphics> extends Node
{
    protected _renderer : Type;

    constructor(type : Type, tag : string)
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