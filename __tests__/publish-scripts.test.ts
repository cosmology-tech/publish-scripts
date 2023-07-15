import { prepare } from '../src/index';
import { join, resolve } from 'path';
import { globSync as glob } from 'glob';

const curDir = resolve(join(__dirname, '/../__fixtures__/'))
const outDir = resolve(join(__dirname, '/../__output__/'))

it('works', async () => {
    prepare({
        clear: true,
        findExt: 'js',
        replaceExt: 'texta',
        cwd: join(curDir, 'builda'),
        out: outDir
    });
    prepare({
        findExt: 'js',
        replaceExt: 'textb',
        cwd: join(curDir, 'buildb'),
        out: outDir
    });
    const a = glob(outDir + '/**/*').map(f => f.replace(outDir, '').replace(/^\//, ''))
    expect(a).toMatchSnapshot();
});