import type { KVNamespace } from '@cloudflare/workers-types/experimental';
import { Configuration, OpenAIApi, ResponseTypes } from 'openai-edge';
/**
 *  We should allow Google to index pages with 1 or 2 npm packages only
 *
 * @param npmPackages
 * @param reposIds
 * @returns {boolean}
 */
export function isSEOPage(npmPackages: string[], reposIds: string[]): boolean {
  return (
    (npmPackages.length === 1 || npmPackages.length === 2) && !reposIds.length
  );
}

export function getSEOTitle(npmPackages: string[]): string {
  if (npmPackages.length === 0) {
    return 'NPM Packages Comparison | Performance, Security & Trends';
  } else if (npmPackages.length === 1) {
    return `${npmPackages[0]} NPM Package: Comprehensive Analysis, Alternatives, and Usage Statistics | Moiva.io`;
  } else {
    return `${npmPackages.join(
      ' vs '
    )}: Detailed NPM Packages Comparison | Performance, Security & Trends`;
  }
}

export function getSEODescription(npmPackages: string[]): string {
  if (npmPackages.length === 0) {
    return `Compare NPM packages and make informed decisions. Explore detailed statistics like NPM downloads, Github star trends, Google search interest, and more. Empower your tech stack decisions with data-driven insights.`;
  } else if (npmPackages.length === 1) {
    return `Explore our in-depth analysis of the ${npmPackages[0]} NPM package. Discover its distinct features, use-cases, alternatives, and comprehensive comparison metrics. Explore detailed statistics like NPM downloads, Github star trends, Google search interest, and more.`;
  } else {
    return `In-depth comparison of ${npmPackages
      .slice(0, -1)
      .join(', ')} and ${npmPackages.at(
      -1
    )} npm packages, offering insights on bundle size, download trends, Google search interest, GitHub Stars, license, contributors activity, security scores, tech radar blips, and more. Empower your tech stack decisions with data-driven insights.`;
  }
}

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

export async function setPkgAIInfo(pkgName: string, KV: KVNamespace) {
  const version = 1;
  const model = 'gpt-3.5-turbo';
  const configuration = new Configuration({
    apiKey: import.meta.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model,
    messages: [
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
    ],
    max_tokens: 900,
    temperature: 1,
  });

  const data = (await response.json()) as ResponseTypes['createChatCompletion'];
  // response format
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

  const content = data.choices[0].message?.content;
  const result = (() => {
    try {
      if (!content) {
        return null;
      }
      const obj = JSON.parse(content) as AI_RESPONSE;
      if (
        !obj.description ||
        !obj.tags ||
        !obj.alternatives ||
        data.choices[0].finish_reason !== 'stop'
      ) {
        return null;
      }
      return obj;
    } catch (e) {
      return null;
    }
  })();
  if (result) {
    await KV.put(
      pkgName,
      JSON.stringify({
        ...result,
        version,
        model: data.model,
        tokensUsed: data.usage?.total_tokens,
        createdAt: new Date().toISOString().slice(0, 10),
      } as KV_AI)
    );
    console.log('AI response saved to KV', pkgName);
  } else {
    console.log('AI generation failed', pkgName);
  }
}
