import * as fs from 'fs';

import { HttpsProxyAgent } from 'https-proxy-agent';
import openai, { ClientOptions } from 'openai';

let _openAIClient: openai | undefined = undefined;
function openAIClient(): openai {
  if (_openAIClient === undefined) {
    let configuration: ClientOptions = {
      apiKey: process.env.OPENAI_API_KEY,
    };
    if (process.env.environment !== 'production') {
      configuration.httpAgent = new HttpsProxyAgent(
        process.env.https_proxy ?? ''
      );
    }
    _openAIClient = new openai(configuration);
  }
  return _openAIClient;
}

export async function askGPT(prompt: string): Promise<string> {
  const completion: openai.Chat.ChatCompletion =
    await openAIClient().chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      top_p: 0.8,
    });

  let response: any | undefined = undefined;
  try {
    // We can only make a synchronous call inside terra at this time, but in this way the completions API returns a string, so we need to
    // do some tricky thing here.
    if (completion !== undefined && typeof completion === 'string') {
      let completionStr = completion as string;
      if (completionStr.length > 0) {
        response = JSON.parse(completionStr);
      }
    } else if (typeof completion === 'object' && completion !== null) {
      response = completion;
    } else {
      console.log('Param is neither a string nor an object');
    }
  } catch (error) {
    console.error(error);
  }

  let res = response?.choices[0]?.message?.content ?? '';

  return res;
}

// 生成嵌入
async function generateEmbeddings(text: string) {
  const embedding = await openAIClient().embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return embedding;
}
