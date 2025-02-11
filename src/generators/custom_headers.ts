import { Diff } from '../utils/diff';
import { askGPT } from '../utils/gpt_utils';

const prompt = `
You are a C++ Code Inspector. Your task is to rename within some given C++ methods.
You should reply shortly and no need to explain the code.
You should provide all the methods in the same reply.
The first method is no need to change, but the left methods need to be renamed.
Given method:
\`\`\`c++
{{ METHOD_SOURCE }}
\`\`\`
`;

let methodSource = `
  virtual int joinChannel(const char* token, const char* channelId, const char* info, uid_t uid) = 0;
  virtual int joinChannel(const char* token, const char* channelId, uid_t uid, const ChannelMediaOptions& options) = 0;
`;

const prompt2 = `
You are a file diff tool. Your task is to compare two versions of a C++ code.
I will provide you a diff result of two versions of a C++ code that is from bash command \`diff -r -u -N\`.
Given diff result:
{{ DIFF_SOURCE }}


Now, you need to provide a summary of the changes between the two versions.
`;

const old_version = 'rtc_4.4.0';
const new_version = 'rtc_4.5.0';

const old_version_path = `headers/${old_version}/include`;
const new_version_path = `headers/${new_version}/include`;
const blackList = ['include/rte_base', 'include/internal'];

const diffTool = new Diff(old_version_path, new_version_path, blackList);
diffTool.setOutputDirectory(`temp/${old_version}↔${new_version}`);
diffTool.run();

let promptWithMethod = prompt
  .replace('{{ METHOD_SOURCE }}', methodSource)
  .trim();

// let promptWithDiff = prompt
//   .replace(
//     '{{ DIFF_SOURCE }}',
//     fs.readFileSync(
//       `temp/${old_version}↔${new_version}/AgoraBase.h.diff`,
//       'utf8'
//     )
//   )
//   .trim();

// (async () => {
//   // let res = await askGPT(promptWithMethod);
//   let res = await askGPT(promptWithDiff);
//   console.log(res);
// })();
