#!/usr/bin/env node

/*
	https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module-ru
	https://nodejs.org/api/http.html
	https://stackoverflow.com/a/18604082/8175291
*/

const http = require('http');  // 'http' for http:// URLs
const https = require('https');  // 'https' for https:// URLs
const fs = require('fs');
const path = require('path');
const url = require('url');
require('dotenv').config();


const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 80;
const spid = process.env.SPID || 'abcd';


function doNotify(evt) {
  console.debug('Debug:', evt);
  if (evt.srcElement.id == "do_download") {
    document.getElementById("download_status").innerHTML = "You click on me!";
    return;
    const user_ip = "You";
    console.log(`${user_ip} pulls feed.`);
    //matrix_exist_update();
    //res.setHeader('Content-Type', 'application/json;');
    const file = fs.createWriteStream(data_matrix.cache.feed.renamed.path);
    //console.log('file:', file);
    /* if (new Date('2017-09-28T22:59:02.448804522Z') > new Date()) {
      break;
    } */
    const req_file = https.get(host, (response) => {
      console.log(`${user_ip}: Download started.`);
      response.pipe(file);
      // after download completed close filestream
      file.on('finish', () => {
        console.log(`${user_ip}: Download completed.`);
        file.close();
      });
      file.once('close', () => {
        try {
          stat = fs.statSync(data_matrix.cache.feed.renamed.path);
          fs.rename(data_matrix.cache.feed.raw.path, data_matrix.cache.feed.renamed.path, (error) => {
            if (error) {
              console.error(error);
              res.writeHead(500); // res.statusCode = 500;
              res.end(JSON.stringify({error: "Internal Server Error!", details: error}));
            }
            console.log(`${user_ip}: File Renamed.`);
          });
          // https://stackoverflow.com/a/17699926/8175291
          /* fs.stat('foo.txt', (err, stat) => {
            if (err == null) {
              console.log('File exists');
            } else if (err.code === 'ENOENT') {
              console.log('file does not exist');
            } else {
              console.log('Some other error: ', err.code);
            }
          }); */
          res.writeHead(200); //res.statusCode = 200;
          res.end(JSON.stringify({message: "Update done!", rtime: timestamp.valueOf()}));
        }
        catch (err) {
          console.log(err);
          res.writeHead(500); //res.statusCode = 500;
          res.end(JSON.stringify({error: "Internal Server Error!", details: err}));
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("do_download").addEventListener("click", doNotify);
});
