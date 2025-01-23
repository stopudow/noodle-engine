import TypedEvent from "core/event";

import { sys } from "noodle";

export default class InputManager
{	
    public readonly touchCancel : TypedEvent<TouchEvent> = new TypedEvent<TouchEvent>();
    public readonly touchStart  : TypedEvent<TouchEvent> = new TypedEvent<TouchEvent>();
    public readonly touchMove   : TypedEvent<TouchEvent> = new TypedEvent<TouchEvent>();
    public readonly touchEnd    : TypedEvent<TouchEvent> = new TypedEvent<TouchEvent>();

    public readonly mouseUp   : TypedEvent<MouseEvent> = new TypedEvent<MouseEvent>();
    public readonly mouseMove : TypedEvent<MouseEvent> = new TypedEvent<MouseEvent>();
    public readonly mouseDown : TypedEvent<MouseEvent> = new TypedEvent<MouseEvent>();

    public constructor()
    {
        // Not supported Safari Desktop / Opera
        if (sys.isTouchSupported)
        {
            window.ontouchcancel = this._handleTouchCancel.bind(this);
            window.ontouchstart  = this._handleTouchStart.bind(this);
            window.ontouchmove   = this._handleTouchMove.bind(this);
            window.ontouchend    = this._handleTouchEnd.bind(this);
        }

        window.onmousedown = this._handleMouseDown.bind(this);
        window.onmousemove = this._handleMouseMove.bind(this);
        window.onmouseup   = this._handleMouseUp.bind(this);
    }

    private _handleMouseUp(event: MouseEvent): void
    {
        event.stopPropagation();
        event.preventDefault();

        this.mouseUp.emit(event);
    }

    private _handleMouseMove(event: MouseEvent): void
    {
        event.stopPropagation();
        event.preventDefault();
        
        this.mouseMove.emit(event);
    }

    private _handleMouseDown(event: MouseEvent): void
    {
        event.stopPropagation();
        event.preventDefault();

        this.mouseDown.emit(event);
    }

    private _handleTouchStart(event: TouchEvent): void
    {
        event.stopPropagation();
        event.preventDefault();

        this.touchStart.emit(event);
    }

    private _handleTouchMove(event: TouchEvent): void
    {
        event.stopPropagation();
        event.preventDefault();

        this.touchMove.emit(event);
    }

    private _handleTouchEnd(event: TouchEvent): void
    {
        event.stopPropagation();
        event.preventDefault();

        this.touchEnd.emit(event);
    }

    private _handleTouchCancel(event: TouchEvent): void
    {
        event.stopPropagation();
        event.preventDefault();

        this.touchCancel.emit(event);
    }
}