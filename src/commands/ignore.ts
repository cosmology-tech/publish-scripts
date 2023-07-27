import { ignore, updateIgnore } from '..';
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
        name: 'gitignoreFile',
        message: 'gitignoreFile',
        type: 'input',
        default: '.gitignore',
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
    if (argv.ignore) {
        return ignore()
    }

    let {
        findExt,
        srcDir,
        stripPath,
        outDir,
        gitignoreFile
    } = await prompt(questions, argv);

    const cwd = process.cwd();
    if (!srcDir.startsWith('/') || !srcDir.startsWith(cwd)) {
        srcDir = join(cwd, srcDir);
    }
    if (!outDir.startsWith('/') || !outDir.startsWith(cwd)) {
        outDir = join(cwd, outDir);
    }
    if (!gitignoreFile.startsWith('/') || !gitignoreFile.startsWith(cwd)) {
        gitignoreFile = join(cwd, gitignoreFile);
    }

    const ignoreStr = ignore({
        findExt,
        outDir,
        srcDir,
        stripPath
    });

    updateIgnore({
        gitignoreFile,
        ignoreStr
    })


};

