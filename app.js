const express = require('express');
const app = express();
const apiRouter = require("./routes/api-router.js")
const { handleInternalErrors, send404, handleCustomErrors } = require('./controllers/errors')

app.use(express.json());

app.use("/api", apiRouter);
app.all('/*', send404);

app.use(handleCustomErrors)
app.use(handleInternalErrors);

module.exports = app;