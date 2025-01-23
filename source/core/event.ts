interface IListener<T> 
{
    (event: T): any;
}

interface IDisposable 
{
    dispose() : void;
}

export default class TypedEvent<T> 
{
    private _listeners: IListener<T>[] = [];
    private _listenersOncer: IListener<T>[] = [];

    public on(listener : IListener<T>, target?: any) : IDisposable
    {
        let finalListener : IListener<T>;

        if (target) 
            finalListener = listener.bind(target);
        else
            finalListener = listener

        this._listeners.push(finalListener);

        return { dispose: () => this.off(finalListener) };
    };

    public once(listener : IListener<T>, target?: any) : void 
    {
        let finalListener : IListener<T>;

        if (target) 
            finalListener = listener.bind(target);
        else
            finalListener = listener

        this._listenersOncer.push(finalListener);
    };

    public off(listener : IListener<T>, target?: any) : void
    {
        let finalListener : IListener<T>;

        if (target) 
            finalListener = listener.bind(target);
        else
            finalListener = listener

        var callbackIndex = this._listeners.indexOf(finalListener);

        if (callbackIndex > -1)
            this._listeners.splice(callbackIndex, 1);
    };

    public emit (event: T) : void 
    {
        this._listeners.forEach((listener) => listener(event));

        if (this._listenersOncer.length > 0) 
        {
            const toCall = this._listenersOncer;

            this._listenersOncer = [];

            toCall.forEach((listener) => listener(event));
        }
    };

    public pipe(typedEvent : TypedEvent<T>, target?: any) : IDisposable 
    {
        return this.on((e) => typedEvent.emit(e), target);
    };
}