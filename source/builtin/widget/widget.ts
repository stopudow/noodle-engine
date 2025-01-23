import { TransformMatrix, Node, view } from "noodle";

export enum AlignX
{
    LEFT,
    CENTER,
    RIGHT,
    STRETCH
}

export enum AlignY
{
    TOP,
    CENTER,
    BOTTOM,
    STRETCH
}

export enum PointerFilter
{
    IGNORE,
    PASS,
    STOP
}

export default class Widget extends Node
{
    protected _width : number = 0;
    protected _height : number = 0;

    protected _localWidth : number = 0;
    protected _localHeight : number = 0;

    private _alignX : AlignX = AlignX.CENTER;
    private _alignY : AlignY = AlignY.CENTER;

    private _offsetX : number = 0;
    private _offsetY : number = 0;

    private _pivotX : number = 0.5;
    private _pivotY : number = 0.5;

    protected _centerX : number = 0;
    protected _centerY : number = 0;
    
    private _anchorX : number = 0.5;
    private _anchorY : number = 0.5;

    private _stretchX : number = 0;
    private _stretchY : number = 0;

    private _cover : number = 0;

    public pointerFilter : PointerFilter = PointerFilter.STOP;
    
    public override get x() : number
    {
        return this._offsetX;
    }

    public override set x(value : number)
    {
        this._offsetX = value;
        this._setDirty();
    }

    public override get y() : number
    {
        return this._offsetY;
    }

    public override set y(value : number)
    {
        this._offsetY = value;
        this._setDirty();
    }

    public get pivotX() : number
    {
        return this._pivotX;
    }

    public set pivotX(value : number)
    {
        this._pivotX = value;
        this._setDirty();
    }

    public get pivotY() : number
    {
        return this._pivotY;
    }

    public set pivotY(value : number)
    {
        this._pivotY = value;
        this._setDirty();
    }

    public get globalWidth() : number
    {
        return this._width;
    }

    public get globalHeight() : number
    {
        return this._height;
    }

    public get width() : number
    {
        return this._localWidth;
    }

    public set width(value : number)
    {
        this._localWidth = value;
        this._setDirty();
    }

    public get height() : number
    {
        return this._localHeight;
    }

    public set height(value : number)
    {
        this._localHeight = value;
        this._setDirty();
    }
    
    public get alignX() : AlignX
    {
        return this._alignX;
    }

    public set alignX(value : AlignX)
    {
        this._alignX = value;

        this._anchorX  = this._getAnchor(value);
        this._stretchX = this._getStretch(value);
        
        this._setDirty();
    }

    public get alignY() : AlignY
    {
        return this._alignY;
    }

    public set alignY(value : AlignY)
    {
        this._alignY = value;

        this._anchorY  = this._getAnchor(value);
        this._stretchY = this._getStretch(value);

        this._setDirty();
    }

    public get cover() : number
    {
        return this._cover;
    }

    public set cover(value : boolean)
    {
        this._cover = value ? 1 : 0;
        this._setDirty();
    }

    private _getAnchor(align : AlignX | AlignY) : number
    {
        let anchor = 0.5;

        switch (align)
        {
        case AlignX.LEFT:
        case AlignY.TOP:
            anchor = 0.0;
            break;
        case AlignX.CENTER:
        case AlignY.CENTER:
            anchor = 0.5;
            break;
        case AlignX.RIGHT:
        case AlignY.BOTTOM:
            anchor = 1.0
            break;
        }

        return anchor;
    }

    private _getStretch(align : AlignX | AlignY)
    {
        let stretch = 0.0;

        switch (align)
        {
        case AlignX.STRETCH:
        case AlignY.STRETCH:
            stretch = 1.0;
            break;
        }

        return stretch;
    }
    
    protected _adjust()
    {
        if (!this.isDirty)
            return;
        
        let visibleWidth, visibleHeight;
        let parent = this.parent;

        if (parent instanceof Widget)
        {
            visibleWidth  = parent._width;
            visibleHeight = parent._height;
        }
        else
        {
            visibleWidth  = view.visibleWidth;
            visibleHeight = view.visibleHeight;
        }

        const width  = this._localWidth;
        const height = this._localHeight;

        const ratioX = visibleWidth  / width;
        const ratioY = visibleHeight / height;

        const ratio = Math.max(ratioY,ratioX) * this._cover;
        
        const newWidth  = width  * (ratio || ratioX) * this._stretchX || width; 
        const newHeight = height * (ratio || ratioY) * this._stretchY || height;

        this._centerX = newWidth  * this._pivotX;
        this._centerY = newHeight * this._pivotY;

        this._x = this._offsetX + (visibleWidth - newWidth)   * this._anchorX;
        this._y = this._offsetY + (visibleHeight - newHeight) * this._anchorY;

        this._width  = newWidth;
        this._height = newHeight;
    }

    protected override _calculateLocalToParentMatrix(): TransformMatrix 
    {
        const localToParentMatrix = this._localToParentMatrix;
        const centerX = this._centerX;
        const centerY = this._centerY;

        localToParentMatrix.identity();
        localToParentMatrix.translate(this._x + centerX, this._y + centerY);
        localToParentMatrix.rotateDeg(-this._angle);
        localToParentMatrix.scale(this._scaleX, this._scaleY);
        localToParentMatrix.translate(-centerX, -centerY);

        return localToParentMatrix;
    }

    protected override applyTransform(ctx: RenderContext): void 
    {
        this._adjust();

        super.applyTransform(ctx);
    }
}