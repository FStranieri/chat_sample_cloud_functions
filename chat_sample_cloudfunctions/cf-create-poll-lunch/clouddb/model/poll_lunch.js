/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2020-2020. All rights reserved.
 * Generated by the CloudDB ObjectType compiler. DO NOT EDIT!
 */

class poll_lunch {
    getFieldTypeMap() {
        let fieldTypeMap = new Map();
        fieldTypeMap.set('user_id', 'String');
        fieldTypeMap.set('choice', 'String');
        return fieldTypeMap;
    }

    getClassName() {
        return 'poll_lunch';
    }

    getPrimaryKeyList() {
        let primaryKeyList = [];
        primaryKeyList.push('user_id');
        return primaryKeyList;
    }

    getIndexList() {
        let indexList = [];
        return indexList;
    }

    getEncryptedFieldList() {
        let encryptedFieldList = [];
        return encryptedFieldList;
    }

    setUser_id(user_id) {
        this.user_id = user_id;
    }

    getUser_id() {
        return this.user_id;
    }

    setChoice(choice) {
        this.choice = choice;
    }

    getChoice() {
        return this.choice;
    }
}

module.exports = {poll_lunch}