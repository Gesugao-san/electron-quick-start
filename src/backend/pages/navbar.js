#!/usr/bin/env node

if (typeof fs === 'undefined' || fs === null) fs = require('fs');

fs.readFile('./src/frontend/template/navbar.html', (error, data) => {
  if (error) console.error(error);
  document.getElementById('navbar-landing').innerHTML = data.toString();
})

