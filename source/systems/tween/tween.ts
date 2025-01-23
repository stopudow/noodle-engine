type TweenMotion = {
    duration : number,
    startProperties : {[name: string]: any},
    properties : {[name:string]: any},
    easing : Function,
    elapsed: number,
    progress: number,
    done: boolean
}

export default class Tween
{
    public tag : number;

    private _target : any;
    private _animations : TweenMotion[];

    private _running : boolean;
    private _autoRemove : boolean;

    private _repeat : number;
    private _count  : number;

    private _doneIndex : number;

    private _updateMethod : (deltaTime : number) => void;

    public get active() : boolean
    {
        return this._running;
    }
    
    public get autoRemove() : boolean
    {
        return this._autoRemove;
    }

    public get target() : any
    {
        return this._target;
    }

    public constructor(target : any, autoRemove : boolean)
    {
        this.tag = 0;

        this._target = target;
        this._animations = [];

        this._autoRemove = autoRemove;
        this._running = false;

        this._repeat = 0;
        this._count = 0;
        this._doneIndex = 0;

        this._updateMethod = this._updateSequence;
    }

    public to(duration : number, properties : { [name: string]: any }, easing : Function) : Tween
    {
        const animations = this._animations;
        const startProperties : { [name: string]: any } = {};

        for (const property in properties)
        {
            startProperties[property] = this._findLastPropertyValue(property);
        }

        const animation : TweenMotion = {
            duration: duration * 1000,
            startProperties: startProperties,
            properties: properties,
            easing: easing,
            elapsed: 0,
            progress: 0,
            done: false
        }

        animations.push(animation);

        return this;
    }

    public by(duration : number, properties : { [name: string]: any }, easing : Function) : Tween
    {
        const absoluteProperties : { [name: string]: any } = {};

        for (const property in properties)
        {
            if (property in this._target === false)
                continue;

            absoluteProperties[property] = this._target[property] + properties[property];
        }

        return this.to(duration, absoluteProperties, easing);
    }
    
    private _findLastPropertyValue(targetProperty : string) : any
    {
        const animations = this._animations;

        for (let i = animations.length; i--;)
        {
            const properties = animations[i].properties;

            for (let property in properties)
            {
                if (targetProperty !== property)
                    continue;

                return properties[property];
            }
        }

        return this._target[targetProperty];
    }

    public parallel() : Tween
    {
        this._updateMethod = this._updateParallel;

        return this;
    }

    public sequence() : Tween
    {
        this._updateMethod = this._updateSequence;

        return this;
    }

    public repeat(count : number = -1) : Tween
    {
        this._repeat = count;

        return this;
    }

    public start()
    {
        this._running = true;
    }

    public stop()
    {
        this._running = false;
    }

    public reset() : void
    {
        this._doneIndex = 0;

        for (let i = 0; i < this._animations.length; i++) 
        {
            const animation = this._animations[i];

            animation.elapsed = 0;
            animation.progress = 0;
            animation.done = false;
        }
    }

    public update(deltaTime: number) : void
    {
        if (!this._running)
            return;

        this._updateMethod(deltaTime);
    }

    private _updateParallel(deltaTime : number)
    {
        for (let i = 0; i < this._animations.length; i++) 
        {
            const animation = this._animations[i];
            
            if (animation.done)
                continue;

            this._updateAnimation(deltaTime, animation);

            this._checkEndOfSequence();
        }
    }

    private _updateSequence(deltaTime : number)
    {
        this._checkEndOfSequence();
        
        let animation = this._animations[this._doneIndex];

        if (animation)
            this._updateAnimation(deltaTime, animation);
    }

    private _checkEndOfSequence()
    {
        if (this._doneIndex !== this._animations.length)
            return;

        this._count++;

        if (this._repeat == -1 || this._count < this._repeat)
            this.reset();
        else
            this.stop();
    }

    private _updateAnimation(deltaTime : number, animation : TweenMotion) : void
    {	
        const target = this._target;

        animation.elapsed += deltaTime;

        animation.progress = Math.min(animation.elapsed / animation.duration, 1);

        const easedProgress = animation.easing(animation.progress);

        for (const property in animation.properties)
        {
            const initialValue = animation.startProperties[property];
            const finalValue = animation.properties[property];

            const interpolatedValue = initialValue + (finalValue - initialValue) * easedProgress;

            target[property] = interpolatedValue;
        }

        if (animation.progress !== 1)
            return;

        animation.done = true;
        this._doneIndex++;
    }
}