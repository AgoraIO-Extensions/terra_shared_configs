export const parseMock = jest.fn();
// export const generateNodesMock = jest.fn();
jest.mock('@agoraio-extensions/cxx-parser', () => {
  const originalModule = jest.requireActual('@agoraio-extensions/cxx-parser');
  return {
    __esModule: true,
    ...originalModule,
    CXXParser: parseMock,
  };
});

import * as Tester from '../../parsers/index';
import * as FUN from '../../utils/parser_utils';

export const generateNodesMock = jest.spyOn(FUN, 'generateNodes');
export const RTCParser = Tester.RTCParser;
export const AddNodeParser = Tester.AddNodeParser;
