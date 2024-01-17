import { TerraContext } from '@agoraio-extensions/terra-core';

import * as MOCK from '../././cxx_parser.mock';
import { RtcParserArgs } from '../../../parsers';
import { genParseResultFromNode } from '../add_node_parser.test';

describe('ReturnTypeParser', () => {
  it('can get version from config', () => {
    const preParseResult = genParseResultFromNode();
    jest.resetAllMocks();
    MOCK.RTCParser(
      new TerraContext(),
      {
        sdkVersion: '1.1.1',
      } as RtcParserArgs,
      preParseResult
    );
    expect(MOCK.generateNodesMock.mock.calls[0][1]).toMatchObject({
      definesMacros: undefined,
      includeHeaderDirs: [
        '@agoraio-extensions/terra_shared_configs:headers/rtc_1.1.1/include',
      ],
      parseFiles: {
        exclude: [
          '@agoraio-extensions/terra_shared_configs:headers/rtc_1.1.1/include/time_utils.h',
          '@agoraio-extensions/terra_shared_configs:headers/rtc_1.1.1/include/IAgoraMediaComponentFactory.h',
        ],
        include: [
          '@agoraio-extensions/terra_shared_configs:headers/rtc_1.1.1/include/*.h',
        ],
      },
    });
    expect(MOCK.generateNodesMock).toHaveBeenCalledTimes(2);
  });
});
