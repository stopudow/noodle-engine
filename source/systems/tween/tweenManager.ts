import Tween from "./tween";

import { loop, time } from "noodle";

export default class TweenManager
{
    private _tweens : Tween[];

    public constructor()
    {
        this._tweens = [];

        const count = loop.systemsCount;

        loop.addSystem(this._update.bind(this), count - 1);

        console.log("Init Tween Manager");
    }

    public create(target : any, autoRemove : boolean = true) : Tween
    {
        let tween =  new Tween(target, autoRemove);

        this._tweens.push(tween);

        tween.tag = this._tweens.length;

        return tween;
    }

    public cancel(target : object) : void;
    public cancel(target : number) : void;
    public cancel(target : object | number) : void
    {
        let tween;

        if (typeof target === 'number')
            tween = this._findTweenByTag(target);
        else
            tween = this._findTweenByTarget(target);

        if (tween !== null)
            this._removeTween(tween);
    }
    
    private _update()
    {
        const deltaTime = time.deltaTime;
        
        for (let tween of this._tweens)
        {
            if (tween.autoRemove && !tween.active)
            {
                this._removeTween(tween);
            }
            else
            {
                tween.update(deltaTime);
            }
        }
    }

    private _findTweenByTag(tag : number) : Tween | null
    {
        for (let i = 0; i < this._tweens.length; i++) 
        {
              if (this._tweens[i].tag === tag)
                return this._tweens[i];
        }
        
        return null;
    }

    private _findTweenByTarget(target : object) : Tween | null
    {
        for (let i = 0; i < this._tweens.length; i++) 
        {
              if (this._tweens[i].target === target)
                return this._tweens[i];
        }
        
        return null;
    }

    private _removeTween(tween : Tween)
    {
        let index = this._tweens.indexOf(tween);
        
        tween.stop();

        this._tweens.splice(index, 1);
    }
}