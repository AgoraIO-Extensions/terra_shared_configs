import fs from 'fs';
import os from 'os';
import path from 'path';

import { genParseResultFromJson } from '@agoraio-extensions/cxx-parser';
import { TerraContext } from '@agoraio-extensions/terra-core';

import { OverrideNodeParser } from '../../parsers/override_node_parser';
import { ValidateCustomHeadersParser } from '../../parsers/validate_custom_headers_parser';
import * as parserUtils from '../../utils/parser_utils';

let root: string;
let warn: jest.SpyInstance;
const context = new TerraContext();
const method = (type: string) => ({
  __TYPE: 'MemberFunction',
  name: 'startRecordingDeviceTest',
  parameters: type
    ? [{ __TYPE: 'Variable', name: 'config', type: { source: type } }]
    : [],
});
const native = (types = ['int']) =>
  genParseResultFromJson(
    JSON.stringify([
      {
        file_path: '/sdk/IAudioDeviceManager.h',
        nodes: [
          {
            __TYPE: 'Clazz',
            name: 'IAudioDeviceManager',
            namespaces: ['agora', 'rtc'],
            methods: types.map(method),
          },
        ],
      },
    ])
  );
const args = () => ({ includeHeaderDirs: [path.join(root, 'include')] });
const custom = (id: string) => {
  const text = `/** @iris_api_id: ${id} */\n`;
  fs.writeFileSync(
    path.join(root, 'custom_headers/CustomIAudioDeviceManager.h'),
    text
  );
  return text;
};

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'custom-headers-test-'));
  fs.mkdirSync(path.join(root, 'custom_headers'));
  warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  jest.restoreAllMocks();
  fs.rmSync(root, { recursive: true, force: true });
});

test('rejects the stale FAV struct override before custom parsing or mutation', () => {
  custom('AudioDeviceManager_startRecordingDeviceTest_db21a14');
  const parsed = native();
  const before = JSON.stringify(parsed, (key, value) =>
    key === 'parent' ? undefined : value
  );
  const parse = jest.spyOn(parserUtils, 'generateNodes');
  expect(() => OverrideNodeParser(context, args() as any, parsed)).toThrow(
    'AudioDeviceManager_startRecordingDeviceTest_db21a14 has no matching Native API signature'
  );
  expect(parse).not.toHaveBeenCalled();
  expect(
    JSON.stringify(parsed, (key, value) =>
      key === 'parent' ? undefined : value
    )
  ).toBe(before);
});

test('accepts the struct selection when Native has both recording-test overloads', () => {
  const text = custom('AudioDeviceManager_startRecordingDeviceTest_db21a14');
  const parsed = native([
    'int',
    'agora::rtc::RecordingDeviceTestConfiguration const&',
  ]);
  expect(ValidateCustomHeadersParser(context, args(), parsed)).toBe(parsed);
  expect(warn).not.toHaveBeenCalled();
  expect(
    fs.readFileSync(
      path.join(root, 'custom_headers/CustomIAudioDeviceManager.h'),
      'utf8'
    )
  ).toBe(text);
});

test('warns about unselected overloads without choosing one or changing the AST', () => {
  const parsed = native([
    'int',
    'agora::rtc::RecordingDeviceTestConfiguration const&',
  ]);
  const before = JSON.stringify(parsed, (key, value) =>
    key === 'parent' ? undefined : value
  );
  ValidateCustomHeadersParser(context, args(), parsed);
  expect(warn).toHaveBeenCalledTimes(1);
  expect(warn.mock.calls[0][0]).toContain('Native overloads need review');
  expect(warn.mock.calls[0][0]).toContain('startRecordingDeviceTest');
  expect(
    JSON.stringify(parsed, (key, value) =>
      key === 'parent' ? undefined : value
    )
  ).toBe(before);
});

test('permits handwritten adapters but does not let them suppress overload warnings', () => {
  custom('AudioDeviceManager_unregisterObserver');
  ValidateCustomHeadersParser(context, args(), native(['int', 'bool']));
  expect(warn).toHaveBeenCalledTimes(1);
});

test('rejects a removed API even if no same-name Native method remains', () => {
  custom('AudioDeviceManager_startRecordingDeviceTest_db21a14');
  expect(() =>
    ValidateCustomHeadersParser(context, args(), native([]))
  ).toThrow('Stale overrides');
});

test('a single Native method needs no overload selection', () => {
  ValidateCustomHeadersParser(context, args(), native());
  expect(warn).not.toHaveBeenCalled();
});
