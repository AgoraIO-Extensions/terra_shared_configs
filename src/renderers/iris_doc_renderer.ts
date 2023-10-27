import { strict as assert } from 'assert';
import { execSync } from 'child_process';
import * as fs from 'fs';
import path from 'path';

import {
  ParseResult,
  RenderResult,
  TerraContext,
} from '@agoraio-extensions/terra-core';

function cloneIrisDoc(terraBuildDir: string): string {
  let irisDocDirPath = path.join(terraBuildDir, 'iris_doc');

  let irisDocRepoDirPath = path.join(terraBuildDir, 'iris-doc');
  // Skip if the iris-doc repo already exists
  if (fs.existsSync(irisDocRepoDirPath)) {
    return irisDocRepoDirPath;
  }

  if (!fs.existsSync(irisDocDirPath)) {
    fs.mkdirSync(irisDocDirPath);
  }

  // git clone the https://github.com/littleGnAl/iris-doc repo into irisDocDirPath
  let irisDocRepoURL = 'https://github.com/littleGnAl/iris-doc';
  let gitCommand = `git clone ${irisDocRepoURL} ${irisDocDirPath} --depth 1`;

  execSync(gitCommand, { encoding: 'utf8', stdio: 'inherit' });

  return irisDocRepoDirPath;
}

function irisDocScript(
  irisDocDir: string,
  exportFilePath: string,
  templateUrl: string
) {
  let requirementsPath = path.join(irisDocDir, 'requirements.txt');
  let installRequirements = `python3 -m pip install -r ${requirementsPath}`;
  const installRequirementsOut = execSync(installRequirements, {
    encoding: 'utf8',
  });
  console.log(installRequirementsOut);

  let fmtConfigPath = path.join(irisDocDir, 'fmt_config', 'fmt_dart.yaml');

  exportFilePath = path.resolve(exportFilePath);

  let irisDocScriptPath = path.join(irisDocDir, 'iris_doc.py');
  let irisDocCommand = `python3 ${irisDocScriptPath} --config=${fmtConfigPath} --language=dart --export-file-path=${exportFilePath} --template-url=${templateUrl}`;

  execSync(irisDocCommand, { encoding: 'utf8', stdio: 'inherit' });
}

export interface IrisDocRendererArgs {
  exportFilePath: string;
  templateUrl: string;
}

export default function IrisDocRenderer(
  terraContext: TerraContext,
  args: IrisDocRendererArgs,
  _: ParseResult
): RenderResult[] {
  let irisDocRepoDirPath = cloneIrisDoc(terraContext.buildDir);
  assert(args.exportFilePath);
  assert(args.templateUrl);

  irisDocScript(irisDocRepoDirPath, args.exportFilePath, args.templateUrl);
  return [];
}
