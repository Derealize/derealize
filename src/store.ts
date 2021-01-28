import Store from 'electron-store'

// https://json-schema.org/learn/getting-started-step-by-step.html
// https://json-schema.org/understanding-json-schema/reference/string.html#id7
const store = new Store({
  schema: {
    language: {
      type: 'string',
    },
    token: {
      type: 'string',
    },
    repositories: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'object',
        required: ['giturl', 'path'],
        properties: {
          giturl: {
            type: 'string',
          },
          username: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
          path: {
            type: 'string',
          },
        },
      },
    },
  },
})

export default store
