#pragma once

#include "AgoraBase.h"
#include "IAgoraMediaEngine.h"

namespace agora {
namespace media {
namespace ext {

class IMediaEngine {
  virtual int unregisterAudioFrameObserver(IAudioFrameObserver *observer) = 0;

  virtual int unregisterVideoFrameObserver(IVideoFrameObserver *observer) = 0;

  virtual int
  unregisterVideoEncodedFrameObserver(IVideoEncodedFrameObserver *observer) = 0;
};

} // namespace ext
} // namespace media
} // namespace agora
