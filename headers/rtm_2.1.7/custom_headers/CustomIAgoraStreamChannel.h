#pragma once

#include "AgoraRtmBase.h"

namespace agora {
namespace rtm {

class IStreamChannel {
  // ----------------------------- 👇🏻new API👇🏻 -----------------------------

  // IStreamChannel
  //virtual int publishTopicMessage(const char* topic, const char* message, size_t length, const PublishOptions& option) = 0;
  virtual int publishTopicMessageWithBuffer(const char* topic, const unsigned char* message, size_t length, const PublishOptions& option) = 0;

  // ----------------------------- 👆🏻new API👆🏻 -----------------------------
};

} // namespace rtm
} // namespace agora