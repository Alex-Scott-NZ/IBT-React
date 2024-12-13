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
    
    // Enhanced request logging
    console.log('Making GraphQL request:', {
      endpoint,
      variables,
      query: query.slice(0, 100) + '...', // Truncate long queries
      options: {
        cache,
        next,
        headers: restOptions
      }
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
      
      // Enhanced response logging
      console.log('GraphQL Response:', {
        status: res.status,
        hasData: !!json.data,
        hasErrors: !!json.errors,
        data: json.data ? 'Present' : 'None',
        errors: json.errors || 'None'
      });

      if (json.errors) {
        console.error('GraphQL Errors:', json.errors);
        throw new Error(
          `GraphQL Error: ${json.errors.map((e: any) => e.message).join(', ')}`
        );
      }
// Right before returning the data:
console.log('Raw GraphQL Response:', {
  fullData: json.data,
  article: json.data?.article,
  typename: json.data?.article?.__typename
});
      return json.data;
    } catch (error) {
      console.error('Fetcher Error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error
      });
      throw error;
    }
  };
};
