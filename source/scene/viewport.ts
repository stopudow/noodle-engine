import { Node, view } from "noodle";

export default class Viewport extends Node
{
    protected onLoad(): void 
    {
        view.changed.on(this._handleViewChanged, this);
    }

    protected start(): void 
    {
        this._handleViewChanged();
    }

    private _handleViewChanged(): void
    {
        this.scaleX = view.scale;
        this.scaleY = view.scale;
    }
}