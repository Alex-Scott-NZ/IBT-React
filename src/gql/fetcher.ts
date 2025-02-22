type FetchOptions = {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

type RequestInit = {
  headers: (HeadersInit & FetchOptions) | FetchOptions;
};

export const fetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit['headers']
) => {
  return async (): Promise<TData> => {
    const { next, cache, ...restOptions } = options || {};
    const endpoint = 'https://backend.saggitari.us/graphql';

    // Log the full query and variables
    console.log('Making GraphQL request:', {
      endpoint,
      variables,
      query, // Log the full query
      options: {
        cache,
        next,
        headers: restOptions,
      },
    });

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...restOptions,
        },
        body: JSON.stringify({ query, variables }),
        next,
        cache,
      });

      // Enhanced error handling for non-OK responses
      if (!res.ok) {
        console.error('Fetch Error:', {
          status: res.status,
          statusText: res.statusText,
        });
        const errorText = await res.text();
        console.error('Error Response:', errorText);
        throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();

      // Log the full response
      console.log('GraphQL Response:', {
        status: res.status,
        hasData: !!json.data,
        hasErrors: !!json.errors,
        data: json.data ? 'Present' : 'None',
        errors: json.errors || 'None',
        fullResponse: json, // Log the full response
      });

      // Log the articlesInJournal field specifically
      if (json.data?.journalIssues?.nodes) {
        json.data.journalIssues.nodes.forEach((issue: any, index: number) => {
          console.log(`Journal Issue ${index + 1}:`, {
            title: issue.title,
            slug: issue.slug,
            articleCount: issue.journalIssueDetails?.articlesInJournal?.nodes?.length || 0,
            articles: issue.journalIssueDetails?.articlesInJournal?.nodes?.map(
              (article: any) => ({
                title: article.title,
                slug: article.slug,
              })
            ),
          });
        });
      }

      if (json.errors) {
        console.error('GraphQL Errors:', json.errors);
        throw new Error(
          `GraphQL Error: ${json.errors.map((e: any) => e.message).join(', ')}`
        );
      }

      return json.data;
    } catch (error) {
      console.error('Fetcher Error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error,
      });
      throw error;
    }
  };
};