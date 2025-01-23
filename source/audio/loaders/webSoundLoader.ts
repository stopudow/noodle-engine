import ISoundLoader from "../contract/ISoundLoader";
import WebSound from "../processor/webSound";
import SoundAsset from "../../asset/resource/soundAsset";

export default class WebSoundLoader implements ISoundLoader
{
    private _context : AudioContext;

    public constructor()
    {
        this._context = new AudioContext();
    }

    public load(asset: SoundAsset, loop: boolean = false) : WebSound
    {
        return new WebSound(this._context, asset.data as AudioBuffer, loop);
    }
}