import { execFileSync } from 'node:child_process';
import type {
  ExecFileSyncOptions,
  ExecFileSyncOptionsWithBufferEncoding,
  ExecFileSyncOptionsWithStringEncoding,
} from 'node:child_process';

// Execute argument arrays directly: paths with spaces must not pass through a shell.
export function pythonInvocation(platform: string = process.platform, executable = process.env.CCNA_PYTHON) {
  if (executable) return { executable, args: ['-X', 'utf8'] };
  return platform === 'win32'
    ? { executable: 'py', args: ['-3', '-X', 'utf8'] }
    : { executable: 'python3', args: ['-X', 'utf8'] };
}

export function execPythonSync(args: readonly string[], options: ExecFileSyncOptionsWithStringEncoding): string;
export function execPythonSync(args: readonly string[], options?: ExecFileSyncOptionsWithBufferEncoding): Buffer;
export function execPythonSync(args: readonly string[], options?: ExecFileSyncOptions): string | Buffer;
export function execPythonSync(args: readonly string[], options: ExecFileSyncOptions = {}): string | Buffer {
  const python = pythonInvocation();
  return execFileSync(python.executable, [...python.args, ...args], { ...options, shell: false });
}
