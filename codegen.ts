import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://backend.saggitari.us/graphql',
  documents: 'src/app/graphql/queries/**/*.gql',
  generates: {
    'src/gql/gql-generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
        {
          add: {
            content: `
            type FetchOptions = {
              cache?: RequestCache;
              next?: NextFetchRequestConfig;
            };
            type RequestInit = {
              headers: (HeadersInit & FetchOptions) | FetchOptions;
            };`,
          },
        },
      ],
      config: {
        // Needed to support the updated React Query 5 API
        reactQueryVersion: 5,
        legacyMode: false,
        exposeFetcher: true,
        exposeQueryKeys: true,
        addSuspenseQuery: true,
        // Allows us to specify a custom fetcher function that will leverage
        // Next.js caching fetaures within our generated query hooks.
        fetcher: './fetcher#fetcher',
        dedupeFragments: true,
        inlineFragments: 'combine',
        exportFragmentSpreadSubTypes: true,
        useTypeImports: true,
      },
    },
    // Add a new output file for fragment types
    'src/gql/fragment-types.ts': {
      plugins: ['fragment-matcher'],
    },
    'src/gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: { unmaskFunctionName: 'getFragmentData' }
      },
      config: {
        useTypeImports: true,
        dedupeFragments: true,
        defaultScalarType: 'unknown',
        skipTypename: false,
        enumsAsTypes: true,
        avoidOptionals: false,
      }
    },
  },
};

export default config;
