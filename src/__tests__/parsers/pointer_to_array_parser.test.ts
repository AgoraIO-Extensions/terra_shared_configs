import {
  CXXFile,
  genParseResultFromJson,
} from '@agoraio-extensions/cxx-parser';

import { TerraContext } from '@agoraio-extensions/terra-core';

import { PointerToArrayParser } from '../..';

describe('PointerToArrayParser', () => {
  it('can process MemberFunction Variable', () => {
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
              },
            ],
            namespaces: ['test'],
          },
        ],
      },
    ]);
    let preParseResult = genParseResultFromJson(json);

    const result = (
      PointerToArrayParser(
        new TerraContext(),
        {
          configJson: JSON.stringify(['test::TestClazz.test.test']),
        },
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asClazz();
    expect(result?.methods[0].parameters[0].type.kind).toEqual(103);
  });

  it('can process MemberVariable', () => {
    const json = JSON.stringify([
      {
        file_path: '/my/path/IAgoraRtcEngine.h',
        nodes: [
          {
            __TYPE: 'Struct',
            name: 'TestStruct',
            member_variables: [
              {
                __TYPE: 'MemberVariable',
                access_specifier: '',
                is_mutable: false,
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
            namespaces: ['test'],
          },
        ],
      },
    ]);
    let preParseResult = genParseResultFromJson(json);

    const result = (
      PointerToArrayParser(
        new TerraContext(),
        {
          configJson: JSON.stringify(['test::TestStruct.test']),
        },
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asStruct();
    expect(result?.member_variables[0].type.kind).toEqual(103);
  });

  it('can process with regex', () => {
    const json = JSON.stringify([
      {
        file_path: '/my/path/IAgoraRtcEngine.h',
        nodes: [
          {
            __TYPE: 'Struct',
            name: 'TestStruct',
            member_variables: [
              {
                __TYPE: 'MemberVariable',
                access_specifier: '',
                is_mutable: false,
                name: 'test123',
                type: {
                  __TYPE: 'SimpleType',
                  is_builtin_type: false,
                  is_const: false,
                  kind: 101,
                  name: 'Test',
                  source: 'Test *',
                },
              },
              {
                __TYPE: 'MemberVariable',
                access_specifier: '',
                is_mutable: false,
                name: 'test456',
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
            namespaces: ['test'],
          },
        ],
      },
    ]);
    let preParseResult = genParseResultFromJson(json);

    const result = (
      PointerToArrayParser(
        new TerraContext(),
        {
          configJson: JSON.stringify(['^test\\d*']),
        },
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asStruct();
    expect(result?.member_variables[0].type.kind).toEqual(103);
    expect(result?.member_variables[1].type.kind).toEqual(103);
  });
});
