import {
  CXXFile,
  genParseResultFromJson,
} from '@agoraio-extensions/cxx-parser';

import { TerraContext } from '@agoraio-extensions/terra-core';

import { FixEnumConstantParser, FixEnumConstantParserArgs } from '../../';

describe('FixEnumConstantParser', () => {
  it('fill empty value', () => {
    let json = `
[
    {
        "file_path": "/my/path/IAgoraRtcEngine.h",
        "nodes": [
            {
                "__TYPE": "Enumz",
                "enum_constants": [
                    {
                        "__TYPE": "EnumConstant",
                        "name": "AUDIO_DEVICE1",
                        "source": "",
                        "value": ""
                    },
                    {
                      "__TYPE": "EnumConstant",
                      "name": "AUDIO_DEVICE2",
                      "source": "12",
                      "value": "12"
                    },
                    {
                      "__TYPE": "EnumConstant",
                      "name": "AUDIO_DEVICE3",
                      "source": "",
                      "value": ""
                    }
                ],
                "file_path": "/my/path/IAgoraRtcEngine.h",
                "name": "MEDIA_DEVICE_TYPE",
                "namespaces": [
                    "agora",
                    "rtc"
                ],
                "parent_name": "rtc"
            }
        ]
    }
]
`;
    let preParseResult = genParseResultFromJson(json);

    const result = (
      FixEnumConstantParser(
        new TerraContext(),
        {} as FixEnumConstantParserArgs,
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asEnumz();
    expect(result?.enum_constants[0].source).toEqual('0');
    expect(result?.enum_constants[0].value).toEqual('0');
    expect(result?.enum_constants[1].source).toEqual('12');
    expect(result?.enum_constants[1].value).toEqual('12');
    expect(result?.enum_constants[2].source).toEqual('13');
    expect(result?.enum_constants[2].value).toEqual('13');
  });

  it('use other EnumConstant value', () => {
    let json = `
[
    {
        "file_path": "/my/path/IAgoraRtcEngine.h",
        "nodes": [
            {
                "__TYPE": "Enumz",
                "enum_constants": [
                    {
                        "__TYPE": "EnumConstant",
                        "name": "AUDIO_DEVICE1",
                        "source": "0",
                        "value": "0"
                    },
                    {
                      "__TYPE": "EnumConstant",
                      "name": "AUDIO_DEVICE2",
                      "source": "AUDIO_DEVICE1",
                      "value": "AUDIO_DEVICE1"
                    }
                ],
                "file_path": "/my/path/IAgoraRtcEngine.h",
                "name": "MEDIA_DEVICE_TYPE",
                "namespaces": [
                    "agora",
                    "rtc"
                ],
                "parent_name": "rtc"
            }
        ]
    }
]
`;
    let preParseResult = genParseResultFromJson(json);

    const result = (
      FixEnumConstantParser(
        new TerraContext(),
        {} as FixEnumConstantParserArgs,
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asEnumz();
    expect(result?.enum_constants[1].source).toEqual('AUDIO_DEVICE1');
    expect(result?.enum_constants[1].value).toEqual('0');
  });

  it('calculate value', () => {
    let json = `
[
    {
        "file_path": "/my/path/IAgoraRtcEngine.h",
        "nodes": [
            {
                "__TYPE": "Enumz",
                "enum_constants": [
                    {
                        "__TYPE": "EnumConstant",
                        "name": "AUDIO_DEVICE1",
                        "source": "(0xFFFFFFFF)",
                        "value": "(0xFFFFFFFF)"
                    },
                    {
                      "__TYPE": "EnumConstant",
                      "name": "AUDIO_DEVICE2",
                      "source": "1<<0",
                      "value": "1<<0"
                    },
                    {
                      "__TYPE": "EnumConstant",
                      "name": "AUDIO_DEVICE3",
                      "source": "AUDIO_DEVICE1|AUDIO_DEVICE2",
                      "value": "AUDIO_DEVICE1|AUDIO_DEVICE2"
                    },
                    {
                      "__TYPE": "EnumConstant",
                      "name": "AUDIO_DEVICE4",
                      "source": "AUDIO_DEVICE3*sizeof(int16_t)",
                      "value": "AUDIO_DEVICE3*sizeof(int16_t)"
                    }
                ],
                "file_path": "/my/path/IAgoraRtcEngine.h",
                "name": "MEDIA_DEVICE_TYPE",
                "namespaces": [
                    "agora",
                    "rtc"
                ],
                "parent_name": "rtc"
            }
        ]
    }
]
`;
    let preParseResult = genParseResultFromJson(json);

    const result = (
      FixEnumConstantParser(
        new TerraContext(),
        {} as FixEnumConstantParserArgs,
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asEnumz();
    expect(result?.enum_constants[0].source).toEqual('(0xFFFFFFFF)');
    expect(result?.enum_constants[0].value).toEqual(`${0xffffffff}`);
    expect(result?.enum_constants[1].source).toEqual('1<<0');
    expect(result?.enum_constants[1].value).toEqual(`${1 << 0}`);
    expect(result?.enum_constants[2].source).toEqual(
      'AUDIO_DEVICE1|AUDIO_DEVICE2'
    );
    expect(result?.enum_constants[2].value).toEqual(`${0xffffffff | (1 << 0)}`);
    expect(result?.enum_constants[3].source).toEqual(
      'AUDIO_DEVICE3*sizeof(int16_t)'
    );
    expect(result?.enum_constants[3].value).toEqual(
      `${(0xffffffff | (1 << 0)) * 2}`
    );
  });

  it('not calculate value', () => {
    let json = `
[
    {
        "file_path": "/my/path/IAgoraRtcEngine.h",
        "nodes": [
            {
                "__TYPE": "Enumz",
                "enum_constants": [
                    {
                        "__TYPE": "EnumConstant",
                        "name": "AUDIO_DEVICE1",
                        "source": "(0xFFFFFFFF)",
                        "value": "(0xFFFFFFFF)"
                    },
                    {
                      "__TYPE": "EnumConstant",
                      "name": "AUDIO_DEVICE2",
                      "source": "1<<0",
                      "value": "1<<0"
                    },
                    {
                      "__TYPE": "EnumConstant",
                      "name": "AUDIO_DEVICE3",
                      "source": "AUDIO_DEVICE1|AUDIO_DEVICE2",
                      "value": "AUDIO_DEVICE1|AUDIO_DEVICE2"
                    },
                    {
                      "__TYPE": "EnumConstant",
                      "name": "AUDIO_DEVICE4",
                      "source": "AUDIO_DEVICE3*sizeof(int16_t)",
                      "value": "AUDIO_DEVICE3*sizeof(int16_t)"
                    }
                ],
                "file_path": "/my/path/IAgoraRtcEngine.h",
                "name": "MEDIA_DEVICE_TYPE",
                "namespaces": [
                    "agora",
                    "rtc"
                ],
                "parent_name": "rtc"
            }
        ]
    }
]
`;
    let preParseResult = genParseResultFromJson(json);

    const result = (
      FixEnumConstantParser(
        new TerraContext(),
        {
          skipCalEnumValue: true,
        } as FixEnumConstantParserArgs,
        preParseResult
      )?.nodes[0] as CXXFile
    ).nodes[0].asEnumz();
    expect(result?.enum_constants[0].source).toEqual('(0xFFFFFFFF)');
    expect(result?.enum_constants[0].value).toEqual('(0xFFFFFFFF)');
    expect(result?.enum_constants[1].source).toEqual('1<<0');
    expect(result?.enum_constants[1].value).toEqual('1<<0');
    expect(result?.enum_constants[2].source).toEqual(
      'AUDIO_DEVICE1|AUDIO_DEVICE2'
    );
    expect(result?.enum_constants[2].value).toEqual('(0xFFFFFFFF)|1<<0');
    expect(result?.enum_constants[3].source).toEqual(
      'AUDIO_DEVICE3*sizeof(int16_t)'
    );
    expect(result?.enum_constants[3].value).toEqual('(0xFFFFFFFF)|1<<0*2');
  });
});
