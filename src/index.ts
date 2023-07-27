import { globSync as glob } from 'glob';
import { mkdirpSync as mkdirp } from 'mkdirp';
import { join, dirname, format, parse } from 'path';
import { copyFileSync } from 'fs';

export const rename = ({
    findExt = 'js',
    replaceExt = 'mjs',
    outDir = join(process.cwd(), '__output__'),
    srcDir = process.cwd()
}) => {
    mkdirp(outDir);
    const files = glob('**/*.' + findExt, { ignore: 'node_modules/**', cwd: srcDir });
    files.forEach(file => {
        const src = file;
        const dst = format({ ...parse(src), base: '', ext: '.' + replaceExt });
        const outDst = join(outDir, dst);
        mkdirp(dirname(outDst));
        copyFileSync(join(srcDir, src), join(outDir, dst));
    })
};

interface CopyFn {
    findExt: string | string[];
    outDir: string;
    srcDir: string;
    stripPath: string;
}
export const copy = ({
    findExt = ['js'],
    outDir = join(process.cwd(), '__output__'),
    srcDir = process.cwd(),
    stripPath = ''
}: CopyFn) => {
    const regexp = new RegExp('^' + stripPath);

    mkdirp(outDir);
    if (typeof findExt === 'string') findExt = findExt.split(',').map(a => a.trim()).filter(Boolean)
    const files = findExt.reduce((m, v) => {
        return [...m, ...glob('**/*.' + v, { ignore: 'node_modules/**', cwd: srcDir })];
    }, []);

    files.forEach(file => {
        let src = file;
        if (regexp.test(file)) {
            src = file.replace(regexp, '');
        }
        const outDst = join(outDir, src);
        mkdirp(dirname(outDst));
        copyFileSync(join(srcDir, file), join(outDir, src));
    })
};
