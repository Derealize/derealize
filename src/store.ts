import Store from 'electron-store'

// https://json-schema.org/learn/getting-started-step-by-step.html
// https://json-schema.org/understanding-json-schema/reference/string.html#id7
const store = new Store({
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
    projects: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'object',
        required: ['url', 'path'],
        properties: {
          url: {
            type: 'string',
          },
          path: {
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
          editedTime: {
            type: 'string',
          },
        },
      },
    },
  },
})

export default store
