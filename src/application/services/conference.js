import { db } from './firebase';

const conferences = () => db.ref('conferences');

const conference = (key) => conferences().child(key);

const getConference = (key) => conference(key).once('value');

export const conferenceService = {
    conferences,
    conference,
    getConference,
};
