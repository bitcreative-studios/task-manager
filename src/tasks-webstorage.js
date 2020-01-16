/**
 * The client must call this to initialize the storage engine before using it.
 *
 * If the storage engine initializes successfully the successCallback will be
 * invoked with a null object.
 *
 * If the errorCallback is invoked then the storage engine
 * cannot be used.
 *
 * It should be possible to call this method multiple times,
 * and the same result will be returned each time.
 *
 * @param {SuccessCallback} successCallback The callback that will be invoked if the storage engine initializes.
 * @param {ErrorCallback} errorCallback The callback that will be invoked in error scenarios.
 */
function init(successCallback, errorCallback) {}

/**
 * The client must call this to initialize a specific object type in the storage engine.
 *
 * If the storage engine supports the object type the successCallback will be invoked with a null value.
 *
 * If the errorCallback is invoked then the object type cannot be stored
 *
 * It should be possible to call this method multiple times, and the same result will be returned each time.
 *
 * @param {String} type The type of object that will be stored.
 * @param {SuccessCallback} successCallback The callback that will be invoked if the storage engine initializes.
 * @param {ErrorCallback} errorCallback The callback that will be invoked on error scenarios.
 */
function initObject(type, successCallback, errorCallback) {}

/**
 * This can be used to find all the objects for a specific type.
 * If there are no objects found for that type this will return an empty array.
 *
 * @param {string} type The type of object that should be searched for.
 * @param {SuccessCallback} successCallback The callback that will be invoked after a query completes.
 * This will be passed an array of objects conforming to the requested type.
 * @param {ErrorCallback} errorCallback The callback that will be invoked on error scenarios.
 */
function findAll(type, successCallback, errorCallback) {}

/**
 * This will return an object with a specific id for a specific type.
 * If no object is found this will return null.
 *
 *
 * @param {string} type The type of object that should searched for
 * @param {string|number} id The unique ID of the object
 * @param {SuccessCallback} successCallback The callback that will be invoked after the query completes.
 * This will be passed an object conforming to the requested type or null.
 * @param {ErrorCallback} errorCallback The callback that will be invoked on error scenarios.
 */
function findById(type, successCallback, errorCallback) {}

/**
 *
 * This will handle adding and editing objects of a specific type.
 *
 * If the id property of the object passed in
 * is null or undefined, an id will be assigned for the object, and it will be saved.
 *
 * If the id property is non-null then the object will be updated
 *
 * If the id cannot be found the error callback will be invoked.
 * On success, the newly saved object will be returned to the success callback.
 *
 * @param {string} type The type of object that will be stored.
 * @param {Object} obj The object that will be stored.
 * @param {SuccessCallback} successCallback The callback that will be invoked after the object has been
 * committed to the storage engine. This will be the stored object, including the id property.
 * @param {ErrorCallback} errorCallback The callback that will be invoked on error scenarios.
 */
function save(type, obj, successCallback, errorCallback) {}

/**
 * This will delete an object with a specific id for a specific type.
 *
 * If no object exists with that id, the error callback will be invoked.
 *
 * If an object is deleted this function will
 * return the id of the deleted object to the success callback.
 *
 * @param {string} type The type of object that will be deleted.
 * @param {string|number} id The unique id of the object
 * @param {SuccessCallback} successCallback The callback
 * that will be invoked after the object has been deleted from the storage engine.
 * This will be passed the unique id of the deleted object.
 * @param {ErrorCallback} errorCallback The callback that will be invoked on error scenarios.
 */
function deleteById(type, id, successCallback, errorCallback) {}

/**
 * This can be used for querying objects based on a property value.
 * A single property name can be passed in, along with the value that matches.
 * Any objects with that value for the property specified will be returned.
 *
 * @param {string} type The type of object that will be searched for.
 * @param {string} propertyName The property name to be matched.
 * @param {string|number} propertyValue The value that property should have.
 * @param {SuccessCallback} successCallback The callback that will be invoked after the query
 * completes. This will be an array of 0 or more objects of the specified type.
 * @param {ErrorCallback} errorCallback The error callback that will be invoked on error scenarios.
 */
function findByProperty(
  type,
  propertyName,
  propertyValue,
  successCallback,
  errorCallback
) {}

/**
 * This will be called in all success scenarios
 * @callback SuccessCallback
 * @param {any} result The success result, as documented on individual method calls
 */
function succesCallback(result) {}

/**
 * This will be called in all failure scenarios
 * @callback ErrorCallback
 * @param {string} errorCode The type of exception
 * @param {string} errorMessage A human readable version of the error message.
 */
function errorCallback(result) {}
