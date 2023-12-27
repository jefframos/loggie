export default class Utils {
    constructor() {

    }
    static randomCircle() {
        let angle = Math.PI * 2 * Math.random();
        return { x: Math.cos(angle), y: Math.sin(angle) }
    }
    static randomRect() {
        return { x: Math.random(), y: Math.random() }
    }
    static shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }
    static cloneArray(toCopy) {
        let array = [];
        toCopy.forEach(element => {
            array.push(element);
        });
        return array;
    }
    static shortAngleDist(a0, a1) {
        var max = Math.PI * 2;
        var da = (a1 - a0) % max;
        return 2 * da % max - da;
    }
    static scaleToFit(element, size) {
        return Math.min(size / element.width * element.scale.x, size / element.height * element.scale.y)
    }
    static scaleToFitIfMax(element, size) {
        if(element.width * element.scale.x < size &&  element.height * element.scale.y < size){
            return element.scale.x
        }
        return Math.min(size / element.width * element.scale.x, size / element.height * element.scale.y)
    }
    static angleLerp(a0, a1, t) {
        return a0 + Utils.shortAngleDist(a0, a1) * t;
    }
    static lerp(x, y, a) {
        return x * (1 - a) + y * a;
    }
    static clamp(a, min = 0, max = 1) {
        return Math.min(max, Math.max(min, a));
    }
    static invlerp(x, y, a) {
        return clamp((a - x) / (y - x));
    }
    static range(x1, y1, x2, y2, a) {
        return lerp(x2, y2, invlerp(x1, y1, a));
    }
    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    static distSort(point, array) {

        array.forEach(element => {
            element._playerDist = this.distance(element.transform.position.x, element.transform.position.z, point.x, point.z)
        });

        array.sort(Utils.playerDistCompare)
    }
    static collidingDistSort(point, array) {

        array.forEach(element => {
            element._playerDist = this.distance(element.entity.transform.position.x, element.entity.transform.position.z, point.x, point.z)
        });

        array.sort(Utils.playerDistCompare)
    }

    static playerDistCompare(a, b) {
        var yA = a._playerDist;
        var yB = b._playerDist;
        if (yA === yB) {
            return 0;
        }
        if (yA < yB) {
            return -1;
        }
        if (yA > yB) {
            return 1;
        }
        return 0;
    }

    static findValue(data) {
        if (Array.isArray(data)) {
            if (data.length == 1) {
                return data[0];
            }
            return Math.random() * (data[1] - data[0]) + data[0];
        }
        return data;
    }

    static findValueOrRandom(data) {
        if (Array.isArray(data)) {
            if (data.length == 1) {
                return data[0];
            }
            return data[Math.floor(Math.random() * data.length)];
        }
        return data;
    }

    static findValueByLevel(data, level = -1) {

        if (Array.isArray(data)) {
            level = Math.max(level, 0)
            level = Math.min(level, data.length - 1)
            if (data.length == 1) {
                return data[0];
            }
            if (level < 0) {
                return data[0];
            } else {
                return data[level];
            }
        }
        return data;
    }
    static centerObject(target, parent) {
        target.x = parent.width / 2 - target.width * 0.5;
        target.y = parent.height / 2 - target.height * 0.5;
    }
    static floatToTimeSeconds(value) {
        if (value <= 0) {
            return "00"
        }
        let hours = Math.floor(value / 60);
        let minutes = value % 60;

        return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
    }
    static floatToTime(value) {
        if (value <= 0) {
            return "00:00"
        }
        let hours = Math.floor(value / 60);
        let minutes = value % 60;

        return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
    }
    static randomRange(min, max) {
        let rnd = Math.random() * (max - min) + min;
        return rnd;
    }

    static formatNumber(value, zeros) {
        if (!zeros) {
            return value;
        }

        if (zeros == 1) {
            if (value < 10) {
                return '0' + value
            }
        }
        return value;
    }
    static easeOutElastic(x) {
        const c4 = (2 * Math.PI) / 3;

        return x === 0
            ? 0
            : x === 1
                ? 1
                : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }
    static easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
    static easeOutQuad(x) {
        return 1 - (1 - x) * (1 - x);
    }

    static easeInQuad(x) {
        return x * x;
    }
    static easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }
}