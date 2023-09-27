export const parseMock = jest.fn();
// export const generateCustomNodesMock = jest.fn();
jest.mock('@agoraio-extensions/cxx-parser', () => {
  const originalModule = jest.requireActual('@agoraio-extensions/cxx-parser');
  return {
    __esModule: true,
    ...originalModule,
    CXXParser: parseMock,
  };
});

import * as Tester from '../../parsers/add_node_parser';

export const generateCustomNodesMock = jest.spyOn(
  Tester,
  'generateCustomNodes'
);
export const AddNodeParser = Tester.AddNodeParser;
