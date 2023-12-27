import {
  Clazz,
  MemberFunction,
  Variable,
} from '@agoraio-extensions/cxx-parser';

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

    let apiType = irisApiId(myClass, mf1);

    expect(apiType).toBe('MYCLASS_MYFUNC_3766a1b9');
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

    let apiType = irisApiId(myClass, mf1);

    expect(apiType).toBe('MYCLASS_MYFUNC_67d36c93');
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

    let apiType = irisApiId(myClass, mf1, { toUpperCase: false });

    expect(apiType).toBe('MyClass_MyFunc_3766a1b9');
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

    let apiType = irisApiId(myClass, mf);

    expect(apiType).toBe('MYCLASS_MYFUNC');
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

    let apiType = irisApiId(myClass, mf, { withClassName: false });

    expect(apiType).toBe('MYFUNC');
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

    let apiType = irisApiId(myClass, mf, { withFuncName: false });

    expect(apiType).toBe('MYCLASS');
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

    let apiType = irisApiId(myClass, mf, {
      withClassName: false,
      withFuncName: false,
    });

    expect(apiType).toBe('');
  });
});
