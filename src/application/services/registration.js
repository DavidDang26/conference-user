import { db } from "./firebase";

const registrations = () => db.ref("registrations");

const registration = (registration) => registrations().child(registration);

const getRegistration = (key) => registration(key).once("value");

const addRegistration = (registration) => {
    const customChild = registrations().child(registration.id);
    if (customChild.id) {
        return updateRegistration(registration.id, registration);
    } else customChild.set(registration);
};

const deleteRegistration = (key) => registration(key).remove();

const updateRegistration = (key, data) => registration(key).update(data);

export const registrationService = {
    getRegistration,
    addRegistration,
    deleteRegistration,
    updateRegistration,
};
