import ImageAsset from "asset/resource/imageAsset";
import IGraphics from "./contract/IGraphics";

export enum ImageType
{
	NONE,
	SIMPLE,
	SLICED,
	//TILED,
}

export default class Image implements IGraphics
{
	public declare asset : ImageAsset;

	public width  : number = 1;
	public height : number = 1;

	public borderLeft   : number = 0;
	public borderRight  : number = 0;

	public borderTop    : number = 0;
	public borderBottom : number = 0;

	private _imageType : ImageType = ImageType.NONE;

	private _drawCallback : DrawFunction = this._drawEmpty;
	
	public get imageType() : ImageType
	{
		return this._imageType;
	}

	public set imageType(value : ImageType)
	{
		this._imageType = value;

		switch(value)
		{
			case ImageType.NONE:
				this._drawCallback = this._drawEmpty;
				break;
			case ImageType.SIMPLE:
				if (this.asset)
					this._drawCallback = this._drawSimple;
				break;
			case ImageType.SLICED:
				if (this.asset)
					this._drawCallback = this._drawNinepatch;
				break;
		}
	}

	public draw(ctx : RenderContext) : void 
	{
		this._drawCallback(ctx);
	}

	private _drawSimple(ctx : RenderContext)
	{
		ctx.drawImage(this.asset.data, 0, 0, this.width, this.height);
	}

	private _drawNinepatch(ctx : RenderContext)
	{
		const image = this.asset.data;

		const width  = this.width;
		const height = this.height;

		const bl = this.borderLeft;
		const br = this.borderRight;

		const bt = this.borderTop;
		const bb = this.borderBottom;

		const iw  = width  - bl - br;
		const ih  = height - bt - bb;

		const imgiw = image.width  - bl - br;
		const imgih = image.height - bt - bb;

		ctx.drawImage(image, 0, 0, bl, bt, 0, 0, bl + 1, bt + 1);                                                   // TOP-LEFT
		ctx.drawImage(image, bl, 0, imgiw, bt, bl, 0, iw + 1, bt + 1);                                              // TOP
		ctx.drawImage(image, image.width - br, 0, br, bt, width - br, 0, br + 1, bt + 1);                           // TOP-RIGHT
		ctx.drawImage(image, 0, bt, bl, imgih, 0, bt, bl + 1, ih + 1);                                              // LEFT
		ctx.drawImage(image, bl, bt, imgiw, imgih, bl, bt, iw + 1, ih + 1);                                         // CENTER
		ctx.drawImage(image, image.width - br, bt, br, imgih, width - br, bt, br + 1, ih + 1);                      // RIGHT
		ctx.drawImage(image, 0, image.height - bb, bl, bb, 0, height - bb, bl + 1, bb + 1);                         // BOTTOM-LEFT
		ctx.drawImage(image, bl, image.height - bb, imgiw, bb, bl, height - bb, iw + 1, bb + 1);                    // BOTTOM
		ctx.drawImage(image, image.width - br, image.height - bb, br, bb, width - br, height - bb, br + 1, bb + 1); // BOTTOM-RIGHT
	}

	private _drawEmpty(ctx : RenderContext)
	{
		ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
		ctx.fillRect(-this.width * 0.5, -this.height * 0.5, this.width, this.height);
	}
}