export interface IVector
{
    x: number;
    y: number;
}

export default class Vector implements IVector
{
    public declare x : number;
    public declare y : number;

    constructor (other: Vector);

    constructor (x?: number, y?: number);

    constructor(x?: number | Vector, y?: number)
    {
        if (x && typeof x === 'object') 
        {
            this.x = x.x;
            this.y = x.y;
        } 
        else 
        {
            this.x = x || 0;
            this.y = y || 0;
        }
    }

    public get direction()
    {
        return Math.atan2(this.y, this.x);
    }

    public get length() : number
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public static get zero() : Vector
    {
        return new Vector();
    }

    public static get one() : Vector
    {
        return new Vector(1, 1);
    }
    
    public normalize() : Vector
    {
        return this.divideScalar(this.length);
    }

    public set(other : Vector) : void
    {
        this.x = other.x;
        this.y = other.y;
    }

    public distance(other : Vector) : number
    {
        let x = this.x - other.x;
        let y = this.y - other.y;

        return Math.sqrt(x * x + y * y);
    }

    public angle(other : Vector) : number
    {
        return Math.acos(this.dot(other) / (this.length * other.length));
    }
    
    public dot(other : Vector) : number
    {
        return this.x * other.x + this.y * other.y;
    }

    public cross (other: Vector) {
        return this.x * other.y - this.y * other.x;
    }

    public add(other : Vector) : Vector
    {
        this.x += other.x;
        this.y += other.y;

        return this;
    }

    public subtract(other : Vector) : Vector
    {
        this.x -= other.x;
        this.y -= other.y;

        return this;
    }

    public divideScalar(scalar : number) : Vector
    {
        this.x /= scalar;
        this.y /= scalar;

        return this;
    }

    public divide(other : Vector) : Vector
    {
        this.x /= other.x;
        this.y /= other.y;

        return this;
    }

    public multiply(other : Vector) : Vector
    {
        this.x *= other.x;
        this.y *= other.y;

        return this;
    }

    public multiplyScalar(scalar : number) : Vector
    {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    public negative() : Vector
    {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    public project(other : Vector) : Vector
    {
        const scalar = this.dot(other) / other.dot(other);

        this.x = other.x * scalar;
        this.y = other.y * scalar;

        return this;
    }
}