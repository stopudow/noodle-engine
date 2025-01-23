import ISound from "../contract/ISound";

export default class HTMLSound implements ISound
{
    private _player : HTMLAudioElement;

    private _suspended : boolean = false;
    private _playing   : boolean = false;
    private _paused    : boolean = false;

    public get playing() : boolean
    {
        return this._playing;
    }
    
    public set loop(value : boolean) 
    {
        this._player.loop = value;
    }

    public get loop() : boolean 
    {
        return this._player.loop;
    }

    public constructor(sound : HTMLAudioElement, loop : boolean)
    {
        this._player = sound;
        this._player.loop = loop;
    }

    public play() : void
    {
        if (this._playing)
            this.stop();
        
        this._player.play();

        this._playing = true;
        this._paused = false;
    }

    public pause() : void
    {
        this._player.pause();

        this._playing = false;
        this._paused = true;
    }

    public stop() : void
    {
        this._player.pause();
        this._player.currentTime = 0;

        this._playing = false;
        this._paused = false;
    }

    public suspend() : void 
    {
        if (this._playing)
        {
            this.pause();

            this._suspended = true;
        }
    }

    public resume() : void
    {
        if (this._paused && this._suspended)
        {
            this.play();

            this._suspended = false;
        }
    }
}