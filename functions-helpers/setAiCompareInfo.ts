import type { KVNamespace } from '@cloudflare/workers-types/experimental';
import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
  ResponseTypes,
} from 'openai-edge';
import type { KvAiCompareT, AiCompareResponseT } from '@/shared-types';

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

/**
 * Generate a comparison for the two requested packages and save it in a KV store
 * The packages provided should be sorted alphabetically
 *
 * @param pkgName1
 * @param pkgName2
 * @param KV
 * @param openAiAPIKey
 */
export async function setAICompareInfo(
  pkgName1: string,
  pkgName2: string,
  KV: KVNamespace,
  openAiAPIKey: string
) {
  const version = 1.0;
  const model = 'gpt-3.5-turbo';
  const configuration = new Configuration({ apiKey: openAiAPIKey });
  const openai = new OpenAIApi(configuration);
  let data;
  try {
    const response = await openai.createChatCompletion({
      model,
      messages: getMessages(pkgName1, pkgName2),
      max_tokens: 900,
      temperature: 0.1,
    });
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: status ${response.status}, statusText ${response.statusText}`
      );
    }
    data = (await response.json()) as ResponseTypes['createChatCompletion'];
  } catch (error: any) {
    throw new Error(
      `[setAICompareInfo] error fetching AI data: ${error.message}`
    );
  }

  if (data.choices[0].finish_reason !== 'stop') {
    throw new Error(
      `[setAICompareInfo] AI didn't finish generating. Finish reason: ${data.choices[0].finish_reason}`
    );
  }

  const contentRaw = data.choices[0].message?.content;
  if (!contentRaw) {
    throw new Error('[setAICompareInfo] No message content in AI reponse');
  }

  let content: AiCompareResponseT;
  try {
    content = JSON.parse(contentRaw) as AiCompareResponseT;
  } catch (error) {
    throw new Error('[setAICompareInfo] AI reply is not a valid JSON');
  }
  if ('notFound' in content && content.notFound !== true) {
    throw new Error(
      '[setAICompareInfo] AI reply doesnt match schema - ' + contentRaw
    );
  }
  if (
    !('notFound' in content) &&
    (!Array.isArray(content) ||
      content.length === 0 ||
      !content.every(
        (item) =>
          typeof item.title === 'string' && typeof item.description === 'string'
      ))
  ) {
    throw new Error(
      '[setAICompareInfo] AI reply doesnt match schema - ' + contentRaw
    );
  }
  try {
    const kvData: KvAiCompareT = {
      data: content,
      version,
      model: data.model,
      tokensUsed: data.usage?.total_tokens,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    await KV.put(`${pkgName1}_vs_${pkgName2}`, JSON.stringify(kvData), {
      expirationTtl:
        'notFound' in content ? 60 * 60 * 24 * 7 : 60 * 60 * 24 * 90,
    });
  } catch (error: any) {
    throw new Error(`[setAICompareInfo] KV.put failed - ${error?.message}`);
  }
}

function getMessages(
  pkgName1: string,
  pkgName2: string
): ChatCompletionRequestMessage[] {
  return [
    {
      role: 'system',
      content: `
      You should provide a concise but comprehensive comparison of two requested npm packages, highlighting their strengths and weaknesses and considering different perspectives like popularity, scalability, performance, developer experience, etc.

      The goal of this comparison is to help a developer decide which library suits their project.
      
      Be careful, don't mention information that might already be outdated because your knowledge is limited by the 2021 year, for example, the number of Github stars.
      
      Provide your answer as a JSON object.
      There might be two scenarios.
      // What if libraries are not comparable???
      1. If you don't have enough information to provide proper comparison, then your answer should be:
      {
          "notFound": true
      }
      2. If you can provide the proper comparison, then your answer should be a list of sections, each with a title and a description:
      [ 
      {
        title: <section name>,
        description: <contents for the section>
      },
      {
      ...
      }
      ]
`,
    },
    {
      role: 'user',
      content: 'compare two npm packages, "moment" and "date-fns"',
    },
    {
      role: 'assistant',
      content: `
      [
        {
          "title": "Popularity",
          "description": "Moment has been around for longer and was historically more popular than Date-fns, but in recent years Date-fns has gained a lot of traction and popularity in the JavaScript community. Both packages are widely used and have a large following."
        },
        {
          "title": "Size",
          "description": "Date-fns is a collection of individual modules, so it's more modular and lightweight. Moment, on the other hand, has a larger code base and is considered to be less performant than Date-fns."
        },
        {
          "title": "Flexibility",
          "description": "Date-fns is more flexible and can be easily integrated with other libraries and frameworks. It also works with tree-shaking so you can import only the modules you need. Moment, on the other hand, is not very modular and requires you to import the whole library."
        },
        {
          "title": "Functionality",
          "description": "Both libraries provide a rich set of features and functionalities. Moment is slightly more feature-rich and provides more configuration options than Date-fns. However, for most use cases, Date-fns provides enough functionality and is a more lightweight option."
        },
        {
          "title": "Development experience",
          "description": "Date-fns provides a more modern and ergonomic API, and can work with both JavaScript and TypeScript, while Moment follows a more traditional, object-oriented, and mutable API style. Date-fns also provides better type support and has better documentation than Moment."
        },
        {
          "title": "Maintenance",
          "description": "Both libraries are actively maintained by their respective communities. However, Moment has seen some criticism for its large size, performance issues, and lack of updates. Date-fns is more structured, modular, and well-maintained, which makes it more future-proof and easier to maintain in the long run."
        }
      ]
`,
    },
    {
      role: 'user',
      content: `compare two npm packages, "react" and "some-unknown-npm-package"`,
    },
    {
      role: 'assistant',
      content: `
      {
        "notFound": true
      }
      `,
    },
    {
      role: 'user',
      content: `compare two npm packages, "${pkgName1}" and "${pkgName2}"`,
    },
  ];
}
