export default interface IAssetLoader
{
    supportedExtensions : string[];

    loadAsset(assetName : string) : void;
}