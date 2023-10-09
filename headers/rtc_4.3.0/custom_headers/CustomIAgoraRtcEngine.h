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

// virtual const char* getVersion(int* build) = 0;
struct SDKBuildInfo {
  int build;
  const char *version;
};

// IVideoDeviceCollection
// virtual int getDevice(int index, char deviceName[MAX_DEVICE_ID_LENGTH],
//                        char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;
struct VideoDeviceInfo {
  const char *deviceId;
  const char *deviceName;
};

// IAudioDeviceCollection
// virtual int getDevice(int index, char deviceName[MAX_DEVICE_ID_LENGTH],
//                        char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;
struct AudioDeviceInfo {
  const char *deviceId;
  const char *deviceName;
};

class IRtcEngineBase {
  // ----------------------------- 👇🏻overload API👇🏻 -----------------------------

  // virtual int joinChannel(const char* token, const char* channelId, uid_t uid,
  //                        const ChannelMediaOptions& options) = 0;
  virtual int joinChannel(const char *token, const char *channelId, uid_t uid,
                          const ChannelMediaOptions &options) = 0;

  // virtual int leaveChannel(const LeaveChannelOptions& options) = 0;
  virtual int leaveChannel(const LeaveChannelOptions *options = NULL) = 0;

  // virtual int setClientRole(CLIENT_ROLE_TYPE role, const ClientRoleOptions& options) = 0;
  virtual int setClientRole(CLIENT_ROLE_TYPE role,
                            const ClientRoleOptions *options = NULL) = 0;

  // virtual int startEchoTest(const EchoTestConfiguration& config) = 0;
  virtual int startEchoTest(const EchoTestConfiguration &config) = 0;

  // virtual int startPreview(VIDEO_SOURCE_TYPE sourceType) = 0;
  virtual int
  startPreview(VIDEO_SOURCE_TYPE sourceType =
                   VIDEO_SOURCE_TYPE::VIDEO_SOURCE_CAMERA_PRIMARY) = 0;

  // virtual int stopPreview(VIDEO_SOURCE_TYPE sourceType) = 0;
  virtual int
  stopPreview(VIDEO_SOURCE_TYPE sourceType =
                  VIDEO_SOURCE_TYPE::VIDEO_SOURCE_CAMERA_PRIMARY) = 0;

  // virtual int setAudioProfile(AUDIO_PROFILE_TYPE profile, AUDIO_SCENARIO_TYPE scenario) __deprecated = 0;
  virtual int
  setAudioProfile(AUDIO_PROFILE_TYPE profile,
                  AUDIO_SCENARIO_TYPE scenario =
                      AUDIO_SCENARIO_TYPE::AUDIO_SCENARIO_DEFAULT) = 0;

  // virtual int startAudioRecording(const AudioRecordingConfiguration& config) = 0;
  virtual int
  startAudioRecording(const AudioRecordingConfiguration &config) = 0;

  // virtual int startAudioMixing(const char* filePath, bool loopback, int cycle, int startPos) = 0;
  virtual int startAudioMixing(const char *filePath, bool loopback, int cycle,
                               int startPos = 0) = 0;

  // virtual int setLocalRenderMode(media::base::RENDER_MODE_TYPE renderMode, VIDEO_MIRROR_MODE_TYPE mirrorMode) = 0;
  virtual int
  setLocalRenderMode(media::base::RENDER_MODE_TYPE renderMode,
                     VIDEO_MIRROR_MODE_TYPE mirrorMode =
                         VIDEO_MIRROR_MODE_TYPE::VIDEO_MIRROR_MODE_AUTO) = 0;

  // virtual int enableDualStreamMode(bool enabled, const SimulcastStreamConfig& streamConfig) = 0;
  virtual int
  enableDualStreamMode(bool enabled,
                       const SimulcastStreamConfig *streamConfig = NULL) = 0;

  // virtual int setDualStreamMode(SIMULCAST_STREAM_MODE mode,
  //                               const SimulcastStreamConfig& streamConfig) = 0;
  virtual int
  setDualStreamMode(SIMULCAST_STREAM_MODE mode,
                    const SimulcastStreamConfig *streamConfig = NULL) = 0;

  // virtual int createDataStream(int* streamId, DataStreamConfig& config) = 0;
  virtual int createDataStream(int *streamId,
                               const DataStreamConfig &config) = 0;

  // virtual int addVideoWatermark(const char* watermarkUrl, const WatermarkOptions& options) = 0;
  virtual int addVideoWatermark(const char *watermarkUrl,
                                const WatermarkOptions &options) = 0;

  

  // virtual int enableExtension(const char* provider, const char* extension, const ExtensionInfo& extensionInfo, bool enable = true) = 0;
  virtual int enableExtension(const char *provider, const char *extension,
                              bool enable = true,
                              agora::media::MEDIA_SOURCE_TYPE type =
                                  agora::media::UNKNOWN_MEDIA_SOURCE) = 0;

  // virtual int setExtensionProperty(
  //    const char* provider, const char* extension,
  //    const char* key, const char* value, agora::media::MEDIA_SOURCE_TYPE type = agora::media::UNKNOWN_MEDIA_SOURCE) = 0;
  virtual int setExtensionProperty(const char *provider, const char *extension,
                                   const char *key, const char *value,
                                   agora::media::MEDIA_SOURCE_TYPE type =
                                       agora::media::UNKNOWN_MEDIA_SOURCE) = 0;

  // virtual int getExtensionProperty(
  //    const char* provider, const char* extension,
  //    const char* key, char* value, int buf_len, agora::media::MEDIA_SOURCE_TYPE type = agora::media::UNKNOWN_MEDIA_SOURCE) = 0;
  virtual int getExtensionProperty(const char *provider, const char *extension,
                                   const char *key, char *value, int buf_len,
                                   agora::media::MEDIA_SOURCE_TYPE type =
                                       agora::media::UNKNOWN_MEDIA_SOURCE) = 0;

  // virtual int startScreenCapture(const ScreenCaptureParameters2& captureParams) = 0;
  virtual int
  startScreenCapture(const ScreenCaptureParameters2 &captureParams) = 0;

  // virtual int stopScreenCapture() = 0;
  virtual int stopScreenCapture() = 0;

  // ----------------------------- 👆🏻overload API👆🏻 -----------------------------

  // ----------------------------- 👇🏻rename API👇🏻 -----------------------------

  // virtual int queryInterface(INTERFACE_ID_TYPE iid, void** inter) = 0;
  // AGORA_IID_AUDIO_DEVICE_MANAGER = 1,
  virtual IAudioDeviceManager *getAudioDeviceManager() = 0;

  // virtual int queryInterface(INTERFACE_ID_TYPE iid, void** inter) = 0;
  // AGORA_IID_VIDEO_DEVICE_MANAGER = 2,
  virtual IVideoDeviceManager *getVideoDeviceManager() = 0;

  // virtual int queryInterface(INTERFACE_ID_TYPE iid, void** inter) = 0;
  // AGORA_IID_MUSIC_CONTENT_CENTER = 15,
  virtual IMusicContentCenter *getMusicContentCenter() = 0;

  // virtual int queryInterface(INTERFACE_ID_TYPE iid, void** inter) = 0;
  // AGORA_IID_MEDIA_ENGINE = 4,
  virtual agora::media::IMediaEngine *getMediaEngine() = 0;

  // virtual int queryInterface(INTERFACE_ID_TYPE iid, void** inter) = 0;
  // AGORA_IID_LOCAL_SPATIAL_AUDIO = 11,
  virtual ILocalSpatialAudioEngine *getLocalSpatialAudioEngine() = 0;

  // virtual bool onReadyToSendMetadata(Metadata &metadata, VIDEO_SOURCE_TYPE source_type) = 0;
  virtual int sendMetaData(const IMetadataObserver::Metadata &metadata,
                           VIDEO_SOURCE_TYPE source_type) = 0;

  // virtual int getMaxMetadataSize() { return DEFAULT_METADATA_SIZE_IN_BYTE; }
  virtual int setMaxMetadataSize(int size) = 0;

  // ----------------------------- 👆🏻rename API👆🏻 -----------------------------

  // ----------------------------- 👇🏻new API👇🏻 -----------------------------

#ifdef __ELECTRON__
  virtual void destroyRendererByView(view_t view) = 0;
#endif


  // add for registerAudioEncodedFrameObserver
  // virtual int registerAudioEncodedFrameObserver(const AudioEncodedFrameObserverConfig& config,  IAudioEncodedFrameObserver *observer) = 0;
  virtual int
  unregisterAudioEncodedFrameObserver(IAudioEncodedFrameObserver *observer) = 0;

  // add for createAgoraRtcEngine
  // AGORA_API agora::rtc::IRtcEngine* AGORA_CALL createAgoraRtcEngine();
  virtual intptr_t getNativeHandle() = 0;

  // ----------------------------- 👆🏻new API👆🏻 -----------------------------

};

class IRtcEngine {
  // ----------------------------- 👇🏻overload API👇🏻 -----------------------------
  // virtual int joinChannelWithUserAccount(const char* token, const char* channelId,
  //                                        const char* userAccount, const ChannelMediaOptions& options) = 0;
  virtual int
  joinChannelWithUserAccount(const char *token, const char *channelId,
                             const char *userAccount,
                             const ChannelMediaOptions *options = NULL) = 0;
  // ----------------------------- 👆🏻overload API👆🏻 -----------------------------

  // ----------------------------- 👇🏻new API👇🏻 -----------------------------

#ifdef __ELECTRON__
  virtual void destroyRendererByConfig(VIDEO_SOURCE_TYPE sourceType,
                                       const char *channelId = NULL,
                                       uid_t uid = 0) = 0;
#endif
  // reason: keep
  // original: 
  // virtual int preloadChannel(const char* token, const char* channelId, uid_t uid) = 0;
  virtual int preloadChannel(const char* token, const char* channelId, uid_t uid) = 0;

  // reason: rename
  // original: 
  // virtual int preloadChannel(const char* token, const char* channelId, const char* userAccount) = 0;
  virtual int preloadChannelWithUserAccount(const char* token, const char* channelId, const char* userAccount) = 0;
  // ----------------------------- 👆🏻new API👆🏻 -----------------------------
};

class IRtcEngineS {
  // ----------------------------- 👇🏻overload API👇🏻 -----------------------------

  // ----------------------------- 👆🏻overload API👆🏻 -----------------------------

  // ----------------------------- 👇🏻new API👇🏻 -----------------------------

#ifdef __ELECTRON__
  virtual void destroyRendererByConfig(VIDEO_SOURCE_TYPE sourceType,
                                       const char *channelId = NULL,
                                       const char* userAccount) = 0;
#endif
  // ----------------------------- 👆🏻new API👆🏻 -----------------------------
};

} // namespace ext
} // namespace rtc
} // namespace agora
