import { assets } from "noodle";

import SoundLoader from "./soundLoader";

export default class HTMLSoundLoader extends SoundLoader
{
    public loadAsset(assetName: string): void 
    {
        let audio = new Audio();

        audio.onload = this._onLoad.bind(this, assetName, audio);
        audio.onerror = this._onError.bind(this, assetName);

        audio.src = assetName;
    }

    private _onLoad(assetName: string, audio : HTMLAudioElement) : void 
    {
        let asset = this._createAsset(assetName, audio);

        assets.onAssetLoaded(asset);

        console.info("Sound loaded: ", assetName);
    }

    private _onError(assetName: string) : void 
    {
        assets.onAssetLoadError();
        
        console.error("Sound not loaded: ", assetName);
    }
}