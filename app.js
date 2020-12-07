const express = require('express');
const cors = require('cors')
const apiRouter = require("./routes/api-router.js")
const { handleInternalErrors, send404, handleCustomErrors, handlePSQLErrors } = require('./controllers/errors')

const app = express();

app.use(cors())
app.use(express.json());


app.use("/api", apiRouter);
app.all('/*', send404);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleInternalErrors);

module.exports = app;