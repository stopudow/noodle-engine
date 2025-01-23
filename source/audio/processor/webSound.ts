import ISound from "../contract/ISound";

export default class WebSound implements ISound
{
    private _context : AudioContext;

    private _buffer  : AudioBuffer;
    private _source  : AudioBufferSourceNode;

    private _startedAt : number = 0;
    private _pausedAt  : number = 0;

    private _loop : boolean;

    private _playing   : boolean = false;
    private _suspended : boolean = false;

    public get playing() : boolean
    {
        return this._playing;
    }
    
    public set loop(value : boolean) 
    {
        this.loop = value;
    }

    public get loop() : boolean 
    {
        return this.loop;
    }

    public constructor(context : AudioContext, sound : AudioBuffer, loop : boolean)
    {
        this._buffer = sound;
        this._context = context;

        this._source = context.createBufferSource();

        this._startedAt = 0;
        this._pausedAt = 0;

        this._loop = loop;
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
        if (this._pausedAt && this._suspended)
        {
            this.play();

            this._suspended = false;
        }
    }

    public play() : void
    {
        if (this._playing)
            this.stop();

        this._playing = true;

        this._source = this._context.createBufferSource();

        this._source.connect(this._context.destination);

        this._source.buffer = this._buffer;
        this._source.loop = this._loop;

        if (this._pausedAt)
        {
            this._startedAt = Date.now() - this._pausedAt;
            this._source.start(0, this._pausedAt / 1000);
        }
        else
        {
            this._startedAt = Date.now();
            this._source.start(0);
        }
    }

    public pause() : void
    {
        this._source.stop(0);

        this._pausedAt = Date.now() - this._startedAt;

        this._playing = false;
    }

    public stop() : void
    {
        this._source.stop(0);

        this._pausedAt = 0;
        this._startedAt = 0;

        this._playing = false;
    }
}