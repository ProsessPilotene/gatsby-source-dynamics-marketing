const axios = require("axios").default

/**
 * Get all published events.
 * @param {*} apiEndPoint
 * @param {*} apiKey
 * @param {*} origin
 * @returns
 */

function getEvents(apiEndPoint, apiKey, origin) {
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

/**
 * Get all sessions
 * @todo Add Loop through all events, and get all sessions pr event.
 * @param {*} apiEndPoint
 * @param {*} apiKey
 * @param {*} origin
 * @param {*} readableEventId
 * @returns
 */
function getSessions(apiEndPoint, apiKey, origin, readableEventId) {
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

/**
 * Get all session tracks
 * @todo Add Loop through all events, and get all sessions pr event.
 * @param {*} apiEndPoint
 * @param {*} apiKey
 * @param {*} origin
 * @param {*} readableEventId
 * @returns
 */
function getSessionTrack(apiEndPoint, apiKey, origin, readableEventId) {
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

module.exports = { getEvents, getSessions, getSessionTrack }
