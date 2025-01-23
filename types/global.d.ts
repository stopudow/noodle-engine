interface Window 
{
    webkitAudioContext: typeof AudioContext
    webkitRequestAnimationFrame(callback : FrameRequestCallback): number;
    mozRequestAnimationFrame(callback : FrameRequestCallback): number;
}

type RequestAnimationFrameFunction = (callback : FrameRequestCallback) => number;
type RenderContext = CanvasRenderingContext2D; 
type DrawFunction = (ctx : RenderContext) => void;

type PerformanceNowFunction = () => number