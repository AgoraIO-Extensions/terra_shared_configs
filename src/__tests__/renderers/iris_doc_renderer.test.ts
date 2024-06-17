import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { TerraContext } from '@agoraio-extensions/terra-core';

import {
  IrisDocRenderer,
  irisDocRepoURL,
} from '../../renderers/iris_doc_renderer';

jest.mock('child_process');

describe('IrisDocRenderer', () => {
  let tmpDir: string = '';
  let irisDocDir: string = '';
  let exportFilePath: string = '';

  beforeEach(() => {
    (execSync as jest.Mock).mockReset();

    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'terra-ut-'));

    irisDocDir = path.join(tmpDir, 'iris_doc');
    exportFilePath = path.join(tmpDir, 'export_file.dart');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('run git clone command if the iris-doc repo not be cloned', () => {
    (execSync as jest.Mock).mockImplementation(() => {
      return '';
    });

    IrisDocRenderer(
      new TerraContext(tmpDir, '', '', true, false),
      {
        language: 'dart',
        fmtConfig: 'fmt_dart.yaml',
        exportFilePath: exportFilePath,
        templateUrl: 'https://exampe.com',
      },
      undefined
    );

    let expectedGitCommand = `git clone ${irisDocRepoURL} ${irisDocDir} --depth 1`;
    expect(execSync).toHaveBeenNthCalledWith(1, expectedGitCommand, {
      encoding: 'utf8',
      stdio: 'inherit',
    });
  });

  it('do not run git clone command if the iris-doc repo exists', () => {
    // Simulate the iris-doc repo exists
    fs.mkdirSync(irisDocDir);

    (execSync as jest.Mock).mockImplementation(() => {
      return '';
    });

    IrisDocRenderer(
      new TerraContext(tmpDir, '', '', true, false),
      {
        language: 'dart',
        fmtConfig: 'fmt_dart.yaml',
        exportFilePath: exportFilePath,
        templateUrl: 'https://exampe.com',
      },
      undefined
    );

    let expectedGitCommand = `git clone ${irisDocRepoURL} ${tmpDir} --depth 1`;
    expect(execSync).not.toHaveBeenCalledWith(expectedGitCommand, {
      encoding: 'utf8',
      stdio: 'inherit',
    });
  });

  it('can run the command of iris-doc.py', () => {
    (execSync as jest.Mock).mockImplementation(() => {
      return '';
    });

    IrisDocRenderer(
      new TerraContext(tmpDir, '', '', true, false),
      {
        language: 'dart',
        fmtConfig: 'fmt_dart.yaml',
        exportFilePath: exportFilePath,
        templateUrl: 'https://exampe.com',
      },
      undefined
    );

    let irisDocScriptPath = path.join(irisDocDir, 'iris_doc.py');
    let fmtConfigPath = path.join(irisDocDir, 'fmt_config', 'fmt_dart.yaml');
    let irisDocCommand = [
      `python3 -m venv ${path.join(irisDocDir, 'venv')}`,
      `source ${path.join(irisDocDir, 'venv', 'bin', 'activate')}`,
      `python3 -m pip install -r ${path.join(irisDocDir, 'requirements.txt')}`,
      `python3 ${irisDocScriptPath} --config=${fmtConfigPath} --language=dart --export-file-path=${exportFilePath} --template-url=https://exampe.com`,
    ].join(' && ');
    // - 1 time for git clone
    // - 1 time for dart format
    // - 1 time for python install requirements.txt
    // - 1 time for iris-doc.py
    expect(execSync).toHaveBeenCalledTimes(3);
    expect(execSync).toHaveBeenNthCalledWith(3, irisDocCommand, {
      encoding: 'utf8',
      stdio: 'inherit',
    });
  });
});
