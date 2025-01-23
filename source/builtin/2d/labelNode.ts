import { GraphicsNode } from "./graphicsNode";

import Text from "graphics/text";

export class LabelNode extends GraphicsNode<Text>
{
    public get label() : Text
    {
        return this._renderer;
    }
    
    constructor(tag: string)
    {
        const graphics = new Text();
        
        super(graphics, tag);
    }
}