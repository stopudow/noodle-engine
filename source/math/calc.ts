export const DEG_TO_RAD : number = 0.0174532; // 9251
export const RAD_TO_DEG : number = 57.295779; // 5131

export function clamp(value: number, min: number, max: number) : number
{
    return Math.min(Math.max(value, min), max);
}

export function lerp(start : number, end : number, percent : number) : number
{
    return start * (1 - percent) + end * percent;
}

export function inverseLerp(start : number, end : number, value : number) : number
{
    return (value - start) / (end - start);
}

export function distance(x1 : number, y1 : number, x2 : number, y2 : number) : number
{
    return Math.sqrt(((y2 - y1) ** 2) + ((x2 - x1) ** 2));
}

export function direction(x1 : number, y1 : number, x2 : number, y2 : number) : number
{
    return Math.atan2(y2 - y1, x2 - x1);
}