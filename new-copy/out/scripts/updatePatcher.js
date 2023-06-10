export function patch(old, diff) {
    let out = [];
    let i = 0;
    while (i < diff.length) {
        if (diff[i]) {
            Array.prototype.push.apply(out, old.slice(out.length, out.length + diff[i]));
        }
        i++;
        if (i < diff.length && diff[i]) {
            Array.prototype.push.apply(out, diff.slice(i + 1, i + 1 + diff[i]));
            i += diff[i];
        }
        i++;
    }
    return out;
}
//# sourceMappingURL=updatePatcher.js.map