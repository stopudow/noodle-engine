import IAsset       from "./contract/IAsset";
import IAssetLoader from "./contract/IAssetLoader";

import ImageLoader     from "./loader/imageLoader";
import HTMLSoundLoader from "./loader/htmlSoundLoader";
import WebSoundLoader  from "./loader/webSoundLoader";

import TypedEvent from "core/event";

import { sys } from "noodle";

type AssetStorage = { [name: string]: IAsset };

export default class AssetManager
{
    public queueEmpty: TypedEvent<void>;

    private _queue: number = 0;

    private _operations: TypedEvent<IAsset>[] = [];
    private _loaders: IAssetLoader[] = [];
    private _assets: AssetStorage = {};

    public get queue(): number
    {
        return this._queue;
    }

    public constructor()
    {
        this.queueEmpty = new TypedEvent<void>();

        this.registerLoader(new ImageLoader());

        // Web Audio API works only from Safari 6 and above using prefix "webkit"
        if (sys.isWebAudioSupported)
            this.registerLoader(new WebSoundLoader());
        else
            this.registerLoader(new HTMLSoundLoader());
    }

    public registerLoader(loader: IAssetLoader): void 
    {
        this._loaders.push(loader);
    }

    public loadAsset(assetName : string): void 
    {
        if (this.isAssetLoaded(assetName))
            return
            
        this._queue++;

        let extension = assetName.split('.').pop()?.toLowerCase() as string;

        for (let loader of this._loaders)
        {
            if (loader.supportedExtensions.indexOf(extension) > -1)
            {
                loader.loadAsset(assetName);
                return;
            }
        }
    }

    public isAssetLoaded(assetName: string): boolean
    {
        return this._assets[assetName] !== undefined;
    }

    public onAssetLoaded(asset: IAsset): void
    {
        this._assets[asset.name] = asset;

        this._queue--;
        this._checkQueue();
    }

    public onAssetLoadError(): void
    {
        this._queue--;
        this._checkQueue();
    }

    private _checkQueue() : void
    {
        if (this._queue === 0)
            this.queueEmpty.emit();
    }
    
    public getAsset(assetName: string): IAsset | undefined
    {
        if (this.isAssetLoaded(assetName))
            return this._assets[assetName];
        else
            this.loadAsset(assetName);
        
        return undefined;
    }
}