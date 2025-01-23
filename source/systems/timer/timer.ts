import Hash from "utils/hash";

export default class Timer
{
    constructor(callback : Function, interval : number, repeat : number, autoRemove : boolean)
    {
        this.hash = Hash.convertString(callback.toString());

        this.callback = callback;

        this.repeat = repeat;
        this.interval = interval;

        this._elapsed = 0;
        this._count = 0;

        this._active = false;
        this._autoRemove = autoRemove;
    }

    public hash : number;
    public callback : Function;

    public repeat : number;
    public interval : number;

    private _active : boolean;
    private _autoRemove : boolean;

    private _elapsed : number;
    private _count : number;

    public get autoRemove() : boolean
    {
        return this._autoRemove;
    }

    public get active() : boolean
    {
        return this._active;
    }

    public update(deltaTime : number)
    {
        if (!this._active)
            return;

        this._elapsed += deltaTime;

        if (this._elapsed >= this.interval)
        {
            this.callback();
            this._count++;

            if (this.repeat == -1 || this._count < this.repeat) 
            {
                this._elapsed = 0;
            }
            else
            {
                this._active = false;
            }
        }
    }

    public start()
    {
        this._active = true;
    }

    public stop()
    {
        this._active = false;
    }

    public reset()
    {
        this._count = 0;
        this._elapsed = 0;

        this._active = false;
    }
}
