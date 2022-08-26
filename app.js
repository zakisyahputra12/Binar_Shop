require('dotenv').config();
const express = require('express');
const logger = require('morgan');

const app = express();

const HOST = "localhost";
const PORT = 8080;

// const serverError = require('./middleware/server_error');

const index_router = require('./router/index_router');
const auth_router = require('./router/auth_router');
const category_router = require('./router/category_router');
const item_router = require('./router/item_router');
const order_router = require('./router/order_router');
const admin_router = require('./router/admin_router');
const user_router = require('./router/user_router');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', index_router);
app.use('/auth/', auth_router);
app.use('/category/', category_router);
app.use('/item/', item_router);
app.use('/order/', order_router);
app.use('/admin/', admin_router);
app.use('/user/', user_router);

// handle server error
// app.use(serverError);

app.listen(PORT, HOST, () => {
  console.log(
    `server running on http://${HOST}:${PORT}`,
  );
});