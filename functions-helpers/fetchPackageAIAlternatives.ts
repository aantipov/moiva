import OpenAI from 'openai';
import { z } from 'zod';

export const AI_ALTERNATIVES_VERSION = 1.0;

const successSchema = z.array(
  z.tuple([
    z.string(), // npm package name
    z.string(), // version
    z.union([
      z.literal(0.1),
      z.literal(0.2),
      z.literal(0.3),
      z.literal(0.4),
      z.literal(0.5),
      z.literal(0.6),
      z.literal(0.7),
      z.literal(0.8),
      z.literal(0.9),
    ]), // distance. How close the package is to the input package. 0.1 - very close, 0.9 - very far
    z.string(), // last published date
  ]),
); // Example: [ ["preact", "10.11.1", 0.2, "2023-02-01"], ["inferno", "7.4.11", 0.3, "2023-01-08"]]

type AlternativesDataT = z.infer<typeof successSchema>;

export interface AlternativesObjectT {
  version: number;
  model: string;
  data: AlternativesDataT;
  usage: OpenAI.ChatCompletion.Usage;
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

const ERR_PREFIX = '[fetchPkgAIAlternatives] ';

export async function fetchPkgAIAlternatives(
  pkgName: string,
  openAiAPIKey: string,
): Promise<AlternativesObjectT> {
  const openai = new OpenAI({ apiKey: openAiAPIKey });
  let response: OpenAI.ChatCompletion;

  let alternativesResponse: OpenAI.ChatCompletion.Choice;
  try {
    response = await openai.chat.completions.create({
      messages: getMessages(pkgName),
      model: 'gpt-4-1106-preview',
      response_format: { type: 'json_object' },
      temperature: 0,
      max_tokens: 1200,
    });
    alternativesResponse = response.choices[0];
  } catch (error) {
    throw new Error(
      `${ERR_PREFIX} openai.chat.completions.create failed - ${error?.message}`,
      { cause: error },
    );
  }

  if (alternativesResponse.finish_reason !== 'stop') {
    throw new Error(
      `${ERR_PREFIX} AI didn't finish generating. Finish reason: ${alternativesResponse.finish_reason}`,
    );
  }

  let alternatives;
  try {
    alternatives = JSON.parse(alternativesResponse.message.content || '{}');
  } catch (error) {
    throw new Error(`${ERR_PREFIX} AI reply is not a valid JSON`);
  }

  if (alternatives.error) {
    throw new Error(`${ERR_PREFIX} AI error - ${alternatives.error}`);
  }

  const validationRes = successSchema.safeParse(alternatives?.data);

  if (!validationRes.success) {
    throw new Error(
      `${ERR_PREFIX} AI reply doesnt match schema - ${JSON.stringify(
        validationRes.error,
      )}`,
    );
  }

  return {
    version: AI_ALTERNATIVES_VERSION,
    model: response.model,
    data: validationRes.data,
    usage: response.usage,
    createdAt: new Date(response.created * 1000).toISOString().slice(0, 10),
  };
}

function getMessages(pkgName: string): OpenAI.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `
  You are an AI assistant designed to provide alternative npm packages based on a given npm package input, using your existing knowledge.
  
  Important: Alternatives and the input package should fall into the same category, such as "date-fns" and "moment".

  Your response must adhere to these guidelines:
  
  1. Format: JSON.
  2. Content: List up to 10 alternative npm packages with these details for each:
     - Package name (string).
     - Latest stable release version (string) based on accurate, current data.
     - "Distance" parameter (float, 0.1 to 0.9) indicating similarity to the input package.
     - Date of the last stable version's release (string), verified for accuracy.
  3. Structure: Each alternative package's information should be an array in this order: [name, version, distance, release date]. For example: ["vue", "3.2.2", 0.7, "2023-03-19"].
  4. Exclusions:
     - Exclude packages not recognized within your existing knowledge.
     - Exclude packages whose last stable versions were published before "2022-01-01", based on your existing knowledge.
  5. Prioritization Criteria. Focus on, as per your existing knowledge:
     - Recent trends and popularity (focus on recent GitHub stars and npm weekly downloads).
     - Active maintenance.
     - Low "distance" values.
  
  Important:
  - Use Existing Knowledge: Rely on the knowledge you have. Real-time verification of data is not required.
  - Verify the Existence and Accuracy: Before including a package in your response, verify its existence on npm and the correctness of the version and release date.
  - Updated Information: Use only the most recent and reliable sources for package information.
  
  Trendiness Emphasis:
  - Prioritize newer packages gaining popularity rapidly.
  - Consider the growth rate in stars and downloads, not just total numbers.
  - Pay attention to community buzz and recent mentions in developer forums and articles.

  Distance Interpretation:
  - "Distance" (float, 0.1 to 0.9) indicates similarity to the input package.
  - Lower values (closer to 0.1) mean closer similarity.
  - Higher values (closer to 0.9) mean less similarity.
  
  Distance Calculation:
  When calculating the "distance" parameter, consider the following:
     - APIs and functionality: How similar the package's features and APIs are to the input package.
     - Popularity: Recent GitHub stars and npm weekly downloads.
     - Intended Application Size: Usability in small, mid-sized, or enterprise applications.

  Valid Response Example:
  {
    "data": [
      ["vue", "3.2.2", 0.7, "2023-03-19"],
      ...
    ]
  }
  
  Incorrect Response Examples: 
  {
    "data": [
      ...
      ["datejs", "1.0.0-rc3", 0.5, "2022-01-22"] // Incorrect: "datejs" was last published in 2014, not 2022.
      ...
    ]
  }

  {
    "data": [
      ...
      ["twix.js", "1.3.0", 0.4, "2022-02-28"], // Incorrect: "twix.js" is a non-existing npm package
      ...
    ]
  }
  
  Note 1: Accuracy in package data is crucial. Double-check for the existence of packages and the correctness of their details.
  
  Note 2: Be precise in calculating the "distance" based on the outlined factors.
  
  Note 3: Ensure the trendiness and recent popularity of packages.
  `,
    },
    { role: 'user', content: `react` },
    {
      role: 'assistant',
      content: `
      {
        "data": [
          ["preact", "10.11.1", 0.2, "2023-03-15"],
          ["inferno", "7.4.11", 0.3, "2023-02-18"],
          ["vue", "3.2.37", 0.6, "2023-03-07"],
          ["svelte", "3.49.0", 0.5, "2023-03-14"],
          ["lit", "2.2.7", 0.4, "2023-03-22"],
          ["alpinejs", "3.10.3", 0.7, "2023-03-27"],
          ["solid-js", "1.4.1", 0.3, "2023-03-11"],
          ["mithril", "2.0.4", 0.5, "2023-01-05"],
          ["hyperapp", "2.0.15", 0.6, "2023-02-11"],
          ["riot", "6.0.4", 0.6, "2023-01-10"]
        ]
      }
    `,
    },
    { role: 'user', content: `date-fns` },
    {
      role: 'assistant',
      content: `
      {
        "data": [
          ["dayjs", "1.11.5", 0.2, "2023-02-17"],
          ["luxon", "2.4.0", 0.3, "2023-01-22"],
          ["moment", "2.29.4", 0.4, "2022-01-21"],
          ["js-joda", "3.2.0", 0.5, "2022-03-29"],
          ["chrono-node", "2.4.1", 0.6, "2022-12-12"],
          ["spacetime", "7.3.0", 0.5, "2022-11-01"],
          ["date-and-time", "2.0.1", 0.4, "2022-04-29"],
          ["ms", "3.0.0", 0.7, "2022-11-07"],
          ["dateformat", "5.0.3", 0.5, "2022-12-15"],
          ["timeago.js", "4.0.2", 0.6, "2022-01-29"]
        ]
      }
      `,
    },
    { role: 'user', content: `${pkgName}` },
  ];
}
