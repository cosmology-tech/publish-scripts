import { copy } from '..';
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
        name: 'srcDir',
        message: 'srcDir',
        type: 'input',
        required: true,
    },
    {
        name: 'stripPath',
        message: 'stripPath',
        type: 'input',
        default: '',
    },
    {
        name: 'outDir',
        message: 'outDir',
        type: 'input',
        required: true,
    }
];
export default async (argv) => {

    // shortcut
    if (argv.copy) {
        return copy();
    }

    let {
        findExt,
        srcDir,
        stripPath,
        outDir
    } = await prompt(questions, argv);

    const cwd = process.cwd();
    if (!srcDir.startsWith('/') || !srcDir.startsWith(cwd)) {
        srcDir = join(cwd, srcDir);
    }
    if (!outDir.startsWith('/') || !outDir.startsWith(cwd)) {
        outDir = join(cwd, outDir);
    }

    copy({
        findExt,
        outDir,
        srcDir,
        stripPath
    })

};

