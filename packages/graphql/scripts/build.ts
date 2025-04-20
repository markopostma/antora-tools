import * as esbuild from 'esbuild';
import { parseArgs } from 'node:util';

const entries = [
  buildEntry({
    entryPoints: ['./src/**/*.ts'],
    tsconfig: './tsconfig.build.json',
    outdir: './lib',
    platform: 'node',
    target: 'ES2022',
    format: 'cjs',
    bundle: false,
    minify: false,
    treeShaking: false,
  }),
];

Promise.all(entries).catch((err) => {
  console.log('❌ error while building');
  console.error(err);
});

async function buildEntry(opts: Partial<esbuild.BuildOptions> = {}) {
  const { watch, logLevel } = getOptions();
  const ctx = await esbuild.context({ ...opts, logLevel });

  // First build.
  await ctx.rebuild();

  // If watch is true then keep watching, else dispose the context.
  if (watch) {
    console.log('✅ Watching...');
    await ctx.watch();
  } else {
    console.log('✅ Build successful');
    await ctx.dispose();
  }

  return ctx;
}

function getOptions() {
  return parseArgs({
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
    },
  }).values as {
    watch: boolean;
    logLevel: esbuild.LogLevel;
  };
}
