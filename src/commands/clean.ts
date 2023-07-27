import { clean } from '..';
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
    },
    {
        name: 'removeEmpty',
        message: 'remove empty directories?',
        type: 'confirm',
        required: true,
    }
];
export default async (argv) => {
    let {
        findExt,
        srcDir,
        stripPath,
        outDir,
        removeEmpty
    } = await prompt(questions, argv);

    const cwd = process.cwd();
    if (!srcDir.startsWith('/') || !srcDir.startsWith(cwd)) {
        srcDir = join(cwd, srcDir);
    }
    if (!outDir.startsWith('/') || !outDir.startsWith(cwd)) {
        outDir = join(cwd, outDir);
    }

    clean({
        findExt,
        outDir,
        srcDir,
        stripPath,
        removeEmpty
    })

};

