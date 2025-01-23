import { Node, time } from "noodle";

export type ParticleSettings = {

    duration : number;
    spawnRate : number;
    lifeTime : number;

    totalCount : number;

    image : number;
    colors : number;

    minAlpha : number;
    maxAlpha : number;

    xVariance : number;
    yVariance : number;

    // startSpin : number;
    // endSpin : number;

    startMinSize : number;
    startMaxSize : number;

    endMinSize : number;
    endMaxSize : number;

    rotationSpeed : number;
    moveSpeed : number;
}

class Particle
{
    private _gravity : number = 0;
    private _radialAcceleration : number = 0;
    private _tangentialAcceleration : number = 0;

    //private _color : number = 0;
    //private _image : number = 0;

    private _alpha : number = 0;
    private _startAlpha : number = 0;
    private _endAlpha : number = 0;

    private _speed : number = 0;
    private _angle : number = 0;

    private _x : number = 0;
    private _y : number = 0;

    private _size : number = 0;
    private _startSize : number = 0;
    private _endSize : number = 0;

    //private _startLifetime : number = 0;
    private _lifetime : number = 0;

    private declare _active : boolean;
    
    public update(deltaTime : number)
    {
        if (!this._active)
            return;

        const lifetime = this._lifetime - deltaTime;

        const speed = this._speed + this._radialAcceleration * deltaTime;
        const angle = this._angle + this._tangentialAcceleration * deltaTime;

        this._x += Math.cos(angle) * speed;
        this._y += Math.sin(angle) * speed + this._gravity * deltaTime;

        this._alpha = this.lerp(lifetime, 0, this._lifetime, this._endAlpha, this._startAlpha);
        this._size  = this.lerp(lifetime, 0, this._lifetime, this._endSize, this._startSize);

        this._speed = speed;
        this._angle = angle;
        this._lifetime = lifetime;

        if (lifetime <= 0)
            this._active = false;
    }

    private lerp(value: number, min1: number, max1: number, min2: number, max2: number)
    {
        return min2 + (max2 - min2) * (value - min1) / (max1 - min1);
    }

    public draw(ctx : RenderContext)
    {
        ctx.save();

        //ctx.fillStyle = this._color;
        ctx.globalAlpha = this._alpha;

        ctx.translate(this._x, this._y);
        ctx.scale(this._size, this._size);
        ctx.rotate(this._angle);

        ctx.fillRect(-this._size / 2, -this._size / 2, this._size, this._size);

        ctx.restore();
    }

    public reset()
    {

    }
}

class ParticleEmmiter
{
    private particles : Particle[] = [];

    protected update(deltaTime: number): void 
    {
        const particles = this.particles;

        for (let i = particles.length; i--;)
            particles[i].update(deltaTime);
    }

    protected draw(ctx: CanvasRenderingContext2D): void 
    {
        const particles = this.particles;

        for (let i = particles.length; i--;)
            particles[i].draw(ctx);
    }
}