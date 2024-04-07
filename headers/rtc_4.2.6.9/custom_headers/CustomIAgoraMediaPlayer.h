#pragma once

#include "AgoraBase.h"
#include "AgoraMediaBase.h"
#include "IAgoraMediaPlayer.h"

namespace agora {
namespace rtc {
namespace ext {

class IMediaPlayerVideoFrameObserver {
  virtual void onFrame(const agora::media::base::VideoFrame *frame) = 0;
};

class IMediaPlayer {
  // ----------------------------- 👇🏻overload API👇🏻 -----------------------------

  // virtual int setPlayerOption(const char* key, int value) = 0;
  virtual int setPlayerOptionInInt(const char *key, int value) = 0;

  // virtual int setPlayerOption(const char* key, const char* value) = 0;
  virtual int setPlayerOptionInString(const char *key, const char *value) = 0;

  // virtual int registerAudioFrameObserver(media::IAudioPcmFrameSink* observer,
  //                                       RAW_AUDIO_FRAME_OP_MODE_TYPE mode) = 0;
  virtual int
  registerAudioFrameObserver(media::IAudioPcmFrameSink* observer,
                             RAW_AUDIO_FRAME_OP_MODE_TYPE mode = RAW_AUDIO_FRAME_OP_MODE_TYPE::RAW_AUDIO_FRAME_OP_MODE_READ_ONLY) = 0;

  // ----------------------------- 👆🏻overload API👆🏻 -----------------------------

  // ----------------------------- 👇🏻rename API👇🏻 -----------------------------

  // virtual int registerVideoFrameObserver(media::base::IVideoFrameObserver* observer) = 0;
  virtual int
  registerVideoFrameObserver(IMediaPlayerVideoFrameObserver *observer) = 0;

  // virtual int unregisterVideoFrameObserver(agora::media::base::IVideoFrameObserver* observer) = 0;
  virtual int
  unregisterVideoFrameObserver(IMediaPlayerVideoFrameObserver *observer) = 0;

  // ----------------------------- 👆🏻rename API👆🏻 -----------------------------
};

} // namespace ext
} // namespace rtc
} // namespace agora