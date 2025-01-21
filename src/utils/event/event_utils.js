import { EventInfo, eventMapById, eventIdByName } from './event_maps.js'

const unknownTypeConst = 'Unknown';
const unknownEvenNameConst = 'Unknown';

export function getEventTypeFromName(eventName) {
  const eventId = eventIdByName[eventName]; // Get the ID from the event name
  const eventInfo = eventMapById[eventId]; // Get the EventInfo object using the ID
  return eventInfo ? eventInfo.type : null; // Return the type or null if not found
}

// Function to get event name from ID
export function getEventNameFromId(eventId) {
  const eventInfo = eventMapById[eventId];
  return eventInfo != null ? eventInfo.name : unknownEvenNameConst;
}