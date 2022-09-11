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


const host = process.env.HOST || 'http://localhost';
const port = process.env.PORT || 80;
const cwd  = process.cwd();  //process.env.CWD  || process.cwd();
const spid = process.env.SPID || 'abcd';

let data_matrix = {
	"cache": {
		"feed": {
			"meta": {
				"filename": path.join("cache", "feed")
			},
			"raw": {
				"exist": false,
				"path": path.join(cwd, "cache", "feed.js")
			},
			"processed": {
				"exist": false,
				"path": null
			},
		}
	}
}


function status_update(data) {
  document.getElementById("download_status").innerHTML = data;
}

function doNotify(evt) {
  //console.debug('Debug:', evt);
  if (evt.srcElement.id == "do_download") {
    status_update('Download started...'); //"You click on me!"
    const user_ip = "You";
    console.log(`${user_ip} pulls feed.`);
    const file = fs.createWriteStream(data_matrix.cache.feed.raw.path);
    console.log(`Debug: ${host}:${port}/openb/get/feed.js?lorem=ipsum`);
    const req_file = http.get(`${host}:${port}/openb/get/feed.js?lorem=ipsum`, (response) => {
      console.log(`${user_ip}: Download started.`);
      response.pipe(file);
      // after download completed close filestream
      file.on('finish', () => {
        console.log(`${user_ip}: Download completed.`);
        status_update('Download completed');
        file.close();
      });
      file.once('close', () => {
        try {
          stat = fs.statSync(data_matrix.cache.feed.raw.path);
          /* fs.rename(data_matrix.cache.feed.raw.path, data_matrix.cache.feed.raw.path, (error) => {
            if (error) {
              console.error(error);
              res.writeHead(500); // res.statusCode = 500;
              res.end(JSON.stringify({error: "Internal Server Error!", details: error}));
            }
            console.log(`${user_ip}: File raw.`);
          }); */
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
          //res.writeHead(200); //res.statusCode = 200;
          //res.end(JSON.stringify({message: "Update done!", rtime: timestamp.valueOf()}));
          status_update('200');
        }
        catch (err) {
          console.log(err);
          status_update(err);
          //res.writeHead(500); //res.statusCode = 500;
          //res.end(JSON.stringify({error: "Internal Server Error!", details: err}));
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("do_download").addEventListener("click", doNotify);
});
