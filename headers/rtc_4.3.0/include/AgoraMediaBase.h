//
//  Agora Engine SDK
//
//  Created by Sting Feng in 2017-11.
//  Copyright (c) 2017 Agora.io. All rights reserved.

#pragma once  // NOLINT(build/header_guard)

#include "AgoraMediaCommonBase.h"

namespace agora {
namespace rtc {
struct EncodedVideoFrameInfo;
}
namespace media {
struct UserAudioSpectrumInfo : public UserAudioSpectrumInfoBase  {
  /**
   * User ID of the speaker.
   */
  agora::rtc::uid_t uid;

  UserAudioSpectrumInfo() : uid(0) {}
  UserAudioSpectrumInfo(agora::rtc::uid_t uid, const float* data, int length) 
      : UserAudioSpectrumInfoBase(data, length), uid(uid) {}
};

class IAudioSpectrumObserver : virtual public IAudioSpectrumObserverBase {
 public:
  /**
   * Reports the audio spectrum of remote user.
   *
   * This callback reports the IDs and audio spectrum data of the loudest speakers at the moment
   * in the channel.
   *
   * You can set the time interval of this callback using \ref ILocalUser::enableAudioSpectrumMonitor "enableAudioSpectrumMonitor".
   *
   * @param spectrums The pointer to \ref agora::media::UserAudioSpectrumInfo "UserAudioSpectrumInfo", which is an array containing
   * the user ID and audio spectrum data for each speaker.
   * - This array contains the following members:
   *   - `uid`, which is the UID of each remote speaker
   *   - `spectrumData`, which reports the audio spectrum of each remote speaker.
   * @param spectrumNumber The array length of the spectrums.
   * - true: Processed.
   * - false: Not processed.
   */
  virtual bool onRemoteAudioSpectrum(const UserAudioSpectrumInfo* spectrums, unsigned int spectrumNumber) = 0;
};

class IAudioFrameObserver : public IAudioFrameObserverBase {
 public:
  using IAudioFrameObserverBase::onPlaybackAudioFrameBeforeMixing;
  /**
   * Occurs when the before-mixing playback audio frame is received.
   * @param channelId The channel name
   * @param uid ID of the remote user.
   * @param audioFrame The reference to the audio frame: AudioFrame.
   * @return
   * - true: The before-mixing playback audio frame is valid and is encoded and sent.
   * - false: The before-mixing playback audio frame is invalid and is not encoded or sent.
   */
  virtual bool onPlaybackAudioFrameBeforeMixing(const char* channelId, rtc::uid_t uid, AudioFrame& audioFrame) = 0;
};

/**
 * The IVideoFrameObserver class.
 */
class IVideoFrameObserver : virtual public IVideoFrameObserverBase {
 public:
  virtual ~IVideoFrameObserver() {}

  /**
   * Occurs each time the SDK receives a video frame sent by the remote user.
   *
   * After you successfully register the video frame observer, the SDK triggers this callback each time a
   * video frame is received. In this callback, you can get the video data sent by the remote user. You
   * can then post-process the data according to your scenarios.
   *
   * After post-processing, you can send the processed data back to the SDK by setting the `videoFrame`
   * parameter in this callback.
   * 
   * @note This callback does not support sending processed RGBA video data back to the SDK.
   *
   * @param channelId The channel name
   * @param remoteUid ID of the remote user who sends the current video frame.
   * @param videoFrame A pointer to the video frame: VideoFrame
   * @return Determines whether to ignore the current video frame if the post-processing fails:
   * - true: Do not ignore.
   * - false: Ignore, in which case this method does not sent the current video frame to the SDK.
   */
  virtual bool onRenderVideoFrame(const char* channelId, rtc::uid_t remoteUid, VideoFrame& videoFrame) = 0;
};

/**
 * The IVideoEncodedFrameObserver class.
 */
class IVideoEncodedFrameObserver {
 public:
  /**
   * Occurs each time the SDK receives an encoded video image.
   * @param uid The user id of remote user.
   * @param imageBuffer The pointer to the video image buffer.
   * @param length The data length of the video image.
   * @param videoEncodedFrameInfo The information of the encoded video frame: EncodedVideoFrameInfo.
   * @return Determines whether to accept encoded video image.
   * - true: Accept.
   * - false: Do not accept.
   */
  virtual bool onEncodedVideoFrameReceived(rtc::uid_t uid, const uint8_t* imageBuffer, size_t length,
                                           const rtc::EncodedVideoFrameInfo& videoEncodedFrameInfo) = 0;

  virtual ~IVideoEncodedFrameObserver() {}
};

}  // namespace media
}  // namespace agora
