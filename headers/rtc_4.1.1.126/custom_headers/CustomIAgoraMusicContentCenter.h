#pragma once

#include "IAgoraMediaPlayer.h"
#include <AgoraRefPtr.h>

namespace agora {
namespace rtc {
namespace ext {

class IMusicPlayer : public IMediaPlayer {
public:
  virtual int openWithSongCode(int64_t songCode, int64_t startPos = 0) = 0;
};

class IMusicContentCenter {
  virtual int preload(int64_t songCode,
                      const char *jsonOption) __deprecated = 0;

  virtual int preloadWithRequestId(agora::util::AString &requestId,
                                   int64_t songCode) = 0;
}

} // namespace ext
} // namespace rtc
} // namespace agora