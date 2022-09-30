

const template = {
  "rtime": 1663653482, // Tue Sep 20 2022 05:58:02 GMT+0000 (http://unixtimestamp.com)
  "type": "hub",
  "author.title": {
    "id": 0,
    "hidden": true,
    "hubpath": "author.title",
    "title": "title",
    "author": "author",
    "type": "type",
    "play_mode": "play_mode",
    "score": 0,
    "has_benefits": 1,
    "icon": "./creation.png", // "id.png"
    "smallicon": "id_s.png",
    "download": true,
    "ziplen": 0,
    "list": "list",
    "fans": 0,
    "tags": null,
    "date": 1663653482,
    "mtime": 1663653482,
    "rtime": 1663653482
  }
};

const data = {
  "rtime": 1663653482, // Tue Sep 20 2022 05:58:02 GMT+0000 (http://unixtimestamp.com)
  "type": "hub",
  "Exadv1.SpaceStation13": {
    "id": 8266,
    "hidden": false,  // fake entry
    "hubpath": "Exadv1.SpaceStation13",
    "title": "Space+Station+13",  // https://stackoverflow.com/a/41451528/8175291
    "author": "Exadv1",
    "type": "game",
    "play_mode": "multi",
    "score": 24.92263,
    "has_benefits": 1,  // fake entry
    "icon": "8266.png",
    "smallicon": "8266_s.png",
    "download": true,  // fake entry
    "ziplen": 123,  // fake entry
    "list": "listed",
    "fans": 158578,
    "tags": "action+rpg+scifi",
    "date": 1045371600,
    "mtime": 1663480753,
    "rtime": 1663480681
  },
};


/* https://stackoverflow.com/a/2324826/8175291 */
function appendDataToTable(force_overwrite = false, do_clear = false, /* do_not_rebuild = false */) {
  //console.log('Func was called.');
  let creations_table, tables, icon, data_langing, inserting_data, creations_table_exist = false;
  let cell, caption, row, tbody;
  creations_table = document.getElementById('creations_table');
  if (!creations_table || force_overwrite) {
    if (do_clear) return console.log('Table already cleared, passing.');
    console.log((force_overwrite ? 'Forced to rec' : 'C') + 'reating table...');
    creations_table = document.createElement('table');
    creations_table.id = 'creations_table';
    caption = creations_table.createCaption();
    caption.textContent = 'Creations';
    //creations_table.createTHead();
    tbody = creations_table.createTBody();
    row = tbody.insertRow(0);
    cell = row.insertCell(0);
    icon = document.createElement('img');
    icon.src = data['Exadv1.SpaceStation13']['icon'];  // from "https://www.byond.com/games/hubicon/8266.png"  //"./creation.png";
    //icon.style = "float: left;";
    cell.appendChild(icon); //document.createTextNode(String(template)));
    data_langing = document.createElement('div');
    data_langing.style = "float: left;";
    /* for (const key of ['rtime']) {
      //console.log('key:', key, data[key]);
      inserting_data = document.createElement('div');
      inserting_data.id = key;
      //inserting_data.style = "float: left;";
      inserting_data.appendChild(document.createTextNode(String(data[key]))); // || 'N/A'
      //inserting_data.appendChild(document.createElement('br'));
      data_langing.appendChild(inserting_data); //document.createTextNode(String(template)));
    } */
    for (const key of ['title']) {
      //console.log('key:', key, data[key]);
      inserting_data = document.createElement('div');
      inserting_data.id = key;
      //inserting_data.style = "float: left;";
      inserting_data.appendChild(document.createTextNode(String(data['Exadv1.SpaceStation13'][key].replaceAll('+', ' ')))); //decodeURI(unescape(unescape(cell_content)));)));
      //inserting_data.appendChild(document.createElement('br'));
      data_langing.appendChild(inserting_data); //document.createTextNode(String(template)));
    }
    for (const key of ['author']) {
      //console.log('key:', key, data[key]);
      inserting_data = document.createElement('div');
      inserting_data.id = key;
      //inserting_data.style = "float: left;";
      inserting_data.appendChild(document.createTextNode(String(data['Exadv1.SpaceStation13'][key].replaceAll('+', ' '))));
      inserting_data.innerHTML = '<i><small>By</small></i> ' + inserting_data.innerHTML;
      //inserting_data.appendChild(document.createElement('br'));
      data_langing.appendChild(inserting_data); //document.createTextNode(String(template)));
    }
    /* for (const key of ['id', 'hubpath']) {
      //console.log('key:', key, data['Exadv1.SpaceStation13'][key]);
      inserting_data = document.createElement('div');
      inserting_data.id = key;
      //inserting_data.style = "float: left;";
      inserting_data.appendChild(document.createTextNode(String(data['Exadv1.SpaceStation13'][key])));
      data_langing.appendChild(document.createTextNode(String(' ')));
      data_langing.appendChild(inserting_data);
    } */
    cell.appendChild(data_langing); //document.createTextNode(String(template)));
    console.log('Created table.');
  } else {
    creations_table_exist = true;
    tbody = creations_table.getElementsByTagName('tbody')[0];
  }
  if (!creations_table_exist && !do_clear && !force_overwrite) {
    tables = document.getElementById('tables-landing');
    tables.appendChild(creations_table);
    console.log('Table landed:', creations_table);
    return;
  } else if (do_clear) {
    tables = document.getElementById('tables-landing');
    let creations_table2 = document.getElementById('creations_table');
    tables.removeChild(creations_table2);
    console.log('Table removed.');
    return;
  } else {
    tables = document.getElementById('tables-landing');
    let creations_table2 = document.getElementById('creations_table');
    if (creations_table2) {
      if ((creations_table.outerHTML == creations_table2.outerHTML) && !force_overwrite)
        return console.log('Existing and inserting tables are identical, passing.');
      tables.removeChild(creations_table2);
    }
    tables.appendChild(creations_table); // tables.insertBefore(creations_table, creations_table);
    console.log('Table rewrited.');
    return;
  }
}


function debug_damage() {
  let creations_table, tables, icon, data_langing, inserting_data, creations_table_exist = false;
  let cell, caption, row, tbody;
  creations_table = document.getElementById('creations_table');
  if (!creations_table) return console.log('Table to damage not existing, passing.');
  creations_table.deleteCaption();
  console.log('Damage: ok');
}

