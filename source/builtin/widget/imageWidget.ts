import ImageAsset from "asset/resource/imageAsset";
import { GraphicsWidget } from "./graphicsWidget";

import Image, { ImageType } from "graphics/image";

export class ImageWidget extends GraphicsWidget<Image>
{
    public get asset() : ImageAsset
    {
        return this._renderer.asset;
    }

    public set width(value : number)
    {
        this._localWidth = value;
        this._renderer.height = value;
        this._setDirty();
    }

    public set height(value : number)
    {
        this._localHeight = value;
        this._renderer.width = value;
        this._setDirty();
    }

    public set asset(asset: ImageAsset)
    {
        this._renderer.asset = asset;

        this.width = asset.height;
        this.height = asset.width;

        this._renderer.imageType = ImageType.SIMPLE;

        this._setDirty();
    }

    public set type(type: ImageType)
    {
        this._renderer.imageType = type;
    }

    public get type(): ImageType
    {
        return this._renderer.imageType;
    }
    
    constructor(tag: string)
    {
        const graphics = new Image();
        
        super(graphics, tag);
    }

    protected override applyTransform(ctx: CanvasRenderingContext2D): void 
    {
        this._adjust();

        this._renderer.width = this._width;
        this._renderer.height = this._height;

        super.applyTransform(ctx);
    }
}