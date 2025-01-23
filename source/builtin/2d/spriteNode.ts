import { GraphicsNode } from "./graphicsNode";

import Image from "graphics/image";

export class SpriteNode extends GraphicsNode<Image>
{
    public get image() : Image
    {
        return this._renderer;
    }

    public get width() : number
    {
        return this._renderer.width;
    }

    public set width(value : number)
    {
        this._renderer.height = value;
    }

    public get height() : number
    {
        return this._renderer.height;
    }
    
    public set height(value : number)
    {
        this._renderer.width = value;
    }
    
    constructor(tag: string)
    {
        const graphics = new Image();
        
        super(graphics, tag);
    }
}