import express from "express"
const router = express.Router();

import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./api.json"

router.use('/api-docs', swaggerUi.serve)
router.get('/api-docs', swaggerUi.setup(swaggerDocument));
