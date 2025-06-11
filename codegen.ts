import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://backend.saggitari.us/graphql',
  documents: 'src/app/graphql/queries/**/*.gql',
  generates: {
    'src/gql/gql-generated.ts': {
      plugins: [
        {
          add: {
            content: '/* eslint-disable */'
          }
        },
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        reactQueryVersion: 5,
        legacyMode: false,
        exposeFetcher: true,
        exposeQueryKeys: true,
        addSuspenseQuery: true,
        fetcher: {
          func: './fetcher#fetcher',
          isReactHook: false, // Add this
        },
        useTypeImports: false,
        dedupeFragments: true,
        skipTypename: false,
        enumsAsTypes: true,
      },
    },
  },
};

export default config;