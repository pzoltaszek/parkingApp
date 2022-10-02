const express = require('express');
//const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: `${__dirname}/config/dev.env` });
const initDb = require("./dataBase/db").initDb;
const exampleRouter = require("./routes/exampleRoute")();
const userRouter = require("./routes/userRoute")();
const app = express();
const Log = require('./utils/Log');

app.use(cors());
//app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

initDb(() => {
    app.listen(process.env.SERVER_PORT, () => {
        Log.info(`Listening on port ${process.env.SERVER_PORT}`);
    });
});
app.use("/example", exampleRouter);
app.use("/user", userRouter);