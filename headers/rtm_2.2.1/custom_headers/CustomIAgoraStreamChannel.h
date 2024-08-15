#pragma once

#include "AgoraRtmBase.h"
#include "IAgoraStreamChannel.h"

namespace agora {
namespace rtm {
namespace ext {

class IStreamChannel {
  // ----------------------------- 👇🏻new API👇🏻 -----------------------------
  /**
   * @iris_api_id: StreamChannel_publishTopicMessage_a31773e
   * @source: virtual void publish(const char* channelName, const char* message, const size_t length, const PublishOptions& option, uint64_t& requestId) = 0;
   */
  virtual void publishTopicBinaryMessage(const char* topic, const unsigned char* message, size_t length, const TopicMessageOptions& option, uint64_t& requestId) = 0;

  // ----------------------------- 👆🏻new API👆🏻 -----------------------------
};

} // namespace ext
} // namespace rtm
} // namespace agora