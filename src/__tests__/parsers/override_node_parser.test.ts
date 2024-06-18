// eslint-disable-next-line import/order
import { generateNodesMock, parseMock } from './cxx_parser.mock';

import {
  CXXFile,
  CXXParserConfigs,
  CXXTYPE,
  Clazz,
} from '@agoraio-extensions/cxx-parser';

import { TerraContext } from '@agoraio-extensions/terra-core';
import {
  OverrideNodeParser,
  getOverrideNodeParserUserData,
} from '../../parsers/override_node_parser';

const customPrefix = 'test';
const parseConfig: CXXParserConfigs = {
  includeHeaderDirs: [],
  definesMacros: [],
  parseFiles: {
    include: ['/my/path/test.h'],
    exclude: [],
  },
};
export const genParseResultFromNode = (
  nodes: any[] = [],
  custom: boolean = false
) => {
  const filePath = `/my/path/${custom ? customPrefix : ''}IAgoraRtcEngine.h`;
  const json = [
    {
      __TYPE: 'CXXFile',
      file_path: filePath,
      nodes,
    },
  ];
  const { genParseResultFromJson } = jest.requireActual(
    '@agoraio-extensions/cxx-parser'
  );
  return genParseResultFromJson(JSON.stringify(json));
};

describe('OverrideNodeParser', () => {
  it('parse with TerraConfig', () => {
    OverrideNodeParser(new TerraContext(), {
      ...parseConfig,
      customHeaderFileNamePrefix: customPrefix,
    });
    expect(parseMock.mock.lastCall[1].parseFiles.include[0]).toStrictEqual(
      parseConfig.parseFiles.include[0]
    );
  });

  it('generateNodes', () => {
    const preParseResult = genParseResultFromNode();
    const config = {
      ...parseConfig,
      customHeaderFileNamePrefix: customPrefix,
    };
    const result = OverrideNodeParser(
      new TerraContext(),
      config,
      preParseResult
    );
    expect(generateNodesMock.mock.lastCall![1]).toStrictEqual(config);
    expect(result).toEqual(preParseResult);
  });

  it('add custom struct', () => {
    const preParseResult = genParseResultFromNode();
    generateNodesMock.mockImplementation(() => {
      return genParseResultFromNode(
        [
          {
            __TYPE: 'Struct',
            name: 'LocalVideoStats',
          },
        ],
        true
      );
    });
    const result = OverrideNodeParser(
      new TerraContext(),
      {
        ...parseConfig,
        customHeaderFileNamePrefix: customPrefix,
      },
      preParseResult
    );
    expect(
      (result?.nodes[0] as CXXFile).nodes[0].__TYPE === CXXTYPE.Struct
    ).toBe(true);
    expect((result?.nodes[0] as CXXFile).nodes[0].name).toEqual(
      'LocalVideoStats'
    );
  });

  it('add custom enum', () => {
    const preParseResult = genParseResultFromNode();
    generateNodesMock.mockImplementation(() => {
      return genParseResultFromNode(
        [
          {
            __TYPE: 'Enumz',
            name: 'MEDIA_DEVICE_TYPE',
          },
        ],
        true
      );
    });
    const result = OverrideNodeParser(
      new TerraContext(),
      {
        ...parseConfig,
        customHeaderFileNamePrefix: customPrefix,
      },
      preParseResult
    );
    expect(
      (result?.nodes[0] as CXXFile).nodes[0].__TYPE === CXXTYPE.Enumz
    ).toBe(true);
    expect((result?.nodes[0] as CXXFile).nodes[0].name).toEqual(
      'MEDIA_DEVICE_TYPE'
    );
  });

  it('add custom class', () => {
    const preParseResult = genParseResultFromNode();
    generateNodesMock.mockImplementation(() => {
      return genParseResultFromNode(
        [
          {
            __TYPE: 'Clazz',
            name: 'IScreenCaptureSourceList',
          },
        ],
        true
      );
    });
    const result = OverrideNodeParser(
      new TerraContext(),
      {
        ...parseConfig,
        customHeaderFileNamePrefix: customPrefix,
      },
      preParseResult
    );
    expect(
      (result?.nodes[0] as CXXFile).nodes[0].__TYPE === CXXTYPE.Clazz
    ).toBe(true);
    expect((result?.nodes[0] as CXXFile).nodes[0].name).toEqual(
      'IScreenCaptureSourceList'
    );
  });

  it('add custom class and struct', () => {
    const preParseResult = genParseResultFromNode();
    generateNodesMock.mockImplementation(() => {
      return genParseResultFromNode(
        [
          {
            __TYPE: 'Struct',
            name: 'LocalVideoStats',
          },
          {
            __TYPE: 'Clazz',
            name: 'IScreenCaptureSourceList',
          },
        ],
        true
      );
    });
    const result = OverrideNodeParser(
      new TerraContext(),
      {
        ...parseConfig,
        customHeaderFileNamePrefix: customPrefix,
      },
      preParseResult
    );
    expect(
      (result?.nodes[0] as CXXFile).nodes[0].__TYPE === CXXTYPE.Struct
    ).toBe(true);
    expect((result?.nodes[0] as CXXFile).nodes[0].name).toEqual(
      'LocalVideoStats'
    );
    expect(
      (result?.nodes[0] as CXXFile).nodes[1].__TYPE === CXXTYPE.Clazz
    ).toBe(true);
    expect((result?.nodes[0] as CXXFile).nodes[1].name).toEqual(
      'IScreenCaptureSourceList'
    );
  });

  it('only process enum struct class', () => {
    const preParseResult = genParseResultFromNode();
    generateNodesMock.mockImplementation(() => {
      return genParseResultFromNode(
        [
          {
            __TYPE: 'IncludeDirective',
            include_file_path: '/my/path/AgoraBase.h',
          },
        ],
        true
      );
    });
    const result = OverrideNodeParser(
      new TerraContext(),
      {
        ...parseConfig,
        customHeaderFileNamePrefix: customPrefix,
      },
      preParseResult
    );
    expect((result?.nodes[0] as CXXFile).nodes.length).toBe(0);
  });

  it('add member function', () => {
    const preParseResult = genParseResultFromNode(
      [
        {
          __TYPE: 'Clazz',
          name: 'IScreenCaptureSourceList',
          methods: [],
        },
      ],
      false
    );
    generateNodesMock.mockImplementation(() => {
      return genParseResultFromNode(
        [
          {
            __TYPE: 'Clazz',
            name: 'IScreenCaptureSourceList',
            methods: [
              {
                __TYPE: 'MemberFunction',
                name: 'getCount',
              },
            ],
          },
        ],
        true
      );
    });
    const result = OverrideNodeParser(
      new TerraContext(),
      {
        ...parseConfig,
        customHeaderFileNamePrefix: customPrefix,
      },
      preParseResult
    );
    const clazz = (result?.nodes[0] as CXXFile).nodes[0] as Clazz;
    expect(
      (result?.nodes[0] as CXXFile).nodes[0].__TYPE === CXXTYPE.Clazz
    ).toBe(true);
    expect(clazz.methods[0].__TYPE === CXXTYPE.MemberFunction).toBe(true);
    expect(clazz.methods[0].name).toBe('getCount');
  });

  it('overload function overrideSourceNodes=true', () => {
    const preParseResult = genParseResultFromNode(
      [
        {
          __TYPE: 'Clazz',
          name: 'IScreenCaptureSourceList',
          methods: [
            {
              __TYPE: 'MemberFunction',
              name: 'getCount',
              comment:
                '@iris_api_id: MediaEngine_IScreenCaptureSourceList @source: getCount',
              parameters: [
                {
                  __TYPE: 'Variable',
                  name: 'a',
                },
              ],
            },
            {
              __TYPE: 'MemberFunction',
              name: 'getCount',
              comment:
                '@iris_api_id: MediaEngine_IScreenCaptureSourceList @source: getCount',
              parameters: [
                {
                  __TYPE: 'Variable',
                  name: 'b',
                },
              ],
            },
          ],
        },
      ],
      false
    );
    generateNodesMock.mockImplementation(() => {
      return genParseResultFromNode(
        [
          {
            __TYPE: 'Clazz',
            name: 'IScreenCaptureSourceList',
            methods: [
              {
                __TYPE: 'MemberFunction',
                name: 'getCount',
                comment:
                  '@iris_api_id: MediaEngine_IScreenCaptureSourceList @source: getCount',
                parameters: [
                  {
                    __TYPE: 'Variable',
                    name: 'c',
                  },
                ],
              },
            ],
          },
        ],
        true
      );
    });
    const result = OverrideNodeParser(
      new TerraContext(),
      {
        ...parseConfig,
        customHeaderFileNamePrefix: customPrefix,
      },
      preParseResult
    );
    const clazz = (result?.nodes[0] as CXXFile).nodes[0] as Clazz;
    expect(clazz.methods.length).toBe(1);
    expect(clazz.methods[0].name).toBe('getCount');
    expect(clazz.methods[0].comment).toBe('');
    expect(clazz.methods[0].parameters[0].name).toBe('c');
  });

  it('overload function overrideSourceNodes=false', () => {
    const preParseResult = genParseResultFromNode(
      [
        {
          __TYPE: 'Clazz',
          name: 'MediaEngine',
          methods: [
            {
              __TYPE: 'MemberFunction',
              name: 'startPreview',
              // comment:
              //   '@iris_api_id: MediaEngine_startPreview @source: startPreview',
              // parameters: [
              //   {
              //     __TYPE: 'Variable',
              //     name: 'a',
              //   },
              // ],
              // This test need iris api id set
              user_data: {
                IrisApiIdParser: {
                  value: 'MediaEngine_startPreview',
                },
              },
            },
            {
              __TYPE: 'MemberFunction',
              name: 'startPreview2',
              // comment:
              //   '@iris_api_id: MediaEngine_IScreenCaptureSourceList @source: getCount',
              // parameters: [
              //   {
              //     __TYPE: 'Variable',
              //     name: 'b',
              //   },
              // ],
            },
          ],
        },
      ],
      false
    );
    generateNodesMock.mockImplementation(() => {
      return genParseResultFromNode(
        [
          {
            __TYPE: 'Clazz',
            name: 'MediaEngine',
            methods: [
              {
                __TYPE: 'MemberFunction',
                name: 'startPreviewWithType',
                comment:
                  '@iris_api_id: MediaEngine_startPreview @source: startPreview',
                // parameters: [
                //   {
                //     __TYPE: 'Variable',
                //     name: 'c',
                //   },
                // ],
              },
            ],
          },
        ],
        true
      );
    });
    const result = OverrideNodeParser(
      new TerraContext(),
      {
        ...parseConfig,
        customHeaderFileNamePrefix: customPrefix,
        overrideSourceNodes: false,
      },
      preParseResult
    );
    const clazz = (preParseResult?.nodes[0] as CXXFile).nodes[0] as Clazz;
    expect(clazz.methods.length).toBe(2);
    expect(clazz.methods[0].name).toBe('startPreview');
    expect(clazz.methods[1].name).toBe('startPreview2');

    let userData = getOverrideNodeParserUserData(clazz.methods[0]);
    let overrideNode = userData!.overridedNode;
    expect(overrideNode.name).toBe('startPreviewWithType');
    let overrideUserData = getOverrideNodeParserUserData(overrideNode);
    expect(overrideUserData!.redirectIrisApiId).toBe(
      'MediaEngine_startPreview'
    );
  });
});
