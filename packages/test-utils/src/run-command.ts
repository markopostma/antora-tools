import { exec } from 'node:child_process';
import { promisify } from 'node:util';

export async function runCommand(...command: string[]) {
  const { stderr, stdout } = await promisify(exec)(command.join(' '));

  if (stderr !== '' && stderr !== undefined && stderr !== null) {
    throw new Error(stderr);
  }

  return stdout;
}
