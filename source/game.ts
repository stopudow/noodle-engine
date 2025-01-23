import { Locale } from "./core/i18n";
import { Node, view, sys, i18n, loop, tree } from "noodle";

export type Config = {
    scenes : Node[];
    locale : Locale;
    designWidth? : number;
    designHeight? : number;
    fitHeight? : boolean;
    fitWidth? : boolean;
}

export class Game
{
    constructor(config : Config)
    {
        i18n.translations = config.locale;

        view.designHeight = config.designHeight || 854;
        view.designWidth  = config.designWidth  || 480;
        view.fitHeight    = config.fitHeight    || false;
        view.fitWidth     = config.fitWidth     || false;

        tree.loadScenes(config.scenes);

        this._start();
    }

    private _start() : void
    {
        let language = localStorage.getItem("lang");

        if (language === null)
            language = sys.language;

        if (i18n.checkLanguage(language))
            i18n.language = language;
        else
            i18n.setDefaultLanguage();

        loop.start();
    }
}

