import { getEventTypeFromName, getEventNameFromId } from "../event/event_utils.js";

/**
 * Extracts a valid identifier from a message.
 * The prefix can be either 'OLD:' or 'NEW:' followed by exactly 20 digits.
 * Any extra characters in the string will be ignored.
 *
 * @param {string} input - The message string to be parsed.
 * @returns {string|null} - 'OLD:XXXXXXXXXXXXXXXXXXXX' or 'NEW:XXXXXXXXXXXXXXXXXXXX' from the message, or null if missing.
 */
export function extractIdentifierFromMessageOrReturnNull(input) {
    //Regex matching both formats
    const newFormatRegex = /^\d{4}\s\d{4}\s\d\s\d\s\d{4}\s\d\s\d{2}\s\d{3}/;
    const oldFormatRegex = /CID:(\d{20})/;
  
    const matchNew = input.match(newFormatRegex);
    if (matchNew && matchNew[0]) {
      input = `NEW:${matchNew[0].replace(/\s/g, '')}`;
    }
  
    const matchOld = input.match(oldFormatRegex);
    if (matchOld && matchOld[1]) {
      input = `OLD:${matchOld[1].replace(/\s/g, '')}`;
    }
  
    const finalRegex = /(OLD:\d{20}|NEW:\d{20})/;
    const match = input.match(finalRegex);
    if (match) {
      return match[0];
    }
  
    return null;
}

/**
 * Parses a valid CID string and returns an object of its components.
 *
 * The CID string must be in the format 'NEW:' or 'OLD:' followed by exactly 20 decimal digits.
 * @param {string} cid - The CID string to be parsed.
 * @returns {Object|null} - An object with the extracted components if the CID string is valid, or `null` if invalid.
 */
export function parseValidCidOrReturnNull(cid) {
  if (!isCidValid(cid)) return null;

  const oldTypeString = "OLD";
  const newTypeString = "NEW";

  // Extracting components
  const cidType = cid.substring(0, 3);
  const cidStr = cid.substring(4, 24);
  const accountStr = cid.substring(8, 12);
  const eventNameStr = cid.substring(14, 18);
  let partitionStr = "";
  let zoneOrUserStr = "";

  if (cidType === oldTypeString) {
    partitionStr = cid.substring(18, 20);
    zoneOrUserStr = cid.substring(20, 23);
  } else if (cidType === newTypeString) {
    partitionStr = cid.substring(19, 21);
    zoneOrUserStr = cid.substring(21, 24);
  }

  // Converting extracted strings to integers
  const accountNumber = parseInt(accountStr, 10);
  const partitionNumber = parseInt(partitionStr, 10);
  const zoneOrUserNumber = parseInt(zoneOrUserStr, 10);

  // Utility function to get event name from event ID
  const eventName = getEventNameFromId(eventNameStr);
  // Creating an object to return
  return {
    accountNumber,
    eventName,
    partitionNumber,
    zoneNumber:
      getEventTypeFromName(eventName) === zoneTypeConst
        ? zoneOrUserNumber
        : null,
    userNumber:
      getEventTypeFromName(eventName) === userTypeConst
        ? zoneOrUserNumber
        : null,
    cid: cidStr,
  };
}

/**
 * Validates if the given CID string is in the correct format.
 *
 * The CID string must start with 'NEW:' or 'OLD:' followed by exactly 20 decimal digits.
 * @param {string} cid - The CID string to be validated.
 * @returns {boolean} - `true` if the CID string is valid, `false` otherwise.
 */
function isCidValid(cid) {
  if (
    (cid.startsWith("NEW:") || cid.startsWith("OLD:")) &&
    cid.length === 24
  ) {
    // Check if the characters after "NEW:" or "OLD:" are all numeric
    return cid
      .substring(4)
      .split("")
      .every((char) => /^[0-9]$/.test(char));
  }
  return false;
}
  


//TODO: implement changed needed to extract the types and so on....
// Constants
const zoneTypeConst = 'Zone';
const userTypeConst = 'User';