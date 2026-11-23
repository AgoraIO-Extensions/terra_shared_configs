#pragma once

#include "AgoraBase.h"
#include "IAgoraMediaEngine.h"

namespace agora {
namespace media {
namespace ext {

class IMediaEngine {
  // ----------------------------- 👇🏻new API👇🏻 -----------------------------

  // add for registerAudioFrameObserver
  // virtual int registerAudioFrameObserver(IAudioFrameObserver* observer) = 0;
  virtual int unregisterAudioFrameObserver(IAudioFrameObserver *observer) = 0;

  // add for registerVideoFrameObserver
  // virtual int registerVideoFrameObserver(IVideoFrameObserver* observer) = 0;
  virtual int unregisterVideoFrameObserver(IVideoFrameObserver *observer) = 0;

  // add for registerVideoEncodedFrameObserver
  // virtual int registerVideoEncodedFrameObserver(IVideoEncodedFrameObserver* observer) = 0;
  virtual int
  unregisterVideoEncodedFrameObserver(IVideoEncodedFrameObserver *observer) = 0;

  // ----------------------------- 👆🏻new API👆🏻 -----------------------------
};

} // namespace ext
} // namespace media
} // namespace agora