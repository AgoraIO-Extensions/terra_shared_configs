import fs from 'fs';
import os from 'os';
import path from 'path';

import {
  CXXFile,
  CXXTYPE,
  CXXTerraNode,
  Clazz,
  Constructor,
  EnumConstant,
  Enumz,
  MemberFunction,
  Struct,
} from '@agoraio-extensions/cxx-parser';

import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

import CUDNodeParser, {
  CUDNodeParserArgs,
  isNodeMatched,
} from '../../parsers/cud_node_parser';

describe('CUDNodeParser', () => {
  it('isNodeMatched', () => {
    let node1 = {
      __TYPE: CXXTYPE.CXXFile,
      file_path: '/my/path/test.h',
      nodes: [
        {
          __TYPE: CXXTYPE.Struct,
          name: 'Struct1',
          namespaces: ['aa'],
        } as unknown as Struct,
      ],
    } as unknown as CXXFile;

    let node2 = {
      __TYPE: CXXTYPE.CXXFile,
      file_path: '/my/path/test.h',
    } as unknown as CXXFile;

    expect(isNodeMatched(node1, node2)).toBe(true);
  });

  describe('delete nodes with config', () => {
    it('delete a CXXFile', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          deleteNodes: [
            {
              __TYPE: CXXTYPE.CXXFile,
              file_path: '/my/path/test.h',
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(parseResult.nodes.length).toBe(0);
    });

    it('delete a Clazz', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            {
              __TYPE: CXXTYPE.Clazz,
              name: 'Test',
              namespaces: ['aa'],
            } as unknown as Clazz,
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          deleteNodes: [
            {
              __TYPE: CXXTYPE.Clazz,
              name: 'Test',
              namespaces: ['aa'],
            } as unknown as Clazz,
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect((parseResult.nodes[0] as CXXFile).nodes.length).toBe(0);
    });

    it('delete a Struct', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            {
              __TYPE: CXXTYPE.Struct,
              name: 'Test',
              namespaces: ['aa'],
            } as unknown as Struct,
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          deleteNodes: [
            {
              __TYPE: CXXTYPE.Struct,
              name: 'Test',
              namespaces: ['aa'],
            } as unknown as Struct,
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect((parseResult.nodes[0] as CXXFile).nodes.length).toBe(0);
    });

    it('delete a Constructor', () => {
      let parseResult = new ParseResult();

      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            Object.assign(new Clazz(), {
              __TYPE: CXXTYPE.Clazz,
              name: 'Test',
              namespaces: ['aa'],
              constructors: [
                {
                  __TYPE: CXXTYPE.Constructor,
                  initializerList: [],
                },
              ],
            }),
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          deleteNodes: [
            {
              __TYPE: CXXTYPE.Constructor,
              initializerList: [],
            } as unknown as CXXTerraNode,
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(
        ((parseResult.nodes[0] as CXXFile).nodes[0] as Clazz).constructors
          .length
      ).toBe(0);
    });

    it('delete a MemberFunction', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            Object.assign(new Clazz(), {
              __TYPE: CXXTYPE.Clazz,
              name: 'Test',
              namespaces: ['aa'],
              methods: [
                {
                  __TYPE: CXXTYPE.MemberFunction,
                  name: 'func1',
                },
              ],
            }),
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          deleteNodes: [
            {
              __TYPE: CXXTYPE.MemberFunction,
              name: 'func1',
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(
        ((parseResult.nodes[0] as CXXFile).nodes[0] as Clazz).methods.length
      ).toBe(0);
    });

    it('delete a Variable of MemberFunction', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            Object.assign(new Clazz(), {
              __TYPE: CXXTYPE.Clazz,
              name: 'Test',
              namespaces: ['aa'],
              methods: [
                {
                  __TYPE: CXXTYPE.MemberFunction,
                  name: 'func1',
                  parameters: [
                    {
                      __TYPE: CXXTYPE.Variable,
                      name: 'size',
                      parent_name: 'func1',
                    },
                  ],
                },
              ],
            }),
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          deleteNodes: [
            {
              __TYPE: CXXTYPE.Variable,
              name: 'size',
              parent_name: 'func1',
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(
        ((parseResult.nodes[0] as CXXFile).nodes[0] as Clazz).methods[0]
          .parameters.length
      ).toBe(0);
    });

    it('delete a MemberVariable', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            Object.assign(new Clazz(), {
              __TYPE: CXXTYPE.Clazz,
              name: 'Test',
              namespaces: ['aa'],
              member_variables: [
                {
                  __TYPE: CXXTYPE.MemberVariable,
                  name: 'm1',
                },
              ],
            }),
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          deleteNodes: [
            {
              __TYPE: CXXTYPE.MemberVariable,
              name: 'm1',
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(
        ((parseResult.nodes[0] as CXXFile).nodes[0] as Clazz).member_variables
          .length
      ).toBe(0);
    });

    it('delete a Enumz', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            {
              __TYPE: CXXTYPE.Enumz,
              name: 'TestEnum',
              namespaces: ['aa'],
            },
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          deleteNodes: [
            {
              __TYPE: CXXTYPE.Enumz,
              name: 'TestEnum',
              namespaces: ['aa'],
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect((parseResult.nodes[0] as CXXFile).nodes.length).toBe(0);
    });

    it('delete a EnumConstant', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            Object.assign(new Enumz(), {
              __TYPE: CXXTYPE.Enumz,
              name: 'TestEnum',
              namespaces: ['aa'],
              enum_constants: [
                {
                  __TYPE: CXXTYPE.EnumConstant,
                  value: 'myEnumConstant',
                },
              ],
            }),
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          deleteNodes: [
            {
              __TYPE: CXXTYPE.EnumConstant,
              value: 'myEnumConstant',
            } as unknown as CXXTerraNode,
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(
        ((parseResult.nodes[0] as CXXFile).nodes[0] as Enumz).enum_constants
          .length
      ).toBe(0);
    });
  });

  describe('delete nodes with configPath', () => {
    let tmpDir: string;
    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'terra-ut-'));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    // It's fine that only add one smoke test case here to verify we can get the config from
    // the config file.
    it('delete a CXXFile', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [],
        } as unknown as CXXFile,
      ];

      let filePath = path.resolve(tmpDir, 'file1.config.ts');
      fs.writeFileSync(
        filePath,
        `
module.exports = {
    deleteNodes: [
        {
            __TYPE: 'CXXFile',
            file_path: '/my/path/test.h',
        }
    ]
};
`.trim()
      );
      let config = {
        configPath: filePath,
      } as CUDNodeParserArgs;

      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(parseResult.nodes.length).toBe(0);
    });
  });

  describe('update nodes with config', () => {
    it('update a CXXFile', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          updateNodes: [
            {
              node: {
                __TYPE: CXXTYPE.CXXFile,
                file_path: '/my/path/test.h',
              },
              updated: {
                __TYPE: CXXTYPE.CXXFile,
                file_path: '/my/path/test1.h',
              },
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect((parseResult.nodes[0] as CXXFile).file_path).toEqual(
        '/my/path/test1.h'
      );
    });

    it('update a Clazz', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            Object.assign(new Clazz(), {
              __TYPE: CXXTYPE.Clazz,
              name: 'Test',
              namespaces: ['aa'],
            }),
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          updateNodes: [
            {
              node: {
                __TYPE: CXXTYPE.Clazz,
                name: 'Test',
                namespaces: ['aa'],
              },
              updated: {
                __TYPE: CXXTYPE.Clazz,
                name: 'Test1',
                namespaces: ['aa'],
              },
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(
        ((parseResult.nodes[0] as CXXFile).nodes[0] as Clazz).name
      ).toEqual('Test1');
    });

    it('update a Struct', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            Object.assign(new Struct(), {
              __TYPE: CXXTYPE.Struct,
              name: 'Test',
              namespaces: ['aa'],
            }),
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          updateNodes: [
            {
              node: {
                __TYPE: CXXTYPE.Struct,
                name: 'Test',
                namespaces: ['aa'],
              },
              updated: {
                __TYPE: CXXTYPE.Struct,
                name: 'Test1',
                namespaces: ['aa'],
              },
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(
        ((parseResult.nodes[0] as CXXFile).nodes[0] as Struct).name
      ).toEqual('Test1');
    });

    it('update a Constructor', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            Object.assign(new Clazz(), {
              __TYPE: CXXTYPE.Clazz,
              name: 'Test',
              namespaces: ['aa'],
              constructors: [
                {
                  __TYPE: CXXTYPE.Constructor,
                  initializerList: [{ name: 'Constructor1' }],
                },
              ],
            }),
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          updateNodes: [
            {
              node: {
                __TYPE: CXXTYPE.Constructor,
                initializerList: [{ name: 'Constructor1' }],
              } as unknown as CXXTerraNode,
              updated: {
                __TYPE: CXXTYPE.Constructor,
                initializerList: [{ name: 'Constructor2' }],
              } as unknown as CXXTerraNode,
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(
        (
          ((parseResult.nodes[0] as CXXFile).nodes[0] as Clazz)
            .constructors[0] as Constructor
        ).initializerList[0].name
      ).toEqual('Constructor2');
    });

    it('update a MemberFunction', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            Object.assign(new Clazz(), {
              __TYPE: CXXTYPE.Clazz,
              name: 'Test',
              namespaces: ['aa'],
              methods: [
                Object.assign(new MemberFunction(), {
                  __TYPE: CXXTYPE.MemberFunction,
                  name: 'func1',
                }),
              ],
            }),
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          updateNodes: [
            {
              node: {
                __TYPE: CXXTYPE.MemberFunction,
                name: 'func1',
              },
              updated: {
                __TYPE: CXXTYPE.MemberFunction,
                name: 'func2',
              },
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(
        ((parseResult.nodes[0] as CXXFile).nodes[0] as Clazz).methods[0].name
      ).toEqual('func2');
    });

    it('update a Variable of MemberFunction', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            Object.assign(new Clazz(), {
              __TYPE: CXXTYPE.Clazz,
              name: 'Test',
              namespaces: ['aa'],
              methods: [
                {
                  __TYPE: CXXTYPE.MemberFunction,
                  name: 'func1',
                  parameters: [
                    {
                      __TYPE: CXXTYPE.Variable,
                      name: 'size',
                      parent_name: 'func1',
                    },
                  ],
                },
              ],
            }),
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          updateNodes: [
            {
              node: {
                __TYPE: CXXTYPE.Variable,
                name: 'size',
                parent_name: 'func1',
              },
              updated: {
                __TYPE: CXXTYPE.Variable,
                name: 'size1',
                parent_name: 'func1',
              },
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(
        ((parseResult.nodes[0] as CXXFile).nodes[0] as Clazz).methods[0]
          .parameters[0].name
      ).toEqual('size1');
    });

    it('delete a MemberVariable', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            Object.assign(new Clazz(), {
              __TYPE: CXXTYPE.Clazz,
              name: 'Test',
              namespaces: ['aa'],
              member_variables: [
                {
                  __TYPE: CXXTYPE.MemberVariable,
                  name: 'm1',
                },
              ],
            }),
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          updateNodes: [
            {
              node: {
                __TYPE: CXXTYPE.MemberVariable,
                name: 'm1',
              },
              updated: {
                __TYPE: CXXTYPE.MemberVariable,
                name: 'm2',
              },
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(
        ((parseResult.nodes[0] as CXXFile).nodes[0] as Clazz)
          .member_variables[0].name
      ).toEqual('m2');
    });

    it('delete a Enumz', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            Object.assign(new Enumz(), {
              __TYPE: CXXTYPE.Enumz,
              name: 'TestEnum',
              namespaces: ['aa'],
            }),
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          updateNodes: [
            {
              node: {
                __TYPE: CXXTYPE.Enumz,
                name: 'TestEnum',
                namespaces: ['aa'],
              },
              updated: {
                __TYPE: CXXTYPE.Enumz,
                name: 'TestEnum1',
                namespaces: ['aa'],
              },
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(
        ((parseResult.nodes[0] as CXXFile).nodes[0] as Enumz).name
      ).toEqual('TestEnum1');
    });

    it('update a EnumConstant', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [
            Object.assign(new Enumz(), {
              __TYPE: CXXTYPE.Enumz,
              name: 'TestEnum',
              namespaces: ['aa'],
              enum_constants: [
                {
                  __TYPE: CXXTYPE.EnumConstant,
                  value: 'myEnumConstant',
                },
              ],
            }),
          ],
        } as unknown as CXXFile,
      ];
      let config = {
        config: {
          updateNodes: [
            {
              node: {
                __TYPE: CXXTYPE.EnumConstant,
                value: 'myEnumConstant',
              } as unknown as EnumConstant,
              updated: {
                __TYPE: CXXTYPE.EnumConstant,
                value: 'myEnumConstant1',
              } as unknown as EnumConstant,
            },
          ],
        },
      } as CUDNodeParserArgs;
      CUDNodeParser(new TerraContext(), config, parseResult);

      expect(
        ((parseResult.nodes[0] as CXXFile).nodes[0] as Enumz).enum_constants[0]
          .value
      ).toEqual('myEnumConstant1');
    });
  });

  describe('delete nodes with configPath', () => {
    let tmpDir: string;
    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'terra-ut-'));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    // It's fine that only add one smoke test case here to verify we can get the config from
    // the config file.
    it('delete a CXXFile', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [],
        } as unknown as CXXFile,
      ];

      let filePath = path.resolve(tmpDir, 'file1.config.ts');
      fs.writeFileSync(
        filePath,
        `
module.exports = {
    deleteNodes: [
        {
            __TYPE: 'CXXFile',
            file_path: '/my/path/test.h',
        }
    ]
};
`.trim()
      );
      let config = {
        configPath: filePath,
      } as CUDNodeParserArgs;

      CUDNodeParser(
        Object.assign(new TerraContext(), {
          configDir: tmpDir,
        }),
        config,
        parseResult
      );

      expect(parseResult.nodes.length).toBe(0);
    });
  });

  describe('update nodes with configPath', () => {
    let tmpDir: string;
    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'terra-ut-'));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    // It's fine that only add one smoke test case here to verify we can get the config from
    // the config file.
    it('update a CXXFile', () => {
      let parseResult = new ParseResult();
      parseResult.nodes = [
        {
          __TYPE: CXXTYPE.CXXFile,
          file_path: '/my/path/test.h',
          nodes: [],
        } as unknown as CXXFile,
      ];

      let filePath = path.resolve(tmpDir, 'file1.config.ts');
      fs.writeFileSync(
        filePath,
        `
module.exports = {
    updateNodes: [

        {
            node: {
                __TYPE: 'CXXFile',
                file_path: '/my/path/test.h',
            },
            updated: {
                __TYPE: 'CXXFile',
                file_path: '/my/path/test1.h',
            },
        }
    ]
};
`.trim()
      );
      let config = {
        configPath: filePath,
      } as CUDNodeParserArgs;

      CUDNodeParser(
        Object.assign(new TerraContext(), {
          configDir: tmpDir,
        }),
        config,
        parseResult
      );

      expect((parseResult.nodes[0] as CXXFile).file_path).toEqual(
        '/my/path/test1.h'
      );
    });
  });
});
