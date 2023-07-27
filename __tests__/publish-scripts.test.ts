import { rename, copy } from '../src/index';
import { join, resolve } from 'path';
import { globSync as glob } from 'glob';
import { rimrafSync } from 'rimraf';

const FIXTURES = resolve(join(__dirname, '/../__fixtures__/'))
const OUTDIR = resolve(join(__dirname, '/../__output__/'))

it('rename', async () => {
    const outDir = join(OUTDIR, 'rename-test');
    const curDir = join(FIXTURES, 'rename-test');
    rimrafSync(outDir);
    rename({
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

it('copy', async () => {
    const outDir = join(OUTDIR, 'copy-test');
    const curDir = join(FIXTURES, 'copy-test');
    rimrafSync(outDir);
    copy({
        findExt: 'texta,textb,tx,ty',
        srcDir: curDir,
        outDir,
        stripPath: ''
    });
    const a = glob(outDir + '/**/*').map(f => f.replace(outDir, '').replace(/^\//, ''))
    expect(a).toMatchSnapshot();
});

it('copy stripPath', async () => {
    const outDir = join(OUTDIR, 'copy-test');
    const curDir = join(FIXTURES, 'copy-test');
    rimrafSync(outDir);
    copy({
        findExt: 'texta,textb,tx,ty',
        srcDir: curDir,
        outDir,
        stripPath: 'some/path'
    });
    const a = glob(outDir + '/**/*').map(f => f.replace(outDir, '').replace(/^\//, ''))
    expect(a).toMatchSnapshot();
});

it('copy stripPath bad', async () => {
    const outDir = join(OUTDIR, 'copy-test');
    const curDir = join(FIXTURES, 'copy-test');
    rimrafSync(outDir);
    copy({
        findExt: 'texta,textb,tx,ty',
        srcDir: curDir,
        outDir,
        stripPath: 'another/some/path'
    });
    const a = glob(outDir + '/**/*').map(f => f.replace(outDir, '').replace(/^\//, ''))
    expect(a).toMatchSnapshot();
});