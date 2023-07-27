# publish-scripts

<p align="center" width="100%">
    <img height="90" src="https://user-images.githubusercontent.com/545047/190171475-b416f99e-2831-4786-9ba3-a7ff4d95b0d3.svg" />
</p>

<p align="center" width="100%">
  <a href="https://github.com/cosmology-tech/publish-scripts/actions/workflows/run-tests.yaml">
    <img height="20" src="https://github.com/cosmology-tech/publish-scripts/actions/workflows/run-tests.yaml/badge.svg" />
  </a>
   <a href="https://github.com/cosmology-tech/publish-scripts/blob/main/LICENSE"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
   <a href="https://www.npmjs.com/package/publish-scripts"><img height="20" src="https://img.shields.io/github/package-json/v/cosmology-tech/publish-scripts?filename=package.json"></a>
</p>

## Usage

First, add `publish-scripts` as a dev dep

```
yarn add --dev publish-scripts
```

Now, update your `package.json`'s `scripts` property:

```
"build:cjs": "yarn tsc -p tsconfig.json --outDir dist --module commonjs",
"build:mjs": "yarn tsc -p tsconfig.json --outDir mjs --module es2022 --declaration false",
"build:rename": "publish-scripts --cmd rename --srcDir mjs --outDir dist --findExt js --replaceExt mjs",
"build:copy": "publish-scripts --cmd copy --srcDir dist --outDir . --findExt js,map,mjs,d.ts --stripPath codegen",
"build:clean": "publish-scripts --cmd clean --srcDir dist --outDir . --findExt js,map,mjs,d.ts --stripPath codegen --removeEmpty",
"build:ignore": "publish-scripts --cmd ignore --srcDir dist --outDir . --findExt js,map,mjs,d.ts --stripPath codegen --gitignoreFile .gitignore",
"build": "rimraf dist && yarn build:cjs && yarn build:mjs && yarn build:rename && rimraf mjs && yarn build:copy && yarn build:ignore",
```