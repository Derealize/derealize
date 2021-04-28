import Store from 'electron-store'

// https://json-schema.org/learn/getting-started-step-by-step.html
// https://json-schema.org/understanding-json-schema/reference/string.html#id7
const store = new Store({
  name: 'store',
  schema: {
    settings: {
      type: 'object',
      properties: {
        language: {
          type: 'string',
        },
      },
    },
    jwt: {
      type: 'string',
    },
    barWidth: {
      type: 'number',
      minimum: 10,
    },
    projects: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'object',
        required: ['url', 'path', 'name', 'editedTime'],
        properties: {
          url: {
            type: 'string',
          },
          path: {
            type: 'string',
          },
          editedTime: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          page: {
            type: 'string',
          },
          lunchUrl: {
            type: 'string',
          },
          username: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
          isOpened: {
            type: 'boolean',
          },
          tailwindVersion: {
            type: 'string',
          },
        },
      },
    },
  },
})

export default store
