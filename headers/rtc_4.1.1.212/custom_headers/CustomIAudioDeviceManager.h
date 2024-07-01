#pragma once

#include "CustomIAgoraRtcEngine.h"

namespace agora {
namespace rtc {
namespace ext {

class IAudioDeviceManager {
  virtual AudioDeviceInfo *getPlaybackDefaultDevice() = 0;

  virtual AudioDeviceInfo *getRecordingDefaultDevice() = 0;
};

} // namespace ext
} // namespace rtc
} // namespace agora
