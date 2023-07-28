import { globSync as glob } from 'glob';
import { mkdirpSync as mkdirp } from 'mkdirp';
import { join, dirname, format, parse } from 'path';
import { writeFileSync, readFileSync, copyFileSync, readdirSync, rmdirSync, statSync } from 'fs';
import { rimrafSync } from 'rimraf';

interface RenameFn {
    findExt: string;
    replaceExt: string;
    outDir: string;
    srcDir: string;
}
const defaultRename: RenameFn = {
    findExt: 'js',
    replaceExt: 'mjs',
    outDir: 'dist',
    srcDir: 'mjs'
};
export const rename = ({
    findExt = 'js',
    replaceExt = 'mjs',
    outDir = 'dist',
    srcDir = 'mjs'
}: RenameFn = defaultRename) => {
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
const defaultCopy: CopyFn = {
    findExt: 'js,map,mjs,d.ts',
    outDir: '.',
    srcDir: 'dist',
    stripPath: ''
};
export const copy = ({
    findExt = 'js,map,mjs,d.ts',
    outDir = '.',
    srcDir = 'dist',
    stripPath = ''
}: CopyFn = defaultCopy) => {
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

const defaultClean: CleanFn = {
    findExt: 'js,map,mjs,d.ts',
    outDir: '.',
    srcDir: 'dist',
    stripPath: '',
    removeEmpty: true
};

// deletes the files that would have otherwise been copied
export const clean = ({
    findExt = 'js,map,mjs,d.ts',
    outDir = '.',
    srcDir = 'dist',
    stripPath = '',
    removeEmpty = true
}: CleanFn = defaultClean) => {
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

const defaultIgnore: IgnoreFn = {
    findExt: 'js,map,mjs,d.ts',
    outDir: '.',
    srcDir: 'dist',
    stripPath: ''
};

// log the files that would have otherwise been copied
export const ignore = ({
    findExt = 'js,map,mjs,d.ts',
    outDir = '.',
    srcDir = 'dist',
    stripPath = ''
}: IgnoreFn = defaultIgnore) => {
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

    const ignoreStr = Object.keys(del).reduce((m, v) => {
        return `${m}/${v}\n`
    }, '');

    return `
# publish-scripts
# AUTOMATED DONT EDIT
${ignoreStr}
# END publish-scripts
    `
};
interface UpdateIgnoreFn {
    gitignoreFile: string;
    ignoreStr: string
}
const defaultUpdateIgnore: UpdateIgnoreFn = {
    gitignoreFile: '.gitignore',
    ignoreStr: ''
};
export const updateIgnore = ({
    gitignoreFile = '.gitignore',
    ignoreStr = ''
}: UpdateIgnoreFn = defaultUpdateIgnore) => {
    let read = true;
    const cur = readFileSync(gitignoreFile, 'utf-8');
    const str = cur.split('\n').filter(line => line.trim() !== '').reduce((m, line) => {
        if (line.match(/^\# publish-scripts/)) read = false;
        if (line.match(/^\# END publish-scripts/)) {
            read = true;
            return m;
        }
        if (read) {
            return [...m, line];
        }
        return m;
    }, []).reduce((m, v) => {
        if (v.startsWith('#')) {
            // hacky way to add some vertical spacing
            return [...m, '\n', v];
        }
        return [...m, v]
    }, []).join('\n');
    const finalStr = `${str}
${ignoreStr}
`;
    writeFileSync(gitignoreFile, finalStr);
};
