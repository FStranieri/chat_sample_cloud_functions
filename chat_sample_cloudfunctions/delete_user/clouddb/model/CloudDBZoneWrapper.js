var { AGCClient, CredentialParser } = require('@agconnect/common-server');
const clouddb = require('@agconnect/database-server/dist/index.js');
const User = require('./users.js');
const credentialPath = "/dcache/layer/func/resource/agc-apiclient-926758088713727104-7115771071712602665.json";
var agcClient = null;

module.exports = class CloudDBZoneWrapper {
    constructor(logger) {
        this.logger = logger;

        try {
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

    async addUser(userData) {
        if (!this.cloudDBZoneClient) {
           this.logger.info("CloudDBClient is null, try re-initialize it");
            return;
        }

        this.logger.info('user - id: '+ userData.id);

        let users = [];
        users.push(userData);

        try {
            const resp = await this.cloudDBZoneClient.executeUpsert(userData);
            this.logger.info('The number of upsert users is: '+ resp);
        } catch (error) {
            this.logger.error('addUser=> '+ error);
        }
    }

    async deleteUser(userData) {
        if (!this.cloudDBZoneClient) {
            this.logger.info("CloudDBClient is null, try re-initialize it");
            return;
        }
        try {
            const resp = await this.cloudDBZoneClient.executeDelete(userData);
            this.logger.info('The number of delete user is:', resp);
        } catch (error) {
            this.logger.error('deleteUser=>', error);
        }
    }

     async getAllUsersColors() {
        var colors = null;

        if (!this.cloudDBZoneClient) {
            this.logger.info("CloudDBClient is null, try re-initialize it");
            return;
        }
        try {
            const resp = await this.cloudDBZoneClient.executeQuery(clouddb.CloudDBZoneQuery.where(User.users));
            this.logger.info('The number of query users is:' + resp.getSnapshotObjects().length);
            colors = this.processUsersColorsQueryResult(resp.getSnapshotObjects());
        } catch (error) {
            this.logger.error('getAllUsersColors=>' + error);
        }

        return colors;
    }

     processUsersColorsQueryResult(users) {
        let colors = [];

        for (let i = 0; i < users.length; i++) {
            const log = "ID:" +  users[i].getId() + ", Color:" + users[i].getColor() + "\n";
            this.logger.info(log);
            colors.push(users[i].getColor());
        }

        return colors;
    }

    async getUser(user_id) {
        if (!this.cloudDBZoneClient) {
            this.logger.info("CloudDBClient is null, try re-initialize it");
            return;
        }

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

    /*getToken() {
        try {
            this.logger.info('The token is loading');
            var token = await this.agcClient.getCredential().getAccessToken() 
            this.logger.info('The token is: '+ token);
        } catch (error) {
            this.logger.error('getToken=> '+ error);
        }
    }*/

    getUserObject(event, colors) {
        let user_data = new User.users();
        user_data.setId(event.uid);
        user_data.setPhone_number(event.phone);
        user_data.setProvider_id("" + event.providers[0].provider + "");
        user_data.setEmail(event.email);
        user_data.setNickname(event.displayName);
        user_data.setPicture_url(event.photoUrl);

        if (colors) {
		    user_data.setColor(this.getRandomColor(colors));
        }
        
        return user_data;
    }

    objToString(obj) {
    let str = '';
    var objKeys = Object.keys(obj);
    var i = 0;
    for(i=0;i<objKeys.length;i++){
        str = str +"KEY: "+ objKeys[i]+ " && value:" +obj[objKeys[i]]+ " || ";
    }
    console.log(str);
    return str;
    }

    getRandomColor(colors) {
	    var color = null;

	    while (!color || colors.includes(color)) {
            var rint = Math.floor( 0x100000000 * Math.random());
		    color = '#' + ('00000' + rint.toString(16)).slice(-6).toUpperCase();
	    }

	    return color;
    }
}
