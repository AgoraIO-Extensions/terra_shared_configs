import {
  CXXFile,
  SimpleTypeKind,
  genParseResultFromJson,
} from '@agoraio-extensions/cxx-parser';

import { TerraContext } from '@agoraio-extensions/terra-core';

import { ReturnTypeParser } from '../..';

describe('ReturnTypeParser', () => {
  it('can change MemberFunction return_type', () => {
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
                return_type: {
                  __TYPE: 'SimpleType',
                  is_builtin_type: false,
                  is_const: false,
                  kind: 102,
                  name: 'value_type',
                  source: 'value_type&',
                  template_arguments: [],
                },
                parent_name: 'TestClazz',
                namespaces: ['test'],
              },
            ],
            namespaces: ['test'],
          },
        ],
      },
    ]);
    let preParseResult = genParseResultFromJson(json);

    let config = {
      'test::TestClazz.test': {
        name: 'test111',
        source: 'test222',
        kind: SimpleTypeKind.array_t,
        is_const: true,
        is_builtin_type: true,
      },
    };

    const result = (
      ReturnTypeParser(
        new TerraContext(),
        {
          convertReturnToVoid: false,
          config: JSON.stringify(config),
        },
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asClazz();
    expect(result?.methods[0].return_type.name).toEqual(
      config['test::TestClazz.test'].name
    );
    expect(result?.methods[0].return_type.source).toEqual(
      config['test::TestClazz.test'].source
    );
    expect(result?.methods[0].return_type.kind).toEqual(
      config['test::TestClazz.test'].kind
    );
    expect(result?.methods[0].return_type.is_const).toEqual(
      config['test::TestClazz.test'].is_const
    );
    expect(result?.methods[0].return_type.is_builtin_type).toEqual(
      config['test::TestClazz.test'].is_builtin_type
    );
  });

  it('can get is_output value', () => {
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
                      is_const: true,
                      kind: 101,
                      name: 'Test',
                      source: 'Test *',
                    },
                  },
                ],
                parent_name: 'TestClazz',
                namespaces: ['test'],
              },
            ],
            namespaces: ['test'],
          },
        ],
      },
    ]);
    let preParseResult = genParseResultFromJson(json);

    const result = (
      ReturnTypeParser(
        new TerraContext(),
        {
          convertReturnToVoid: false,
        },
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asClazz();
    expect(result?.methods[0].parameters[0].is_output).toBeFalsy();
  });

  it('if convertReturnToVoid is true, and method name is like registerRtcEventHandler change return_type', () => {
    const json = JSON.stringify([
      {
        file_path: '/my/path/IAgoraRtcEngine.h',
        nodes: [
          {
            __TYPE: 'Clazz',
            name: 'registertest',
            methods: [
              {
                __TYPE: 'MemberFunction',
                name: 'registerRtcEventHandler',
                return_type: {
                  __TYPE: 'SimpleType',
                  is_builtin_type: false,
                  is_const: false,
                  kind: 102,
                  name: 'int',
                  source: 'int',
                  template_arguments: [],
                },
                parameters: [
                  {
                    __TYPE: 'Variable',
                    name: 'test',
                    type: {
                      __TYPE: 'SimpleType',
                      is_builtin_type: false,
                      is_const: true,
                      kind: 101,
                      name: 'int',
                      source: 'int',
                    },
                  },
                ],
                parent_name: 'TestClazz',
                namespaces: ['test'],
              },
            ],
            namespaces: ['test'],
          },
        ],
      },
    ]);
    let preParseResult = genParseResultFromJson(json);

    const result = (
      ReturnTypeParser(
        new TerraContext(),
        {
          convertReturnToVoid: true,
        },
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asClazz();
    expect(result?.methods[0].return_type.name).toBe('void');
    expect(result?.methods[0].return_type.source).toBe('void');
    expect(result?.methods[0].return_type.kind).toBe(SimpleTypeKind.value_t);
    expect(result?.methods[0].return_type.is_const).toBe(false);
    expect(result?.methods[0].return_type.is_builtin_type).toBe(true);
  });
});
