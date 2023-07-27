import { prompt } from './utils';
import { Commands as commands } from './cmds';

const question = [
    {
        _: true,
        type: 'fuzzy',
        name: 'cmd',
        message: 'what do you want to do?',
        choices: Object.keys(commands)
    }
];

export const cli = async (argv) => {
    if (argv.clean) argv.cmd = 'clean';
    if (argv.rename) argv.cmd = 'rename';
    if (argv.copy) argv.cmd = 'copy';
    if (argv.ignore) argv.cmd = 'ignore';

    var { cmd } = await prompt(question, argv);
    if (typeof commands[cmd] === 'function') {
        await commands[cmd](argv);
    } else {
        console.log('command not found.');
    }
};
