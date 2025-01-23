import ISoundLoader from "../contract/ISoundLoader";

import HTML5Sound from "../processor/htmlSound";
import SoundAsset from "../../asset/resource/soundAsset";

export default class HTMLSoundLoader implements ISoundLoader
{
    public load(asset: SoundAsset, loop: boolean = false) : HTML5Sound
    {
        return new HTML5Sound(asset.data as HTMLAudioElement, loop);
    }
}