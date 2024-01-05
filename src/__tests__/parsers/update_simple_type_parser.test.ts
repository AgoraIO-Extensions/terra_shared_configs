import {
  CXXFile,
  genParseResultFromJson,
} from '@agoraio-extensions/cxx-parser';

import { TerraContext } from '@agoraio-extensions/terra-core';

import { UpdateSimpleTypeParser } from '../..';

describe('UpdateSimpleTypeParser', () => {
  it('can update with full name', () => {
    const json = JSON.stringify([
      {
        file_path: '/my/path/IAgoraRtcEngine.h',
        nodes: [
          {
            __TYPE: 'Clazz',
            name: 'TestClazz',
            methods: [
              {
                __TYPE: 'MemberFunction',
                name: 'test',
                parameters: [
                  {
                    __TYPE: 'Variable',
                    name: 'test',
                    type: {
                      __TYPE: 'SimpleType',
                      is_builtin_type: false,
                      is_const: false,
                      kind: 101,
                      name: 'Test',
                      source: 'Test *',
                    },
                  },
                ],
                parent_name: 'TestClazz',
                namespaces: ['test'],
                return_type: {
                  __TYPE: 'SimpleType',
                  is_builtin_type: false,
                  is_const: false,
                  kind: 101,
                  name: 'Test',
                  source: 'Test *',
                },
              },
            ],
            namespaces: ['test'],
          },
        ],
      },
    ]);
    let preParseResult = genParseResultFromJson(json);

    const result = (
      UpdateSimpleTypeParser(
        new TerraContext(),
        {
          config: JSON.stringify({
            'test::TestClazz.test.test': 'test',
            'test::TestClazz.test@return_type': 'ABC',
            'test::TestClazz.test.test@type': 'ABC',
          }),
        },
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asClazz();
    expect(result?.methods[0].parameters[0].source).toEqual('test');
    expect(result?.methods[0].parameters[0].type.source).toEqual('ABC');
    expect(result?.methods[0].return_type.source).toEqual('ABC');
  });

  it('can update with type name', () => {
    const json = JSON.stringify([
      {
        file_path: '/my/path/IAgoraRtcEngine.h',
        nodes: [
          {
            __TYPE: 'Clazz',
            name: 'TestClazz',
            methods: [
              {
                __TYPE: 'MemberFunction',
                name: 'test',
                parameters: [
                  {
                    __TYPE: 'Variable',
                    name: 'test',
                    type: {
                      __TYPE: 'SimpleType',
                      is_builtin_type: false,
                      is_const: false,
                      kind: 101,
                      name: 'Test',
                      source: 'Test *',
                    },
                  },
                ],
                parent_name: 'TestClazz',
                namespaces: ['test'],
                return_type: {
                  __TYPE: 'SimpleType',
                  is_builtin_type: false,
                  is_const: false,
                  kind: 101,
                  name: 'Test',
                  source: 'Test *',
                },
              },
            ],
            namespaces: ['test'],
          },
        ],
      },
    ]);
    let preParseResult = genParseResultFromJson(json);

    const result = (
      UpdateSimpleTypeParser(
        new TerraContext(),
        {
          config: JSON.stringify({
            Test: 'ABC',
          }),
        },
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asClazz();
    expect(result?.methods[0].parameters[0].type.name).toEqual('ABC');
    expect(result?.methods[0].return_type.name).toEqual('ABC');
  });

  it('can update with regex', () => {
    const json = JSON.stringify([
      {
        file_path: '/my/path/IAgoraRtcEngine.h',
        nodes: [
          {
            __TYPE: 'Clazz',
            name: 'TestClazz',
            methods: [
              {
                __TYPE: 'MemberFunction',
                name: 'test',
                parameters: [
                  {
                    __TYPE: 'Variable',
                    name: 'test',
                    type: {
                      __TYPE: 'SimpleType',
                      is_builtin_type: false,
                      is_const: false,
                      kind: 104,
                      name: 'Optional<Test>',
                      source: 'Optional<Test>',
                    },
                  },
                ],
                parent_name: 'TestClazz',
                namespaces: ['test'],
                return_type: {
                  __TYPE: 'SimpleType',
                  is_builtin_type: false,
                  is_const: false,
                  kind: 104,
                  name: 'Optional<Test>',
                  source: 'Optional<Test>',
                },
              },
            ],
            namespaces: ['test'],
          },
        ],
      },
    ]);
    let preParseResult = genParseResultFromJson(json);

    const result = (
      UpdateSimpleTypeParser(
        new TerraContext(),
        {
          config: JSON.stringify({
            'Test': 'ABC',
            '^Optional<(.*)>': '$1',
          }),
        },
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asClazz();
    expect(result?.methods[0].parameters[0].type.name).toEqual('ABC');
    expect(result?.methods[0].return_type.name).toEqual('ABC');
  });

  it('can update with function', () => {
    const json = JSON.stringify([
      {
        file_path: '/my/path/IAgoraRtcEngine.h',
        nodes: [
          {
            __TYPE: 'Clazz',
            name: 'TestClazz',
            methods: [
              {
                __TYPE: 'MemberFunction',
                name: 'test',
                parameters: [
                  {
                    __TYPE: 'Variable',
                    name: 'test',
                    type: {
                      __TYPE: 'SimpleType',
                      is_builtin_type: false,
                      is_const: false,
                      kind: 104,
                      name: 'Optional<Test>',
                      source: 'Optional<Test>',
                    },
                  },
                ],
                parent_name: 'TestClazz',
                namespaces: ['test'],
                return_type: {
                  __TYPE: 'SimpleType',
                  is_builtin_type: false,
                  is_const: false,
                  kind: 104,
                  name: 'Optional<Test>',
                  source: 'Optional<Test>',
                },
              },
            ],
            namespaces: ['test'],
          },
        ],
      },
    ]);
    let preParseResult = genParseResultFromJson(json);

    const result = (
      UpdateSimpleTypeParser(
        new TerraContext(),
        {
          ignoreDefaultConfig: true,
          configFilePath:
            './src/__tests__/parsers/update_simple_type_parser.mock.ts',
        },
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asClazz();
    expect(result?.methods[0].parameters[0].type.name).toEqual('customHook');
    expect(result?.methods[0].return_type.name).toEqual('customHook');
  });
});
