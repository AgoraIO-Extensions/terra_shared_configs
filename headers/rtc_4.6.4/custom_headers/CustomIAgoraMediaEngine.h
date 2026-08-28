#pragma once

#include "AgoraBase.h"
#include "IAgoraMediaEngine.h"

namespace agora {
namespace media {
namespace ext {

class IMediaEngine {
  // ----------------------------- 👇🏻new API👇🏻 -----------------------------

  /**
   * @iris_api_id: MediaEngine_unregisterAudioFrameObserver
   * @source: virtual int registerAudioFrameObserver(IAudioFrameObserver* observer) = 0;
   */
  virtual int unregisterAudioFrameObserver(IAudioFrameObserver *observer) = 0;

  /**
   * @iris_api_id: MediaEngine_unregisterVideoFrameObserver
   * @source: virtual int registerVideoFrameObserver(IVideoFrameObserver* observer) = 0;
   */
  virtual int unregisterVideoFrameObserver(IVideoFrameObserver *observer) = 0;

  /**
   * @iris_api_id: MediaEngine_unregisterVideoEncodedFrameObserver
   * @source: virtual int registerVideoEncodedFrameObserver(IVideoEncodedFrameObserver* observer) = 0;
   */
  virtual int
  unregisterVideoEncodedFrameObserver(IVideoEncodedFrameObserver *observer) = 0;

  /**
   * @iris_api_id: MediaEngine_unregisterFaceInfoObserver
   * @source: virtual int registerFaceInfoObserver(IFaceInfoObserver* observer) = 0;
   */
  virtual int unregisterFaceInfoObserver(IFaceInfoObserver* observer) = 0;

  /**
   * @iris_api_id: MediaEngine_setExternalRemoteEglContext_f337cbf
   * @source: virtual int setExternalRemoteEglContext(void* eglContext) = 0;
   */
  virtual int setExternalRemoteEglContext(const void* eglContext) = 0;

  // ----------------------------- 👆🏻new API👆🏻 -----------------------------
};

} // namespace ext
} // namespace media
} // namespace agora