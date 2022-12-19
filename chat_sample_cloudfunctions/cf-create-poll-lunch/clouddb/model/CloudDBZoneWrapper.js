var { AGCClient, CredentialParser } = require('@agconnect/common-server');
const clouddb = require('@agconnect/database-server/dist/index.js');
const UserMessage = require('./input_messages.js');
const User = require('./users.js');
const FullMessage = require('./full_messages.js');
const PollLunch = require('./poll_lunch.js');
//const path = require('path');
const credentialPath = "/dcache/layer/func/resource/agc-apiclient-926758088713727104-7115771071712602665.json";
var agcClient = null;

module.exports = class CloudDBZoneWrapper {
    constructor(logger) {
        this.logger = logger;

        try {
            /*
            * To Integrate the server sdk, a credential file should be used.
            * Change the value of 'credentialPath' to the path of the credential file.
            * */
            //const credentialPath = "resource\\agc-apiclient-926758088713727104-7115771071712602665.json";
            //let client_name = "../../agc-apiclient-926758088713727104-7115771071712602665.json";
            //var credentialPath = path.join(__dirname, client_name);
            if (!AGCClient.INSTANCES.has(AGCClient.DEFAULT_INSTANCE_NAME)) {
                var credential = CredentialParser.toCredential(credentialPath);
                AGCClient.initialize(credential);
            }
            const agcClient = AGCClient.getInstance();
            clouddb.AGConnectCloudDB.initialize(agcClient);
            const zoneName = 'ChatDemo';
            const cloudDBZoneConfig = new clouddb.CloudDBZoneConfig(zoneName);
            this.cloudDBZoneClient = clouddb.AGConnectCloudDB.getInstance(agcClient).openCloudDBZone(cloudDBZoneConfig);
        } catch (err) {
                this.logger.error(err);
        }
    }

    async addMessage(fullMessageData) {
        if (!this.cloudDBZoneClient) {
           this.logger.info("CloudDBClient is null, try re-initialize it");
            return;
        }

        this.logger.info('message - id: '+ fullMessageData.id);

        let mess = [];
        mess.push(fullMessageData);

        try {
            const resp = await this.cloudDBZoneClient.executeUpsert(fullMessageData);
            this.logger.info('The number of upsert messages is: '+ resp);
        } catch (error) {
            this.logger.error('addMessage=> '+ error);
        }
    }

    async deleteMessage(UserMessage) {
        if (!this.cloudDBZoneClient) {
            this.logger.info("CloudDBClient is null, try re-initialize it");
            return;
        }
        try {
            const resp = await this.cloudDBZoneClient.executeDelete(UserMessage);
            this.logger.info('The number of delete message is:', resp);
        } catch (error) {
            this.logger.error('deleteMessage=>', error);
        }
    }

    async deleteAllMessages() {
        if (!this.cloudDBZoneClient) {
            this.logger.info("CloudDBClient is null, try re-initialize it");
            return;
        }
        try {
            const resp = await this.cloudDBZoneClient.executeDeleteAll(UserMessage.UserMessage);
            this.logger.info('The number of delete all messages is:', resp);
        } catch (error) {
            this.logger.error('deleteAllMessages=>', error);
        }
    }

    async getAllMessages() {
        if (!this.cloudDBZoneClient) {
            this.logger.info("CloudDBClient is null, try re-initialize it");
            return;
        }
        try {
            const resp = await this.cloudDBZoneClient.executeQuery(clouddb.CloudDBZoneQuery.where(UserMessage.user_messages));
            this.logger.info('The number of query messages is:', resp.getSnapshotObjects().length);
            this.processQueryResult(resp.getSnapshotObjects());
        } catch (error) {
            this.logger.error('getAllMessages=>', error);
        }
    }

    async queryMessages(cloudDBZoneQuery) {
        if (!this.cloudDBZoneClient) {
            this.logger.info("CloudDBClient is null, try re-initialize it");
            return;
        }
        try {
            const resp = await this.cloudDBZoneClient.executeQuery(cloudDBZoneQuery);
            this.logger.info('The number of spc query messages is:', resp.getSnapshotObjects().length);
            this.processQueryResult(resp.getSnapshotObjects());
        } catch (error) {
            this.logger.error('queryMessages=>', error);
        }
    }

    async getUserMessages(user_id) {
        if (!this.cloudDBZoneClient) {
            this.logger.info("CloudDBClient is null, try re-initialize it");
            return;
        }
        try {
            const cloudDBZoneQuery = clouddb.CloudDBZoneQuery
            .where(UserMessage.messages)
            .equalTo("user_id", user_id);
            const resp = await this.cloudDBZoneClient.executeQuery(cloudDBZoneQuery);
            this.logger.info('The number of query user messages is:', resp.getSnapshotObjects().length);
            this.processQueryResult(resp.getSnapshotObjects());
        } catch (error) {
            this.logger.error('getUserMessages=>', error);
        }
    }

    async getUser(user_id) {
        if (!this.cloudDBZoneClient) {
            this.logger.info("CloudDBClient is null, try re-initialize it");
            return;
        }

        /*try {
            this.logger.info('The token is loading');
            var token = await this.agcClient.getCredential().getAccessToken() 
            this.logger.info('The token is: '+ token);
        } catch (error) {
            this.logger.error('getToken=> '+ error);
        }*/

        var userData = null;

        try {
            const cloudDBZoneQuery = clouddb.CloudDBZoneQuery
            .where(User.users)
            .equalTo("id", user_id);
            const resp = await this.cloudDBZoneClient.executeQuery(cloudDBZoneQuery);
            this.logger.info('The user results length is:' + resp.getSnapshotObjects().length);
            userData = resp.getSnapshotObjects()[0];
        } catch (error) {
            this.logger.error('getUser=>' + error);
        }

        return userData;
    }

    async countUsers() {
        if (!this.cloudDBZoneClient) {
            this.logger.info("CloudDBClient is null, try re-initialize it");
            return;
        }

        var userData = null;

        try {
            const cloudDBZoneQuery = clouddb.CloudDBZoneQuery
            .where(User.users);
            const resp = await this.cloudDBZoneClient.executeCountQuery(cloudDBZoneQuery, "id");
            this.logger.info('The user count results is:' + resp);
            userData = resp;
        } catch (error) {
            this.logger.error('getUsersCount=>' + error);
        }

        return userData;
    }

    processQueryResult(userMessages) {
        for (let i = 0; i < userMessages.length; i++) {
            const log = "ID:" +  userMessages[i].getId() + ", Text:" + userMessages[i].getText()
                + ", Name:" + userMessages[i].getUser_id() + ", Type:" + userMessages[i].getType() + "\n";
            this.logger.info(log);
        }
    }

    async getLunchPolls() {
        if (!this.cloudDBZoneClient) {
            this.logger.info("CloudDBClient is null, try re-initialize it");
            return;
        }

        var lunchPollsData = null;

        try {
            const cloudDBZoneQuery = clouddb.CloudDBZoneQuery
            .where(PollLunch.poll_lunch);
            const resp = await this.cloudDBZoneClient.executeQuery(cloudDBZoneQuery);
            this.logger.info('The lunch poll results length is:' + resp.getSnapshotObjects().length);
            lunchPollsData = resp.getSnapshotObjects();
        } catch (error) {
            this.logger.error('getLunchPolls=>' + error);
        }

        return lunchPollsData;
    }

    getSingleMessage() {
        let message = new UserMessage.input_messages();
        message.setId("");
        message.setUser_id("test_user");
        message.setType(0);
        message.setText("Test message 1");
        message.setDate(new Date());
        return message;
    }

    getFullMessage(user, message) {
        let fullMessage = new FullMessage.full_messages();
        fullMessage.setId("poll_lunch");
        fullMessage.setUser_id(message.user_id);
        fullMessage.setNickname(user.nickname);
        fullMessage.setEmail(user.email);
        fullMessage.setPhone_number(user.phone_number);
        fullMessage.setPicture_url(user.picture_url);
        fullMessage.setCredential_provider_id(user.provider_id);
        fullMessage.setColor(user.color);
        fullMessage.setType(message.type);
        fullMessage.setText(message.text);
        fullMessage.setDate_ins(new Date());
        return fullMessage;
    }
}