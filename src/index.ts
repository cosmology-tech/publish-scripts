import { globSync as glob } from 'glob';
import { mkdirpSync as mkdirp } from 'mkdirp';
import { extname, join, dirname, format, parse } from 'path';
import { copyFileSync, readdirSync, rmdirSync, statSync } from 'fs';
import { rimrafSync } from 'rimraf';

export const rename = ({
    findExt,
    replaceExt,
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
    findExt = [],
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
interface CleanFn {
    findExt: string | string[];
    outDir: string;
    srcDir: string;
    stripPath: string;
    removeEmpty: boolean;
}


const cleanEmptyFoldersRecursively = (folder) => {
    const isDir = statSync(folder).isDirectory();
    if (!isDir) return;
    let files = readdirSync(folder);
    if (files.length > 0) {
        files.forEach((file) => {
            var fullPath = join(folder, file);
            cleanEmptyFoldersRecursively(fullPath);
        });

        // re-evaluate files; after deleting subfolder
        // we may have parent folder empty now
        files = readdirSync(folder);
    }

    if (files.length == 0) {
        rmdirSync(folder);
        return;
    }
}

// deletes the files that would have otherwise been copied
export const clean = ({
    findExt = [],
    outDir = join(process.cwd(), '__output__'),
    srcDir = process.cwd(),
    stripPath = '',
    removeEmpty = true
}: CleanFn) => {
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
        rimrafSync(join(outDir, src));
    });

    // clean empty dirs
    if (removeEmpty) {
        cleanEmptyFoldersRecursively(outDir);
    }
};

interface IgnoreFn {
    findExt: string | string[];
    outDir: string;
    srcDir: string;
    stripPath: string;
}

// log the files that would have otherwise been copied
export const ignore = ({
    findExt = [],
    outDir = join(process.cwd(), '__output__'),
    srcDir = process.cwd(),
    stripPath = ''
}: IgnoreFn) => {
    const regexp = new RegExp('^' + stripPath);

    if (typeof findExt === 'string') findExt = findExt.split(',').map(a => a.trim()).filter(Boolean)
    const files = findExt.reduce((m, v) => {
        return [...m, ...glob('**/*.' + v, { ignore: 'node_modules/**', cwd: srcDir })];
    }, []);

    // only get the top level files (this can prob be more efficient)
    const del = files.reduce((m, file) => {
        let src = file;
        if (regexp.test(file)) {
            src = file.replace(regexp, '');
        }
        const srcs = src.split('/').map(a => a.trim()).filter(Boolean);
        const first = srcs?.[0] ?? '';
        if (first !== '') {
            m[first] = true;
        }
        return m;
    }, {});

    return Object.keys(del).reduce((m, v) => {
        return `${m}/${v}\n`
    }, '');
};
