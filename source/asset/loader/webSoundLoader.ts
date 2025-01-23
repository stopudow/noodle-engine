import SoundLoader from "./soundLoader";

import { assets, sys } from "noodle";

export default class WebSoundLoader extends SoundLoader
{
    public loadAsset(assetName: string): void 
    {
        let request = new XMLHttpRequest();

        request.responseType = "arraybuffer"; // Safari 5.1

        request.onload = this._onLoad.bind(this, assetName, request);
        request.onerror = this._onError.bind(this, assetName);

        request.open("GET", assetName, true);
        request.send();
    }

    private _onLoad(assetName: string, request : XMLHttpRequest) : void 
    {
        if (request.status === 200)
        {
            if (sys.audioContext) 
            {
                sys.audioContext.decodeAudioData
                (
                    request.response, 
                    this._onDecodeSuccess.bind(this, assetName), 
                    this._onDecodeError.bind(this, assetName)
                );
            }
            else 
            {
                assets.onAssetLoadError();
                console.error("Web Audio API not supported: " + assetName);
            }
        }
        else
        {
            assets.onAssetLoadError();
            console.error("Sound not loaded: " + assetName);
        }
    }

    private _onDecodeSuccess(assetName : string, decodedData: AudioBuffer) : void
    {
        let asset = this._createAsset(assetName, decodedData);

        assets.onAssetLoaded(asset);

        // console.info("Sound decode success: ", assetName);
    }

    private _onDecodeError(assetName: string) : void
    {
        assets.onAssetLoadError();
        console.error("Sound decode failed: ", assetName);
    }

    private _onError(assetName: string) : void 
    {
        assets.onAssetLoadError();
        console.error("Sound not loaded: ", assetName);
    }
}