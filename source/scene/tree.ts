import { Node, Viewport, assets, loop, render } from "noodle";

export default class Tree
{
    private _root : Viewport;

    private _isLoading : boolean = false;

    public get root() : Node
    {
        return this._root;
    }

    public constructor()
    {
        this._root = new Viewport();
        this._root.tag = "__Root__";
        this._root.load();

        loop.addSystem(this._renderScene.bind(this));

        console.log("Init Tree (Render Scene)");
    }

    public loadScenes(scenes : Node[])
    {
        for (let scene of scenes)
            this._loadScene(scene);

        this._waitForAssetsLoaded();
    }

    public loadScene(scene : Node)
    {
        this._loadScene(scene);
        this._waitForAssetsLoaded();
    }

    public findByTag(tag : string) : Node | null
    {
        return this._root.findByTag(tag);
    }

    public findAllByTag(tag : string) : Node[]
    {
        return this._root.findAllByTag(tag);
    }

    public findByType<Type extends Node>(type : new (...args : any []) => Type) : Type | null
    {
        return this._root.findByType(type);
    }

    public findAllByType<Type extends Node>(type : new (...args : any []) => Type) : Type[]
    {
        return this._root.findAllByType(type);
    }

    private _renderScene()
    {
        const ctx = render.context;

        for (let child of this._root.children)
            child.render(ctx);
    }

    private _loadScene(scene : Node)
    {
        scene.setParent(this._root);
        scene.load();

        for (let child of scene.children)
            child.load();
    }

    private _waitForAssetsLoaded() : void
    {
        if (this._isLoading)
            return

        this._isLoading = true;

        if (assets.queue > 0)
        {
            assets.queueEmpty.once(this._onAssetsLoaded.bind(this));
            return;
        }
    }

    private _onAssetsLoaded()
    {
        this._isLoading = false;

        this._root.setActive(true);
    }
}