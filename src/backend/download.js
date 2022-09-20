
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
  cache: {
    meta: {
      "path": path.join(".", "cache")
    },
    feed: {
      meta: {
        "filename": path.join("cache", "feed")  // Warning: It's "feed.js"!
      },
      processed: {
        "exist": false,
        "path": path.join(cwd, "cache", "feed.json")
      },
    },
    hubcache: {
      meta: {
        "filename": path.join("cache", "hubcache")  // Warning: It's "feed.js"!
      },
      processed: {
        "exist": false,
        "path": path.join(cwd, "cache", "hubcache.json")
      }
    }
  }
}

let feed_package = {};

// https://stackoverflow.com/a/45605555/8175291
function createList(mode, data = Array()) {
  console.log('createList mode:', mode);
  switch (mode) {
    case 'feed':
      const feeds_arr = data; //feed_package.pagerinit_dict.lists.feed;
      console.log('Processing feed package, contains:', feeds_arr);
      let feeds_list = document.createElement('ol');
      for (let i = 0; i < feeds_arr.length; i++) {
        const current_feed = feeds_arr[i];
        let li_value = 0;
        console.log('current_feed:', current_feed);
        let feed_list = document.createElement('ol');
        feed_list.setAttribute('class', 'one_feed');
        feed_list.id = current_feed.post; //feed_list.setAttribute('id', toString(current_feed));
        for (const [key, value] of Object.entries(current_feed)) {
          let feed_element = document.createElement('li');
          feed_element.setAttribute('id', key);
          switch (key) {
            case 'author': //
            case 'key':
              feed_element.appendChild(document.createTextNode(`${key}: `));
              //let blank_link = document.createElement("a").setAttribute('target', '_blank');

              const member_href = `https://www.byond.com/members/${value}`;
              let user_link = document.createElement("a");
              user_link.setAttribute('href', `${member_href}?tab=favorites`);
              user_link.setAttribute('target', '_blank');
              user_link.appendChild(document.createTextNode(value));
              feed_element.appendChild(user_link);

              feed_element.appendChild(document.createTextNode(' ('));
              let posts_link = document.createElement("a");
              posts_link.setAttribute('href', `${member_href}?tab=index`);
              posts_link.setAttribute('target', '_blank');
              posts_link.appendChild(document.createTextNode('posts'));
              feed_element.appendChild(posts_link);
              feed_element.appendChild(document.createTextNode(', '));

              let comments_link = document.createElement("a");
              comments_link.setAttribute('href', `${member_href}?tab=index`);
              comments_link.setAttribute('target', '_blank');
              comments_link.appendChild(document.createTextNode('comments'));
              feed_element.appendChild(comments_link);
              feed_element.appendChild(document.createTextNode(', '));

              let fans_link = document.createElement("a");
              fans_link.setAttribute('href', `${member_href}?command=view_fans`);
              fans_link.setAttribute('target', '_blank');
              fans_link.appendChild(document.createTextNode('fans'));
              feed_element.appendChild(fans_link);
              feed_element.appendChild(document.createTextNode('; '));


              const games_href = `https://www.byond.com/games/${value}`;
              let creations_link = document.createElement("a");
              creations_link.setAttribute('href', `${games_href}?tab=creations`);
              creations_link.setAttribute('target', '_blank');
              creations_link.appendChild(document.createTextNode('creations'));
              feed_element.appendChild(creations_link);
              feed_element.appendChild(document.createTextNode(', '));

              let favorites_link = document.createElement("a");
              favorites_link.setAttribute('href', `${games_href}?tab=favorites`);
              favorites_link.setAttribute('target', '_blank');
              favorites_link.appendChild(document.createTextNode('favorites'));
              feed_element.appendChild(favorites_link);
              feed_element.appendChild(document.createTextNode(', '));

              let medals_link = document.createElement("a");
              medals_link.setAttribute('href', `${games_href}?tab=medals`);
              medals_link.setAttribute('target', '_blank');
              medals_link.appendChild(document.createTextNode('medals'));
              feed_element.appendChild(medals_link);

              feed_element.appendChild(document.createTextNode(')'));
              break;
            case 'forum':
              feed_element.appendChild(document.createTextNode(`${key}: `));
              let forums_link = document.createElement("a");
              forums_link.setAttribute('href', `https://www.byond.com/forum/`);
              forums_link.setAttribute('target', '_blank');
              forums_link.appendChild(document.createTextNode('forums'));
              feed_element.appendChild(document.createTextNode(value));
              feed_element.appendChild(document.createTextNode(' ('));
              feed_element.appendChild(forums_link);
              feed_element.appendChild(document.createTextNode(')'));
              break;
            //https://www.byond.com/forum/
            case 'web_url':
              let web_link = document.createElement("a");
              web_link.setAttribute('href', value);
              web_link.setAttribute('target', '_blank');
              web_link.appendChild(document.createTextNode(value)); //web_link.textContent = value;
              feed_element.appendChild(document.createTextNode(`${key}: `));
              feed_element.appendChild(web_link);
              break;
            case 'last_activity': //
            case 'date':
              feed_element.appendChild(document.createTextNode(`${key} (timestamp): ${value} `));
              feed_element.setAttribute('id', `${key}_timestamp`);
              feed_list.appendChild(feed_element);
              feed_element = document.createElement('li');
              feed_element.appendChild(document.createTextNode(`${key} (GMT): ${new Date(value* 1e3).toGMTString()}`)); //`x.toLocaleString('en-US', {hour12: false})})`));
              feed_element.setAttribute('id', `${key}_gmt`);
              break;
            default:
              feed_element.appendChild(document.createTextNode(`${key}: ${value}`)); //current_feed[ii]
              break;
          }
          li_value += 1;
          feed_element.setAttribute('value', `${li_value}`);
          feed_list.appendChild(feed_element);
        }
        const temp = document.createElement('li');
        temp.appendChild(document.createTextNode((current_feed.is_feed ? 'Feed №' : 'Entry №') + `${current_feed.post}:`));
        temp.appendChild(feed_list);
        feeds_list.appendChild(temp);
        /* for (let ii = 0; ii < Object.keys(current_feed).length; ii++) { } */
      }
      return feeds_list; //break;
    case 'hubcache':
      /* if (['rtime', 'type'].includes(key)) {
        return data_to_json_parsed[key] = !isNaN(data) ? parseInt(data) : data;
      } */
      const hubcache_arr = data; //feed_package.pagerinit_dict.lists.feed;
      console.log('Processing hubcache package, contains:', hubcache_arr);
      let hubcache_list = document.createElement('ol');
      for (let i = 0; i < hubcache.length; i++) {
        const current_feed = hubcache[i];
        let li_value = 0;
        console.log('current hubcache entry:', current_feed);
        break;
        let feed_list = document.createElement('ol');
        feed_list.setAttribute('class', 'one_feed');
        feed_list.id = current_feed.post; //feed_list.setAttribute('id', toString(current_feed));
        for (const [key, value] of Object.entries(current_feed)) {
          let feed_element = document.createElement('li');
          feed_element.setAttribute('id', key);
          switch (key) {
            case 'author': //
            case 'key':
              feed_element.appendChild(document.createTextNode(`${key}: `));
              //let blank_link = document.createElement("a").setAttribute('target', '_blank');

              const member_href = `https://www.byond.com/members/${value}`;
              let user_link = document.createElement("a");
              user_link.setAttribute('href', `${member_href}?tab=favorites`);
              user_link.setAttribute('target', '_blank');
              user_link.appendChild(document.createTextNode(value));
              feed_element.appendChild(user_link);

              feed_element.appendChild(document.createTextNode(' ('));
              let posts_link = document.createElement("a");
              posts_link.setAttribute('href', `${member_href}?tab=index`);
              posts_link.setAttribute('target', '_blank');
              posts_link.appendChild(document.createTextNode('posts'));
              feed_element.appendChild(posts_link);
              feed_element.appendChild(document.createTextNode(', '));

              let comments_link = document.createElement("a");
              comments_link.setAttribute('href', `${member_href}?tab=index`);
              comments_link.setAttribute('target', '_blank');
              comments_link.appendChild(document.createTextNode('comments'));
              feed_element.appendChild(comments_link);
              feed_element.appendChild(document.createTextNode(', '));

              let fans_link = document.createElement("a");
              fans_link.setAttribute('href', `${member_href}?command=view_fans`);
              fans_link.setAttribute('target', '_blank');
              fans_link.appendChild(document.createTextNode('fans'));
              feed_element.appendChild(fans_link);
              feed_element.appendChild(document.createTextNode('; '));


              const games_href = `https://www.byond.com/games/${value}`;
              let creations_link = document.createElement("a");
              creations_link.setAttribute('href', `${games_href}?tab=creations`);
              creations_link.setAttribute('target', '_blank');
              creations_link.appendChild(document.createTextNode('creations'));
              feed_element.appendChild(creations_link);
              feed_element.appendChild(document.createTextNode(', '));

              let favorites_link = document.createElement("a");
              favorites_link.setAttribute('href', `${games_href}?tab=favorites`);
              favorites_link.setAttribute('target', '_blank');
              favorites_link.appendChild(document.createTextNode('favorites'));
              feed_element.appendChild(favorites_link);
              feed_element.appendChild(document.createTextNode(', '));

              let medals_link = document.createElement("a");
              medals_link.setAttribute('href', `${games_href}?tab=medals`);
              medals_link.setAttribute('target', '_blank');
              medals_link.appendChild(document.createTextNode('medals'));
              feed_element.appendChild(medals_link);

              feed_element.appendChild(document.createTextNode(')'));
              break;
            case 'forum':
              feed_element.appendChild(document.createTextNode(`${key}: `));
              let forums_link = document.createElement("a");
              forums_link.setAttribute('href', `https://www.byond.com/forum/`);
              forums_link.setAttribute('target', '_blank');
              forums_link.appendChild(document.createTextNode('forums'));
              feed_element.appendChild(document.createTextNode(value));
              feed_element.appendChild(document.createTextNode(' ('));
              feed_element.appendChild(forums_link);
              feed_element.appendChild(document.createTextNode(')'));
              break;
            //https://www.byond.com/forum/
            case 'web_url':
              let web_link = document.createElement("a");
              web_link.setAttribute('href', value);
              web_link.setAttribute('target', '_blank');
              web_link.appendChild(document.createTextNode(value)); //web_link.textContent = value;
              feed_element.appendChild(document.createTextNode(`${key}: `));
              feed_element.appendChild(web_link);
              break;
            case 'last_activity': //
            case 'date':
              feed_element.appendChild(document.createTextNode(`${key} (timestamp): ${value} `));
              feed_element.setAttribute('id', `${key}_timestamp`);
              feed_list.appendChild(feed_element);
              feed_element = document.createElement('li');
              feed_element.appendChild(document.createTextNode(`${key} (GMT): ${new Date(value* 1e3).toGMTString()}`)); //`x.toLocaleString('en-US', {hour12: false})})`));
              feed_element.setAttribute('id', `${key}_gmt`);
              break;
            default:
              feed_element.appendChild(document.createTextNode(`${key}: ${value}`)); //current_feed[ii]
              break;
          }
          li_value += 1;
          feed_element.setAttribute('value', `${li_value}`);
          feed_list.appendChild(feed_element);
        }
        const temp = document.createElement('li');
        temp.appendChild(document.createTextNode((current_feed.is_feed ? 'Feed №' : 'Entry №') + `${current_feed.post}:`));
        temp.appendChild(feed_list);
        feeds_list.appendChild(temp);
        /* for (let ii = 0; ii < Object.keys(current_feed).length; ii++) { } */
      }
      return feeds_list; //break;
    default:
      var listView = document.createElement('ul');
      for (var i = 0; i < data.length; i++) {
        var feed_element = document.createElement('li');
        feed_element.appendChild(document.createTextNode(data[i]));
        listView.appendChild(feed_element);
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
      feed_package = {};
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
      feed_package = require(`./${data_matrix.cache.feed.meta.filename}`);
      console.log('feed_package:', feed_package);
      console.log('Last feed update (Unix Timestamp; Date):', feed_package.feedupdate_dict.date);
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
      const list = createList('feed', feed_package.pagerinit_dict.lists.feed);
      console.log('list:\n', list);
      feeds_shown.appendChild(list);
      break;
    default:
      console.debug('Debug (event):', ev);
      break;
    }
  return;
};


module.exports = {status_update, createList, data_matrix}

if (document)
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("feed_download_clear").addEventListener("click", func_feed_download);
    document.getElementById("feed_download_action").addEventListener("click", func_feed_download);
    document.getElementById("feed_download_read").addEventListener("click", func_feed_download);
    document.getElementById("feed_process_action").addEventListener("click", func_feed_process);
    document.getElementById("feed_process_clear").addEventListener("click", func_feed_process);
});

