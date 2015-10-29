const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const resolve = require('path').resolve;

const env = nunjucks.configure([
  resolve(__dirname, './views/'),
], {
  autoescape : true,
  watch: (process.env.NODE_ENV !== 'production')
});

env.express(app);

app.use('/assets', express.static('assets'));

app.get('/', (req, res) => res.render('layout.html'));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Ready: http://localhost:${process.env.PORT || 3000}`);
});
