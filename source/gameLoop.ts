import { sys } from "noodle";

export default class GameLoop
{
    private _systems : VoidFunction[] = [];

    private _requestAnimationFrame : RequestAnimationFrameFunction;

    public constructor()
    {
        this._requestAnimationFrame = sys.getRequestAnimationFrameAPI();
    }

    public get systemsCount() : number
    {
        return this._systems.length;
    }

    public start() : void
    {
        this._systems.reverse();
        this._step()
    }

    public addSystem(delegate : VoidFunction, index = -1) : void
    {
        this._systems.splice(index, 0, delegate);
    }

    private _step(): void
    {
        const systems = this._systems;
        const systemsCount = systems.length;

        for (let i = systemsCount; i--;)
            systems[i]();

        this._requestAnimationFrame(this._step.bind(this));
    }
}
