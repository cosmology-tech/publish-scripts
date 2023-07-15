import { globSync as glob } from 'glob';
import { mkdirpSync as mkdirp } from 'mkdirp';
import { rimrafSync as rimraf } from 'rimraf';
import { join, dirname, format, parse } from 'path';
import { copyFileSync } from 'fs';

export const prepare = ({
    findExt = 'js',
    replaceExt = 'mjs',
    clear = false,
    out = join(process.cwd(), '__output__'),
    cwd = process.cwd()
}) => {
    if (clear) rimraf(out);
    mkdirp(out);
    const files = glob('**/*.' + findExt, { ignore: 'node_modules/**', cwd });
    files.forEach(file => {
        const src = file;
        const dst = format({ ...parse(src), base: '', ext: '.' + replaceExt });
        const outDst = join(out, dst);
        mkdirp(dirname(outDst));
        copyFileSync(join(cwd, src), join(out, dst));
    })
}

