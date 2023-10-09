//
//  Agora SDK
//
//  Copyright (c) 2022 Agora.io. All rights reserved.
//
#pragma once  // NOLINT(build/header_guard)

#include "AgoraBase.h"
#include "AgoraMediaBase.h"
#include "IAgoraRtcEngineEx.h"
#include "IAgoraMediaRecorderBase.h"

namespace agora {
namespace rtc {

class IMediaRecorderS : public IMediaRecorderBase, public RefCountInterface {
 protected:
  virtual ~IMediaRecorderS() {}

 public:
  /**
   * Registers the IMediaRecorderObserverS object.
   *
   * @technical preview
   *
   * @note Call this method before the startRecording method.
   *
   * @param callbackS The callback for recording audio and video streams. See \ref IMediaRecorderObserverS.
   *
   * @return
   * - 0(ERR_OK): Success.
   * - < 0: Failure:
   */
  virtual int setMediaRecorderObserver(media::IMediaRecorderObserverS* callbackS) = 0;
};

} //namespace rtc
} // namespace agora
