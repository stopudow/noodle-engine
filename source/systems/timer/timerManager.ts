import Hash from "utils/hash";
import Timer from "./timer";

import { loop, time } from "noodle";

export default class TimerManager
{
    constructor()
    {
        this._timers = [];

        loop.addSystem(this._update.bind(this));

        console.log("Init Timer Manager");
    }

    private _timers : Timer[];

    public delay(callback : Function, interval : number, repeat : number = -1, autoRemove : boolean = true) : void
    {
        let timer = new Timer(callback, interval, repeat, autoRemove);

        this._timers.push(timer);

        timer.start();
    }

    public cancel(callback : number) : void
    public cancel(callback : Function) : void
    public cancel(callback : Function | number) : void
    {
        let timer;

        if (typeof callback === 'function')
            timer = this._findTimerByCallback(callback);
        else
            timer = this._findTimerByHash(callback);

        if (timer !== null)
            this._removeTimer(timer);
    }

    private _update()
    {
        const deltaTime = time.deltaTime;

        for (let timer of this._timers)
        {
            if (timer.autoRemove && !timer.active)
            {
                this._removeTimer(timer);
            }
            else
            {
                timer.update(deltaTime);
            }
        }
    }
    
    private _removeTimer(timer : Timer)
    {
        let index = this._timers.indexOf(timer);
        
        timer.stop();

        this._timers.splice(index, 1);
    }

    private _findTimerByHash(hash : number) : Timer | null
    {
        for (let i = 0; i < this._timers.length; i++) 
        {
              if (this._timers[i].hash === hash)
                return this._timers[i];
        }
        
        return null;
    }

    private _findTimerByCallback(callback : Function) : Timer | null
    {
        let hash = Hash.convertString(callback.toString());

        return this._findTimerByHash(hash);
    }
}

