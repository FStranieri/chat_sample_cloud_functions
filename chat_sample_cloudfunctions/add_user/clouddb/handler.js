const CloudDBZoneWrapper = require("./model/CloudDBZoneWrapper.js");

let myHandler = async function(event, context, callback, logger) {
	var userData = null;
		
	logger.info("initializing cloudDBZoneWrapper");
	
	const cloudDBZoneWrapper = new CloudDBZoneWrapper(logger);

	try {
		// get users colors
		var colors = await cloudDBZoneWrapper.getAllUsersColors();
	    userData = cloudDBZoneWrapper.getUserObject(event, colors);
	} catch (error) {
		logger.error("Error: "+ error)
	}
	
	if (userData.color) {
		try {
			// upsert one user
			await cloudDBZoneWrapper.addUser(userData);
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
