import {
  CXXFile,
  SimpleTypeKind,
  genParseResultFromJson,
} from '@agoraio-extensions/cxx-parser';
import { TerraContext } from '@agoraio-extensions/terra-core';

import { RemoveNodeParser, ReturnTypeParser } from '../..';

it('exposes loopback snapshots as arrays without native list handles', () => {
  const namespaces = ['agora', 'rtc'];
  const method = (name: string, type: string) => ({
    __TYPE: 'MemberFunction',
    name,
    parent_name: 'IRtcEngine',
    namespaces,
    parameters: [],
    return_type: {
      __TYPE: 'SimpleType',
      name: type,
      source: `${type}*`,
      kind: SimpleTypeKind.pointer_t,
      is_const: false,
      is_builtin_type: false,
    },
  });
  const parsed = genParseResultFromJson(
    JSON.stringify([
      {
        file_path: '/sdk/IAgoraRtcEngine.h',
        nodes: [
          {
            __TYPE: 'Clazz',
            name: 'IRtcEngine',
            namespaces,
            methods: [
              method(
                'getLoopbackRecordingSources',
                'ILoopbackRecordingSourceList'
              ),
              method('getScreenCaptureSources', 'IScreenCaptureSourceList'),
              method('getUnrelatedInterface', 'IUnrelatedInterface'),
            ],
          },
          { __TYPE: 'Clazz', name: 'ILoopbackRecordingSourceList', namespaces },
          { __TYPE: 'Struct', name: 'LoopbackRecordingSourceInfo', namespaces },
        ],
      },
    ])
  );
  const context = new TerraContext();
  ReturnTypeParser(context, {}, parsed);
  RemoveNodeParser(context, {}, parsed);

  const nodes = (parsed.nodes[0] as CXXFile).nodes;
  expect(nodes.map((node) => node.name)).toEqual([
    'IRtcEngine',
    'LoopbackRecordingSourceInfo',
  ]);
  const returns = nodes[0].asClazz().methods.map((entry) => entry.return_type);
  expect(returns[0].name).toBe('agora::rtc::LoopbackRecordingSourceInfo');
  expect(returns[0].kind).toBe(SimpleTypeKind.array_t);
  expect(returns[1].name).toBe('agora::rtc::ScreenCaptureSourceInfo');
  expect(returns[1].kind).toBe(SimpleTypeKind.array_t);
  expect(returns[2].name).toBe('IUnrelatedInterface');
  expect(returns[2].kind).toBe(SimpleTypeKind.pointer_t);
});
