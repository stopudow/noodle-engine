import { DEG_TO_RAD } from "./calc";
import { IVector } from "./vector";

/**
 * @note The transformation matrix is described by
 * @note | a, c, e |
 * @note | b, d, f |
 * @note | 0, 0, 1 |
 */
export interface ITransformMatrix
{
    a : number; c : number; e : number;
    b : number; d : number; f : number;
}

export default class TransformMatrix implements ITransformMatrix
{
    public declare a : number;
    public declare b : number;

    public declare c : number;
    public declare d : number;
    
    public declare e : number;
    public declare f : number;

    constructor(other: TransformMatrix);

    constructor
    (
        a?: number, b?: number, c?: number,
        d?: number, e?: number, f?: number
    );

    constructor
    (
        a: number | TransformMatrix = 1, b: number = 0, c: number = 0,
        d: number = 1, e: number = 0, f: number = 0
    )
    {
        if (typeof a == 'object')
        {
            this.a = a.a;	this.c = a.c;	this.e = a.e;
            this.b = a.b;	this.d = a.d;	this.f = a.f;
        }
        else
        {
            this.a = a;	this.c = c;	this.e = e;
            this.b = b;	this.d = d;	this.f = f;
        }
    }

    public clone()
    {
        const t = this;

        return new TransformMatrix
        (
            t.a, t.b, t.c,
            t.d, t.e, t.f
        );
    }

    public set (other : TransformMatrix) : TransformMatrix;

    public set 
    (
        a?: number, b?: number, c?: number, 
        d?: number, e?: number, f?: number
    ) : TransformMatrix;

    public set
    (	
        a: number | TransformMatrix = 1, b: number = 0, c: number = 0, 
        d: number = 1, e: number = 0, f: number = 0
    ) : TransformMatrix
    {
        if (typeof a == 'object')
        {
            this.a = a.a;	this.c = a.c;	this.e = a.e;
            this.b = a.b;	this.d = a.d;	this.f = a.f;
        }
        else
        {
            this.a = a;	this.c = c;	this.e = e;
            this.b = b;	this.d = d;	this.f = f;
        }

        return this;
    }

    public identity() : TransformMatrix
    {
        this.a = 1;
        this.b = 0;

        this.c = 0;
        this.d = 1;

        this.e = 0;
        this.f = 0;

        return this;
    }

    // (x, 0, 0, y, 0, 0)
    public scale(x : number, y : number) : TransformMatrix
    {
        this.a *= x;
        this.b *= x;

        this.c *= y;
        this.d *= y;

        return this;
    }

    // (1, 0, 0, 1, x, y)
    public translate(x : number, y : number) : TransformMatrix
    {
        const a = this.a;	const c = this.c;	const e = this.e;
        const b = this.b;	const d = this.d;	const f = this.f;

        this.e = a * x + c * y + e;
        this.f = b * x + d * y + f;

        return this;
    }

    public rotateDeg(angle : number) : TransformMatrix
    {
        return this.rotate(angle * DEG_TO_RAD);
    }

    // (cos, sin, -sin, cos, 0, 0);
    public rotate(angle : number) : TransformMatrix
    {
        const a = this.a;	const c = this.c;
        const b = this.b;	const d = this.d;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        this.a = a * cos + c * sin;
        this.b = b * cos + d * sin;

        this.c = c * cos - a * sin;
        this.d = d * cos - b * sin;

        return this;
    }

    public multiplyPoint(out : IVector, point: IVector) : IVector
    {
        const a = this.a;	const c = this.c;	const e = this.e;
        const b = this.b;	const d = this.d;	const f = this.f;

        const x = point.x;
        const y = point.y;

        out.x = x * a + y * c + e;
        out.y = x * b + y * d + f;

        return out;
    }

    public static multiply <Out extends ITransformMatrix> (out : Out, a: Out, b: Out) : ITransformMatrix
    {
        const a1 = a.a;	const c1 = a.c;	const e1 = a.e;
        const b1 = a.b;	const d1 = a.d;	const f1 = a.f;

        const a2 = b.a;	const c2 = b.c;	const e2 = b.e;
        const b2 = b.b;	const d2 = b.d;	const f2 = b.f;

        out.a = a1 * a2 + c1 * b2;
        out.b = b1 * a2 + d1 * b2;

        out.c = a1 * c2 + c1 * d2;
        out.d = b1 * c2 + d1 * d2;

        out.e = a1 * e2 + c1 * f2 + e1;
        out.f = b1 * e2 + d1 * f2 + f1;

        return out;
    }
    
    public multiply(tm : TransformMatrix) : TransformMatrix
    {
        const a1 = this.a;	const c1 = this.c;	const e1 = this.e;
        const b1 = this.b;	const d1 = this.d;	const f1 = this.f;

        const a2 = tm.a;	const c2 = tm.c;	const e2 = tm.e;
        const b2 = tm.b;	const d2 = tm.d;	const f2 = tm.f;

        this.a = a1 * a2 + c1 * b2;
        this.b = b1 * a2 + d1 * b2;

        this.c = a1 * c2 + c1 * d2;
        this.d = b1 * c2 + d1 * d2;

        this.e = a1 * e2 + c1 * f2 + e1;
        this.f = b1 * e2 + d1 * f2 + f1;
        
        return this;
    }

    public static invert<Out extends ITransformMatrix> (out : Out, a: Out) : ITransformMatrix
    {
        const a1 = a.a;	const c1 = a.c;	const e1 = a.e;
        const b1 = a.b;	const d1 = a.d;	const f1 = a.f;

        const det = 1 / (a1 * d1 - b1 * c1);

        out.a =  d1 * det;
        out.b = -b1 * det;

        out.c = -c1 * det;
        out.d =  a1 * det;

        out.f = det * (b1 * e1 - a1 * f1);
        out.e = det * (c1 * f1 - d1 * e1);

        return out;
    }

    public invert() : TransformMatrix
    {
        const a = this.a;	const c = this.c;	const e = this.e;
        const b = this.b;	const d = this.d;	const f = this.f;

        const det = 1 / (a * d - b * c);

        this.a =  d * det;
        this.b = -b * det;

        this.c = -c * det;
        this.d =  a * det;

        this.e = det * (c * f - d * e);
        this.f = det * (b * e - a * f);

        return this;
    }
}