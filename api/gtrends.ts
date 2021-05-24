import { Handler } from '@netlify/functions';
import { repoToGTrendDefMap } from '../src/google-trends.config';
// @ts-ignore
import googleTrends from 'google-trends-api';
import { initSentry, reportError } from '../api-utils';

const defaultStartDateStr = '2017-01-01';

interface QueryParamsT {
  libs: string;
  start: string;
}

initSentry();

const handler: Handler = async (event) => {
  const defaultStartDate = new Date(defaultStartDateStr);
  const today = new Date();
  let startDate = defaultStartDate;
  const {
    libs: repos,
    start,
  } = (event.queryStringParameters as unknown) as QueryParamsT;

  // Validate "start" parameter
  if (start) {
    const customStartDdate = new Date(start as string);

    if (
      isNaN(customStartDdate.getTime()) ||
      customStartDdate < defaultStartDate ||
      customStartDdate >= today
    ) {
      console.error('API GOOGLE TRENDS 1-0: Wrong start parameter', repos);
      reportError(new Error('API GOOGLE TRENDS 1-0: Wrong start parameter'));

      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Wrong start parameter',
          code: 'GOOGLE_TENDS_API_1-0',
        }),
      };
    }

    startDate = customStartDdate;
  }

  // Validate "libs" parameter
  if (!repos || typeof repos !== 'string') {
    console.error('API GOOGLE TRENDS 1: Wrong libs parameter', repos);
    reportError(new Error('API GOOGLE TRENDS 1: Wrong libs parameter'));
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Wrong libs parameter',
        code: 'GOOGLE_TENDS_API_1',
      }),
    };
  }

  const reposIds = repos.split(',').map((repoId) => repoId.toLowerCase());

  // Make sure we have a corresponding keyword value for each repoId
  if (reposIds.some((repoId) => !repoToGTrendDefMap[repoId])) {
    console.error('API GOOGLE TRENDS 2: EXTRA LIB PROVIDED', repos);
    reportError(new Error('API GOOGLE TRENDS 2: EXTRA LIB PROVIDED'));
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Wrong libs parameter',
        code: 'GOOGLE_TENDS_API_2',
      }),
    };
  }

  // Make sure the provided value doesn't exceed 5
  if (reposIds.length > 5) {
    console.error('API GOOGLE TRENDS 3: TOO MANY LIBS PROVIDED', repos);
    reportError(new Error('API GOOGLE TRENDS 3: TOO MANY LIBS PROVIDED'));
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Wrong libs parameter',
        code: 'GOOGLE_TENDS_API_3',
      }),
    };
  }

  const keywords = reposIds.map((repoId) => repoToGTrendDefMap[repoId].keyword);

  try {
    const results = await googleTrends.interestOverTime({
      keyword: keywords,
      startTime: startDate,
      category: 31, // Programming
    });

    return {
      statusCode: 200,
      body: JSON.stringify(JSON.parse(results).default),
      headers: {
        'Cache-Control': 'no-cache',
      },
    };
  } catch (e) {
    console.error('API GOOGLE TRENDS: SOMETHING WENT WRONG', e);
    reportError(e);

    return {
      statusCode: (e.response && e.response.status) || 500,
      body: JSON.stringify({
        error: 'Something went wrong',
        msg: JSON.stringify(e.message),
      }),
    };
  }
};

export { handler };
