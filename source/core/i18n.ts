import TypedEvent from "./event";

export type Locale = { [language: string] : Translation };
export type Translation = { [translation : string] : string };

export default class I18n 
{
    public languageChange : TypedEvent<void>;

    private _translations : Locale;
    private _currentLanguage : string;

    public constructor()
    {
        this._currentLanguage = "en";
        this._translations    = {};

        this.languageChange = new TypedEvent<void>();
    }

    public set translations(locale : Locale)
    {
        this._translations = locale;
    }

    public get translations() : Locale
    {
        return this._translations;
    }

    public set language(language : string)
    {
        if (this.checkLanguage(language))
        {
            this._currentLanguage = language;

            localStorage.setItem("lang", language);
        }
        else
        {
            console.error("Invalid language: " + language);
        }

        this.languageChange.emit();
    }

    public setDefaultLanguage()
    {
        this.language = this.translations[0].key;
    }

    public checkLanguage(language : string)
    {
        return this._translations.hasOwnProperty(language);
    }

    public getTranslation(key : string)
    {
        let translations = this._translations;
        let language = this._currentLanguage;

        if (translations[language].hasOwnProperty(key)) 
        {
            return translations[language][key];
        } 
        else 
        {
            console.error("Invalid key: " + key);
            return key;
        }
    }
}