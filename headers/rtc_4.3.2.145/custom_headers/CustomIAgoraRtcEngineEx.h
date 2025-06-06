#pragma once

#include "AgoraBase.h"
#include "AgoraMediaBase.h"
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
   * @iris_api_id: RtcEngineEx_leaveChannelWithUserAccountEx_8bbe372
   * @source: virtual int leaveChannelWithUserAccountEx(const char* channelId, const char* userAccount, const LeaveChannelOptions& options) = 0;
   */
  virtual int leaveChannelWithUserAccountEx(const char* channelId, const char* userAccount, const LeaveChannelOptions* options = NULL) = 0;

  /**
   * @iris_api_id: RtcEngineEx_takeSnapshotEx_de1c015
   * @source: virtual int takeSnapshotEx(const RtcConnection& connection, uid_t uid, const char* filePath)  = 0;
   */
  virtual int takeSnapshotEx(const RtcConnection& connection, uid_t uid, const char* filePath)  = 0;

  /**
   * @iris_api_id: RtcEngineEx_takeSnapshotEx_b856417
   * @source: virtual int takeSnapshotEx(const RtcConnection& connection, uid_t uid, const agora::media::SnapshotConfig& config)  = 0;
   */
  virtual int takeSnapshotWithConfigEx(const RtcConnection& connection, uid_t uid, const agora::media::SnapshotConfig& config)  = 0;

  /**
   * @iris_api_id: RtcEngineEx_createDataStreamEx_9f641b6
   * @source: virtual int createDataStreamEx(int* streamId, const DataStreamConfig& config, const RtcConnection& connection) = 0;
   */
  virtual int createDataStreamEx(int* streamId, const DataStreamConfig& config, const RtcConnection& connection) = 0;

  // ----------------------------- 👆🏻overload API👆🏻 -----------------------------
};

} // namespace ext
} // namespace rtc
} // namespace agora