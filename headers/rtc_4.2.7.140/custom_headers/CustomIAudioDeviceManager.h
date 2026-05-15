#pragma once

#include "CustomIAgoraRtcEngine.h"

namespace agora {
namespace rtc {
namespace ext {

class IAudioDeviceManager {
  // ----------------------------- 👇🏻rename API👇🏻 -----------------------------

  // IAudioDeviceCollection
  // virtual int getDefaultDevice(char deviceName[MAX_DEVICE_ID_LENGTH], char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;
  virtual AudioDeviceInfo *getPlaybackDefaultDevice() = 0;

  // IAudioDeviceCollection
  // virtual int getDefaultDevice(char deviceName[MAX_DEVICE_ID_LENGTH], char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;
  virtual AudioDeviceInfo *getRecordingDefaultDevice() = 0;

  // ----------------------------- 👆🏻rename API👆🏻 -----------------------------
};

} // namespace ext
} // namespace rtc
} // namespace agora
