import { GraphicsWidget } from "./graphicsWidget";

import Text, { Weight } from "graphics/text";

export class LabelWidget extends GraphicsWidget<Text>
{
    public set text(value: string)
    {
        const renderer = this._renderer;

        renderer.text = value;

        this.height = renderer.height;
        this.width = renderer.width;
    }

    public set weight(value: Weight)
    {
        const renderer = this._renderer;

        renderer.weight = value;

        this.height = renderer.height;
        this.width = renderer.width;
    }

    public set size(value: number)
    {
        const renderer = this._renderer;

        renderer.size = value;

        this.height = renderer.height;
        this.width = renderer.width;
    }

    public set fillColor(value: string)
    {
        this._renderer.fillColor = value;
    }

    public set strokeColor(value: string)
    {
        this._renderer.strokeColor = value;
    }

    constructor(tag: string)
    {
        const graphics = new Text();

        super(graphics, tag);
    }
}