const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: `${__dirname}/config/dev.env` });
//const initDb = require("./dataBase/db").initDb;
//const userRouter = require("./routes/UserRoute")();
//const weRouter = require("./routes/WeRoute")();
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//initDb(() => {
    app.listen(process.env.SERVER_PORT, () => {
        console.log(`${'[APP-INFO]'} Listening on port ${process.env.SERVER_PORT}`);
    });
//});
//app.use("/user", userRouter);
//app.use("/we",weRouter);