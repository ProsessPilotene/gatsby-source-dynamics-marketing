const fetch = require("node-fetch")
const gql = require("graphql-tag")

const { assertValidExecutionArguments } = require("graphql/execution/execute")
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const axios = require("axios").default

// TODO : få det til å virke

const pluginOptionsSchema = ({ Joi }) => {
  Joi.object({
    apiKey: Joi.string().required().description(`Dynamics Marketing apiKey`).messages({
      // Override the error message if the .required() call fails
      "any.required": `"apiKey" needs to be defined. Get the correct value from dynamics marketing.`,
    }),
    apiEndPoint: Joi.string().required().description(`Dynamics Marketing apiEndPoint`),
    Origin: Joi.string().required().description(`Origin`).messages({
      // Override the error message if the .required() call fails
      "any.required": `"Origin" needs to be defined. Get the correct value from dynamics marketing.`,
    }),
  })
}

exports.pluginOptionsSchema = pluginOptionsSchema

exports.onPreInit = (_, pluginOptions) => {
  console.log(`Loaded gatsby-source-dynamics-marketing`)
}

const getEvents = (apiEndPoint, apiKey, origin) => {
  const eventEndPoint = apiEndPoint + "/EvtMgmt/api/v2.0/events/published?emApplicationtoken=" + apiKey
  var config = {
    method: "get",
    url: eventEndPoint,
    headers: {
      Origin: origin,
    },
  }
  return axios(config)
}

const getSessions = (apiEndPoint, apiKey, origin, readableEventId) => {
  const sessionEndPoint =
    apiEndPoint + "/EvtMgmt/api/v2.0/events/" + readableEventId + "/sessions/?emApplicationtoken=" + apiKey
  var config = {
    method: "get",
    url: sessionEndPoint,
    headers: {
      Origin: origin,
    },
  }
  return axios(config)
}

const getSessionTrack = (apiEndPoint, apiKey, origin, readableEventId) => {
  const sessionTrackEndPoint =
    apiEndPoint + "/EvtMgmt/api/v2.0/events/" + readableEventId + "/tracks/?emApplicationtoken=" + apiKey
  var config = {
    method: "get",
    url: sessionTrackEndPoint,
    headers: {
      Origin: origin,
    },
  }
  return axios(config)
}

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
  // TODO: egne funksjoner per modell
  const EVENT_NODE_TYPE = "DynamicsMarketingEvent"
  const SESSION_NODE_TYPE = "DynamicsMarketingSession"
  const SESSION_TRACK_NODE_TYPE = "DynamicsMarketingSessionTrack"

  getEvents(pluginOptions.apiEndPoint, pluginOptions.apiKey, pluginOptions.Origin).then(function (response) {
    reporter.info("creating event node")
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
          reporter.info("creating session node")
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
        reporter.info("creating sessionTrack node")
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
