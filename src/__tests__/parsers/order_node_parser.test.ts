import {
  CXXFile,
  genParseResultFromJson,
} from '@agoraio-extensions/cxx-parser';
import { TerraContext } from '@agoraio-extensions/terra-core';

import { OrderNodeParser } from '../..';

describe('OrderNodeParser', () => {
  it('swap order', () => {
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
                "parent_name": "rtc"
            },
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
                "parent_name": "Test"
            }
        ]
    }
]
`;
    let preParseResult = genParseResultFromJson(json);

    const result = OrderNodeParser(new TerraContext(), {}, preParseResult)
      ?.nodes[0] as CXXFile;
    expect(result?.nodes[0].name).toEqual('MEDIA_DEVICE_TYPE');
    expect(result?.nodes[1].name).toEqual('Test');
  });
});
