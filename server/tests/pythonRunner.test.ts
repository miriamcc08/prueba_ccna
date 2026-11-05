import { describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execPythonSync, pythonInvocation } from './helpers/python';

describe('Cross-platform Python review runner', () => {
  it('uses the Python 3 launcher on Windows rather than the Microsoft Store python3 alias', () => {
    expect(pythonInvocation('win32', '')).toEqual({ executable: 'py', args: ['-3', '-X', 'utf8'] });
  });
  it.each(['linux', 'darwin'])('keeps Python 3 with UTF-8 mode on %s', platform => {
    expect(pythonInvocation(platform, '')).toEqual({ executable: 'python3', args: ['-X', 'utf8'] });
  });
  it('treats a configured interpreter path as one executable, without shell quoting', () => {
    const executable = 'C:\\Users\\Example User\\Python313\\python.exe';
    expect(pythonInvocation('win32', executable)).toEqual({ executable, args: ['-X', 'utf8'] });
  });
  it('executes a script in a spaced path and reads bilingual UTF-8 text using default file encoding', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ccna python '));
    try {
      const text = 'Validación: dirección IPv6, español y 日本語';
      const data = join(dir, 'bilingual data.txt');
      const script = join(dir, 'read fixture.py');
      writeFileSync(data, text, 'utf8');
      writeFileSync(script, 'import pathlib, sys\nassert sys.flags.utf8_mode == 1\nprint(pathlib.Path(sys.argv[1]).read_text())\n');
      expect(execPythonSync([script, data], { encoding: 'utf8' }).trim()).toBe(text);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  it('preserves checker failures instead of returning a passing result', () => {
    expect(() => execPythonSync(['-c', 'raise SystemExit(7)'], { stdio: 'pipe' })).toThrow();
  });
});
