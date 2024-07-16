#pragma once

#include "AgoraBase.h"
#include "AgoraMediaBase.h"
#include "IAgoraMediaEngine.h"
#include "IAgoraMediaRecorder.h"
#include "IAgoraMusicContentCenter.h"
#include "IAgoraRtcEngine.h"
#include "IAgoraSpatialAudio.h"
#include "IAudioDeviceManager.h"
#include "IAgoraH265Transcoder.h"

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
// virtual int getDevice(int index, char deviceName[MAX_DEVICE_ID_LENGTH], char deviceTypeName[MAX_DEVICE_ID_LENGTH],
//                       char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;
struct AudioDeviceInfo {
  const char *deviceId;
  const char *deviceTypeName;
  const char *deviceName;
};

class IRtcEngine {
  // ----------------------------- 👇🏻overload API👇🏻 -----------------------------

  /**
   * @iris_api_id: RtcEngine_joinChannel_cdbb747
   * @source: virtual int joinChannel(const char* token, const char* channelId, uid_t uid, const ChannelMediaOptions& options) = 0;
   */
  virtual int joinChannel(const char *token, const char *channelId, uid_t uid,
                          const ChannelMediaOptions &options) = 0;

  /**
   * @iris_api_id: RtcEngine_leaveChannel_2c0e3aa
   * @source: virtual int leaveChannel(const LeaveChannelOptions& options) = 0;
   */
  virtual int leaveChannel(const LeaveChannelOptions *options = NULL) = 0;

  /**
   * @iris_api_id: RtcEngine_setClientRole_b46cc48
   * @source: virtual int setClientRole(CLIENT_ROLE_TYPE role, const ClientRoleOptions& options) = 0;
   */
  virtual int setClientRole(CLIENT_ROLE_TYPE role,
                            const ClientRoleOptions *options = NULL) = 0;

  /**
   * @iris_api_id: RtcEngine_startEchoTest_16140d7
   * @source: virtual int startEchoTest(const EchoTestConfiguration& config) = 0;
   */
  virtual int startEchoTest(const EchoTestConfiguration &config) = 0;

  /**
   * @iris_api_id: RtcEngine_startPreview_4fd718e
   * @source: virtual int startPreview(VIDEO_SOURCE_TYPE sourceType) = 0;
   */
  virtual int
  startPreview(VIDEO_SOURCE_TYPE sourceType =
                   VIDEO_SOURCE_TYPE::VIDEO_SOURCE_CAMERA_PRIMARY) = 0;

  /**
   * @iris_api_id: RtcEngine_stopPreview_4fd718e
   * @source: virtual int stopPreview(VIDEO_SOURCE_TYPE sourceType) = 0;
   */
  virtual int
  stopPreview(VIDEO_SOURCE_TYPE sourceType =
                  VIDEO_SOURCE_TYPE::VIDEO_SOURCE_CAMERA_PRIMARY) = 0;

  /**
   * @iris_api_id: RtcEngine_setAudioProfile_d944543
   * @source: virtual int setAudioProfile(AUDIO_PROFILE_TYPE profile, AUDIO_SCENARIO_TYPE scenario) __deprecated = 0;
   */
  virtual int
  setAudioProfile(AUDIO_PROFILE_TYPE profile,
                  AUDIO_SCENARIO_TYPE scenario =
                      AUDIO_SCENARIO_TYPE::AUDIO_SCENARIO_DEFAULT) = 0;

  /**
   * @iris_api_id: RtcEngine_startAudioRecording_e32bb3b
   * @source: virtual int startAudioRecording(const AudioRecordingConfiguration& config) = 0;
   */
  virtual int
  startAudioRecording(const AudioRecordingConfiguration &config) = 0;

  /**
   * @iris_api_id: RtcEngine_startAudioMixing_1ee1b1e
   * @source: virtual int startAudioMixing(const char* filePath, bool loopback, int cycle, int startPos) = 0;
   */
  virtual int startAudioMixing(const char *filePath, bool loopback, int cycle,
                               int startPos = 0) = 0;

  /**
   * @iris_api_id: RtcEngine_setLocalRenderMode_cfb201b
   * @source: virtual int setLocalRenderMode(media::base::RENDER_MODE_TYPE renderMode, VIDEO_MIRROR_MODE_TYPE mirrorMode) = 0;
   */
  virtual int
  setLocalRenderMode(media::base::RENDER_MODE_TYPE renderMode,
                     VIDEO_MIRROR_MODE_TYPE mirrorMode =
                         VIDEO_MIRROR_MODE_TYPE::VIDEO_MIRROR_MODE_AUTO) = 0;

  /**
   * @iris_api_id: RtcEngine_enableDualStreamMode_9822d8a
   * @source: virtual int enableDualStreamMode(bool enabled, const SimulcastStreamConfig& streamConfig) = 0;
   */
  virtual int
  enableDualStreamMode(bool enabled,
                       const SimulcastStreamConfig *streamConfig = NULL) = 0;

  /**
   * @iris_api_id: RtcEngine_setDualStreamMode_b3a4f6c
   * @source: virtual int setDualStreamMode(SIMULCAST_STREAM_MODE mode, const SimulcastStreamConfig& streamConfig) = 0;
   */
  virtual int
  setDualStreamMode(SIMULCAST_STREAM_MODE mode,
                    const SimulcastStreamConfig *streamConfig = NULL) = 0;

  /**
   * @iris_api_id: RtcEngine_createDataStream_5862815
   * @source: virtual int createDataStream(int* streamId, DataStreamConfig& config) = 0;
   */
  virtual int createDataStream(int *streamId,
                               const DataStreamConfig &config) = 0;

  /**
   * @iris_api_id: RtcEngine_addVideoWatermark_7480410
   * @source: virtual int addVideoWatermark(const char* watermarkUrl, const WatermarkOptions& options) = 0;
   */
  virtual int addVideoWatermark(const char *watermarkUrl,
                                const WatermarkOptions &options) = 0;

  /**
   * @iris_api_id: RtcEngine_joinChannelWithUserAccount_4685af9
   * @source: virtual int joinChannelWithUserAccount(const char* token, const char* channelId, const char* userAccount, const ChannelMediaOptions& options) = 0;
   */
  virtual int
  joinChannelWithUserAccount(const char *token, const char *channelId,
                             const char *userAccount,
                             const ChannelMediaOptions *options = NULL) = 0;

  /**
   * @iris_api_id: RtcEngine_enableExtension_0b60a2c
   * @source: virtual int enableExtension(const char* provider, const char* extension, const ExtensionInfo& extensionInfo, bool enable = true) = 0;
   */
  virtual int enableExtension(const char *provider, const char *extension,
                              bool enable = true,
                              agora::media::MEDIA_SOURCE_TYPE type =
                                  agora::media::UNKNOWN_MEDIA_SOURCE) = 0;

  /**
   * @iris_api_id: RtcEngine_setExtensionProperty_520ac55
   * @source: virtual int setExtensionProperty(const char* provider, const char* extension, const char* key, const char* value, agora::media::MEDIA_SOURCE_TYPE type = agora::media::UNKNOWN_MEDIA_SOURCE) = 0;
   */
  virtual int setExtensionProperty(const char *provider, const char *extension,
                                   const char *key, const char *value,
                                   agora::media::MEDIA_SOURCE_TYPE type =
                                       agora::media::UNKNOWN_MEDIA_SOURCE) = 0;

  /**
   * @iris_api_id: RtcEngine_getExtensionProperty_38c9723
   * @source: virtual int getExtensionProperty(const char* provider, const char* extension, const char* key, char* value, int buf_len, agora::media::MEDIA_SOURCE_TYPE type = agora::media::UNKNOWN_MEDIA_SOURCE) = 0;
   */
  virtual int getExtensionProperty(const char *provider, const char *extension,
                                   const char *key, char *value, int buf_len,
                                   agora::media::MEDIA_SOURCE_TYPE type =
                                       agora::media::UNKNOWN_MEDIA_SOURCE) = 0;

  /**
   * @iris_api_id: RtcEngine_startScreenCapture_270da41
   * @source: virtual int startScreenCapture(const ScreenCaptureParameters2& captureParams) = 0;
   */
  virtual int
  startScreenCapture(const ScreenCaptureParameters2 &captureParams) = 0;

  /**
   * @iris_api_id: RtcEngine_startScreenCapture_9ebb320
   * @source: virtual int startScreenCapture(VIDEO_SOURCE_TYPE sourceType, const ScreenCaptureConfiguration& config) = 0;
   */
  virtual int startScreenCaptureBySourceType(
      VIDEO_SOURCE_TYPE sourceType,
      const ScreenCaptureConfiguration &config) = 0;

  /**
   * @iris_api_id: RtcEngine_stopScreenCapture
   * @source: virtual int stopScreenCapture() = 0;
   */
  virtual int stopScreenCapture() = 0;

  /**
   * @iris_api_id: RtcEngine_stopScreenCapture_4fd718e
   * @source: virtual int stopScreenCapture(VIDEO_SOURCE_TYPE sourceType) = 0;
   */
  virtual int stopScreenCaptureBySourceType(VIDEO_SOURCE_TYPE sourceType) = 0;

  /**
   * @iris_api_id: RtcEngine_release
   * @source: AGORA_CPP_API static void release(bool sync = false);
   */
  virtual void release(bool sync = false) = 0;

  // ----------------------------- 👆🏻overload API👆🏻 -----------------------------

  // ----------------------------- 👇🏻rename API👇🏻 -----------------------------

  /**
   * @iris_api_id: RtcEngine_startPreview
   * @source: virtual int startPreview() = 0;
   */
  virtual int startPreviewWithoutSourceType() = 0;

  /**
   * @iris_api_id: RtcEngine_getAudioDeviceManager
   * @source: virtual int queryInterface(INTERFACE_ID_TYPE iid, void** inter) = 0;
   * AGORA_IID_AUDIO_DEVICE_MANAGER = 1,
   */
  virtual IAudioDeviceManager *getAudioDeviceManager() = 0;

  /**
   * @iris_api_id: RtcEngine_getVideoDeviceManager
   * @source: virtual int queryInterface(INTERFACE_ID_TYPE iid, void** inter) = 0;
   * AGORA_IID_VIDEO_DEVICE_MANAGER = 2,
   */
  virtual IVideoDeviceManager *getVideoDeviceManager() = 0;

  /**
   * @iris_api_id: RtcEngine_getMusicContentCenter
   * @source: virtual int queryInterface(INTERFACE_ID_TYPE iid, void** inter) = 0;
   * AGORA_IID_MUSIC_CONTENT_CENTER = 15,
   */
  virtual IMusicContentCenter *getMusicContentCenter() = 0;

  /**
   * @iris_api_id: RtcEngine_getMediaEngine
   * @source: virtual int queryInterface(INTERFACE_ID_TYPE iid, void** inter) = 0;
   * AGORA_IID_MEDIA_ENGINE = 4,
   */
  virtual agora::media::IMediaEngine *getMediaEngine() = 0;

  /**
   * @iris_api_id: RtcEngine_getLocalSpatialAudioEngine
   * @source: virtual int queryInterface(INTERFACE_ID_TYPE iid, void** inter) = 0;
   * AGORA_IID_LOCAL_SPATIAL_AUDIO = 11,
   */
  virtual ILocalSpatialAudioEngine *getLocalSpatialAudioEngine() = 0;

  /**
   * @iris_api_id: RtcEngine_getH265Transcoder
   * @source: virtual int queryInterface(INTERFACE_ID_TYPE iid, void** inter) = 0;
   * AGORA_IID_H265_TRANSCODER = 16,
   */
  virtual IH265Transcoder *getH265Transcoder() = 0;

  /**
   * @iris_api_id: RtcEngine_sendMetaData
   * @source: virtual bool onReadyToSendMetadata(Metadata &metadata, VIDEO_SOURCE_TYPE source_type) = 0;
   */
  virtual int sendMetaData(const IMetadataObserver::Metadata &metadata,
                           VIDEO_SOURCE_TYPE source_type) = 0;

  /**
   * @iris_api_id: RtcEngine_setMaxMetadataSize
   * @source: virtual int getMaxMetadataSize() { return DEFAULT_METADATA_SIZE_IN_BYTE; }
   */
  virtual int setMaxMetadataSize(int size) = 0;

  // ----------------------------- 👆🏻rename API👆🏻 -----------------------------

  // ----------------------------- 👇🏻new API👇🏻 -----------------------------

#ifdef __ELECTRON__
  virtual void destroyRendererByView(view_t view) = 0;

  virtual void destroyRendererByConfig(VIDEO_SOURCE_TYPE sourceType,
                                       const char *channelId = NULL,
                                       uid_t uid = 0) = 0;
#endif


  /**
   * @iris_api_id: RtcEngine_unregisterAudioEncodedFrameObserver
   * @source: virtual int registerAudioEncodedFrameObserver(const AudioEncodedFrameObserverConfig& config,  IAudioEncodedFrameObserver *observer) = 0;
   * add for registerAudioEncodedFrameObserver
   */
  virtual int
  unregisterAudioEncodedFrameObserver(IAudioEncodedFrameObserver *observer) = 0;

  /**
   * @iris_api_id: RtcEngine_getNativeHandle
   * @source: AGORA_API agora::rtc::IRtcEngine* AGORA_CALL createAgoraRtcEngine();
   * add for createAgoraRtcEngine
   */
  virtual intptr_t getNativeHandle() = 0;

  // ----------------------------- 👆🏻new API👆🏻 -----------------------------

  /**
   * @iris_api_id: RtcEngine_preloadChannel_a0779eb
   * @source: virtual int preloadChannel(const char* token, const char* channelId, uid_t uid) = 0;
   */
  virtual int preloadChannel(const char* token, const char* channelId, uid_t uid) = 0;

  /**
   * @iris_api_id: RtcEngine_preloadChannelWithUserAccount_0e4f59e
   * @source: virtual int preloadChannel(const char* token, const char* channelId, const char* userAccount) = 0;
   */
  virtual int preloadChannelWithUserAccount(const char* token, const char* channelId, const char* userAccount) = 0;

  /**
   * @iris_api_id: RtcEngine_takeSnapshot_1922dd1
   * @source: virtual int takeSnapshot(uid_t uid, const char* filePath)  = 0;
   */
  virtual int takeSnapshot(uid_t uid, const char* filePath)  = 0;

  /**
   * @iris_api_id: RtcEngine_takeSnapshot_5669ea6
   * @source: virtual int takeSnapshot(uid_t uid, const agora::media::SnapshotConfig& config)  = 0;
   */
  virtual int takeSnapshotWithConfig(uid_t uid, const agora::media::SnapshotConfig& config)  = 0;
};

} // namespace ext
} // namespace rtc
} // namespace agora
