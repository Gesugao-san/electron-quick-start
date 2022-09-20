#!/usr/bin/env node


if (typeof fs       === 'undefined' || fs       === null) fs       = require('fs');
if (typeof path     === 'undefined' || path     === null) path     = require('path');
if (typeof https    === 'undefined' || https    === null) https    = require('https');
if (typeof download === 'undefined' || download === null) download = require('./download');

const data_to_prepand = {
	feed: {
		begin: [
			'let pagedata = {}, pagerinit_dict = {}, feedupdate_dict = {};',
			'function pagerinit(d)  {pagerinit_dict  = d;}',
			'function feedupdate(d) {feedupdate_dict = d;}',
		],
		end: [
			'module.exports = {pagedata, pagerinit_dict, feedupdate_dict};',
			''
		]
	},
	hubcache: {
		begin: [
			'let hubcache_arr = []; function hubupdate(d) {hubcache_arr = d;};',
		],
		end: [
			'module.exports = hubcache_arr;',
			''
		]
	}
}

function feed(user, path_to_open_js, path_to_save_json) {
	console.log(`${user}: Converting started. Reading js file in buffer "as is"...`);
	if (!fs.existsSync(path_to_open_js)) {return console.error(`No file "${path_to_open_js}"`);}
	let data_as_is = fs.readFileSync(path_to_open_js).toString().replace('\r', '').split('\n');
	let data_to_js = [];
	if (data_as_is[0] != data_to_prepand.feed.begin[0]) {
		console.log(`${user}: Reading js file done. File doesn't have custom header, injecting it...`);
		data_to_prepand.feed.begin.forEach((line) => {data_to_js.push(line);}); // pushing begin
		data_as_is.forEach((line) => {data_to_js.push(line);}); // pushing content
		data_to_prepand.feed.end.forEach((line) => {data_to_js.push(line);}); // pushing end
	} else {
		console.log(`${user}: Reading js file done. File already have been injected, no inject needed...`);
		data_as_is.forEach((line) => {data_to_js.push(line);}); // pushing content
	}

	if (data_as_is[0] != data_to_prepand.feed.begin[0]) {
		console.log(`${user}: Saving js file with injected data...`);
		fs.writeFileSync(path_to_open_js, data_to_js.join('\n'), (error) => {
			if (error) return console.error(error);
		});
	} else {
		console.log(`${user}: File js already injected, injecting not needed.`);
	}

	let data_to_json = require(`${path_to_open_js}`);
	console.log('Feed file contains:', data_to_json);

	fs.writeFileSync(path_to_save_json, JSON.stringify(data_to_json, null, '\t'), (error) => {
		if (error) return console.error(error);
	});
	console.log(`${user}: Converting completed.`);
}

async function hubcache(user, path_to_open_js, path_to_save_json) {
	console.log(`${user}: Converting started. Reading js file in buffer "as is"...`);
	if (!fs.existsSync(path_to_open_js)) {return console.error(`No file "${path_to_open_js}"`);}
	let data_as_is = fs.readFileSync(path_to_open_js).toString().replace('\r', '').split('\n');
	let data_to_js = [];
	if (data_as_is[0] != data_to_prepand.hubcache.begin[0]) {
		console.log(`${user}: Reading js file done. File doesn't have custom header, injecting it...`);
		data_to_prepand.hubcache.begin.forEach((line) => {data_to_js.push(line);}); // pushing begin
		data_as_is.forEach((line) => {data_to_js.push(line);}); // pushing content
		data_to_prepand.hubcache.end.forEach((line) => {data_to_js.push(line);}); // pushing end
	} else {
		console.log(`${user}: Reading js file done. File already have been injected, no inject needed...`);
		data_as_is.forEach((line) => {data_to_js.push(line);}); // pushing content
	}
	const mistake1 = "].join('\\n'));", mistake2 = ".join('\\n')";
	// console.log('mistake1:', mistake1);
	// console.log('mistake2:', mistake2);
	// console.log('data_to_js[-4]:', data_to_js[data_to_js.length - 4]);
	// console.log('data_to_js.includes(mistake1):', data_to_js.includes(mistake1));
	// console.log('data_to_js.includes(mistake2):', data_to_js.includes(mistake2));
	// console.log('data_to_js[-4] == mistake1:', data_to_js[data_to_js.length - 4] == mistake1);
	// console.log('data_to_js[-4].includes(mistake2):', data_to_js[data_to_js.length - 4].includes(mistake2));
	if (data_to_js.includes(mistake1)) {
		console.log(`${user}: Fixing file...`);
		const indexx = data_to_js.indexOf(mistake1);
		if (indexx == -1) {return console.error('Cann\'t find index of mistake1');}
		data_to_js[indexx] = data_to_js[indexx].replace(mistake1, '');
	} else if ((data_to_js[data_to_js.length - 4].includes(mistake2)) || (data_to_js[data_to_js.length - 4] == mistake1)) {
		console.log(`${user}: Fixing file (fall-back)...`);
		let indexx = data_to_js.indexOf(mistake2);
		if (indexx == -1) {
			console.log('Cann\'t find index of mistake (fall-back), so forcing index 4.');
			indexx = data_to_js.length - 4;
		}
		console.log('data_to_js[indexx]:', data_to_js[indexx]);
		data_to_js[indexx] = data_to_js[indexx].replace(mistake2, '').replace(mistake1, ']);');
		console.log('data_to_js[indexx]:', data_to_js[indexx]);
	} else {
		console.log('No need to fix mistake');
	}
	if (data_as_is[0] != data_to_prepand.hubcache.begin[0]) {
		console.log(`${user}: Saving js file with injected data...`);
		fs.writeFileSync(path_to_open_js, data_to_js.join('\n'), (error) => {
			if (error) return console.error(error);
		});
	} else {
		console.log(`${user}: File js already injected, injecting not needed.`);
	}

	//console.log('path_to_open_js:', path_to_open_js);
	const data_to_json = require(path_to_open_js); //path.join(process.cwd(), "path_to_open_js")
	if (data_to_json.length == 0) return console.error('JSON File is empty!')
	//console.log('Feed file contains:', data_to_json);
	let data_to_json_parsed = {}
	data_to_json.forEach((element) => {
		let [key, data] = element.split(' ');
		if (['rtime', 'type'].includes(key)) {
			return data_to_json_parsed[key] = !isNaN(data) ? parseInt(data) : data;
		}
		data = data.split(';');
		let entries = {};
		data.forEach((entry) => {
			// id score fans date mtime rtime -> num
			let [keyy, dataa] = entry.split('=');
			if (['hidden', 'download'].includes(keyy)) {
				return entries[keyy] = Boolean(dataa);
			}
			if (!isNaN(dataa)) {
				if (dataa.includes('.')) {
					dataa = parseFloat(dataa);
				} else {
					dataa = parseInt(dataa);
				}
			}
			entries[keyy] = dataa;
			//entries[keyy] = !isNaN(dataa) ? parseInt(dataa) : dataa;
		});
		data_to_json_parsed[key] = entries;
	});

	// sorting unavaliable for dicts...
	/* for (const key of Object.keys(data_to_json_parsed)) {
		if (['rtime', 'type'].includes(key)) {continue;}
		// Create items array
		var items = Object.keys(data_to_json_parsed[key]).map((keyy) => {
			return [key, data_to_json_parsed[key][keyy]];
		});
		// Sort the array based on the second element
		items.sort((first, second) => {
			return second[1] - first[1];
		});
		// Create a new array with only the first 5 items
		console.log(items.slice(0, 5));
	} */

	fs.writeFileSync(path_to_save_json, JSON.stringify(data_to_json_parsed, null, '\t'), (error) => {
		if (error) return console.error(error);
	});
	console.log(`${user}: Converting completed.`);
}

module.exports = {feed, hubcache};

/*
function timeDifference(date1,date2) {
  var difference = date1.getTime() - date2.getTime();
  var daysDifference = Math.floor(difference/60/60/24);
  difference -= daysDifference*60*60*24;
  var hoursDifference = Math.floor(difference/60/60);
  difference -= hoursDifference*60*60;
  var minutesDifference = Math.floor(difference/60);
  difference -= minutesDifference*60;
  var secondsDifference = Math.floor(difference);
  console.log('difference = ' + daysDifference + ' day/s ' + hoursDifference + ' hour/s ' + minutesDifference + ' minute/s ' + secondsDifference + ' second/s ');
  console.log('News need to be updated:', (daysDifference > 0) ? true : false);
}
timeDifference(new Date(1663584949), new Date(1663464082)) // difference = 1 day/s 9 hour/s 34 minute/s 27 second/s; true
timeDifference(new Date(1663584949), new Date(1663567082)) // difference = 0 day/s 4 hour/s 57 minute/s 47 second/s; false
https://stackoverflow.com/a/16767434/8175291
*/

