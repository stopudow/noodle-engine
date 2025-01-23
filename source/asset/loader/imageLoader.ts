import IAssetLoader from "../contract/IAssetLoader";
import ImageAsset from "../resource/imageAsset";

import { assets } from "noodle";

export default class ImageLoader implements IAssetLoader
{
    public get supportedExtensions() : string[]
    {
        return ["png", "gif", "jpg"];
    }

    public loadAsset(assetName: string): void 
    {
        let image : HTMLImageElement = new Image();

        image.onload = this._onLoad.bind(this, assetName, image);
        image.onerror = this._onError.bind(this, assetName);

        image.src = assetName;
    }

    private _onLoad(assetName : string, image : HTMLImageElement) : void 
    {
        let asset = new ImageAsset(assetName, image);

        assets.onAssetLoaded(asset);

        //console.info("Image loaded: ", assetName);
    }

    private _onError(assetName : string) : void 
    {
        assets.onAssetLoadError();
        
        console.error("Image not loaded: ", assetName);
    }
}