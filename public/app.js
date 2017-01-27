(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("components/Api.jsx", function(exports, require, module) {
"use strict";

module.exports = function (channelId, channelImage, func) {
    var url = GLOBAL_TRACKER_URL;
    var oReq = new XMLHttpRequest();
    var params = "channelId=" + channelId + "&channelImage=" + channelImage;
    oReq.open("POST", url, true);

    //Send the proper header information along with the request
    oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    oReq.onreadystatechange = function () {
        //Call a function when the state changes.
        if (oReq.readyState == 4 && oReq.status == 200) {
            func(oReq.responseText);
        }
    };
    oReq.send(params);
};

});

require.register("components/App.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Fetcher = require('./Fetcher');

var _Fetcher2 = _interopRequireDefault(_Fetcher);

var _Api = require('./Api');

var _Api2 = _interopRequireDefault(_Api);

var _Channel = require('./Channel');

var _Channel2 = _interopRequireDefault(_Channel);

var _Nav = require('./Nav');

var _Nav2 = _interopRequireDefault(_Nav);

var _Player = require('./Player');

var _Player2 = _interopRequireDefault(_Player);

var _Programs = require('./Programs');

var _Programs2 = _interopRequireDefault(_Programs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'App',

    getInitialState: function getInitialState() {
        return {
            channels: [],
            programs: [],
            schedule: [],
            player: {
                cmd: "pause", // "play", "pause"
                program: {},
                src: "http://sverigesradio.se/topsy/direkt/132.mp3"
            },
            ui: {
                selectedchannelid: null,
                selectedchannelimage: null,
                display: "guide"
            }
        };
    },

    _cache: {
        channels: [],
        programs: [],
        schedule: [],
        player: {
            cmd: "pause", // "play", "pause"
            program: {},
            src: "http://sverigesradio.se/topsy/direkt/132.mp3"
        },
        ui: {
            selectedchannelid: null,
            selectedchannelimage: null,
            display: "guide"
        }
    },

    // API functions
    get: function get(url, prop) {
        return new Promise(function (resolve, reject) {
            var fetcher = (0, _Fetcher2.default)(url).then(function (val) {
                var r = val[prop];
                resolve(r);
            }).catch(function (err) {
                reject(err);
            });
        });
    },
    getChannels: function getChannels() {
        var usefilter = true;
        var filter = usefilter ? "&filter=channel.channeltype&filtervalue=Rikskanal" : "";
        var url = "http://api.sr.se/api/v2/channels?pagination=false&format=json" + filter;
        var _self = this;
        this.get(url, "channels").then(function (val) {
            _self.updateState({ channels: val });
        });
    },

    getProgramsForChannel: function getProgramsForChannel(channel) {
        var _this = this;

        // ToDo internal cache check
        if (this._cache.ui.selectedchannelid === channel.id) {
            return;
        }
        var _self = this;
        var urls = [{ u: "http://api.sr.se/api/v2/programs/index?channelid=" + channel.id + "&format=json&pagination=false", v: "programs" }, { u: channel.scheduleurl + "&format=json&pagination=false", v: "schedule" }];

        var _loop = function _loop() {
            var act = urls[i];
            _this.get(act.u, act.v).then(function (val) {
                var obj = {};
                obj[act.v] = val;
                var ui = _self._cache.ui;
                ui.selectedchannelid = channel.id;
                ui.selectedchannelimage = channel.image;
                ui.display = "guide"; // always reset
                _self.updateState(_self.mergeObjects({}, obj, { ui: ui }));
            });
        };

        for (var i = 0; i < urls.length; i++) {
            _loop();
        }
    },
    // ie Object.assign function
    mergeObjects: function mergeObjects() {
        var resObj = {};
        for (var i = 0; i < arguments.length; i += 1) {
            var obj = arguments[i],
                keys = Object.keys(obj);
            for (var j = 0; j < keys.length; j += 1) {
                resObj[keys[j]] = obj[keys[j]];
            }
        }
        return resObj;
    },
    // State updater
    updateState: function updateState(obj) {

        this._cache = this.mergeObjects(this._cache, obj);
        this.setState(obj);
        // console.log(this._cache);
    },
    // Update player
    updatePlayer: function updatePlayer(obj) {
        var player = this._cache.player;
        var c = this._cache;
        // Deal with pausing
        if (obj.cmd == "pause") {
            player.cmd = "pause";
            this.updateState({ player: player });
            return;
        }

        // find channel live src from cache
        var url = c.channels.filter(function (channel) {
            return c.ui.selectedchannelid == channel.id;
        })[0].liveaudio.url;

        var update = false;
        // play or pause
        if (obj.cmd != player.cmd) {
            player.cmd = obj.cmd;
            update = true;
        }
        if (url != player.src) {
            player.src = url;
            update = true;
        }

        if (update) {
            player.program = obj.player;
            //console.log(player, '<<<<<<<<<')
            this.updateState({ player: player });
        }
    },
    tracker: function tracker() {
        var c = this._cache;
        (0, _Api2.default)(c.ui.selectedchannelid, c.ui.selectedchannelimage, function (res) {
            console.log("Track clicked channel: " + c.ui.selectedchannelid);
        });
    },
    componentWillMount: function componentWillMount() {
        this.getChannels();
    },

    render: function render() {
        var s = this._cache;
        var navcontent = s.channels.length > 0 ? _react2.default.createElement(_Nav2.default, { channels: s.channels, updateState: this.getProgramsForChannel }) : '';
        var bodycontent = s.programs.length > 0 && s.ui.selectedchannelid ? _react2.default.createElement(_Programs2.default, { programs: s.programs, schedule: s.schedule, ui: s.ui, update: this.updateState, updateplayer: this.updatePlayer }) : "";

        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'nav',
                null,
                navcontent
            ),
            _react2.default.createElement(
                'div',
                { className: 'audio-player' },
                _react2.default.createElement(_Player2.default, { player: s.player, ui: s.ui, updateplayer: this.updatePlayer, tracker: this.tracker })
            ),
            _react2.default.createElement(
                'section',
                { className: 'content-body' },
                bodycontent
            )
        );
    }
});

});

require.register("components/Channel.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
   displayName: 'Channel',


   render: function render() {
      return _react2.default.createElement(
         'h1',
         null,
         this.props.name
      );
   }
});

});

require.register("components/Fetcher.jsx", function(exports, require, module) {
"use strict";

module.exports = function (url) {
     return new Promise(function (resolve, reject) {

          var reqListener = function reqListener() {
               var data = JSON.parse(this.responseText);
               resolve(data);
          };

          var reqError = function reqError(err) {
               reject('Fetch Error :-S', err);
          };

          var oReq = new XMLHttpRequest();
          oReq.addEventListener("load", reqListener);
          oReq.addEventListener("error", reqError);
          oReq.open("GET", url, true);
          oReq.overrideMimeType('application\/json; charset=utf-8');
          oReq.send();
     });
};

});

require.register("components/Guide.jsx", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: "Guide",

    getInitialState: function getInitialState() {
        return {};
    },
    play: function play(obj) {
        this.props.updateplayer({ player: obj, cmd: "play" });
    },
    guide: function guide() {
        var _self = this;
        var parseaspdate = function parseaspdate(str) {
            var d = /-?\d+/.exec(str)[0];
            return new Date(parseInt(d, 10));
        };

        var guide = (this.props.schedule || []).map(function (s, n) {
            var start = parseaspdate(s.starttimeutc);
            var end = parseaspdate(s.endtimeutc);
            var starthour = (start.getHours() < 10 ? "0" : "") + start.getHours();
            var startmin = (start.getMinutes() < 10 ? "0" : "") + start.getMinutes();
            var now = new Date();
            var show = start.getTime() >= now.getTime() || now.getTime() < end.getTime() ? "" : "hide";
            var isplaying = start.getTime() <= now.getTime() && end.getTime() > now.getTime();
            var playbtn = isplaying ? _react2.default.createElement(
                "a",
                { href: "#", className: "btn", onClick: function onClick(e) {
                        e.preventDefault();_self.play(s);
                    } },
                " Spela upp "
            ) : "";
            var playing = isplaying ? _react2.default.createElement(
                "span",
                { className: "playing" },
                "*** I s\xE4ndning *** "
            ) : "";
            var playimage = isplaying ? _react2.default.createElement("img", { src: s.imageurl, className: "playimage" }) : "";
            // get more data through s.episodeid and api call
            return _react2.default.createElement(
                "li",
                { className: show, key: n },
                _react2.default.createElement(
                    "div",
                    { className: "schedule" },
                    _react2.default.createElement(
                        "div",
                        null,
                        playing
                    ),
                    _react2.default.createElement(
                        "span",
                        { className: "time" },
                        starthour,
                        ":",
                        startmin
                    ),
                    " | ",
                    _react2.default.createElement(
                        "span",
                        { className: "title" },
                        s.title,
                        " ",
                        s.subtitle
                    ),
                    " ",
                    _react2.default.createElement(
                        "p",
                        null,
                        s.description
                    ),
                    playbtn
                )
            );
        });

        return guide;
    },
    render: function render() {
        return _react2.default.createElement(
            "div",
            { className: "program-group" },
            _react2.default.createElement(
                "ul",
                { className: "guide" },
                this.guide()
            )
        );
    }
});

});

require.register("components/Nav.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _NavItem = require('./NavItem');

var _NavItem2 = _interopRequireDefault(_NavItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'Nav',

    // return channels array ui fixed
    getInitialState: function getInitialState() {
        return {};
    },

    navItems: function navItems() {
        var fn = this.props.updateState;
        return (this.props.channels || []).map(function (c, n) {
            return _react2.default.createElement(_NavItem2.default, { key: n, channel: c, updateState: fn });
        });
    },

    render: function render() {
        return _react2.default.createElement(
            'div',
            null,
            this.navItems()
        );
    }
});

});

require.register("components/NavItem.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'NavItem',

  navigate: function navigate(e) {
    e.preventDefault();
    this.props.updateState(this.props.channel);
  },
  styles: function styles(color) {
    return {};
  },
  defaultProps: { color: 'red' },
  render: function render() {
    var c = this.props.channel;
    return _react2.default.createElement(
      'div',
      { style: this.styles(this.props.color), className: 'navitem' },
      _react2.default.createElement(
        'a',
        { onClick: this.navigate },
        _react2.default.createElement('img', { src: c.image, width: '100%' })
      )
    );
  }
});

});

require.register("components/Player.jsx", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: "Player",

    getInitialState: function getInitialState() {
        return {
            player: false
        };
    },
    hasbeenplayed: false,
    shouldComponentUpdate: function shouldComponentUpdate(prevProps, prevState) {
        var a = this.props.player;
        var b = prevProps.player;
        var ui = this.props.ui;

        var player = document.getElementById("player");
        if (!this.hasbeenplayed && a.cmd == "play") {
            this.hasbeenplayed = true;
            console.log(1);
            return true;
        }
        if (player.paused && a.cmd == "play") {
            return true;
        }

        console.log('in player', player.src, player.paused, a.cmd, a.src);

        if (!a.cmd) {
            console.log(2);
            return false;
        }
        if (a.cmd != b.cmd || a.cmd == "pause" && !player.paused) {
            console.log(3);
            return true;
        }
        if (a.src != player.src && a.cmd == "play") {
            console.log(4);
            return true;
        }
        return false;
    },

    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        var player = document.getElementById("player");
        var p = this.props.player;
        player.src = p.src;
        player.load();

        if (p.cmd == "play") {
            player.load();
            setTimeout(function () {
                player.play();
            }, 800);

            var isplaying = setInterval(function () {
                console.log('in setInterval');
                if (!player.paused && !player.ended && 0 < player.currentTime) {
                    clearInterval(isplaying);
                } else {
                    if (!player.src) {
                        player.src = p.src;
                        player.load();
                    }
                    player.load();
                    player.play();
                }
            }, 1000);
            this.props.tracker();
        }
        if (p.cmd == "pause") {
            player.pause();
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        this._player.pause();
    },
    interact: function interact(e) {
        this.props.updateplayer({ cmd: "pause" });
    },
    render: function render() {
        var p = this.props.player;
        var src = p.src;
        console.log(p);
        return _react2.default.createElement(
            "div",
            { className: "player-container" },
            _react2.default.createElement(
                "a",
                { className: "player-pause", onClick: this.interact },
                "\xA0"
            ),
            " ",
            _react2.default.createElement(
                "a",
                { className: "player-pause", onClick: this.interact },
                "\xA0"
            ),
            " ",
            _react2.default.createElement(
                "figure",
                null,
                _react2.default.createElement("img", { src: this.props.ui.selectedchannelimage, className: "player-image" })
            ),
            _react2.default.createElement(
                "div",
                { className: "player-content" },
                _react2.default.createElement(
                    "span",
                    { className: "player-title" },
                    p.program.title,
                    " ",
                    p.program.subtitle
                ),
                _react2.default.createElement("audio", {
                    controls: "controls",
                    className: "player",
                    id: "player",
                    preload: "false"
                })
            ),
            _react2.default.createElement("div", { className: "clear" })
        );
    }
});

});

require.register("components/Program.jsx", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: "Program",

  getInitialState: function getInitialState() {
    return {};
  },
  programs: function programs() {
    // sort the programs then show
    var obj = {};
    var p = this.props.programs || [];
    for (var i = 0; i < p.length; i++) {
      var str = p[i];
      if (!str.archived === true) {
        if (!obj[str.name.charAt(0).toUpperCase()]) {
          obj[str.name.charAt(0).toUpperCase()] = [];
        }
        obj[str.name.charAt(0).toUpperCase()].push(str);
      }
    }

    var items = function items(arr) {
      return arr.map(function (c, n) {
        return _react2.default.createElement(
          "li",
          { key: n },
          _react2.default.createElement(
            "div",
            { className: "program" },
            _react2.default.createElement("img", { src: c.programimage, className: "small" }),
            _react2.default.createElement(
              "div",
              { className: "content-item" },
              _react2.default.createElement(
                "span",
                { className: "title" },
                c.name
              ),
              _react2.default.createElement(
                "p",
                { className: "description" },
                c.description
              ),
              _react2.default.createElement("span", { className: "small" })
            )
          )
        );
      });
    };
    var keys = Object.keys(obj).sort();
    var result = [];

    for (var k = 0; k < keys.length; k++) {

      result.push(_react2.default.createElement(
        "div",
        { key: k, className: "program-bundle" },
        _react2.default.createElement(
          "span",
          { className: "program-key" },
          keys[k]
        ),
        _react2.default.createElement(
          "ul",
          null,
          items(obj[keys[k]])
        )
      ));
    }

    return result;
  },

  render: function render() {
    return _react2.default.createElement(
      "div",
      { className: "program-group" },
      this.programs()
    );
  }
});

});

require.register("components/Programs.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Program = require('./Program');

var _Program2 = _interopRequireDefault(_Program);

var _Guide = require('./Guide');

var _Guide2 = _interopRequireDefault(_Guide);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'Programs',

    // return channels array ui fixed
    getInitialState: function getInitialState() {
        return {};
    },
    toggle: function toggle(data) {
        var ui = this.props.ui;
        ui.display = data;
        this.props.update({ ui: ui });
    },
    render: function render() {
        var _this = this;

        var programs = this.props.programs;
        var schedule = this.props.schedule;
        var player = this.props.updateplayer;
        var content = this.props.ui.display === "guide" ? _react2.default.createElement(_Guide2.default, { schedule: schedule, updateplayer: player }) : _react2.default.createElement(_Program2.default, { programs: programs });
        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'div',
                { className: 'toggler' },
                _react2.default.createElement('img', { src: this.props.ui.selectedchannelimage, className: 'channelimage' }),
                _react2.default.createElement(
                    'a',
                    { onClick: function onClick() {
                            return _this.toggle("guide");
                        }, className: 'active' },
                    't'
                ),
                _react2.default.createElement(
                    'a',
                    { onClick: function onClick() {
                            return _this.toggle("program");
                        } },
                    'p'
                )
            ),
            content
        );
    }
});

});

require.register("initialize.js", function(exports, require, module) {
'use strict';

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _App = require('components/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  _reactDom2.default.render(_react2.default.createElement(_App2.default, null), document.querySelector('#app'));
});

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map