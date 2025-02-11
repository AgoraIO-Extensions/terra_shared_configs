import { strict as assert } from 'assert';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import path from 'path';

import {
  ParseResult,
  RenderResult,
  TerraContext,
} from '@agoraio-extensions/terra-core';

export const irisDocRepoURL = 'https://github.com/AgoraIO-Extensions/iris_doc';

function cloneIrisDoc(terraBuildDir: string): string {
  let irisDocDirPath = path.join(terraBuildDir, 'iris_doc');

  // Skip if the iris-doc repo already exists
  if (fs.existsSync(irisDocDirPath)) {
    return irisDocDirPath;
  }

  if (!fs.existsSync(irisDocDirPath)) {
    fs.mkdirSync(irisDocDirPath);
  }

  // git clone the https://github.com/AgoraIO-Extensions/iris_doc repo into irisDocDirPath
  let gitCommand = `git clone ${irisDocRepoURL} ${irisDocDirPath} --depth 1`;

  execSync(gitCommand, { encoding: 'utf8', stdio: 'inherit' });

  return irisDocDirPath;
}

function irisDocScript(
  irisDocDir: string,
  language: string,
  fmtConfig: string,
  exportFilePath: string,
  templateUrl: string
) {
  exportFilePath = path.resolve(exportFilePath);

  if (language === 'dart') {
    // TODO(littlegnal): Maybe move to the `iris_doc.py` script.
    // The `iris_doc.py` script relies on the formatted file, we format the files before running the script to ensure the script run correctly.
    try {
      execSync(`dart format ${path.dirname(exportFilePath)}`, {
        encoding: 'utf8',
        stdio: 'inherit',
      });
    } catch (e) {
      // Allow failed.
      console.log(e);
    }
  }

  let requirementsPath = path.join(irisDocDir, 'requirements.txt');
  let fmtConfigPath = path.join(irisDocDir, 'fmt_config', fmtConfig);
  let irisDocScriptPath = path.join(irisDocDir, 'iris_doc.py');

  const isMacOS = os.platform() === 'darwin';
  const activateCommand = isMacOS
    ? `source ${path.join(irisDocDir, 'venv', 'bin', 'activate')}`
    : `. ${path.join(irisDocDir, 'venv', 'bin', 'activate')}`;

  let irisDocCommand = [
    `python3 -m venv ${path.join(irisDocDir, 'venv')}`,
    activateCommand,
    `python3 -m pip install -r ${requirementsPath}`,
    `python3 ${irisDocScriptPath} --config=${fmtConfigPath} --language=${language} --export-file-path=${exportFilePath} --template-url=${templateUrl}`,
  ].join(' && ');

  execSync(irisDocCommand, { encoding: 'utf8', stdio: 'inherit' });
}

export interface IrisDocRendererArgs {
  exportFilePath: string;
  templateUrl: string;
  language: string;
  fmtConfig: string;
}

/// e.g.,
/// ```yaml
/// renderers:
///   - name: IrisDocRenderer
///     package: '@agoraio-extensions/terra_shared_configs'
///     args:
///       language: dart
///       fmtConfig: fmt_dart.yaml
///       exportFilePath: ../../lib/agora_rtc_engine.dart
///       templateUrl: https://github.com/AgoraIO/agora_doc_source/releases/download/master-build/flutter_ng_json_template_en.json
/// ```
export function IrisDocRenderer(
  terraContext: TerraContext,
  args: IrisDocRendererArgs,
  _?: ParseResult
): RenderResult[] {
  let irisDocRepoDirPath = cloneIrisDoc(terraContext.buildDir);
  assert(args.exportFilePath);
  assert(args.templateUrl);
  assert(args.language);
  assert(args.fmtConfig);

  irisDocScript(
    irisDocRepoDirPath,
    args.language,
    args.fmtConfig,
    args.exportFilePath,
    args.templateUrl
  );
  return [];
}
