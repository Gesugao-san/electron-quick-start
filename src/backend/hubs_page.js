#!/usr/bin/env node


if (typeof path     === 'undefined' || path     === null) path     = require('path');

const tarrrrrrrr = path.join(process.cwd(), '/src/backend/download')
console.log(tarrrrrrrr)
const download = require(tarrrrrrrr);

let data_matrix = download.data_matrix;

/* function status_update(element, data) {
  document.getElementById(element).innerHTML = data;
  return;
} */

function func_hubs_process(ev) {
  let hubs_shown = document.getElementById('hubs_shown');
  switch (ev.srcElement.id) {
    case "hubs_process_clear":
      download.status_update('process_status', 'Hubs cleared.');
      hubs_shown.innerHTML = "";
      break;
    case "hubs_process_action":
      download.status_update('process_status', 'Hubs processed.');
      //func_hubs_download({srcElement: {id: 'feed_download_read'}});
      //hubs_shown.appendChild(createList([1, 2, 3]));
      let hubcache = require(data_matrix.cache.hubcache.processed.path);
      const list = download.createList('hubcache', hubcache);
      console.log('list:\n', list);
      hubs_shown.appendChild(list);
      break;
    default:
      console.debug('Debug (event):', ev);
      break;
    }
  return;
};


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("hubs_process_action").addEventListener("click", func_hubs_process);
  document.getElementById("hubs_process_clear").addEventListener("click", func_hubs_process);
});
