"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newSessionCapabilityObject = newSessionCapabilityObject;
exports.decode = decode;
exports.extract = extract;
const recap_session_capability_object_1 = require("./recap/recap-session-capability-object");
/**
 *
 * newSessionCapabilityObject is a function that abstracts away the details of
 * creating and verifying a session capability object. For example, it uses
 * the SIWE Recap object to create the capability object, but that detail is
 * hidden from the user.
 *
 * This function serves as an abstraction and router to the
 * underlying implementation of the ISessionCapabilityObject.
 *
 * @param attenuations the attenuations you want to add to the capability object
 * @param proof the proofs you want to add to the capability object
 * @returns a ISessionCapabilityObject
 */
function newSessionCapabilityObject(attenuations = {}, proof = []) {
    return new recap_session_capability_object_1.RecapSessionCapabilityObject(attenuations, proof);
}
function decode(encoded) {
    return recap_session_capability_object_1.RecapSessionCapabilityObject.decode(encoded);
}
function extract(siwe) {
    return recap_session_capability_object_1.RecapSessionCapabilityObject.extract(siwe);
}
//# sourceMappingURL=session-capability-object.js.map