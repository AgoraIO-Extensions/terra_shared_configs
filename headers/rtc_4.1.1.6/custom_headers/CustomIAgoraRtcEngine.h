#pragma once

#include "AgoraBase.h"
#include "IAgoraMediaEngine.h"
#include "IAgoraMediaRecorder.h"
#include "IAgoraMusicContentCenter.h"
#include "IAgoraRtcEngine.h"
#include "IAgoraSpatialAudio.h"
#include "IAudioDeviceManager.h"

namespace agora {
namespace rtc {
namespace ext {

struct SDKBuildInfo {
  int build;
  const char *version;
};

struct VideoDeviceInfo {
  const char *deviceId;
  const char *deviceName;
};

struct AudioDeviceInfo {
  const char *deviceId;
  const char *deviceName;
};

class IRtcEngine {
  virtual int joinChannel(const char *token, const char *channelId, uid_t uid,
                          const ChannelMediaOptions &options) = 0;

  virtual int leaveChannel(const LeaveChannelOptions *options = NULL) = 0;

  virtual int setClientRole(CLIENT_ROLE_TYPE role,
                            const ClientRoleOptions *options = NULL) = 0;

  virtual int startEchoTest(int intervalInSeconds = 10) = 0;

  virtual int
  startPreview(VIDEO_SOURCE_TYPE sourceType =
                   VIDEO_SOURCE_TYPE::VIDEO_SOURCE_CAMERA_PRIMARY) = 0;

  virtual int
  stopPreview(VIDEO_SOURCE_TYPE sourceType =
                  VIDEO_SOURCE_TYPE::VIDEO_SOURCE_CAMERA_PRIMARY) = 0;

  virtual int
  setAudioProfile(AUDIO_PROFILE_TYPE profile,
                  AUDIO_SCENARIO_TYPE scenario =
                      AUDIO_SCENARIO_TYPE::AUDIO_SCENARIO_DEFAULT) = 0;

  virtual int
  startAudioRecording(const AudioRecordingConfiguration &config) = 0;

  virtual int startAudioMixing(const char *filePath, bool loopback, int cycle,
                               int startPos = 0) = 0;

  virtual int
  setLocalRenderMode(media::base::RENDER_MODE_TYPE renderMode,
                     VIDEO_MIRROR_MODE_TYPE mirrorMode =
                         VIDEO_MIRROR_MODE_TYPE::VIDEO_MIRROR_MODE_AUTO) = 0;

  virtual int
  enableDualStreamMode(bool enabled,
                       const SimulcastStreamConfig *streamConfig = NULL) = 0;

  virtual int
  setDualStreamMode(SIMULCAST_STREAM_MODE mode,
                    const SimulcastStreamConfig *streamConfig = NULL) = 0;

  virtual int createDataStream(int *streamId,
                               const DataStreamConfig &config) = 0;

  virtual int addVideoWatermark(const char *watermarkUrl,
                                const WatermarkOptions &options) = 0;

  virtual int
  joinChannelWithUserAccount(const char *token, const char *channelId,
                             const char *userAccount,
                             const ChannelMediaOptions *options = NULL) = 0;

  virtual int enableExtension(const char *provider, const char *extension,
                              bool enable = true,
                              agora::media::MEDIA_SOURCE_TYPE type =
                                  agora::media::UNKNOWN_MEDIA_SOURCE) = 0;

  virtual int setExtensionProperty(const char *provider, const char *extension,
                                   const char *key, const char *value,
                                   agora::media::MEDIA_SOURCE_TYPE type =
                                       agora::media::UNKNOWN_MEDIA_SOURCE) = 0;

  virtual int getExtensionProperty(const char *provider, const char *extension,
                                   const char *key, char *value, int buf_len,
                                   agora::media::MEDIA_SOURCE_TYPE type =
                                       agora::media::UNKNOWN_MEDIA_SOURCE) = 0;

#ifdef __ELECTRON__
  virtual void destroyRendererByView(view_t view) = 0;

  virtual void destroyRendererByConfig(VIDEO_SOURCE_TYPE sourceType,
                                       const char *channelId = NULL,
                                       uid_t uid = 0) = 0;
#endif

  virtual IAudioDeviceManager *getAudioDeviceManager() = 0;

  virtual IVideoDeviceManager *getVideoDeviceManager() = 0;

  virtual IMusicContentCenter *getMusicContentCenter() = 0;

  virtual agora::media::IMediaEngine *getMediaEngine() = 0;

  virtual IMediaRecorder *getMediaRecorder() = 0;

  virtual ILocalSpatialAudioEngine *getLocalSpatialAudioEngine() = 0;

  virtual int sendMetaData(const IMetadataObserver::Metadata &metadata,
                           VIDEO_SOURCE_TYPE source_type) = 0;

  virtual int setMaxMetadataSize(int size) = 0;

  virtual int
  unregisterAudioEncodedFrameObserver(IAudioEncodedFrameObserver *observer) = 0;

  virtual intptr_t getNativeHandle() = 0;

  // virtual int startScreenCapture(const ScreenCaptureParameters2& captureParams) = 0;
  virtual int
  startScreenCapture(const ScreenCaptureParameters2 &captureParams) = 0;

  // virtual int startScreenCapture(VIDEO_SOURCE_TYPE type, const ScreenCaptureConfiguration& config) = 0;
  virtual int startScreenCaptureBySourceType(
      VIDEO_SOURCE_TYPE type,
      const ScreenCaptureConfiguration &config) = 0;

  // virtual int stopScreenCapture() = 0;
  virtual int stopScreenCapture() = 0;

  // virtual int stopScreenCapture(VIDEO_SOURCE_TYPE type) = 0;
  virtual int stopScreenCaptureBySourceType(VIDEO_SOURCE_TYPE type) = 0;
};

} // namespace ext
} // namespace rtc
} // namespace agora
