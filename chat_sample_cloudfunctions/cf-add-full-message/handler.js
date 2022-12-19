const clouddb = require('@agconnect/database-server/dist/index.js');
const CloudDBZoneWrapper = require("./model/CloudDBZoneWrapper.js");
const UserMessage = require("./model/input_messages.js");
const FullMessage = require("./model/full_messages.js");

let myHandler = async function(event, context, callback, logger) {
	let message = null;
	let record = event.records[0].after;

	if (!record.date) {
		message = new UserMessage.input_messages();
        message.setId(record.id);
        message.setUser_id(record.user_id);
        message.setType(record.type);
        message.setText(record.text);
	}
		
	if (message) {
	logger.info("initializing cloudDBZoneWrapper");

	var fullMessage = null;
	
	const cloudDBZoneWrapper = new CloudDBZoneWrapper(logger);

	try {
		// get user
		var user = await cloudDBZoneWrapper.getUser(message.user_id);
	    logger.info("user: " + user.id + ", nickname: " + user.nickname);
		fullMessage = cloudDBZoneWrapper.getFullMessage(user, message);
	} catch (error) {
		logger.error("Error: "+ error)
	}
	
	if (fullMessage) {
		try {
			// upsert one message
			await cloudDBZoneWrapper.addMessage(fullMessage);
		} catch (error) {
			logger.error("Error: "+ error)
		}
	}
	
	} else {
		logger.info("Date already set");
	}

	let result = {"message":"Success"};
	let res = new context.HTTPResponse(result, {
        "res-type": "simple example",
        "faas-content-type": "json"
    }, "application/json", "200"); 

	callback(res);
	
}

module.exports.myHandler = myHandler;
