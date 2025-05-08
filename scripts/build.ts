import { configureLogger, getLogger } from '@antora/logger';
import { parseArgs } from 'node:util';

/**
 * A generic build script with esbuild under the hood.
 *
 */
async function build() {
  const { join, resolve } = await import('node:path');
  const { root } = getOptions();

  return Promise.all(
    root.map((dir) =>
      buildEntry({
        entryPoints: [join(dir, 'src/**/*.ts')],
        tsconfig: join(dir, 'tsconfig.build.json'),
        outdir: join(resolve(dir), 'lib'),
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

async function buildEntry(opts: Partial<import('esbuild').BuildOptions> = {}) {
  const esbuild = await import('esbuild');
  const logger = await createLogger('build');
  const { watch, logLevel } = getOptions();
  const ctx = await esbuild.context({
    ...opts,
    logLevel,
  });

  // First build.
  await ctx.rebuild();

  // If watch is true then keep watching, else dispose the context.
  if (watch) {
    logger.info('Watching... 👀');
    await ctx.watch();
  } else {
    logger.info(`Build successful [${opts.outdir}]`);
    await ctx.dispose();
  }

  return ctx;
}

async function createLogger(name: string) {
  configureLogger({
    name,
    level: 'trace',
    format: 'pretty',
  });

  return getLogger(name);
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
      root: {
        type: 'string',
        multiple: true,
        default: ['.'],
        short: 'r',
      },
    },
  }).values as {
    watch: boolean;
    logLevel: import('esbuild').LogLevel;
    root: string[];
  };
}

build();
