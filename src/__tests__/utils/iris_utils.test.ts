import {
  Clazz,
  MemberFunction,
  Variable,
} from '@agoraio-extensions/cxx-parser';

import { irisApiId } from '../../index';

describe('irisApiId', () => {
  it('return full api type with hash code', () => {
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

    expect(apiType).toBe('MYCLASS_MYFUNC_3766a1b9');
  });

  it('return full api type with hash code with so long parameter type name', () => {
    let myClass = { name: 'MyClass' } as Clazz;
    let mf = {
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

    let apiType = irisApiId(myClass, mf);

    expect(apiType).toBe('MYCLASS_MYFUNC_67d36c93');
  });

  it('return full api type with hash code, toUpperCase = false', () => {
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

    let apiType = irisApiId(myClass, mf, { toUpperCase: false });

    expect(apiType).toBe('MyClass_MyFunc_3766a1b9');
  });

  it('return hash code only', () => {
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

    expect(apiType).toBe('3766a1b9');
  });
});
