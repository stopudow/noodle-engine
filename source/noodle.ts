import System from "./core/system";
import I18n   from "./core/i18n";
import View   from "./core/view";

import TimerManager from "./systems/timer/timerManager";
import TweenManager from "./systems/tween/tweenManager";
import InputManager from "./systems/input";
import TickManager  from "./systems/ticker";
import Render       from "./systems/render";
import Time         from "./systems/time";

import SoundManager from "./audio/soundManager";
import AssetManager from "./asset/assetManager";

import Tree from "./scene/tree";

import GameLoop from "./gameLoop";

export * as calc   from "./math/calc";
export * as random from "./math/random";
export * as easing from "./math/easing";

export { default as TypedEvent } from "./core/event";

export { default as Vector, IVector } from "./math/vector";
export { default as TransformMatrix } from "./math/transformMatrix";

export { default as Node } from "./scene/node";
export { default as Viewport } from "./scene/viewport";

export { default as Widget } from "./builtin/widget/widget";
export { default as Camera } from "./builtin/2d/camera";

export const sys    = new System();
export const i18n   = new I18n();

export const loop   = new GameLoop();

export const assets = new AssetManager();
export const sound  = new SoundManager();

export const time   = new Time();
export const timer  = new TimerManager();

export const render = new Render();
export const view   = new View();

export const input  = new InputManager();
export const ticker = new TickManager();
export const tween  = new TweenManager();

export const tree   = new Tree();