#pragma once

#include "IAgoraMediaPlayer.h"

namespace agora {
namespace rtc {
namespace ext {

class IMusicPlayer : public IMediaPlayer {
  // ----------------------------- 👇🏻overload API👇🏻 -----------------------------

  /**
   * @iris_api_id: MusicPlayer_open_303b92e
   * @source: virtual int open(int64_t songCode, int64_t startPos = 0) = 0;
   */
  virtual int openWithSongCode(int64_t songCode, int64_t startPos = 0) = 0;

  // ----------------------------- 👆🏻overload API👆🏻 -----------------------------
};

class IMusicContentCenter
{
  /**
   * @iris_api_id: MusicContentCenter_preload_d3baeab
   * @source: virtual int preload(agora::util::AString& requestId, int64_t songCode) = 0;
   */
  virtual int preload(agora::util::AString& requestId, int64_t songCode) = 0;
};
} // namespace ext
} // namespace rtc
} // namespace agora