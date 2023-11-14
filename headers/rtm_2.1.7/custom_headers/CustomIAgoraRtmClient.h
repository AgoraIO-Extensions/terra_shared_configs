#pragma once

#include "IAgoraStreamChannel.h"
#include "IAgoraRtmStorage.h"
#include "IAgoraRtmPresence.h"
#include "IAgoraRtmLock.h"
#include "AgoraRtmBase.h"
#include "IAgoraRtmClient.h"

namespace agora {
namespace rtm {
namespace ext {

class IRtmClient {
  // ----------------------------- 👇🏻new API👇🏻 -----------------------------

  // IRtmClient
  //virtual int publish(const char* channelName, const char* message, const size_t length, const PublishOptions& option, uint64_t& requestId) = 0;
  virtual int publishWithBuffer(const char* channelName, const unsigned char* message, const size_t length, const PublishOptions& option, uint64_t& requestId) = 0;

  // ----------------------------- 👆🏻new API👆🏻 -----------------------------
};

} // namespace ext
} // namespace rtm
} // namespace agora