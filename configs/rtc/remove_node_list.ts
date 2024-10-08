module.exports = [
  'AgoraOptional.h',
  'AgoraRefPtr.h',
  'agora::rtc::',
  'agora::media::',
  'agora::media::base::',
  'agora::util::AutoPtr',
  'agora::util::CopyableAutoPtr',
  'agora::util::IString',
  'agora::util::IIterator',
  'agora::util::IContainer',
  'agora::util::AOutputIterator',
  'agora::util::AList',
  'agora::base::IParameterEngine',
  'agora::media::base::IVideoFrameObserver',
  'agora::media::base::IAudioFrameObserver',
  'agora::media::base::IMediaPlayerCustomDataProvider',
  'agora::UserInfo',
  'agora::RefCountInterface',
  'RefCountInterface',
  'agora::base::IEngineBase',
  'agora::base::AParameter',
  'agora::rtc::IMediaPlayerCustomDataProvider',
  'agora::rtc::IMediaPlayerSource',
  'agora::rtc::IPacketObserver',
  'agora::base::LicenseCallback',
  'agora::media::ISnapshotCallback',
  'agora::commons::ILogWriter',
  'agora::rtc::IMediaStreamingSource',
  'agora::rtc::IMediaStreamingSourceObserver',
  'agora::rtc::IAudioDeviceCollection',
  'agora::rtc::IVideoDeviceCollection',
  'agora::rtc::IScreenCaptureSourceList',
  'agora::rtc::AAudioDeviceManager',
  'agora::rtc::AVideoDeviceManager',
  'agora::rtc::IRtcEngineParameter',
  'agora::base::IAgoraParameter',
  'agora::rtc::IRhythmPlayer',
  'agora::rtc::LocalSpatialAudioConfig',
  'agora::media::base::MAX_METADATA_SIZE_TYPE',
  'agora::media::base::VIDEO_SOURCE_TYPE',
  'operator==',
  'operator!=',
  'operator=',
  'operator>',
  'operator<',
  'Optional',
  'agora::rtc::EncodedVideoTrackOptions.SetFrom',
  'agora::rtc::ChannelMediaOptions.SetAll',
  'agora::rtc::DirectCdnStreamingMediaOptions.SetAll',
  'agora::rtc::EncryptionConfig:getEncryptionString',
  'agora::media::IMediaEngine.addVideoFrameRenderer',
  'agora::media::IMediaEngine.removeVideoFrameRenderer',
  'agora::rtc::IRtcEngine.queryInterface',
  'agora::rtc::IRtcEngine.registerPacketObserver',
  'agora::rtc::IRtcEngineEventHandler.eventHandlerType',
  'agora::rtc::IRtcEngineEventHandlerEx.eventHandlerType',
  'agora::rtc::IRtcEngineEventHandlerEx.onFirstLocalVideoFrame',
  'agora::rtc::IRtcEngineEventHandlerEx.onLocalVideoStateChanged',
  'agora::rtc::IMediaPlayer.initialize',
  'agora::rtc::IMediaPlayer.openWithCustomSource',
  'agora::rtc::IMetadataObserver.getMaxMetadataSize',
  'agora::rtc::IMetadataObserver.onReadyToSendMetadata',
  'agora::rtc::IRhythmPlayer.initialize',
  'agora::rtc::IRhythmPlayer.getRhythmPlayerTrack',
  'agora::media::IAudioFrameObserverBase.onPlaybackAudioFrameBeforeMixing',
  'agora::media::IAudioFrameObserverBase.getObservedAudioFramePosition',
  'agora::media::IAudioFrameObserverBase.getPlaybackAudioParams',
  'agora::media::IAudioFrameObserverBase.getPublishAudioParams',
  'agora::media::IAudioFrameObserverBase.getRecordAudioParams',
  'agora::media::IAudioFrameObserverBase.getMixedAudioParams',
  'agora::media::IAudioFrameObserverBase.getEarMonitoringAudioParams',
  'agora::media::IVideoFrameObserver.getVideoFrameProcessMode',
  'agora::media::IVideoFrameObserver.getVideoFormatPreference',
  'agora::media::IVideoFrameObserver.getRotationApplied',
  'agora::media::IVideoFrameObserver.getMirrorApplied',
  'agora::media::IVideoFrameObserver.getObservedFramePosition',
  'agora::media::IVideoFrameObserver.isExternal',
  'agora::rtc::IMediaPlayer.setPlayerOption',
  'agora::rtc::IMediaPlayer.getPlayerOption',
  'agora::rtc::IMusicPlayer.open',
  'agora::rtc::RtcEngineContext.context',
  'agora::rtc::RtcEngineContext.eventHandler',
  'agora::media::base::ExternalVideoFrame.eglContext',
  'agora::media::base::ExternalVideoFrame.d3d11_texture_2d',
  'agora::media::base::VideoFrame.sharedContext',
  'agora::media::base::VideoFrame.d3d11Texture2d',
  'agora::media::base::MediaSource.provider',
  'agora::rtc::MusicContentCenterConfiguration.eventHandler',
  'agora::rtc::IAudioDeviceManager.getPlaybackDeviceInfo.deviceId',
  'agora::rtc::IAudioDeviceManager.getPlaybackDeviceInfo.deviceName',
  'agora::rtc::IAudioDeviceManager.getPlaybackDeviceInfo.deviceTypeName',
  'agora::rtc::IAudioDeviceManager.getRecordingDeviceInfo.deviceId',
  'agora::rtc::IAudioDeviceManager.getRecordingDeviceInfo.deviceName',
  'agora::rtc::IAudioDeviceManager.getRecordingDeviceInfo.deviceTypeName',
  'agora::rtc::IRtcEngineEx.joinChannelEx.eventHandler',
  'agora::rtc::IRtcEngine.joinChannelWithUserAccountEx.eventHandler',
  'agora::rtc::IRtcEngine.getVersion.build',
  'agora::rtc::IRtcEngine.takeSnapshot.callback',
  'agora::rtc::ICloudSpatialAudioEngine.getTeammates.uids',
  'agora::rtc::ICloudSpatialAudioEngine.getTeammates.userCount',
  'agora::rtc::ILocalSpatialAudioEngine.initialize.config',
];
