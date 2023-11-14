#pragma once

#include "AgoraRtmBase.h"
#include "IAgoraStreamChannel.h"

namespace agora {
namespace rtm {
namespace ext {

class IStreamChannel {
  // ----------------------------- 👇🏻new API👇🏻 -----------------------------

  // IStreamChannel
  //virtual int publishTopicMessage(const char* topic, const char* message, size_t length, const PublishOptions& option) = 0;
  virtual int publishTopicMessageWithBuffer(const char* topic, const unsigned char* message, size_t length, const PublishOptions& option) = 0;

  // ----------------------------- 👆🏻new API👆🏻 -----------------------------
};

} // namespace ext
} // namespace rtm
} // namespace agora