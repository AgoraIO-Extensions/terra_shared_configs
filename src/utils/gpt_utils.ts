import OpenAI from "openai";

let _openAIClient: OpenAI | undefined = undefined;
function openAIClient(): OpenAI {
    if (_openAIClient === undefined) {
        _openAIClient = new OpenAI();
    }
    return _openAIClient;
}

/// Make sure you add the following environment variables before you call this function
/// - OPENAI_API_KEY
/// - OPENAI_BASE_URL
export async function askGPT(prompt: string): Promise<string> {
    console.log(`prompt:`);
    console.log(prompt);

    const completion: OpenAI.Chat.ChatCompletion = (await openAIClient().chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    }));

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

    console.log(`response:`);
    console.log(res);

    return res;
}