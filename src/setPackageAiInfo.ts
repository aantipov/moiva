import type { KVNamespace } from '@cloudflare/workers-types/experimental';
import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
  ResponseTypes,
} from 'openai-edge';

interface AI_RESPONSE {
  description: string[];
  tags: string[];
  alternatives: string[];
}

export interface KV_AI extends AI_RESPONSE {
  version: number;
  model: string;
  tokensUsed: number | undefined;
  createdAt: string;
}

// Example of AI response:
/** 
{
  "id": "chatcmpl-7PsP6nVoA5A3ngL1XlrXZS2S6pESM",
  "object": "chat.completion",
  "created": 1686401684,
  "model": "gpt-3.5-turbo-0301",
  "usage": {
    "prompt_tokens": 492,
    "completion_tokens": 236,
    "total_tokens": 728
  },
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "{\n    \"description\": [...
      },
      "finish_reason": "stop",
      "index": 0
    }
  ]
}
   */

export async function setPkgAIInfo(
  pkgName: string,
  KV: KVNamespace,
  openAiAPIKey: string
) {
  const version = 1;
  const model = 'gpt-3.5-turbo';
  const configuration = new Configuration({
    apiKey: openAiAPIKey,
    // apiKey: import.meta.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model,
    messages: getMessages(pkgName),
    max_tokens: 900,
    temperature: 1,
  });

  if (!response.ok) {
    throw new Error(
      `[setPkgAIInfo] AI response not ok - network issue: status ${response.status}, statusText ${response.statusText}`
    );
  }
  if (response.status !== 200) {
    throw new Error(
      `[setPkgAIInfo] AI response status not 200 - ${response.status}`
    );
  }

  const data = (await response.json()) as ResponseTypes['createChatCompletion'];

  if (data.choices[0].finish_reason !== 'stop') {
    throw new Error(
      `[setPkgAIInfo] AI didn't finish generating. Finish reason: ${data.choices[0].finish_reason}`
    );
  }
  const contentRaw = data.choices[0].message?.content;
  if (!contentRaw) {
    throw new Error('[setPkgAIInfo] No message content in AI reponse');
  }
  let content: AI_RESPONSE;
  try {
    content = JSON.parse(contentRaw) as AI_RESPONSE;
  } catch (error) {
    throw new Error('[setPkgAIInfo] AI reply is not a valid JSON');
  }
  if (!content.description || !content.tags || !content.alternatives) {
    throw new Error(
      '[setPkgAIInfo] AI reply doesnt match schema - ' + contentRaw
    );
  }

  try {
    await KV.put(
      pkgName,
      JSON.stringify({
        ...content,
        version,
        model: data.model,
        tokensUsed: data.usage?.total_tokens,
        createdAt: new Date().toISOString().slice(0, 10),
      } as KV_AI)
    );
  } catch (error: any) {
    throw new Error(`[setPkgAIInfo] KV.put failed - ${error?.message}`);
  }
  console.log(`[setPkgAIInfo] KV.put success - ${pkgName}`);
}

function getMessages(pkgName: string): ChatCompletionRequestMessage[] {
  return [
    {
      role: 'system',
      content: `
I'm building a website to provide a comprehensive analysis of requested npm package.

It aggregates information from Google Trends, Github, Thoughtworks Tech Radar, Snyk, Bundlephobia, State-of-js report to provide the following information:
- bundle size, 
- npm downloads trends, 
- Google search interest,
- GitHub Stars, 
- License, 
- Contributors activity, 
- Commits per month
- number of dependencies
- age
- security score
- Thoughtworks tech radar blip
- languages used to build the package
- Releases

The information is presented via numbers and charts (a trend over time).

I want to add some textual descriptive information.

You are the endpoint to provide that information : 
- short and concise description outlining the main distinct characteristics. No bullshit, stay objective
- consider comparison with the main alternative solutions

Provide the response as a JSON object:
{
"description": [paragraph1, paragraph2, ...],
"tags": [tag1, tag2, ...],
"alternatives": [npmPackage1, npmPackage2, ...]
}

"alternatives" field contains a list  of npm packages names considered alternatives.

Constraints: 
1. 125 words as a maximum for the whole response.
2. At least 2 paragraphs in a "description" field`,
    },
    {
      role: 'user',
      content: 'Provide information about vue npm package',
    },
    {
      role: 'assistant',
      content: `
        {
          "description": [
          "Vue is a progressive and versatile JavaScript framework used for building user interfaces. It focuses on the view layer and provides high performance with its reactive data binding and fast virtual DOM. Vue is popular for its simplicity, allowing developers to easily switch between plain HTML templates and render functions. It also offers a rich set of components and plugins, making it easy to add functionality to your application.",
          "Compared to other popular frameworks like React and Angular, Vue has a smaller learning curve and is easier to understand and use. Its highly modular architecture also allows you to use Vue in smaller chunks or in combination with other libraries."
          ],
          "tags": [
          "javascript",
          "framework",
          "user-interface",
          "reactive-data-binding",
          "virtual-dom"
          ],
          "alternatives": [
          "react",
          "angular",
          "svelte"
          ]
          }
`,
    },
    {
      role: 'user',
      content: `Provide information about ${pkgName} npm package`,
    },
  ];
}
