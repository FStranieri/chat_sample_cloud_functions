# CLOUD FUNCTIONS for the CHAT APP

This repository is containing all the `Cloud Functions` we used in the [CHAT APP sample](https://github.com/FStranieri/CloudySamples), you should include them into your project on `AGC Console` in order to let the app working well. 

About [HUAWEI Cloud Functions](https://developer.huawei.com/consumer/en/doc/development/AppGallery-connect-Guides/agc-cloudfunction-guidancen-0000001324585185)

# SETUP

1) Create a new `Cloud Function` following this [guide](https://developer.huawei.com/consumer/en/doc/development/AppGallery-connect-Guides/agc-cloudfunction-create-0000001058511532);
2) each project contains a file `handler.zip`, you need to upload it into the `CODE` section;
3) follow the specific `SETUP` below for each `Cloud Function`.

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
