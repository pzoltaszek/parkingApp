const express = require('express');
const exampleRouter = express.Router();
const Log = require('../utils/Log');

function router() {
    exampleRouter.get("/getData", async (req, res) => {
        try {
            Log.info('fetched "/example"');
            return res.json({ success: true, data: "Siema" });
        } catch (error) {
            Log.error('fetched "/example" failed');
        }
    });

    return exampleRouter;
};

module.exports = router;