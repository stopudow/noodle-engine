export default interface ISound
{
    get playing() : boolean;
    
    loop : boolean;
    play() : void;
    resume() : void;
    suspend() : void;
    pause() : void;
    stop() : void;
}