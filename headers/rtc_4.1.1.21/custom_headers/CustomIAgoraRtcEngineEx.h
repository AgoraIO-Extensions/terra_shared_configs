#pragma once

#include "AgoraBase.h"
#include "IAgoraRtcEngineEx.h"

namespace agora {
namespace rtc {
namespace ext {

class IRtcEngineEx {
  virtual int leaveChannelEx(const RtcConnection &connection,
                             const LeaveChannelOptions *options = NULL) = 0;

  virtual int createDataStreamEx(int *streamId, DataStreamConfig &config,
                                 const RtcConnection &connection) = 0;
};

} // namespace ext
} // namespace rtc
} // namespace agora