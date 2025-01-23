import { loop, sys } from "noodle";

export default class Time
{
    public timeScale : number = 1;

    private _currentSmoothDeltaTime : number = 0;
    private _previousSmoothDeltaTime : number = 0;

    private _unscaledDeltaTime : number = 0;
    private _deltaTime : number = 0;
    private _lastTime  : number = 0;

    private _performanceNow : PerformanceNowFunction;

    public get deltaTime() : number
    {
        return this._deltaTime;
    }

    public get unscaledDeltaTime() : number
    {
        return this._unscaledDeltaTime;
    }

    public get smoothDeltaTime() : number
    {
        return this._currentSmoothDeltaTime;
    }
    
    constructor()
    {
        this._performanceNow = sys.getPerformanceNowAPI();

        loop.addSystem(this._update.bind(this));

        console.log("Init Time");
    }

    private _update() : void
    {
        const now = this._performanceNow();

        const unscaledDeltaTime = Math.max(0, now - this._lastTime);
        const deltaTime = unscaledDeltaTime * this.timeScale;

        this._unscaledDeltaTime = unscaledDeltaTime;
        this._deltaTime = deltaTime;

        const currentSmoothedDeltaTime = 0.2 * deltaTime + 0.8 * this._previousSmoothDeltaTime;

        this._currentSmoothDeltaTime = currentSmoothedDeltaTime;
        this._previousSmoothDeltaTime = currentSmoothedDeltaTime;

        this._lastTime = now;
    }
}
