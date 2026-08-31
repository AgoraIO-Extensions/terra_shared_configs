import fs from 'fs';
import path from 'path';

describe('rtc_4.6.4 headers', () => {
  const headers = path.resolve(__dirname, '../../headers/rtc_4.6.4');
  const customHeaders = path.join(headers, 'custom_headers');

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

  it('keeps the camera focal length local video events', () => {
    const agoraBaseHeader = fs.readFileSync(
      path.join(headers, 'include/AgoraBase.h'),
      'utf8'
    );

    expect(agoraBaseHeader).toContain(
      'LOCAL_VIDEO_EVENT_TYPE_CAMERA_FOCAL_LENGTH_APPLIED = 5'
    );
    expect(agoraBaseHeader).toContain(
      'LOCAL_VIDEO_EVENT_TYPE_CAMERA_FOCAL_LENGTH_FALLBACK_TO_DEFAULT = 6'
    );
  });
});
