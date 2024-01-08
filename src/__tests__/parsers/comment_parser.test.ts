import {
  CXXFile,
  genParseResultFromJson,
} from '@agoraio-extensions/cxx-parser';
import { TerraContext } from '@agoraio-extensions/terra-core';

import { CommentParser, LANGUAGE } from '../..';

describe('CommentParser', () => {
  it('parser with TS', () => {
    let json = `
[
    {
        "file_path": "/my/path/IAgoraRtcEngine.h",
        "nodes": [
            {
                "__TYPE": "Clazz",
                "file_path": "/my/path/IAgoraRtcEngine.h",
                "name": "Test",
                "namespaces": [
                    "agora",
                    "rtc"
                ],
                "comment": "Clazz.",
                "parent_name": "rtc"
            },
            {
                "__TYPE": "Enumz",
                "enum_constants": [
                    {
                        "__TYPE": "EnumConstant",
                        "comment": "North America.",
                        "name": "AUDIO_DEVICE1",
                        "source": "",
                        "value": ""
                    },
                    {
                      "__TYPE": "EnumConstant",
                      "comment": "North America.",
                      "name": "AUDIO_DEVICE2",
                      "source": "12",
                      "value": "12"
                    },
                    {
                      "__TYPE": "EnumConstant",
                      "comment": "North America.",
                      "name": "AUDIO_DEVICE3",
                      "source": "",
                      "value": ""
                    }
                ],
                "file_path": "/my/path/IAgoraRtcEngine.h",
                "comment": "Enumz",
                "name": "MEDIA_DEVICE_TYPE",
                "namespaces": [
                    "agora",
                    "rtc"
                ],
                "parent_name": "Test"
            }
        ]
    }
]
`;
    let preParseResult = genParseResultFromJson(json);

    const result = CommentParser(
      new TerraContext(),
      {
        language: LANGUAGE.TS,
      },
      preParseResult
    )?.nodes[0] as CXXFile;
    expect(result?.nodes[0].comment).toEqual(`/**
Clazz.
*/`);
    expect(result?.nodes[1].comment).toEqual(`/**
Enumz
*/`);
    expect(result?.nodes[1].asEnumz().enum_constants[0].comment).toEqual(`/**
North America.
*/`);
  });
});
