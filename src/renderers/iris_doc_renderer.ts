import { strict as assert } from 'assert';
import { execSync } from 'child_process';
import * as fs from 'fs';
import path from 'path';

import {
  ParseResult,
  RenderResult,
  TerraContext,
} from '@agoraio-extensions/terra-core';

export const irisDocRepoURL = 'https://github.com/littleGnAl/iris-doc';

function cloneIrisDoc(terraBuildDir: string): string {
  let irisDocDirPath = path.join(terraBuildDir, 'iris_doc');

  // Skip if the iris-doc repo already exists
  if (fs.existsSync(irisDocDirPath)) {
    return irisDocDirPath;
  }

  if (!fs.existsSync(irisDocDirPath)) {
    fs.mkdirSync(irisDocDirPath);
  }

  // git clone the https://github.com/littleGnAl/iris-doc repo into irisDocDirPath
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
  let requirementsPath = path.join(irisDocDir, 'requirements.txt');
  let installRequirements = `python3 -m pip install -r ${requirementsPath}`;
  const installRequirementsOut = execSync(installRequirements, {
    encoding: 'utf8',
    stdio: 'inherit',
  });
  console.log(installRequirementsOut);

  let fmtConfigPath = path.join(irisDocDir, 'fmt_config', fmtConfig);

  exportFilePath = path.resolve(exportFilePath);

  let irisDocScriptPath = path.join(irisDocDir, 'iris_doc.py');
  let irisDocCommand = `python3 ${irisDocScriptPath} --config=${fmtConfigPath} --language=${language} --export-file-path=${exportFilePath} --template-url=${templateUrl}`;

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
