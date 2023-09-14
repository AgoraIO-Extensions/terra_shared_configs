#pragma once

#include "AgoraBase.h"
#include "AgoraMediaBase.h"
#include "IAgoraMediaPlayer.h"

namespace agora {
namespace rtc {
namespace ext {

class IMediaPlayerAudioFrameObserver {
  virtual void onFrame(const agora::media::base::AudioPcmFrame *frame) = 0;
};

class IMediaPlayerVideoFrameObserver {
  virtual void onFrame(const agora::media::base::VideoFrame *frame) = 0;
};

class IMediaPlayer {
  virtual int
  registerAudioFrameObserver(IMediaPlayerAudioFrameObserver *observer) = 0;

  virtual int
  unregisterAudioFrameObserver(IMediaPlayerAudioFrameObserver *observer) = 0;

  virtual int
  registerVideoFrameObserver(IMediaPlayerVideoFrameObserver *observer) = 0;

  virtual int
  unregisterVideoFrameObserver(IMediaPlayerVideoFrameObserver *observer) = 0;

  virtual int setPlayerOptionInInt(const char *key, int value) = 0;

  virtual int setPlayerOptionInString(const char *key, const char *value) = 0;
};

} // namespace ext
} // namespace rtc
} // namespace agora
