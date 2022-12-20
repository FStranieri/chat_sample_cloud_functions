# CLOUD FUNCTIONS for the CHAT APP

This repository is containing all the `Cloud Functions` we used in the [CHAT APP sample](https://github.com/FStranieri/CloudySamples), you should include them into your project on `AGC Console` in order to let the app working well. 

About [HUAWEI Cloud Functions](https://developer.huawei.com/consumer/en/doc/development/AppGallery-connect-Guides/agc-cloudfunction-guidancen-0000001324585185)

# SETUP

1) each project contains a folder named `resource`, you need to upload your [credentials file](https://developer.huawei.com/consumer/en/doc/development/AppGallery-connect-Guides/agc-cloudfunction-download-credentials-0000001328608158) into it;
2) edit the constant `credentialPath` into each `CloudDBZoneWrapper` file with the real value;
3) build each project with `node` running `npm install` and then `npm run build`;
4) archive all the files into a zip file named `handler.zip` like the following structure:
    
    handler.zip
      
      |---- handler.js
      
      |---- node_modules
      
      |---- resource
      
      |---- model
      
      |----...;
5) create a new `Cloud Function` on `AGC Console` following this [guide](https://developer.huawei.com/consumer/en/doc/development/AppGallery-connect-Guides/agc-cloudfunction-create-0000001058511532);
6) into the 'CODE' section upload the zip file `handler.zip`;
7) follow the specific `SETUP` below for each `Cloud Function`.

# ADD USER

As `TRIGGER` add an `AUTH TRIGGER` with `userLogin` as `EventType`

# DELETE USER

As `TRIGGER` add an `AUTH TRIGGER` with `userLogout` as `EventType`

# CREATE FULL MESSAGE

As `TRIGGER` add a `CLOUD DB TRIGGER` with the following parameters:
- EventSourceId - box 1 (DB Zone): ChatDemo (as default or your own DB Zone), box 2: input_messages
- EventType - onUpsert;
- Enabled - true

# CREATE LUNCH POLL MESSAGE

As `TRIGGER` add a `CLOUD DB TRIGGER` with the following parameters:
- EventSourceId - box 1 (DB Zone): ChatDemo (as default or your own DB Zone), box 2: poll_lunch
- EventType - onUpsert;
- Enabled - true

# CLEAR POLL LUNCH CHOICES

As `TRIGGER` add a `CRON TRIGGER` with the following parameters:
- Schedule - follow the [syntax](https://developer.huawei.com/consumer/en/doc/development/AppGallery-connect-Guides/agc-cloudfunction-crontrigger-0000001301347480) based on your requirement
- Transfer - async
