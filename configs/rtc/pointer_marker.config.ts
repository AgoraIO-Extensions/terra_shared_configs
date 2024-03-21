import { CXXTYPE } from '@agoraio-extensions/cxx-parser';

module.exports = {
  markers: [
    {
      node: {
        __TYPE: CXXTYPE.Struct,
        name: 'LiveTranscoding',
        namespaces: ['agora', 'rtc'],
      },
      pointerArrayNameMappings: [
        {
          ptrName: 'transcodingUsers',
          lengthName: 'userCount',
        },
        {
          ptrName: 'watermark',
          lengthName: 'watermarkCount',
        },
        {
          ptrName: 'backgroundImage',
          lengthName: 'backgroundImageCount',
        },
        {
          ptrName: 'advancedFeatures',
          lengthName: 'advancedFeatureCount',
        },
      ],
    },
    {
      node: {
        __TYPE: CXXTYPE.Struct,
        name: 'ScreenCaptureParameters',
        namespaces: ['agora', 'rtc'],
      },
      pointerArrayNameMappings: [
        {
          ptrName: 'excludeWindowList',
          lengthName: 'excludeWindowCount',
        },
      ],
    },
    {
      node: {
        __TYPE: CXXTYPE.Struct,
        name: 'ChannelMediaRelayConfiguration',
        namespaces: ['agora', 'rtc'],
      },
      pointerArrayNameMappings: [
        {
          ptrName: 'destInfos',
          lengthName: 'destCount',
        },
      ],
    },
    {
      node: {
        __TYPE: CXXTYPE.Struct,
        name: 'LocalAccessPointConfiguration',
        namespaces: ['agora', 'rtc'],
      },
      pointerArrayNameMappings: [
        {
          ptrName: 'ipList',
          lengthName: 'ipListSize',
        },
        {
          ptrName: 'domainList',
          lengthName: 'domainListSize',
        },
      ],
    },
    {
      node: {
        __TYPE: CXXTYPE.Struct,
        name: 'ContentInspectConfig',
        namespaces: ['agora', 'media'],
      },
      pointerArrayNameMappings: [
        {
          ptrName: 'modules',
          lengthName: 'moduleCount',
        },
      ],
    },
    {
      node: {
        __TYPE: CXXTYPE.Struct,
        name: 'AudioSpectrumData',
        namespaces: ['agora', 'media'],
      },
      pointerArrayNameMappings: [
        {
          ptrName: 'audioSpectrumData',
          lengthName: 'dataLength',
        },
      ],
    },
    {
      node: {
        __TYPE: CXXTYPE.Struct,
        name: 'LogConfig',
        namespaces: ['agora', 'commons'],
      },
      pointerArrayNameMappings: [
        {
          ptrName: 'filePath',
          lengthName: 'fileSizeInKB',
        },
      ],
    },
    {
      node: {
        __TYPE: CXXTYPE.Struct,
        name: 'InputSeiData',
        namespaces: ['agora', 'rtc'],
      },
      pointerArrayNameMappings: [
        {
          ptrName: 'private_data',
          lengthName: 'data_size',
        },
      ],
    },
    {
      node: {
        __TYPE: CXXTYPE.Struct,
        name: 'Music',
        namespaces: ['agora', 'rtc'],
      },
      pointerArrayNameMappings: [
        {
          ptrName: 'lyricList',
          lengthName: 'lyricCount',
        },
        {
          ptrName: 'climaxSegmentList',
          lengthName: 'climaxSegmentCount',
        },
        {
          ptrName: 'mvPropertyList',
          lengthName: 'mvPropertyCount',
        },
      ],
    },
    {
      node: {
        __TYPE: CXXTYPE.Struct,
        name: 'VideoCompositingLayout',
        namespaces: ['agora', 'rtc'],
      },
      pointerArrayNameMappings: [
        {
          ptrName: 'regions',
          lengthName: 'regionCount',
        },
        {
          ptrName: 'appData',
          lengthName: 'appDataLength',
        },
      ],
    },
  ],
};
