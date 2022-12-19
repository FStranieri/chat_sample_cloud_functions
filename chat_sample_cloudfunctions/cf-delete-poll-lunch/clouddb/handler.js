const clouddb = require('@agconnect/database-server/dist/index.js');
const CloudDBZoneWrapper = require("./model/CloudDBZoneWrapper.js");
const UserMessage = require("./model/input_messages.js");
const FullMessage = require("./model/full_messages.js");
const PollLunch = require("./model/poll_lunch.js");

let myHandler = async function(event, context, callback, logger) {

	let message = new FullMessage.full_messages();
    message.setId("poll_lunch");
    message.setUser_id("");
    message.setType(1);
    message.setText("");
	message.setNickname("");
    message.setCredential_provider_id("1");
		
	logger.info("initializing cloudDBZoneWrapper");
	
	const cloudDBZoneWrapper = new CloudDBZoneWrapper(logger);

	try {
		// delete one message
		await cloudDBZoneWrapper.deleteMessage(message);

		// delete all poll lunch choices
		await cloudDBZoneWrapper.deletePollLunchChoices();
	} catch (error) {
		logger.error("Error: "+ error)
	}

	let result = {"message":"Success"};
	let res = new context.HTTPResponse(result, {
        "res-type": "simple example",
        "faas-content-type": "json"
    }, "application/json", "200"); 

	callback(res);
	
}

//myHandler();

module.exports.myHandler = myHandler;
