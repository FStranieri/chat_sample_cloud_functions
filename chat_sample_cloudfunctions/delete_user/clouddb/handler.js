const clouddb = require('@agconnect/database-server/dist/index.js');
const CloudDBZoneWrapper = require("./model/CloudDBZoneWrapper.js");
const User = require('./model/users.js');

let myHandler = async function(event, context, callback, logger) {
	logger.info("initializing cloudDBZoneWrapper");
	
	const cloudDBZoneWrapper = new CloudDBZoneWrapper(logger);

	var userData = cloudDBZoneWrapper.getUserObject(event, null);
	
	if (userData) {
		try {
			// delete one user
			await cloudDBZoneWrapper.deleteUser(userData);
		} catch (error) {
			logger.error("Error: "+ error)
		}
	}

	let result = {"message":"Success"};
	let res = new context.HTTPResponse(result, {
        "res-type": "simple example",
        "faas-content-type": "json"
    }, "application/json", "200"); 

	callback(res);	
}

module.exports.myHandler = myHandler;
