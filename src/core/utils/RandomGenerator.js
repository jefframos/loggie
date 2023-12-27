export default class RandomGenerator {
    constructor(seed) {
        this.seedBase = seed;
        this.seed = seed;
        //console.log(seed)
    }
    reset(newSeed){
        if(newSeed){
            this.seedBase = newSeed;
        }
        this.seed = this.seedBase
    }
    random() {
        var x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }
    randomOffset(value){
        var x = Math.sin(this.seedBase + value) * 10000;
        return x - Math.floor(x);
    }
}