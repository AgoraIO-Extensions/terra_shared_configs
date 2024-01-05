export type MergeNodeConfig = {
  source: string;
  target: string;
  deleteSource: boolean;
};

module.exports = [
  {
    source: 'agora::rtc::IRtcEngineEventHandlerEx',
    target: 'agora::rtc::IRtcEngineEventHandler',
    deleteSource: true,
  },
];
