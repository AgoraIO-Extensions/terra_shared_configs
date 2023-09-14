#pragma once

#include "AgoraBase.h"
#include "IAgoraMediaEngine.h"
#include "IAgoraMediaRecorder.h"
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

  //  virtual int leaveChannel() = 0;

  virtual int leaveChannel(const LeaveChannelOptions *options = NULL) = 0;

  //  virtual int setClientRole(CLIENT_ROLE_TYPE role) = 0;

  virtual int setClientRole(CLIENT_ROLE_TYPE role,
                            const ClientRoleOptions *options = NULL) = 0;

  //  virtual int startEchoTest() = 0;

  virtual int startEchoTest(int intervalInSeconds = 10) = 0;

  //  virtual int startPreview() = 0;

  virtual int
  startPreview(VIDEO_SOURCE_TYPE sourceType =
                   VIDEO_SOURCE_TYPE::VIDEO_SOURCE_CAMERA_PRIMARY) = 0;

  //  virtual int stopPreview() = 0;

  virtual int
  stopPreview(VIDEO_SOURCE_TYPE sourceType =
                  VIDEO_SOURCE_TYPE::VIDEO_SOURCE_CAMERA_PRIMARY) = 0;

  virtual int
  setAudioProfile(AUDIO_PROFILE_TYPE profile,
                  AUDIO_SCENARIO_TYPE scenario =
                      AUDIO_SCENARIO_TYPE::AUDIO_SCENARIO_DEFAULT) = 0;

  //  virtual int setAudioProfile(AUDIO_PROFILE_TYPE profile) = 0;

  //  virtual int startAudioRecording(const char *filePath,
  //                                  AUDIO_RECORDING_QUALITY_TYPE quality) = 0;

  //  virtual int startAudioRecording(const char *filePath, int sampleRate,
  //                                  AUDIO_RECORDING_QUALITY_TYPE quality) = 0;

  virtual int
  startAudioRecording(const AudioRecordingConfiguration &config) = 0;

  //  virtual int startAudioMixing(const char *filePath, bool loopback,
  //                               bool replace, int cycle) = 0;

  virtual int startAudioMixing(const char *filePath, bool loopback, int cycle,
                               int startPos = 0) = 0;

  virtual int
  setLocalRenderMode(media::base::RENDER_MODE_TYPE renderMode,
                     VIDEO_MIRROR_MODE_TYPE mirrorMode =
                         VIDEO_MIRROR_MODE_TYPE::VIDEO_MIRROR_MODE_AUTO) = 0;

  //  virtual int setLocalRenderMode(media::base::RENDER_MODE_TYPE renderMode) =
  //  0;

  //  virtual int enableDualStreamMode(bool enabled) = 0;

  //  virtual int enableDualStreamMode(VIDEO_SOURCE_TYPE sourceType,
  //                                   bool enabled) = 0;

  virtual int
  enableDualStreamMode(bool enabled,
                       VIDEO_SOURCE_TYPE sourceType =
                           VIDEO_SOURCE_TYPE::VIDEO_SOURCE_CAMERA_PRIMARY,
                       const SimulcastStreamConfig *streamConfig = NULL) = 0;

  //  virtual int createDataStream(int *streamId, bool reliable, bool ordered) =
  //  0;

  virtual int createDataStream(int *streamId,
                               const DataStreamConfig &config) = 0;

  //  virtual int addVideoWatermark(const RtcImage &watermark) = 0;

  virtual int addVideoWatermark(const char *watermarkUrl,
                                const WatermarkOptions &options) = 0;

  //  virtual int joinChannelWithUserAccount(const char *token,
  //                                         const char *channelId,
  //                                         const char *userAccount) = 0;

  virtual int
  joinChannelWithUserAccount(const char *token, const char *channelId,
                             const char *userAccount,
                             const ChannelMediaOptions *options = NULL) = 0;

#ifdef __ELECTRON__
  virtual void destroyRendererByView(view_t view) = 0;

  virtual void destroyRendererByConfig(VIDEO_SOURCE_TYPE sourceType,
                                       const char *channelId = NULL,
                                       uid_t uid = 0) = 0;
#endif

  virtual IAudioDeviceManager *getAudioDeviceManager() = 0;

  virtual IVideoDeviceManager *getVideoDeviceManager() = 0;

  virtual agora::media::IMediaEngine *getMediaEngine() = 0;

  virtual IMediaRecorder *getMediaRecorder() = 0;

  virtual ILocalSpatialAudioEngine *getLocalSpatialAudioEngine() = 0;

  virtual int sendMetaData(const IMetadataObserver::Metadata &metadata,
                           VIDEO_SOURCE_TYPE source_type) = 0;

  virtual int setMaxMetadataSize(int size) = 0;

  virtual int
  unregisterAudioEncodedFrameObserver(IAudioEncodedFrameObserver *observer) = 0;

  virtual int setParameters(const char *parameters) = 0;

  virtual int
  startScreenCaptureWithType(VIDEO_SOURCE_TYPE type,
                             const ScreenCaptureConfiguration &config) = 0;

  virtual int stopScreenCaptureWithType(VIDEO_SOURCE_TYPE type) = 0;

  virtual int
  startScreenCapture(const ScreenCaptureParameters2 &captureParams) = 0;

  virtual int stopScreenCapture() = 0;
};

} // namespace ext
} // namespace rtc
} // namespace agora
