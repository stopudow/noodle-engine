import IAsset from "../contract/IAsset";

export default class SoundAsset implements IAsset
{
    public readonly name : string;
    public readonly data : AudioBuffer | HTMLAudioElement;

    public constructor(name : string, data : AudioBuffer | HTMLAudioElement)
    {
        this.name = name;
        this.data = data;
    }	

    public get duration() : number
    {
        return this.data.duration;
    }
}