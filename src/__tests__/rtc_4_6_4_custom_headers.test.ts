import fs from 'fs';
import path from 'path';

describe('rtc_4.6.4 custom audio device headers', () => {
  const customHeaders = path.resolve(
    __dirname,
    '../../headers/rtc_4.6.4/custom_headers'
  );

  it('keeps AudioDeviceInfo and the compatible overload mappings', () => {
    const rtcEngineHeader = fs.readFileSync(
      path.join(customHeaders, 'CustomIAgoraRtcEngine.h'),
      'utf8'
    );
    const audioDeviceHeader = fs.readFileSync(
      path.join(customHeaders, 'CustomIAudioDeviceManager.h'),
      'utf8'
    );

    expect(rtcEngineHeader).toContain('struct AudioDeviceInfo');
    expect(audioDeviceHeader).toContain(
      'AudioDeviceManager_getPlaybackDeviceInfo_ed3a96d'
    );
    expect(audioDeviceHeader).toContain(
      'getPlaybackDeviceInfo(char deviceId[MAX_DEVICE_ID_LENGTH], char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH])'
    );
    expect(audioDeviceHeader).toContain(
      'virtual AudioDeviceInfo *getPlaybackDeviceInfo() = 0;'
    );
  });
});
