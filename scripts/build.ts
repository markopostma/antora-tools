import * as esbuild from 'esbuild';
import * as path from 'node:path';
import { parseArgs } from 'node:util';

async function build() {
  const { packages } = getOptions();

  return Promise.all(
    packages.map(async (pack) =>
      buildEntry({
        entryPoints: [path.join(pack, 'src/**/*.ts')],
        tsconfig: path.join(pack, 'tsconfig.build.json'),
        outdir: path.join(pack, 'lib'),
        // Common
        platform: 'node',
        target: 'ES2022',
        format: 'cjs',
        bundle: false,
        minify: false,
        treeShaking: false,
      }),
    ),
  );
}

async function buildEntry(opts: Partial<esbuild.BuildOptions> = {}) {
  const { watch, logLevel } = getOptions();
  const ctx = await esbuild.context({
    ...opts,
    logLevel,
  });

  // First build.
  await ctx.rebuild();

  // If watch is true then keep watching, else dispose the context.
  if (watch) {
    console.log('✅ Watching...');
    await ctx.watch();
  } else {
    console.log(`✅ Build successful [${opts.outdir}]`);
    await ctx.dispose();
  }

  return ctx;
}

function getOptions() {
  return parseArgs({
    strict: true,
    options: {
      watch: {
        type: 'boolean',
        short: 'w',
        default: false,
        multiple: false,
      },
      logLevel: {
        type: 'string',
        default: 'info',
      },
      packages: {
        type: 'string',
        multiple: true,
        default: [],
        short: 'p',
      },
    },
  }).values as {
    watch: boolean;
    logLevel: esbuild.LogLevel;
    packages: string[];
  };
}

build();
