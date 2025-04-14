'use strict';
import express from "express"
import pkg from "swagger-generator-express"
// import { validation } from "swagger-generator-express"
import userController from "../controller/user.js"
import requestModel from "./requestModel/users.js"

var router = express.Router();
const { validation } = pkg;

// var express = require('express');
// var router = express.Router();
// var { validation } = require('swagger-generator-express');
// var userController = require('../controller/user');
// var requestModel = require('../requestModel/users');

router.post('/', validation(requestModel[0]), userController.createUser);

router.get('/', userController.getUsers);

router.put('/:userId', userController.updateUser);

router.get('/:userId', userController.getUserDetails);

router.delete('/:userId', userController.deleteUser);

module.exports = router;
/**
 *  Router can be exported in different ways if your structure need export some other data along with routers. 
 * Create object with key router inside and export from there For example
 * module.exports = {
        router: router,
        basePath: '/users'
    }
 * /*/
