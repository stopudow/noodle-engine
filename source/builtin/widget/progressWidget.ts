import { Widget } from "noodle";

export enum ProgressDirection
{
    HORIZONTAL,
    VERTICAL
}

export class ProgressWidget extends Widget
{
    private _direction   : ProgressDirection = 0;

    private _totalLength : number = 100;
    private _progress    : number = 0.5;

    private _progressX   : number = 1;
    private _progressY   : number = 0;

    public get direction() : ProgressDirection
    {
        return this._direction;
    }

    public set direction(value : ProgressDirection)
    {
        this._direction = value;

        switch(value)
        {
        case ProgressDirection.HORIZONTAL:

            this._progressX = 1;
            this._progressX = 0;

            break;

        case ProgressDirection.VERTICAL:

            this._progressX = 0;
            this._progressX = 1;

            break;
        }

        this._calculateBar();
    }

    public get totalLength() : number
    {
        return this._totalLength;
    }

    public set totalLength(value : number)
    {
        this._totalLength = value;
        this._calculateBar();
    }

    public get progress() : number
    {
        return this._progress;
    }

    public set progress(value : number)
    {
        this._progress = value;
        this._calculateBar();
    }

    private _calculateBar() : void
    {
        const value = this._progress * this._totalLength;

        this.width  = value * this._progressX || this.width;
        this.height = value * this._progressY || this.height;
    }
}