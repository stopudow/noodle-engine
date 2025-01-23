import { IVector, TransformMatrix, ticker } from "noodle";

export default class Node
{
    public tag : string = "Node";

    private _parent   : Node | null = null;
    private _children : Node[] = [];

    private _depth : number = -1;

    protected _x : number = 0;
    protected _y : number = 0;

    protected _angle : number = 0;

    protected _scaleX : number = 1;
    protected _scaleY : number = 1;

    protected _localToParentMatrix : TransformMatrix;

    private _localToWorldMatrix : TransformMatrix;
    private _worldToLocalMatrix : TransformMatrix;

    private _isDirty        : boolean = true;
    private _isInverseDirty : boolean = false;
    
    private _isLoaded : boolean = false;
    private _active   : boolean = false;

    public get parent() : Node | null
    {
        return this._parent;
    }

    public get children() : Node[]
    {
        return this._children;
    }

    public get childrenCount() : number
    {
        return this._children.length;
    }

    public get isDirty() : boolean
    {
        return this._isDirty;
    }

    public get x() : number
    {
        return this._x;
    }

    public set x(value : number)
    {
        this._x = value;
        this._setDirty();
    }

    public get y() : number
    {
        return this._x;
    }

    public set y(value : number)
    {
        this._y = value;
        this._setDirty();
    }
    
    public get scaleX() : number
    {
        return this._scaleX;
    }

    public set scaleX(value : number)
    {
        this._scaleX = value;
        this._setDirty();
    }

    public get scaleY() : number
    {
        return this._scaleY;
    }

    public set scaleY(value : number)
    {
        this._scaleY = value;
        this._setDirty();
    }

    public get angle() : number
    {
        return this._angle;
    }

    public set angle(value : number)
    {
        this._angle = value;
        this._setDirty();
    }

    public get active() : boolean
    {
        return this._active;
    }

    constructor(tag: string = "")
    {
        this.tag = tag;

        this._localToParentMatrix = new TransformMatrix();
        this._localToWorldMatrix  = new TransformMatrix();
        this._worldToLocalMatrix  = new TransformMatrix();

        this.create?.();
    }

    public load() : void
    {
        if (this._isLoaded)
            return;

        this.onLoad?.();

        this._isLoaded = true;
    }

    public render(ctx : RenderContext)
    {
        // if (!this.active)
        // 	return;
        
        if (this.draw)
            this.draw(ctx);

        for (let child of this._children)
            child.render(ctx);
    }

    public setActive(value : boolean) : void
    {
        if (value === this._active)
            return;

        this._active = value;

        if (value)
            this._registerProcess();
        else
            this._unregisterProcess();

        for (let child of this._children)
            child.setActive(value);
    }

    public getSiblingIndex() : number
    {
        const parent = this._parent;

        if (!parent)
            return -1;

        return parent.children.indexOf(this);
    }

    public setSiblingIndex(index : number) : void
    {
        const parent = this._parent;

        if (!parent)
            return;

        const siblings = parent._children;
        const oldIndex = siblings.indexOf(this);

        if (index !== oldIndex)
            return;

        siblings.splice(oldIndex, 1);

        if (index > siblings.length)
            siblings.push(this);
        else
            siblings.splice(index, 0, this);
    }

    public isGreaterThan(node : Node)
    {
        const this_stack : number[] = [];
        const that_stack : number[] = [];

        let index : number;
        let result : boolean;

        let n : Node | null;

        n = this;
        index = this._depth - 1;

        while (n)
        {
            this_stack[index] = n.getSiblingIndex();
            n = n.parent;
        }

        n = node;
        index = node._depth - 1;

        while (n)
        {
            that_stack[index] = n.getSiblingIndex();
            n = n.parent;
        }

        index = 0;
        result = false;

        while (true)
        {
            let this_idx = (index >= this._depth) ? -2 : this_stack[index];
            let that_idx = (index >= node._depth) ? -2 : that_stack[index];

            if (this_idx > that_idx)
            {
                result = true;
                break;
            }
            else if (this_idx < that_idx)
            {
                result = false;
                break;
            }
            else if (this_idx === -2)
            {
                result = false;
                break;
            }

            index++;
        }

        return result;
    }

    public static comparator<Comparable extends Node>(a : Comparable, b : Comparable)
    {
        return a.isGreaterThan(b) ? 1 : 0;
    }

    public setParent(value : Node | null)
    {
        if (this._parent != null)
        {
            let index = this._parent._children.indexOf(this);

            if (index > -1)
                this._parent._children.splice(index, 1);
        }

        this._parent = value;

        if (this._parent)
            this._parent._children.push(this);

        this._setDirty();
    }

    public findByTag(tag : string) : Node | null
    {
        if (this.tag === tag)
            return this;

        for (let child of this.children)
        {
            let result = child.findByTag(tag);

            if (result !== null)
                return result;
        }

        return null;
    }

    public findAllByTag(tag : string) : Node[]
    {
        let results : Node[] = [];

        if (this.tag === tag)
            results.push(this);

        for (let child of this.children)
            results = results.concat(child.findAllByTag(tag));

        return results;
    }

    public findByType<Type extends Node>(type : new (...args : any []) => Type) : Type | null
    {
        if (this instanceof type)
            return this as Type;

        for (let child of this.children)
        {
            let result = child.findByType(type);

            if (result !== null)
                return result;
        }

        return null;
    }

    public findAllByType<Type extends Node>(type : new (...args : any []) => Type) : Type[]
    {
        let results : Type[] = [];

        if (this instanceof type)
            results.push(this as Type);

        for (let child of this.children)
            results = results.concat(child.findAllByType(type));

        return results;
    }

    public getLocalToWorldMatrix() : TransformMatrix
    {
        const localToWorldMatrix = this._localToWorldMatrix;

        if (!this._isDirty)
            return localToWorldMatrix;

        if (this._parent !== null)
        {
            TransformMatrix.multiply(
                localToWorldMatrix, 
                this._parent.getLocalToWorldMatrix(), 
                this._calculateLocalToParentMatrix());
        }
        else
        {
            localToWorldMatrix.set(this._calculateLocalToParentMatrix());
        }

        this._isDirty = false;

        return localToWorldMatrix;
    }
    
    public getWorldToLocalMatrix()
    {
        if (this._isInverseDirty)
        {
            TransformMatrix.invert(
                this._worldToLocalMatrix, 
                this.getLocalToWorldMatrix());

            this._isInverseDirty = false;
        }

        return this._worldToLocalMatrix;
    }
    
    protected _calculateLocalToParentMatrix() : TransformMatrix
    {
        const localToParentMatrix = this._localToParentMatrix;

        localToParentMatrix.identity();

        localToParentMatrix.translate(this._x, -this._y);
        localToParentMatrix.rotateDeg(-this._angle);
        localToParentMatrix.scale(this._scaleX, this._scaleY);

        return localToParentMatrix;
    }
    
    public transformPoint(out : IVector, point : IVector) : IVector
    {
        return this.getLocalToWorldMatrix().multiplyPoint(out, point);
    }

    public inverseTransformPoint(out : IVector, point : IVector) : IVector
    {
        return this.getWorldToLocalMatrix().multiplyPoint(out, point);
    }

    protected applyTransform(ctx : RenderContext)
    {
        const m = this.getLocalToWorldMatrix();

        ctx.setTransform(m)
        //ctx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
    }
    
    protected _setDirty() : void
    {
        if (this._isDirty)
            return;

        this._isDirty = true;
        this._isInverseDirty = true;

        for (let child of this._children)
            child._setDirty();
    }

    private _registerProcess()
    {
        this.onEnable?.();
        this.start?.();

        if (this.update) 
            ticker.registerTick(this.update.bind(this));

        if (this.lateUpdate) 
            ticker.registerLateTick(this.lateUpdate.bind(this));

        if (this.draw) 
            ticker.registerDrawTick(this.draw.bind(this));

        // console.log("register callbacks")
    }

    private _unregisterProcess()
    {
        this.onDisable?.();

        if (this.update) 
            ticker.unregisterTick(this.update.bind(this));

        if (this.lateUpdate) 
            ticker.unregisterLateTick(this.lateUpdate.bind(this));

        if (this.draw) 
            ticker.unregisterDrawTick(this.draw.bind(this));
    }

    protected onLoad?    () : void;
    protected onEnable?  () : void;
    protected onDisable? () : void;
    protected onDestroy? () : void;

    protected create?                      () : void;
    protected start?                       () : void;
    protected update?     (deltaTime: number) : void;
    protected lateUpdate? (deltaTime: number) : void;
    protected draw?     (ctx : RenderContext) : void;
}