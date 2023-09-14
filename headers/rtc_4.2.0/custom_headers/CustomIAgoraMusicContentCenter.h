#pragma once

#include "IAgoraMediaPlayer.h"

namespace agora {
namespace rtc {
namespace ext {

class IMusicPlayer : public IMediaPlayer {
  // ----------------------------- 👇🏻overload API👇🏻 -----------------------------

  // virtual int open(int64_t songCode, int64_t startPos = 0) = 0;
  virtual int openWithSongCode(int64_t songCode, int64_t startPos = 0) = 0;

  // ----------------------------- 👆🏻overload API👆🏻 -----------------------------
};
} // namespace ext
} // namespace rtc
} // namespace agora