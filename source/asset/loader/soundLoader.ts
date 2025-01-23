import IAssetLoader from "../contract/IAssetLoader";

import SoundAsset from "../../asset/resource/soundAsset";

export default abstract class SoundLoader implements IAssetLoader
{
    public get supportedExtensions() : string[]
    {
        return ["ogg", "mp3", "wav"];
    }

    public abstract loadAsset(assetName: string): void;

    protected _createAsset(assetName : string, decodedData : AudioBuffer | HTMLAudioElement) : SoundAsset
    {
        return new SoundAsset(assetName, decodedData);
    }
}