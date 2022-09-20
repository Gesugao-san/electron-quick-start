

/* https://stackoverflow.com/a/2324826/8175291 */
function appendDataToTable(rewrite = false, clear = false) {
  let c, r, t, h, b, l, d, t_exist = false;
  //let data = [['Column 1', 'Column 2'], [123, 456]];
  let data_dict = {
    headers: ['Column 1', 'Column 2'],
    data: [
      [123, 456],
      [789, '012;']
    ]
  };
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

