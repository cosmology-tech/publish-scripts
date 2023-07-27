import { rename } from '..';
import { prompt } from '../utils';
import { join } from 'path';

const questions = [
    {
        name: 'findExt',
        message: 'findExt',
        type: 'input',
        required: true,
    },
    {
        name: 'replaceExt',
        message: 'replaceExt',
        type: 'input',
        required: true,
    },
    {
        name: 'srcDir',
        message: 'srcDir',
        type: 'input',
        required: true,
    },
    {
        name: 'outDir',
        message: 'outDir',
        type: 'input',
        required: true,
    }
];
export default async (argv) => {

    if (argv.rename) {
        if (!argv.findExt) {
            argv.findExt = 'js';
        }
        if (!argv.replaceExt) {
            argv.replaceExt = 'mjs';
        }
        if (!argv.outDir) {
            argv.outDir = 'dist';
        }
        if (!argv.srcDir) {
            argv.srcDir = 'mjs';
        }
    }


    let {
        findExt,
        replaceExt,
        srcDir,
        outDir
    } = await prompt(questions, argv);

    const cwd = process.cwd();
    if (!srcDir.startsWith('/') || !srcDir.startsWith(cwd)) {
        srcDir = join(cwd, srcDir);
    }
    if (!outDir.startsWith('/') || !outDir.startsWith(cwd)) {
        outDir = join(cwd, outDir);
    }

    rename({
        findExt,
        replaceExt,
        outDir,
        srcDir
    })

};

