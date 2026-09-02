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

class IMusicContentCenter
{
  // reason: keep 
  // virtual int preload(agora::util::AString& requestId, int64_t songCode) = 0;
  //
  // original:
  // virtual int preload(int64_t songCode, const char* jsonOption) __deprecated = 0;
  // virtual int preload(agora::util::AString& requestId, int64_t songCode) = 0;
  virtual int preload(agora::util::AString& requestId, int64_t songCode) = 0;
};
} // namespace ext
} // namespace rtc
} // namespace agora