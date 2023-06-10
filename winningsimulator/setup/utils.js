export function later(delay) {
    return new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });
}
export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export class Log {
    static debugEnabled = false;
    static setDebugOutput(debug) {
        Log.debugEnabled = debug;
    }
    static stdout(...args) {
        console.log(new Date().toISOString(), args.join(' '));
    }
    static stderr(...args) {
        process.stderr.write('\x1b[31m');
        console.error(new Date().toISOString(), args.join(' '));
        process.stderr.write('\x1b[0m');
    }
    static debug(...args) {
        if (!Log.debugEnabled)
            return;
        process.stdout.write('\x1b[34m');
        console.log(new Date().toISOString(), args.join(' '));
        process.stdout.write('\x1b[0m');
    }
    static debugObject(label, obj) {
        if (!Log.debugEnabled)
            return;
        process.stdout.write('\x1b[34m');
        console.log(new Date().toISOString(), label);
        console.log(JSON.stringify(obj, null, 2));
        process.stdout.write('\x1b[0m');
    }
}
//# sourceMappingURL=utils.js.map