import { Widget } from "noodle";

export class BaseButton extends Widget
{
    public onPointerEnter   ?(): void;
    public onPointerExit    ?(): void;
    public onPointerPress   ?(): void;
    public onPointerRelease ?(): void;
    public onPointerDrag    ?(): void;
}


