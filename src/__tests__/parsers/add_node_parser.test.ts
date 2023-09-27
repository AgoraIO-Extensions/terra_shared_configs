// eslint-disable-next-line import/order
import {
  AddNodeParser,
  generateCustomNodesMock,
  parseMock,
} from './add_node_parser.mock';

import {
  CXXFile,
  CXXParserConfigs,
  CXXTYPE,
  Clazz,
} from '@agoraio-extensions/cxx-parser';

import { TerraContext } from '@agoraio-extensions/terra-core';

const customPrefix = 'test';
const parseConfig: CXXParserConfigs = {
  customHeaders: ['/my/path/test.h'],
  includeHeaderDirs: [],
  definesMacros: [],
  parseFiles: {
    include: [],
    exclude: [],
  },
};
const genParseResultFromNode = (nodes: any[] = [], custom: boolean = false) => {
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

describe('AddNodeParser', () => {
  it('parse with TerraConfig', () => {
    AddNodeParser(new TerraContext(), {
      ...parseConfig,
      customHeaderFileNamePrefix: customPrefix,
    });
    expect(parseMock.mock.lastCall[1].customHeaders).toStrictEqual(
      parseConfig.customHeaders
    );
  });

  it('parse with AddNodeParserArgs', () => {
    const customHeaders = ['/my/path/test2.h'];
    AddNodeParser(new TerraContext(), {
      ...parseConfig,
      customHeaders,
      customHeaderFileNamePrefix: customPrefix,
    });
    expect(parseMock.mock.lastCall[1].customHeaders).toStrictEqual(
      customHeaders
    );
  });

  it('generateCustomNodes', () => {
    const preParseResult = genParseResultFromNode();
    const config = {
      ...parseConfig,
      customHeaderFileNamePrefix: customPrefix,
    };
    const result = AddNodeParser(new TerraContext(), config, preParseResult);
    expect(generateCustomNodesMock.mock.lastCall![1]).toStrictEqual(config);
    expect(result).toEqual(preParseResult);
  });

  it('add custom struct', () => {
    const preParseResult = genParseResultFromNode();
    generateCustomNodesMock.mockImplementation(() => {
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
    const result = AddNodeParser(
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
    generateCustomNodesMock.mockImplementation(() => {
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
    const result = AddNodeParser(
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
    generateCustomNodesMock.mockImplementation(() => {
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
    const result = AddNodeParser(
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
    generateCustomNodesMock.mockImplementation(() => {
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
    const result = AddNodeParser(
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
    generateCustomNodesMock.mockImplementation(() => {
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
    const result = AddNodeParser(
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
    generateCustomNodesMock.mockImplementation(() => {
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
    const result = AddNodeParser(
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

  it('overload function', () => {
    const preParseResult = genParseResultFromNode(
      [
        {
          __TYPE: 'Clazz',
          name: 'IScreenCaptureSourceList',
          methods: [
            {
              __TYPE: 'MemberFunction',
              name: 'getCount',
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
    generateCustomNodesMock.mockImplementation(() => {
      return genParseResultFromNode(
        [
          {
            __TYPE: 'Clazz',
            name: 'IScreenCaptureSourceList',
            methods: [
              {
                __TYPE: 'MemberFunction',
                name: 'getCount',
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
    const result = AddNodeParser(
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
    expect(clazz.methods[0].parameters[0].name).toBe('c');
  });
});
