// const fetch = require("node-fetch")
// const gql = require("graphql-tag")

// const { assertValidExecutionArguments } = require("graphql/execution/execute")
// const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const { getEvents, getSessions, getSessionTrack } = require("./src/DynamicsMarketing.js")

// exports.onPreInit = (_) => {
//   console.log(`Loaded gatsby-source-dynamics-marketing`)
// }

const pluginOptionsSchema = ({ Joi }) =>
  Joi.object().keys({
    apiKey: Joi.string().required().description(`Dynamics Marketing apiKey`).messages({
      // Override the error message if the .required() call fails
      "any.required": `"apiKey" needs to be defined. Get the correct value from dynamics marketing.`,
    }),
    apiEndPoint: Joi.string().required().description(`Dynamics Marketing apiEndPoint`),
    Origin: Joi.string().required().description(`Origin`).messages({
      // Override the error message if the .required() call fails
      "any.required": `"Origin" needs to be defined and identical to Dynamics Marketing`,
    }),
  })

exports.pluginOptionsSchema = pluginOptionsSchema

// exports.createSchemaCustomization = ({ actions }) = {
//   const { createTypes } = actions
//   createTypes(`
//   type DynamicsMarketingEvent implements Node {
//     id: ID!
//     session: DynamicsMarketingSession @link(from: "session.name" by: "name")
//   }
//   type DynamicsMarketingSession implements Node {
//     id: ID!
//     name: String!
//   }
//   `)
// }

exports.sourceNodes = async (
  { actions, createContentDigest, createNodeId, getNodesByType, reporter },
  pluginOptions
) => {
  const EVENT_NODE_TYPE = "DynamicsMarketingEvent"
  const SESSION_NODE_TYPE = "DynamicsMarketingSession"
  const SESSION_TRACK_NODE_TYPE = "DynamicsMarketingSessionTrack"

  getEvents(pluginOptions.apiEndPoint, pluginOptions.apiKey, pluginOptions.Origin).then(function (response) {
    reporter.info("Creating " + getEvents.length + " Dynamics Marketing Event nodes")
    response.data.forEach((event) => {
      actions.createNode({
        ...event,
        id: createNodeId(`${EVENT_NODE_TYPE}-${event.eventId}`),
        parent: null,
        children: [],
        internal: {
          type: EVENT_NODE_TYPE,
          content: JSON.stringify(event),
          contentDigest: createContentDigest(event),
        },
      })
      getSessions(pluginOptions.apiEndPoint, pluginOptions.apiKey, pluginOptions.Origin, event.readableEventId).then(
        function (response) {
          reporter.info("Creating " + getSessions.length + " Dynamics Marketing Session nodes")
          response.data.forEach((session) => {
            actions.createNode({
              ...session,
              id: createNodeId(`${SESSION_NODE_TYPE}-${session.id}`),
              parent: null,
              children: [],
              internal: {
                type: SESSION_NODE_TYPE,
                content: JSON.stringify(session),
                contentDigest: createContentDigest(session),
              },
            })
          })
        }
      )
      getSessionTrack(
        pluginOptions.apiEndPoint,
        pluginOptions.apiKey,
        pluginOptions.Origin,
        event.readableEventId
      ).then(function (response) {
        reporter.info("Creating " + getSessions.length + " Dynamics Marketing SessionTrack nodes")
        response.data.forEach((track) => {
          actions.createNode({
            ...track,
            id: createNodeId(`${SESSION_TRACK_NODE_TYPE}-${track.id}`),
            parent: null,
            children: [],
            internal: {
              type: SESSION_TRACK_NODE_TYPE,
              content: JSON.stringify(track),
              contentDigest: createContentDigest(track),
            },
          })
        })
      })
    })
  })
}
