#!/usr/bin/env node


if (typeof path        === 'undefined' || path        === null) path        = require('path');
//if (typeof windows1251 === 'undefined' || windows1251 === null) windows1251 = require('windows1251');

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
const ephemeral_keys = ['hidden', 'type', 'play_mode', 'score', 'has_benefits', 'icon', 'smallicon', 'download', 'ziplen'];
const all_headers = ['id', 'hidden', 'hubpath', 'title', 'author', 'type', 'play_mode', 'score', 'has_benefits', 'icon', 'smallicon', 'download', 'ziplen', 'list', 'fans', 'tags', 'date', 'mtime', 'rtime'];

// https://stackoverflow.com/a/41451528/8175291
var decodeMap = {};
var win1251 = new TextDecoder("windows-1251");
for (var i = 0x00; i < 0xFF; i++) {
  var hex = (i <= 0x0F ? "0" : "") +      // zero-padded
            i.toString(16).toUpperCase();
  decodeMap[hex] = win1251.decode(Uint8Array.from([i]));
}
// console.log(decodeMap);
// {"10":"\u0010", ... "40":"@","41":"A","42":"B", ... "C0":"А","C1":"Б", ...


// Decodes a windows-1251 encoded string, additionally
// encoded as an ASCII string where each non-ASCII character of the original
// windows-1251 string is encoded as %XY where XY (uppercase!) is a
// hexadecimal representation of that character's code in windows-1251.
function percentEncodedWin1251ToDOMString(str) {
  if (str)
    return String(str).replace(/%([0-9A-F]{2})/g,
      (match, hex) => decodeMap[hex]);
}


/* https://stackoverflow.com/a/2324826/8175291 */
function appendDataToTable(rewrite = false, clear = false) {
  let c, r, t, h, b, l, d, t_exist = false;
  //let data = [['Column 1', 'Column 2'], [123, 456]];

  console.log('Function "appendDataToTable" started.');

  t = document.getElementById('table');
  if (!t || rewrite) {
    console.log('Table not existing, creating new one...')
    t = document.createElement('table');
    t.id = 'table';
    t.className = 'searchable sortable';
    h = t.createTHead();
    r = h.insertRow(0);
    for (let i = 0; i < all_headers.length; i++) {
      c = r.insertCell(i);
      c.appendChild(document.createTextNode(String(all_headers[i])));
    }
    b = t.createTBody();
  } else {
    t_exist = true;
    b = t.getElementsByTagName('tbody')[0];
  }

  console.log('Function "appendDataToTable": filtering data by keys, searching for anomalies...');

  for (const [k, v] of Object.entries(data_dict)) {
    switch (k) {
      case 'rtime':
        console.log('Refresh time:', v, '; (GMT):', new Date(v * 1e3).toGMTString());
        delete data_dict[k];
        break;
      case 'type':
        console.log('Entry type:', v);
        delete data_dict[k];
        break;
      default:
        break;
    }
    if (typeof v == "object") {
      //console.log(`ID: %s, hidden: %s, hubpath: %s, title: %s, type: %s, download: %s, ziplen: %s, list: %s, fans: %s, tags: %s, date: %s, mtime: %s, rtime: %s` % (v.id, (v.hidden || false), v.hubpath, v.title, (v.type || 'N/A'), (v.download || false), (v.ziplen || 'N/A'), v.list, v.fans, v.tags, v.date, v.mdate, v.rtime));
      //console.log(v.id, (v.hidden || false), v.hubpath, v.title, (v.type || 'N/A'), (v.download || false), (v.ziplen || 'N/A'), v.list, v.fans, v.tags, v.date, v.mdate, v.rtime);
      for (const kk of Object.keys(v))
        if (!all_headers.includes(kk)) {
          console.log('Strange key:', kk);
        }
    }
  }

  /* for (let i = 0; i < all_headers.length; i++) {
    const value = all_headers[i];
    console.log(value);
  } */
  /* for (const key of all_headers) {
    const index = all_headers.indexOf(key);
    console.log(all_headers[index]);
  } */

  /* for (let i = 0; i < all_headers.length; i++) {
    const header = all_headers[i];
    r = b.insertRow(i);
    for (const entries of Object.values(data_dict)) {
      for (const [kkkkk, creation] of Object.entries(entries)) {
        //console.log('creationL', kkkkk, creation);
        let creation_index = (Object.keys(creation || {})).indexOf(header);
        c = r.insertCell(creation_index);
        c.appendChild(document.createTextNode(String(creation_index.id)));
      }
    }
  } */

  console.log('Function "appendDataToTable": sorting data by fans...');

  // Create items array
  var items = Object.keys(data_dict).map((key) => {
    return [key, data_dict[key]['fans']];
  });
  // Sort the array based on the second element
  items.sort((first, second) => {
    return second[1] - first[1];
  });
  // Create a new array with only the first 5 items
  ////console.log(items.slice(0, 15));
  // https://stackoverflow.com/a/25500462/8175291

  data_dict_sorted = {};
  for (let i = 0; i < items.length; i++) {
    data_dict_sorted[String(items[i][0])] = data_dict[String(items[i][0])];
  }

  console.log('Function "appendDataToTable": constructing table...');

  let data_dict_values = Object.values(data_dict_sorted);
  for (const creation of data_dict_values) {
    r = b.insertRow(data_dict_values.indexOf(creation));
    for (let i = 0; i < all_headers.length; i++) {
      const header_name = all_headers[i];
      let cell_content = String(creation[header_name]); // .replace(/%([^\d].)/, "%25$1")
      if (['hidden', 'play_mode', 'has_benefits', 'icon', 'smallicon', 'download', 'ziplen'].includes(header_name)) { // FIX_ME
        cell_content = cell_content.replaceAll('undefined', 'false');
      } if (header_name == 'title') {
        cell_content = percentEncodedWin1251ToDOMString(cell_content).replaceAll('+', ' '); //decodeURI(unescape(unescape(cell_content)));
      } else if (header_name == 'author') {
        cell_content = cell_content.replaceAll('+', ' ');
      } else if (header_name == 'tags') {
        cell_content = cell_content.replaceAll('+', ',');
      }
      c = r.insertCell(i);
      c.appendChild(document.createTextNode(String(cell_content)));
    }
  }

  console.log('Function "appendDataToTable" about to done with work.');

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
