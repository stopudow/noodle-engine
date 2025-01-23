import TypedEvent from "./event";

export enum Platform
{
    UNKNOWN,
    WINDOWS,
    MACOSX,
    ANDROID,
    IOS
}

export default class System
{
    public readonly windowFocus  : TypedEvent<void>;
    public readonly windowBlur   : TypedEvent<void>;
    public readonly windowResize : TypedEvent<void>;
    public readonly windowLoad   : TypedEvent<void>;

    private _audioContext : AudioContext | null;

    private _language : string;

    private _platform : Platform;

    private _canvas : HTMLCanvasElement;

    public get audioContext()
    {
        return this._audioContext;
    }

    public get language() : string
    {
        return this._language;
    }

    public get platform() : Platform
    {
        return this._platform;
    }

    public get canvas() : HTMLCanvasElement
    {
        return this._canvas;
    }

    public get isWebAudioSupported() : boolean
    {
        return !!(window.AudioContext || window.webkitAudioContext)
    }

    public get isTouchSupported() : boolean
    {
        return 'ontouchstart' in window && 'ontouchend' in window && 'ontouchcancel' in window && 'ontouchmove' in window;
    }

    public constructor()
    {
        this.windowLoad   = new TypedEvent<void>();
        this.windowBlur   = new TypedEvent<void>();
        this.windowFocus  = new TypedEvent<void>();
        this.windowResize = new TypedEvent<void>();

        this._language = "en";
        this._platform = Platform.UNKNOWN;

        this._audioContext = null;

        this._canvas = window["canvas" as keyof Window] as HTMLCanvasElement;

        this.init();
    }

    public init()
    {
        const windowAudioContext = window.AudioContext || window.webkitAudioContext;

        this._language = navigator.language.split("-")[0];
        this._platform = this._getPlatform();

        this._audioContext = null;

        if (this.isWebAudioSupported)
            this._audioContext = new windowAudioContext;

        this._disableMediaPlayer();
        this._disableContextMenu();

        window.onload   = () => { this.windowLoad.emit();   };
        window.onblur   = () => { this.windowBlur.emit();   };
        window.onfocus  = () => { this.windowFocus.emit();  };
        window.onresize = () => { this.windowResize.emit(); };
    }

    public getPerformanceNowAPI() : PerformanceNowFunction
    {
        return (performance.now ||
                function() {
                    return Date.now()
                }).bind(performance);
    }

    public getRequestAnimationFrameAPI() : RequestAnimationFrameFunction
    {
        return (window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                }).bind(window);
    }

    private _disableContextMenu() : void
    {
        // BUGFIX: Not supported on IOS.
        // Reference: https://bugs.webkit.org/show_bug.cgi?id=213953
        if (this.platform !== Platform.IOS)
            window.oncontextmenu = (e) => e.preventDefault();
    }

    private _disableMediaPlayer() : void
    {
        if ('mediaSession' in navigator) 
            navigator.mediaSession.metadata = new MediaMetadata({ });
    }

    private _getPlatform() : Platform
    {
        let userPlatform : number = Platform.UNKNOWN;

        let userAgent : string = navigator.userAgent;

        const platforms = [
            { value: Platform.WINDOWS, regex: /Windows/ },
            { value: Platform.ANDROID, regex: /Android/ },
            { value: Platform.MACOSX,  regex: /Mac OS X/ },
            { value: Platform.IOS,     regex: /(iPhone|iPad|iPod)/ },
        ]

        for (let id in platforms)
        {
            let platform = platforms[id];
            
            if (platform.regex.test(userAgent)) 
            {
                userPlatform = platform.value;
                break;
            }
        }

        return userPlatform;
    }
}