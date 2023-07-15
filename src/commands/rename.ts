import { prompt } from '../utils';

const questions = [
    {
        name: 'findExt',
        message: 'findExt',
        required: true,
    },
    {
        name: 'replaceExt',
        message: 'replaceExt',
        required: true,
    }
];
export default async (argv) => {
    const args = await prompt(questions, argv);

    console.log(args);
};

