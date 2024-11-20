#pragma once

#include "AgoraBase.h"
#include "IAgoraRtcEngineEx.h"

namespace agora {
namespace rtc {
namespace ext {

class IRtcEngineEx {
  // ----------------------------- 👇🏻overload API👇🏻 -----------------------------

  /**
   * @iris_api_id: RtcEngineEx_leaveChannelEx_b03ee9a
   * @source: virtual int leaveChannelEx(const RtcConnection& connection, const LeaveChannelOptions& options) = 0;
   */
  virtual int leaveChannelEx(const RtcConnection &connection,
                             const LeaveChannelOptions *options = NULL) = 0;

  /**
   * @iris_api_id: RtcEngineEx_createDataStreamEx_9f641b6
   * @source: virtual int createDataStreamEx(int* streamId, DataStreamConfig& config, const RtcConnection& connection) = 0;
   */
  virtual int createDataStreamEx(int *streamId, DataStreamConfig &config,
                                 const RtcConnection &connection) = 0;

  // ----------------------------- 👆🏻overload API👆🏻 -----------------------------
};

} // namespace ext
} // namespace rtc
} // namespace agora