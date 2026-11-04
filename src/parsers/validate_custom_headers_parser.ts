import fs from 'fs';
import path from 'path';

import { CXXFile } from '@agoraio-extensions/cxx-parser';
import {
  ParseResult,
  TerraContext,
  resolvePath,
} from '@agoraio-extensions/terra-core';

import { irisApiId } from '../utils/iris_utils';

/** Check Native parameter signatures without parsing the custom headers again. */
export function ValidateCustomHeadersParser(
  context: TerraContext,
  args: { includeHeaderDirs?: string[] },
  result?: ParseResult
): ParseResult | undefined {
  if (!result) return result;

  const nativeIds = new Set<string>();
  const overloads = new Map<string, Set<string>>();
  for (const file of result.nodes as CXXFile[]) {
    for (const node of file.nodes) {
      if (!node.isClazz()) continue;
      const clazz = node.asClazz();
      for (const method of clazz.methods) {
        const id = irisApiId(clazz, method, { toUpperCase: false });
        nativeIds.add(id);
        if (!/^I[A-Z]/.test(clazz.name)) continue;
        const key = `${clazz.fullName}.${method.name}`;
        const ids = overloads.get(key) ?? new Set<string>();
        ids.add(id);
        overloads.set(key, ids);
      }
    }
  }

  const selected = new Set<string>();
  const errors: string[] = [];
  const directories = new Set(
    (args.includeHeaderDirs ?? []).map((dir) =>
      path.join(
        path.dirname(resolvePath(dir, context.configDir)),
        'custom_headers'
      )
    )
  );
  for (const directory of directories) {
    if (!fs.existsSync(directory)) continue;
    for (const name of fs.readdirSync(directory).sort()) {
      if (!name.endsWith('.h')) continue;
      const filename = path.join(directory, name);
      const text = fs.readFileSync(filename, 'utf8');
      for (const match of text.matchAll(/@iris_api_id:\s*(\S+)/g)) {
        const id = match[1];
        selected.add(id);
        // Unhashed IDs also name handwritten Iris adapters (e.g. unregister).
        // Only hashed IDs claim a Native parameter signature we can verify.
        if (/_[0-9a-f]{7}$/.test(id) && !nativeIds.has(id)) {
          errors.push(
            `${filename}: ${id} has no matching Native API signature`
          );
        }
      }
    }
  }

  if (errors.length) {
    throw new Error(`[custom headers] Stale overrides:\n${errors.join('\n')}`);
  }
  const unreviewed = [...overloads]
    .filter(
      ([, ids]) => ids.size > 1 && ![...ids].some((id) => selected.has(id))
    )
    .map(([name, ids]) => `${name}: ${[...ids].join(', ')}`);
  if (unreviewed.length) {
    console.warn(
      `[custom headers] Native overloads need review; no custom selection found. ` +
        `Review which overload to expose; custom headers were not changed.\n${unreviewed.join(
          '\n'
        )}`
    );
  }
  return result;
}
