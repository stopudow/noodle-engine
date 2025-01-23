import ISound     from "./contract/ISound";
import SoundAsset from "asset/resource/soundAsset";

import ISoundLoader  from "./contract/ISoundLoader";

import HTMLSoundLoader from "./loaders/htmlSoundLoader";
import WebSoundLoader  from "./loaders/webSoundLoader";

import { assets, sys } from "noodle";

type SoundStorage = { [name : string] : ISound };

export default class SoundManager
{
    private _loader : ISoundLoader;
    private _sounds : SoundStorage = {};

    private _muted: boolean = false;
    private _suspended: boolean = false;

    public get mute() : boolean
    {
        return this._muted;
    }

    public set mute(value : boolean)
    {
        this._muted = value;
        this.stopAll;
    }

    public constructor()
    {
        if (sys.isWebAudioSupported)
            this._loader = new WebSoundLoader();
        else
            this._loader = new HTMLSoundLoader();

        sys.windowFocus.on(this.resume, this);
        sys.windowBlur.on(this.suspend, this);
    }

    public load(asset: SoundAsset, loop: boolean) : void
    {
        this._sounds[asset.name] = this._loader.load(asset, loop);
    }

    public play(name: string, loop : boolean = false) : void
    {
        if (this._suspended || this._muted)
            return;

        if (this._sounds[name] !== undefined)
        {
            this._sounds[name].play();
        }
        else
        {
            if (assets.isAssetLoaded(name))
            {
                let sound = assets.getAsset(name) as SoundAsset;

                this.load(sound, loop);
                this.play(name, loop);
            }
            else
            {
                console.error("Sound \"", name, "\" not found.");
            }
        }
    }

    public pause(name: string) : void
    {
        if (this._sounds[name] !== undefined)
            this._sounds[name].pause();
    }

    public stop(name: string) : void
    {
        if (this._sounds[name] !== undefined)
            this._sounds[name].stop();
    }

    public resume(): void 
    {
        for (let sound in this._sounds)
            this._sounds[sound].resume();
    }

    public suspend(): void 
    {
        for (let sound in this._sounds)
            this._sounds[sound].suspend();
    }

    public stopAll(): void
    {
        for (let sound in this._sounds)
            this._sounds[sound].stop();
    }
}