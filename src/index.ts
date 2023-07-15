import { globSync as glob } from 'glob';
import { mkdirpSync as mkdirp } from 'mkdirp';
import { rimrafSync as rimraf } from 'rimraf';
import { join, dirname, format, parse } from 'path';
import { copyFileSync } from 'fs';

export const rename = ({
    findExt = 'js',
    replaceExt = 'mjs',
    rmDir = false,
    outDir = join(process.cwd(), '__output__'),
    srcDir = process.cwd()
}) => {
    if (rmDir) rimraf(outDir);
    mkdirp(outDir);
    const files = glob('**/*.' + findExt, { ignore: 'node_modules/**', cwd: srcDir });
    files.forEach(file => {
        const src = file;
        const dst = format({ ...parse(src), base: '', ext: '.' + replaceExt });
        const outDst = join(outDir, dst);
        mkdirp(dirname(outDst));
        copyFileSync(join(srcDir, src), join(outDir, dst));
    })
}
