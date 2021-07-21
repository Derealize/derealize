import Store from 'electron-store'
import { JSONSchema } from 'json-schema-typed'

const withRuntime = process.env.WITH_RUNTIME === 'true'

// https://json-schema.org/learn/getting-started-step-by-step.html
// https://json-schema.org/understanding-json-schema/reference/string.html#id7

const projectItems: JSONSchema = {
  type: 'object',
  required: ['id', 'path', 'name', 'editedTime'],
  properties: {
    id: {
      type: 'string',
    },
    path: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    editedTime: {
      type: 'string',
    },
    tailwindVersion: {
      type: 'string',
    },
  },
}

const projectItemsWithRuntime: JSONSchema = {
  type: 'object',
  required: ['id', 'url', 'path', 'name', 'editedTime'],
  properties: {
    id: {
      type: 'string',
    },
    url: {
      type: 'string',
    },
    path: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    editedTime: {
      type: 'string',
    },
    branch: {
      type: 'string',
    },
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    tailwindVersion: {
      type: 'string',
    },
  },
}

const store = new Store({
  name: withRuntime ? 'store-runtime' : 'store',
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
      items: withRuntime ? projectItemsWithRuntime : projectItems,
    },
  },
})

export default store
