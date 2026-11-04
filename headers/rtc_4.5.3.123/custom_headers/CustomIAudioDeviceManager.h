#pragma once

#include "CustomIAgoraRtcEngine.h"

namespace agora {
namespace rtc {
namespace ext {

class IAudioDeviceManager {
  // ----------------------------- 👇🏻rename API👇🏻 -----------------------------

  /**
   * @iris_api_id: AudioDeviceManager_getPlaybackDefaultDevice
   * @source: virtual int getDefaultDevice(char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH], char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;
   */
  virtual AudioDeviceInfo *getPlaybackDefaultDevice() = 0;

  /**
   * @iris_api_id: AudioDeviceManager_getRecordingDefaultDevice
   * @source: virtual int getDefaultDevice(char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH], char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;
   */
  virtual AudioDeviceInfo *getRecordingDefaultDevice() = 0;

  // ----------------------------- 👆🏻rename API👆🏻 -----------------------------

  // ----------------------------- 👇🏻overload API👇🏻 -----------------------------

  /**
   * @iris_api_id: AudioDeviceManager_getPlaybackDeviceInfo_ed3a96d
   * @source: virtual int getPlaybackDeviceInfo(char deviceId[MAX_DEVICE_ID_LENGTH], char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH]) = 0;
   */
  virtual AudioDeviceInfo *getPlaybackDeviceInfo() = 0;

  /**
   * @iris_api_id: AudioDeviceManager_getRecordingDeviceInfo_ed3a96d
   * @source: virtual int getRecordingDeviceInfo(char deviceId[MAX_DEVICE_ID_LENGTH], char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH]) = 0;
   */
  virtual AudioDeviceInfo *getRecordingDeviceInfo() = 0;

  // ----------------------------- 👆🏻overload API👆🏻 ----------------------------- 

};

} // namespace ext
} // namespace rtc
} // namespace agora
