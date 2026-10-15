#pragma once

#include "AgoraBase.h"
#include "AgoraMediaBase.h"
#include "IAgoraMediaPlayer.h"

namespace agora {
namespace rtc {

// Put this class to the agora::rtc namespaces to avoid unecessary namespace trimming(trim the `ext` namespace).
class IMediaPlayerVideoFrameObserver {
  virtual void onFrame(const agora::media::base::VideoFrame *frame) = 0;
};

namespace ext {

class IMediaPlayer {
  // ----------------------------- 👇🏻overload API👇🏻 -----------------------------

  /**
   * @iris_api_id: MediaPlayer_setPlayerOption_4d05d29
   * @source: virtual int setPlayerOption(const char* key, int value) = 0;
   */
  virtual int setPlayerOptionInInt(const char *key, int value) = 0;

  /**
   * @iris_api_id: MediaPlayer_setPlayerOption_ccad422
   * @source: virtual int setPlayerOption(const char* key, char* value) = 0;
   */
  virtual int setPlayerOptionInString(const char *key, const char *value) = 0;

  /**
   * @iris_api_id: MediaPlayer_registerAudioFrameObserver_a5b510b
   * @source: virtual int registerAudioFrameObserver(media::IAudioPcmFrameSink* observer, RAW_AUDIO_FRAME_OP_MODE_TYPE mode) = 0;
   */
  virtual int
  registerAudioFrameObserver(media::IAudioPcmFrameSink* observer,
                             RAW_AUDIO_FRAME_OP_MODE_TYPE mode = RAW_AUDIO_FRAME_OP_MODE_TYPE::RAW_AUDIO_FRAME_OP_MODE_READ_ONLY) = 0;

  // ----------------------------- 👆🏻overload API👆🏻 -----------------------------

  // ----------------------------- 👇🏻rename API👇🏻 -----------------------------

  /**
   * @iris_api_id: MediaPlayer_registerVideoFrameObserver_833bd8d
   * @source: virtual int registerVideoFrameObserver(media::base::IVideoFrameObserver* observer) = 0;
   */
  virtual int
  registerVideoFrameObserver(IMediaPlayerVideoFrameObserver *observer) = 0;

  /**
   * @iris_api_id: MediaPlayer_unregisterVideoFrameObserver_5165d4c
   * @source: virtual int unregisterVideoFrameObserver(agora::media::base::IVideoFrameObserver* observer) = 0;
   */
  virtual int
  unregisterVideoFrameObserver(IMediaPlayerVideoFrameObserver *observer) = 0;

  // ----------------------------- 👆🏻rename API👆🏻 -----------------------------
};

} // namespace ext
} // namespace rtc
} // namespace agora