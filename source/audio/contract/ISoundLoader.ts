import SoundAsset from "asset/resource/soundAsset";
import ISound from "./ISound";

export default interface ISoundLoader
{
    load(asset: SoundAsset, loop: boolean) : ISound;
}