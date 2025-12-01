import pools from '../database.js';
import { EVENT_QUERIES } from './eventQuery.js';

export const insertEvent = async (
    creatorUserId,
    eventTitle,
    eventType,
    eventDate,
    eventLocation,
    eventDesc,
) => {
    const [result] = await pools.fepns.query(EVENT_QUERIES.INSERT_EVENT, [
        creatorUserId,
        eventTitle,
        eventType,
        eventDate,
        eventLocation,
        eventDesc,
    ]);
    return result;
};

export const findEventById = async (eventId) => {
    const [rows] = await pools.fepns.query(EVENT_QUERIES.FIND_EVENT_BY_ID, [eventId]);
    return rows[0];
};

export const findEventsByUser = async (userId) => {
    const [rows] = await pools.fepns.query(EVENT_QUERIES.FIND_EVENTS_BY_USER, [userId]);
    return rows;
};
