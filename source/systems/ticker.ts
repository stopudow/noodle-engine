import { loop, render, time } from "noodle";

type DrawTick   = (context : RenderContext) => void;
type LateTick   = (deltaTime : number) => void;
type Tick       = (deltaTime : number) => void;

export default class TickManager
{
    private _ticks     : Tick[]       = [];
    private _lateTicks : LateTick[]   = [];
    private _drawTicks : DrawTick[]   = [];
    public constructor()
    {
        const count = loop.systemsCount;

        // Add before render update
        loop.addSystem(this._update.bind(this),     count - 1);
        loop.addSystem(this._lateUpdate.bind(this), count - 1);
        loop.addSystem(this._drawUpdate.bind(this), count - 1);

        console.log("Init Ticker (Update)");
        console.log("Init Ticker (LateUpdate)");
    }

    public registerLateTick(tick : LateTick, order : number = -1) : void
    {
        this._lateTicks.splice(order, 0, tick);
    }

    public unregisterLateTick(tick : LateTick) : void
    {
        const index = this._lateTicks.indexOf(tick);

        if (index > -1)
            this._lateTicks.splice(index, 1);
    }

    public registerTick(tick : Tick, order : number = -1) : void
    {
        this._ticks.splice(order, 0, tick);
    }

    public unregisterTick(tick : Tick) : void
    {
        const index = this._ticks.indexOf(tick);

        if (index > -1)
            this._ticks.splice(index, 1);
    }

    public registerDrawTick(tick : DrawTick, order : number = -1) : void
    {
        this._drawTicks.splice(order, 0, tick);
    }

    public unregisterDrawTick(tick : DrawTick) : void
    {
        const index = this._drawTicks.indexOf(tick);

        if (index > -1)
            this._drawTicks.splice(index, 1);
    }

    private _update() : void
    {
        const deltaTime = time.deltaTime;

        for (let i = this._ticks.length; i--;)
            this._ticks[i](deltaTime);
    }

    private _lateUpdate() : void
    {
        const deltaTime = time.deltaTime;

        for (let i = this._lateTicks.length; i--;)
            this._lateTicks[i](deltaTime);
    }

    private _drawUpdate() : void
    {
        const context = render.context;

        for (let i = this._drawTicks.length; i--;)
            this._drawTicks[i](context);
    }
}