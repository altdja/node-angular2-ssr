import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { platformServer, renderModuleFactory } from '@angular/platform-server'
import { enableProdMode } from '@angular/core'
import { AppServerModuleNgFactory } from './dist/ngfactory/src/app/app.server.module.ngfactory'
import { readFileSync } from 'fs';
import * as express from 'express';

const config = require('./server.config.js');
const path = require('path');

enableProdMode();
const app = express();

let template = readFileSync(path.join(__dirname + '/dist/index.html')).toString();

app.engine('html', (_, options, callback) => {
  const opts = { document: template, url: options.req.url };
  renderModuleFactory(AppServerModuleNgFactory, opts)
    .then(html => callback(null, html));
});

app.set('view engine', 'html');
app.set('views', 'src')

app.use(express.static(__dirname + '/dist'));

app.get('*', (req, res) => {
  res.render('index', { req });
});

app.listen(config.server.port, () => {
  console.log(`listening on http://localhost:${config.server.port}!`);
});