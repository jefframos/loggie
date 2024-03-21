export default class RandomGenerator {
    private seedBase:number = 0;
    private seed:number = 0;
    constructor(seed:number) {
        this.seedBase = seed;
        this.seed = seed;
        //console.log(seed)
    }
    reset(newSeed:number){
        if(newSeed){
            this.seedBase = newSeed;
        }
        this.seed = this.seedBase
    }
    random() {
        var x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }
    randomOffset(value:number){
        var x = Math.sin(this.seedBase + value) * 10000;
        return x - Math.floor(x);
    }
}