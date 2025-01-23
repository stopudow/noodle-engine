import { TransformMatrix, Node } from "noodle";

export default class Camera extends Node
{
    protected override _calculateLocalToParentMatrix(): TransformMatrix 
    {
        this._localToParentMatrix.identity();

        this._localToParentMatrix.translate(-this._x, this._y);
        this._localToParentMatrix.rotateDeg(this._angle);
        this._localToParentMatrix.scale(this._scaleX, this._scaleY);

        return this._localToParentMatrix;
    }
}