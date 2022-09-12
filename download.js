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


const host = process.env.HOST || 'http://0.0.0.0';
const port = process.env.PORT || 880;
const cwd  = process.cwd();  //process.env.CWD  || process.cwd();
const spid = process.env.SPID || 'abcd';

let data_matrix = {
  "cache": {
    "meta": {
      "path": "./cache"
    },
    "feed": {
      "meta": {
        "filename": path.join("cache", "feed")
      },
      "processed": {
        "exist": false,
        "path": path.join(cwd, "cache", "feed.json")
      },
    }
  }
}

let feed_data = {};

// https://stackoverflow.com/a/45605555/8175291
function createList(mode, data = Array()) {
  console.log('createList mode:', mode);
  switch (mode) {
    case 'feed':
      const feeds_arr = data; //feed_data.pagerinit_dict.lists.feed;
      console.log('feeds_arr:', feeds_arr);
      for (let i = 0; i < feeds_arr.length; i++) {
        const current_feed = feeds_arr[i];
        console.log('current_feed:', current_feed);
        var listView = document.createElement('ul');
        listView.id = current_feed.post;
        for (const [key, value] of Object.entries(current_feed)) {
          var listViewItem = document.createElement('li');
          if (key == 'web_url') {
            var link = document.createElement("a");
            link.setAttribute('href', value);
            link.setAttribute('target', '_blank');
            link.textContent = value;
            console.log('link:', link);
            listViewItem.appendChild(link);
          } else {
            listViewItem.appendChild(document.createTextNode(`${key}: ${value}`)); //current_feed[ii]
          }
          listView.appendChild(listViewItem);
        }
        /* for (var ii = 0; ii < Object.keys(current_feed).length; ii++) { } */
      }
      return listView; //break;
    default:
      var listView = document.createElement('ul');
      for (var i = 0; i < data.length; i++) {
        var listViewItem = document.createElement('li');
        listViewItem.appendChild(document.createTextNode(data[i]));
        listView.appendChild(listViewItem);
      }
      return listView; //break;
  }
}

function status_update(element, data) {
  document.getElementById(element).innerHTML = data;
  return;
}

function func_feed_download(ev) {
  switch (ev.srcElement.id) {
    case "feed_download_clear":  // if (ev.srcElement.id == "feed_download_action") {
      feed_data = {};
      fs.unlinkSync(path.resolve(data_matrix.cache.feed.processed.path), (error) => {
        if (error) {
          status_update('feed_download_status', 'Error:' + error);
          return console.error(error);
        }
      });
      status_update('feed_download_status', 'Feed file cleared.');
      break;
    case "feed_download_action":
      status_update('feed_download_status', 'Feed file download started...'); //"You click on me!"
      const user_ip = "You";
      console.log(`${user_ip} pulls feed.`);
      if (!fs.existsSync(path.resolve(data_matrix.cache.meta.path))) {
        console.warn('Cache directory not found.');
        fs.mkdirSync(path.resolve(data_matrix.cache.meta.path));
        console.warn('Cache directory created.');
      }
      const file = fs.createWriteStream(data_matrix.cache.feed.processed.path, {flags: 'w'}); //{ overwrite: false }
      console.log(`Debug (URL): ${host}:${port}/openb/get/feed.json?lorem=ipsum`);
      const req_file = http.get(`${host}:${port}/openb/get/feed.json?lorem=ipsum`, (response) => {
        console.log(`${user_ip}: Download started.`);
        if (error) {
          status_update('feed_download_status', 'Error:' + error);
          return console.error(error);
        }
        response.pipe(file);
        // after download completed close filestream
        file.on('finish', () => {
          console.log(`${user_ip}: Download completed.`);
          status_update('feed_download_status', 'Feed file download completed.');
          file.close();
        });
        file.once('close', () => {
          try {
            stat = fs.statSync(data_matrix.cache.feed.processed.path);
            /* fs.rename(data_matrix.cache.feed.processed.path, data_matrix.cache.feed.processed.path, (error) => {
              if (error) {
                console.error(error);
                res.writeHead(500); // res.statusCode = 500;
                res.end(JSON.stringify({error: "Internal Server Error!", details: error}));
              }
              console.log(`${user_ip}: File processed.`);
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
            status_update('feed_download_status', '200');
          }
          catch (err) {
            console.log(err);
            status_update('feed_download_status', err);
            //res.writeHead(500); //res.statusCode = 500;
            //res.end(JSON.stringify({error: "Internal Server Error!", details: err}));
          }
        });
      });
      break;
    case "feed_download_read":  // if (ev.srcElement.id == "feed_download_action") {
      feed_data = require(`./${data_matrix.cache.feed.meta.filename}`);
      console.log('feed_data:', feed_data);
      console.log('Last feed update (Unix Timestamp; Date):', feed_data.feedupdate_dict.date);
      status_update('feed_download_status', 'Feed file readed.');
      break;
    default:
      console.debug('Debug (event):', ev);
      break;
  }
  return;
};

function func_feed_process(ev) {
  let feeds_shown = document.getElementById('feeds_shown');
  switch (ev.srcElement.id) {
    case "feed_process_clear":
      status_update('process_status', 'Feed cleared.');
      feeds_shown.innerHTML = "";
      break;
    case "feed_process_action":
      status_update('process_status', 'Feed processed.');
      func_feed_download({srcElement: {id: 'feed_download_read'}});
      //feeds_shown.appendChild(createList([1, 2, 3]));
      const list = createList('feed', feed_data.pagerinit_dict.lists.feed);
      console.log('list:', list);
      feeds_shown.appendChild(list);
      break;
    default:
      console.debug('Debug (event):', ev);
      break;
    }
  return;
};


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("feed_download_clear").addEventListener("click", func_feed_download);
  document.getElementById("feed_download_action").addEventListener("click", func_feed_download);
  document.getElementById("feed_download_read").addEventListener("click", func_feed_download);
  document.getElementById("feed_process_action").addEventListener("click", func_feed_process);
  document.getElementById("feed_process_clear").addEventListener("click", func_feed_process);
});
