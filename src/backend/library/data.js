

/*
if (typeof fs       === 'undefined' || fs       === null) fs       = require('fs');
if (typeof url      === 'undefined' || url      === null) url      = require('url');
if (typeof path     === 'undefined' || path     === null) path     = require('path');
if (typeof http     === 'undefined' || http     === null) http     = require('http');
if (typeof https    === 'undefined' || https    === null) https    = require('https');

//if (typeof download === 'undefined' || download === null) download = require('../download');

require('dotenv').config();


const host = process.env.HOST || 'http://0.0.0.0';
const port = process.env.PORT || 880;
const cwd  = path.resolve(process.cwd() + '\\..'.repeat(3));  //process.env.CWD  || process.cwd();
const spid = process.env.SPID || 'abcd';

return console.log(cwd)

let data_matrix = {
  library: {
    js: {
      requirements: path.join('.', 'cache')
    }
  },
  cache: {
    meta: {
      path: path.join('.', 'cache')
    },
    feed: {
      meta: {
        filename: path.join('cache', 'feed.js'.replace('.js', ''))
      },
      processed: {
        exist: false,
        path: path.join(cwd, 'cache', 'feed.json')
      },
    },
    hubcache: {
      meta: {
        filename: path.join('cache', 'hubcache'.replace('.js', ''))
      },
      processed: {
        exist: false,
        path: path.join(cwd, 'cache', 'hubcache.json')
      }
    }
  }
}

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

module.exports = {
  host,
  port,
  cwd,
  spid,
  data_matrix,
  data_to_prepand
}
 */

