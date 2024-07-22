#pragma once

#include "AgoraBase.h"
#include "AgoraMediaBase.h"
#include "IAgoraMediaPlayer.h"

namespace agora{
namespace rtc{
namespace ext{

class IMediaPlayerSource
{
  // ----------------------------- 👇🏻overload API👇🏻 -----------------------------

  /**
   * @iris_api_id: MediaPlayerSource_setPlayerOption_e43f201
   * @source: virtual int setPlayerOption(const char* key, int64_t value) = 0;
   */
  virtual int setPlayerOptionInInt(const char *key, int64_t value) = 0;

  /**
   * @iris_api_id: MediaPlayerSource_setPlayerOption_ccad422
   * @source: virtual int setPlayerOption(const char* key, const char* value) = 0;
   */
  virtual int setPlayerOptionInString(const char *key, const char *value) = 0;

  /**
   * @iris_api_id: MediaPlayerSource_getPlayerOption_ae3d0cf
   * @source: virtual int getPlayerOption(const char* key, int& value) = 0;
   */
  virtual int getPlayerOptionInInt(const char *key, int &value) = 0;

  /**
   * @iris_api_id: MediaPlayerSource_getPlayerOption_f15226a
   * @source: virtual int getPlayerOption(const char* key, agora::util::AString& value) = 0;
   */
  virtual int getPlayerOptionInString(const char *key, agora::util::AString &value) = 0;

  // ----------------------------- 👆🏻overload API👆🏻 -----------------------------
};

} // namespace ext
} // namespace rtc
} // namespace agora