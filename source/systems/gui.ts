import { Widget, input } from "noodle";

export default class GUI
{
    private _roots: Widget[] = [];
    private _isDirty: boolean = false;

    constructor()
    {
        input.mouseMove.on(this._handleMouseMove, this);
        input.mouseDown.on(this._handleMouseDown, this);
        input.mouseUp.on(this._handleMouseUp, this);

        input.touchCancel.on(this._handleTouchCancel, this);
        input.touchStart.on(this._handleTouchStart, this);
        input.touchMove.on(this._handleTouchMove, this);
        input.touchEnd.on(this._handleTouchEnd, this);
    }
    
    public addRootWidget(root: Widget): void
    {
        this._roots.push(root);

        this._isDirty = true;
    }

    public removeRootWidget(root: Widget): void
    {
        const roots = this._roots;
        const index = roots.indexOf(root);

        if (index > -1)
            roots.splice(index, 1);
    }

    private _sortRoots(): void
    {
        if (!this._isDirty)
            return;

        this._roots.sort(Widget.comparator);

        this._isDirty = false;
    }

    private _findWidget(x: number, y: number): Widget | null
    {
        let point = { x: x, y: y };

        this._sortRoots();

        const roots = this._roots;

        for (let i = roots.length; i--;)
        {
            let result = this._findWidgetAtPoint(roots[i], point);

            if (result)
                return result;
        }

        return null
    }

    private _findWidgetAtPoint(widget: Widget, point: Point): Widget | null
    {
        if (!widget.active)
            return null;

        const inversePoint : Point = { x: 0, y: 0 };

        widget.inverseTransformPoint(inversePoint, point);

        if (inversePoint.x > 0 && inversePoint.x < widget.width &&
            inversePoint.y > 0 && inversePoint.y < widget.height)
            return widget;

        let result : Widget | null;

        for (let child of widget.children)
        {
            if (child instanceof Widget === false)
                continue;

            result = this._findWidgetAtPoint(child, point);

            if (result !== null)
                return result;
        }

        return null;
    }

    private _handleMouseUp(event: MouseEvent): void
    {
        const x = event.clientX;
        const y = event.clientY;

        const result = this._findWidget(x, y);
    }

    private _handleMouseMove(event: MouseEvent): void
    {
        const x = event.clientX;
        const y = event.clientY;

        const result = this._findWidget(x, y);
    }

    private _handleMouseDown(event: MouseEvent): void
    {
        const x = event.clientX;
        const y = event.clientY;

        const result = this._findWidget(x, y);
    }

    private _handleTouchStart(event: TouchEvent): void
    {
        const touch = event.touches[0];

        const x = touch.clientX;
        const y = touch.clientY;

        const result = this._findWidget(x, y);
    }

    private _handleTouchMove(event: TouchEvent): void
    {
        const touch = event.touches[0];
        
        const x = touch.clientX;
        const y = touch.clientY;

        const result = this._findWidget(x, y);
    }

    private _handleTouchEnd(event: TouchEvent): void
    {
        const touch = event.touches[0];
        
        const x = touch.clientX;
        const y = touch.clientY;

        const result = this._findWidget(x, y);
    }

    private _handleTouchCancel(event: TouchEvent): void
    {
        const touch = event.touches[0];
        
        const x = touch.clientX;
        const y = touch.clientY;

        let result = this._findWidget(x, y);

        if (result === null)
            return;

        while (result)
        {
        }
    }
}