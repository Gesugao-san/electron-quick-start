#!/usr/bin/env node


if (typeof path     === 'undefined' || path     === null) path     = require('path');

const target = path.join(process.cwd(), '/src/backend/download');
console.log(target);
const download = require(target);

let data_dict = require(path.join(process.cwd(), '/cache/example/hubcache_parsed.json'));

let data_matrix = download.data_matrix;

/* function status_update(element, data) {
  document.getElementById(element).innerHTML = data;
  return;
} */

const persistent_keys = ['id', 'hubpath', 'title', 'author', 'list', 'fans', 'tags', 'date', 'mtime', 'rtime'];
// ephemeral
const hideable_keys = ['type', 'hidden', 'download', 'ziplen', 'play_mode', 'score', 'icon', 'smallicon', 'has_benefits'];

/* https://stackoverflow.com/a/2324826/8175291 */
function appendDataToTable(rewrite = false, clear = false) {
  let c, r, t, h, b, l, d, t_exist = false;
  for (const [k, v] of Object.entries(data_dict)) {
    switch (k) {
      case 'rtime':
        console.log('Refresh time:', v, '; (GMT):', new Date(v * 1e3).toGMTString());
        break;
      case 'type':
        console.log('Entry type:', v);
        break;
      default:
        break;
    }
    if (typeof v == "object") {
      //console.log(`ID: %s, hidden: %s, hubpath: %s, title: %s, type: %s, download: %s, ziplen: %s, list: %s, fans: %s, tags: %s, date: %s, mtime: %s, rtime: %s` % (v.id, (v.hidden || false), v.hubpath, v.title, (v.type || 'N/A'), (v.download || false), (v.ziplen || 'N/A'), v.list, v.fans, v.tags, v.date, v.mdate, v.rtime));
      console.log(v.id, (v.hidden || false), v.hubpath, v.title, (v.type || 'N/A'), (v.download || false), (v.ziplen || 'N/A'), v.list, v.fans, v.tags, v.date, v.mdate, v.rtime);
      for (const kk of Object.keys(v))
        if (!persistent_keys.includes(kk) && !hideable_keys.includes(kk)) {
          console.log('Strange key:', kk);
        }
    }
  }
  //let data = [['Column 1', 'Column 2'], [123, 456]];

  t = document.getElementById('table');
  if (!t || rewrite) {
    t = document.createElement('table');
    t.id = 'table';
    h = t.createTHead();
    r = h.insertRow(0);
    for (let i = 0; i < data_dict.headers.length; i++) {
      c = r.insertCell(i);
      c.appendChild(document.createTextNode(String(data_dict.headers[i])));
    }
    b = t.createTBody();
  } else {
    t_exist = true;
    b = t.getElementsByTagName('tbody')[0];
  }
  l = b.rows.length; // offset
  for (let i = 0; i < data_dict.data.length; i++) {
    r = b.insertRow(l + i);
    for (let ii = 0; ii < data_dict.data[i].length ; ii++) {
      c = r.insertCell(ii);
      c.appendChild(document.createTextNode(String(data_dict.data[i][ii])));
    }
  }
  if (!t_exist && !clear && !rewrite) {
    d = document.getElementById('appendDataToTable');
    d.appendChild(t);
    console.log('Table created:', t);
    return;
  } else if (clear) {
    d = document.getElementById('appendDataToTable');
    let tt = document.getElementById('table');
    if (tt) {
      d.removeChild(tt);
      console.log('Table cleared.');
    } else {
      console.log('Table already cleared, passing.');
    }
    return;
  } else if (rewrite) {
    d = document.getElementById('appendDataToTable');
    let tt = document.getElementById('table');
    if (tt) {
      if (t.outerHTML == tt.outerHTML)
        return console.log('Existing and inserting tables are identical, passing.');
      d.removeChild(tt);
    }
    d.appendChild(t); // d.insertBefore(tt, t);
    console.log('Table rewrited.');
    return;
  } else {
    b.appendChild(r);
    console.log('Table updated.');
    return;
  }
}


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
  document.getElementById("hubs_process_clear").addEventListener("click", appendDataToTable);
});
