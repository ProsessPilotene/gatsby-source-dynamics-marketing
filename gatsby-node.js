const { getEvents, getSessions, getSessionTrack, getSpeakers } = require("./src/DynamicsMarketing.js")

exports.onPreInit = (_) => {
  console.log(`Loaded gatsby-source-dynamics-marketing`)
}

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

// NODE TYPES
const EVENT_NODE_TYPE = "DynamicsMarketingEvent"
const SESSION_NODE_TYPE = "DynamicsMarketingSession"
const SESSION_TRACK_NODE_TYPE = "DynamicsMarketingSessionTrack"
const SPEAKER_NODE_TYPE = "DynamicsMarketingSpeaker"
const VENUE_NODE_TYPE = "DynamicsMarketingVenue"

exports.sourceNodes = async (
  { actions, createContentDigest, createNodeId, getNodesByType, reporter },
  pluginOptions
) => {
  getEvents(pluginOptions.apiEndPoint, pluginOptions.apiKey, pluginOptions.Origin).then(function (response) {
    reporter.info("Creating " + getEvents.length + " Dynamics Marketing Event nodes")
    response.data.forEach((event) => {
      const eventNodeId = createNodeId(`${EVENT_NODE_TYPE}-${event.eventId}`)

      const venueData = {
        venueId: event.building.id + event.room.id,
        building: event.building,
        room: event.room,
      }
      // creating venue node with building and room
      const venueNodeId = createNodeId(`venueData-${venueData.venueId}`)
      const nodeMeta = {
        id: venueNodeId,
        parent: null,
        children: [],
        internal: {
          type: VENUE_NODE_TYPE,
          mediaType: "text/html",
          content: JSON.stringify(venueData),
          contentDigest: createContentDigest(venueData),
        },
      }
      actions.createNode(Object.assign({}, venueData, nodeMeta))

      const sessionNodeIds = []
      const sessionTrackNodeIds = []
      const speakerNodeIds = []

      actions.createNode({
        ...event,
        dynamicsMarketingVenue___NODE: venueNodeId,
        dynamicsMarketingSession___NODE: sessionNodeIds,
        dynamicsMarketingSessionTrack___NODE: sessionTrackNodeIds,
        dynamicsMarketingSpeaker___NODE: speakerNodeIds,
        id: eventNodeId,
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
            var sessionNodeId = createNodeId(`${SESSION_NODE_TYPE}-${session.id}`)
            sessionNodeIds.push(sessionNodeId)
            actions.createNode({
              ...session,
              // adds the event node by node id
              allDynamicsMarketingEvent___NODE: eventNodeId,
              id: sessionNodeId,
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
        reporter.info("Creating " + getSessionTrack.length + " Dynamics Marketing SessionTrack nodes")
        response.data.forEach((track) => {
          var trackNodeId = createNodeId(`${SESSION_TRACK_NODE_TYPE}-${track.id}`)
          sessionTrackNodeIds.push(trackNodeId)
          actions.createNode({
            ...track,
            allDynamicsMarketingEvent___NODE: eventNodeId,
            id: trackNodeId,
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

      getSpeakers(pluginOptions.apiEndPoint, pluginOptions.apiKey, pluginOptions.Origin, event.readableEventId).then(
        function (response) {
          reporter.info("Creating " + getSpeakers.length + " Dynamics Marketing Speakers nodes")
          response.data.forEach((speaker) => {
            var speakerNodeId = createNodeId(`${SPEAKER_NODE_TYPE}-${speaker.id}`)
            speakerNodeIds.push(speakerNodeId)
            actions.createNode({
              ...speaker,
              allDynamicsMarketingEvent___NODE: eventNodeId,
              id: speakerNodeId,
              parent: null,
              children: [],
              internal: {
                type: SPEAKER_NODE_TYPE,
                content: JSON.stringify(speaker),
                contentDigest: createContentDigest(speaker),
              },
            })
          })
        }
      )
    })
  })
}
