import { rename } from '../src/index';
import { join, resolve } from 'path';
import { globSync as glob } from 'glob';

const curDir = resolve(join(__dirname, '/../__fixtures__/'))
const outDir = resolve(join(__dirname, '/../__output__/'))

it('works', async () => {
    rename({
        rmDir: true,
        findExt: 'js',
        replaceExt: 'texta',
        srcDir: join(curDir, 'builda'),
        outDir
    });
    rename({
        findExt: 'js',
        replaceExt: 'textb',
        srcDir: join(curDir, 'buildb'),
        outDir
    });
    const a = glob(outDir + '/**/*').map(f => f.replace(outDir, '').replace(/^\//, ''))
    expect(a).toMatchSnapshot();
});