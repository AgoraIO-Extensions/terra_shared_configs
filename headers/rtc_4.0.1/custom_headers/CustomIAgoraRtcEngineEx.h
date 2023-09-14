#pragma once

#include "AgoraBase.h"
#include "IAgoraRtcEngineEx.h"

namespace agora {
namespace rtc {
namespace ext {

class IRtcEngineEx {
  virtual int createDataStreamEx(int *streamId, DataStreamConfig &config,
                                 const RtcConnection &connection) = 0;
};

} // namespace ext
} // namespace rtc
} // namespace agora
