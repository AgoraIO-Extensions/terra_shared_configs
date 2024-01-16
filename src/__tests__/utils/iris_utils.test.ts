import {
  Clazz,
  MemberFunction,
  Variable,
} from '@agoraio-extensions/cxx-parser';

import { ParseResult } from '@agoraio-extensions/terra-core';

import { irisApiId } from '../../index';

describe('irisApiId', () => {
  it('full api type for overload function with hash code', () => {
    let mf1 = {
      name: 'MyFunc',
      parameters: [
        {
          type: {
            source: 'const char *',
          },
        } as Variable,
      ],
    } as MemberFunction;
    let mf2 = {
      name: 'MyFunc',
      parameters: [
        {
          type: {
            source: 'const char *',
          },
        } as Variable,
        {
          type: {
            source: 'int',
          },
        } as Variable,
      ],
    } as MemberFunction;
    let myClass = { name: 'MyClass', methods: [mf1, mf2] } as Clazz;

    let parseResult = new ParseResult();
    parseResult.nodes = [
      {
        nodes: [myClass],
      },
    ];

    let apiType = irisApiId(myClass, mf1);

    expect(apiType).toBe('MYCLASS_MYFUNC_56658dc');
  });

  it('full api type for overload function with hash code with so long parameter type name', () => {
    let mf1 = {
      name: 'MyFunc',
      parameters: [
        {
          type: {
            source:
              'ThisIsASoLooooooooooooooooongNamespace1::ThisIsASoLooooooooooooooooongNamespace2::ThisIsASoLooooooooooooooooongNamespace3::ThisIsASoLooooooooooooooooongClass',
          },
        } as Variable,
      ],
    } as MemberFunction;
    let mf2 = {
      name: 'MyFunc',
      parameters: [
        {
          type: {
            source: 'const char *',
          },
        } as Variable,
        {
          type: {
            source: 'int',
          },
        } as Variable,
      ],
    } as MemberFunction;
    let myClass = { name: 'MyClass', methods: [mf1, mf2] } as Clazz;
    let parseResult = new ParseResult();
    parseResult.nodes = [
      {
        nodes: [myClass],
      },
    ];

    let apiType = irisApiId(myClass, mf1);

    expect(apiType).toBe('MYCLASS_MYFUNC_026cad0');
  });

  it('full api type for overload function with hash code, toUpperCase = false', () => {
    let mf1 = {
      name: 'MyFunc',
      parameters: [
        {
          type: {
            source: 'const char *',
          },
        } as Variable,
      ],
    } as MemberFunction;
    let mf2 = {
      name: 'MyFunc',
      parameters: [
        {
          type: {
            source: 'const char *',
          },
        } as Variable,
        {
          type: {
            source: 'int',
          },
        } as Variable,
      ],
    } as MemberFunction;
    let myClass = { name: 'MyClass', methods: [mf1, mf2] } as Clazz;
    let parseResult = new ParseResult();
    parseResult.nodes = [
      {
        nodes: [myClass],
      },
    ];

    let apiType = irisApiId(myClass, mf1, { toUpperCase: false });

    expect(apiType).toBe('MyClass_MyFunc_56658dc');
  });

  it('api id for non overload function', () => {
    let myClass = { name: 'MyClass' } as Clazz;
    let mf = {
      name: 'MyFunc',
      parameters: [
        {
          type: {
            source: 'const char *',
          },
        } as Variable,
      ],
    } as MemberFunction;

    let parseResult = new ParseResult();
    parseResult.nodes = [
      {
        nodes: [myClass],
      },
    ];

    let apiType = irisApiId(myClass, mf);

    expect(apiType).toBe('MYCLASS_MYFUNC_56658dc');
  });

  it('api id for non overload function without class name', () => {
    let myClass = { name: 'MyClass' } as Clazz;
    let mf = {
      name: 'MyFunc',
      parameters: [
        {
          type: {
            source: 'const char *',
          },
        } as Variable,
      ],
    } as MemberFunction;

    let parseResult = new ParseResult();
    parseResult.nodes = [
      {
        nodes: [myClass],
      },
    ];

    let apiType = irisApiId(myClass, mf, { withClassName: false });

    expect(apiType).toBe('MYFUNC_56658dc');
  });

  it('api id for non overload function without function name', () => {
    let myClass = { name: 'MyClass' } as Clazz;
    let mf = {
      name: 'MyFunc',
      parameters: [
        {
          type: {
            source: 'const char *',
          },
        } as Variable,
      ],
    } as MemberFunction;

    let parseResult = new ParseResult();
    parseResult.nodes = [
      {
        nodes: [myClass],
      },
    ];

    let apiType = irisApiId(myClass, mf, { withFuncName: false });

    expect(apiType).toBe('MYCLASS_56658dc');
  });

  it('empty api id for non overload function', () => {
    let myClass = { name: 'MyClass' } as Clazz;
    let mf = {
      name: 'MyFunc',
      parameters: [
        {
          type: {
            source: 'const char *',
          },
        } as Variable,
      ],
    } as MemberFunction;

    let parseResult = new ParseResult();
    parseResult.nodes = [
      {
        nodes: [myClass],
      },
    ];

    let apiType = irisApiId(myClass, mf, {
      withClassName: false,
      withFuncName: false,
    });

    expect(apiType).toBe('');
  });

  it('api id trim prefix "I"', () => {
    let myClass = { name: 'IMyClass' } as Clazz;
    let mf = {
      name: 'MyFunc',
      parameters: [
        {
          type: {
            source: 'const char *',
          },
        } as Variable,
      ],
    } as MemberFunction;

    let parseResult = new ParseResult();
    parseResult.nodes = [
      {
        nodes: [myClass],
      },
    ];

    let apiType = irisApiId(myClass, mf, { toUpperCase: false });

    expect(apiType).toBe('MyClass_MyFunc_56658dc');
  });

  it('api id trim prefix other prefix', () => {
    let myClass = { name: 'MyClass' } as Clazz;
    let mf = {
      name: 'MyFunc',
      parameters: [
        {
          type: {
            source: 'const char *',
          },
        } as Variable,
      ],
    } as MemberFunction;

    let parseResult = new ParseResult();
    parseResult.nodes = [
      {
        nodes: [myClass],
      },
    ];

    let apiType = irisApiId(myClass, mf, {
      toUpperCase: false,
      trimPrefix: 'My',
    });

    expect(apiType).toBe('Class_MyFunc_56658dc');
  });

  it('api id trim prefix empty', () => {
    let myClass = { name: 'MyClass' } as Clazz;
    let mf = {
      name: 'MyFunc',
      parameters: [
        {
          type: {
            source: 'const char *',
          },
        } as Variable,
      ],
    } as MemberFunction;

    let parseResult = new ParseResult();
    parseResult.nodes = [
      {
        nodes: [myClass],
      },
    ];

    let apiType = irisApiId(myClass, mf, {
      toUpperCase: false,
      trimPrefix: '',
    });

    expect(apiType).toBe('MyClass_MyFunc_56658dc');
  });
});
