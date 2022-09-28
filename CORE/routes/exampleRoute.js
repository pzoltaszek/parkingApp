const express = require('express');
const exampleRouter = express.Router();

function router() {
    exampleRouter.get("/getData", async (req, res) => {
        try {
            console.log(`${'[APP-INFO]'} fetched "/example"`);
            return res.json({ success: true, data: "Siema" });
        } catch (error) {
            console.log(`${'[APP-ERROR]'} fetched "/example" failed`);
        }
    });

    return exampleRouter;
};

module.exports = router;