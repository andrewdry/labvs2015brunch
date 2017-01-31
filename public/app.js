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
var global = typeof window === 'undefined' ? this : window;require.register("fs", function(exports, require, module) {
  module.exports = {};
});
require.register("net", function(exports, require, module) {
  module.exports = {};
});
require.register("tls", function(exports, require, module) {
  module.exports = {};
});
require.register("child_process", function(exports, require, module) {
  module.exports = {};
});
var process;
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
require.register("components/App.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Fetcher = require('./Fetcher');

var _Fetcher2 = _interopRequireDefault(_Fetcher);

var _Tracker = require('./Tracker');

var _Tracker2 = _interopRequireDefault(_Tracker);

var _Channel = require('./Channel');

var _Channel2 = _interopRequireDefault(_Channel);

var _Nav = require('./Nav');

var _Nav2 = _interopRequireDefault(_Nav);

var _Player = require('./Player');

var _Player2 = _interopRequireDefault(_Player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Promise = require('bluebird');

exports['default'] = _react2['default'].createClass({
    displayName: 'App',

    getInitialState: function () {
        function getInitialState() {
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
        }

        return getInitialState;
    }(),

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
    get: function () {
        function get(url, prop) {
            return new Promise(function (resolve, reject) {
                var fetcher = (0, _Fetcher2['default'])(url).then(function (val) {
                    var r = val[prop];
                    resolve(r);
                })['catch'](function (err) {
                    reject(err);
                });
            });
        }

        return get;
    }(),
    getChannels: function () {
        function getChannels() {
            var usefilter = true;
            var filter = usefilter ? "&filter=channel.channeltype&filtervalue=Rikskanal" : "";
            var url = "http://api.sr.se/api/v2/channels?pagination=false&format=json" + filter;
            var _self = this;
            this.get(url, "channels").then(function (val) {
                _self.updateState({ channels: val });
            });
        }

        return getChannels;
    }(),

    getProgramsForChannel: function () {
        function getProgramsForChannel(channel) {
            var _this = this;

            // ToDo internal cache check
            if (this._cache.ui.selectedchannelid === channel.id) {
                return;
            }
            var _self = this;
            var urls = [{ u: "http://api.sr.se/api/v2/programs/index?channelid=" + channel.id + "&format=json&pagination=false", v: "programs" }, { u: channel.scheduleurl + "&format=json&pagination=false", v: "schedule" }];

            var _loop = function () {
                function _loop() {
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
                }

                return _loop;
            }();

            for (var i = 0; i < urls.length; i++) {
                _loop();
            }
        }

        return getProgramsForChannel;
    }(),

    // ie Object.assign function
    mergeObjects: function () {
        function mergeObjects() {
            var resObj = {};
            for (var i = 0; i < arguments.length; i += 1) {
                var obj = arguments[i],
                    keys = Object.keys(obj);
                for (var j = 0; j < keys.length; j += 1) {
                    resObj[keys[j]] = obj[keys[j]];
                }
            }
            return resObj;
        }

        return mergeObjects;
    }(),

    // State updater
    updateState: function () {
        function updateState(obj) {
            this._cache = this.mergeObjects(this._cache, obj);
            this.setState(obj);
        }

        return updateState;
    }(),
    // Update player
    updatePlayer: function () {
        function updatePlayer(obj) {
            var player = this._cache.player;
            var c = this._cache;
            // Deal with pausing
            if (obj.cmd == "pause") {
                player.cmd = "pause";
                this.updateState({ player: player });
                return;
            }

            // find channel live src from _cache
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
                this.updateState({ player: player });
            }
        }

        return updatePlayer;
    }(),
    postTrackToApi: _Tracker2['default'],
    tracker: function () {
        function tracker() {
            var c = this._cache;
            this.postTrackToApi(c.ui.selectedchannelid, c.ui.selectedchannelimage, function (res) {
                console.log('tracking');
            });
        }

        return tracker;
    }(),
    componentWillMount: function () {
        function componentWillMount() {
            this.getChannels();
        }

        return componentWillMount;
    }(),

    render: function () {
        function render() {
            var s = this._cache;
            var navcontent = s.channels.length > 0 ? _react2['default'].createElement(_Nav2['default'], { channels: s.channels, updateState: this.getProgramsForChannel, className: 'nav' }) : '';
            var bodycontent = s.programs.length > 0 && s.ui.selectedchannelid ? _react2['default'].createElement(_Channel2['default'], { programs: s.programs, schedule: s.schedule, ui: s.ui, update: this.updateState, updateplayer: this.updatePlayer }) : "";

            return _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(
                    'nav',
                    null,
                    navcontent
                ),
                _react2['default'].createElement(
                    'div',
                    { className: 'audio-player' },
                    _react2['default'].createElement(_Player2['default'], { player: s.player, ui: s.ui, updateplayer: this.updatePlayer, tracker: this.tracker })
                ),
                _react2['default'].createElement(
                    'section',
                    { className: 'content-body' },
                    bodycontent
                )
            );
        }

        return render;
    }()
});

});

require.register("components/Channel.jsx", function(exports, require, module) {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = _react2['default'].createClass({
    displayName: 'Channel',

    // return channels array ui fixed
    getInitialState: function () {
        function getInitialState() {
            return {};
        }

        return getInitialState;
    }(),
    toggle: function () {
        function toggle(data) {
            var ui = this.props.ui;
            ui.display = data;
            this.props.update({ ui: ui });
        }

        return toggle;
    }(),
    render: function () {
        function render() {
            var _this = this;

            var programs = this.props.programs;
            var schedule = this.props.schedule;
            var player = this.props.updateplayer;
            var now = this.props.now;
            var content = this.props.ui.display === "guide" ? _react2['default'].createElement(_Guide2['default'], { schedule: schedule, updateplayer: player, now: now }) : _react2['default'].createElement(_Program2['default'], { programs: programs });
            return _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(
                    'div',
                    { className: 'toggler' },
                    _react2['default'].createElement('img', { src: this.props.ui.selectedchannelimage, className: 'channelimage' }),
                    _react2['default'].createElement(
                        'a',
                        { onClick: function () {
                                function onClick() {
                                    return _this.toggle("guide");
                                }

                                return onClick;
                            }(), className: 'active' },
                        't'
                    ),
                    _react2['default'].createElement(
                        'a',
                        { onClick: function () {
                                function onClick() {
                                    return _this.toggle("program");
                                }

                                return onClick;
                            }() },
                        'p'
                    )
                ),
                content
            );
        }

        return render;
    }()
});

});

require.register("components/Fetcher.jsx", function(exports, require, module) {
"use strict";

module.exports = function (url) {
  return new Promise(function (resolve, reject) {

    var reqListener = function () {
      function reqListener() {
        var data = JSON.parse(this.responseText);
        resolve(data);
      }

      return reqListener;
    }();

    var reqError = function () {
      function reqError(err) {
        reject('Fetch Error :-S', err);
      }

      return reqError;
    }();

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports["default"] = _react2["default"].createClass({
  displayName: "Guide",

  getInitialState: function () {
    function getInitialState() {
      return {};
    }

    return getInitialState;
  }(),
  play: function () {
    function play(obj) {
      this.props.updateplayer({ player: obj, cmd: "play" });
    }

    return play;
  }(),
  guide: function () {
    function guide() {
      var _self = this;
      var parseaspdate = function () {
        function parseaspdate(str) {
          var d = /-?\d+/.exec(str)[0];
          return new Date(parseInt(d, 10));
        }

        return parseaspdate;
      }();

      var guide = (this.props.schedule || []).map(function (s, n) {
        var start = parseaspdate(s.starttimeutc);
        var end = parseaspdate(s.endtimeutc);
        var starthour = (start.getHours() < 10 ? "0" : "") + start.getHours();
        var startmin = (start.getMinutes() < 10 ? "0" : "") + start.getMinutes();
        var now = _self.props.now ? _self.props.now : new Date();
        var show = start.getTime() >= now.getTime() || now.getTime() < end.getTime() ? "" : "hide";
        var isplaying = start.getTime() <= now.getTime() && end.getTime() > now.getTime();
        var playbtn = isplaying ? _react2["default"].createElement(
          "a",
          { href: "#", className: "btn", onClick: function () {
              function onClick(e) {
                e.preventDefault();_self.play(s);
              }

              return onClick;
            }() },
          " Spela upp "
        ) : "";
        var playing = isplaying ? _react2["default"].createElement(
          "span",
          { className: "playing" },
          "*** I s\xE4ndning *** "
        ) : "";
        var playimage = isplaying ? _react2["default"].createElement("img", { src: s.imageurl, className: "playimage" }) : "";
        // get more data through s.episodeid and api call
        return _react2["default"].createElement(
          "li",
          { className: show, key: n },
          _react2["default"].createElement(
            "div",
            { className: "schedule" },
            _react2["default"].createElement(
              "div",
              null,
              playing
            ),
            _react2["default"].createElement(
              "span",
              { className: "time" },
              starthour,
              ":",
              startmin
            ),
            " | ",
            _react2["default"].createElement(
              "span",
              { className: "title" },
              s.title,
              " ",
              s.subtitle
            ),
            " ",
            _react2["default"].createElement(
              "p",
              null,
              s.description
            ),
            playbtn
          )
        );
      });

      return guide;
    }

    return guide;
  }(),
  render: function () {
    function render() {
      return _react2["default"].createElement(
        "div",
        { className: "program-group" },
        _react2["default"].createElement(
          "ul",
          { className: "guide" },
          this.guide()
        )
      );
    }

    return render;
  }()
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = _react2['default'].createClass({
   displayName: 'Nav',

   getInitialState: function () {
      function getInitialState() {
         return {};
      }

      return getInitialState;
   }(),

   navItems: function () {
      function navItems() {
         var fn = this.props.updateState;
         return (this.props.channels || []).map(function (c, n) {
            return _react2['default'].createElement(_NavItem2['default'], { key: n, channel: c, updateState: fn });
         });
      }

      return navItems;
   }(),

   render: function () {
      function render() {
         return _react2['default'].createElement(
            'div',
            null,
            this.navItems()
         );
      }

      return render;
   }()
});

});

require.register("components/NavItem.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = _react2['default'].createClass({
  displayName: 'NavItem',

  navigate: function () {
    function navigate(e) {
      e.preventDefault();
      this.props.updateState(this.props.channel);
    }

    return navigate;
  }(),
  styles: function () {
    function styles(color) {
      return {};
    }

    return styles;
  }(),
  defaultProps: { color: 'red' },
  render: function () {
    function render() {
      var c = this.props.channel;
      return _react2['default'].createElement(
        'div',
        { style: this.styles(this.props.color), className: 'navitem' },
        _react2['default'].createElement(
          'a',
          { onClick: this.navigate },
          _react2['default'].createElement('img', { src: c.image, width: '100%' })
        )
      );
    }

    return render;
  }()
});

});

require.register("components/Player.jsx", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports["default"] = _react2["default"].createClass({
    displayName: "Player",

    getInitialState: function () {
        function getInitialState() {
            return {
                player: this.props.player,
                ui: this.props.ui
            };
        }

        return getInitialState;
    }(),
    hasbeenplayed: false,
    shouldComponentUpdate: function () {
        function shouldComponentUpdate(prevProps, prevState) {
            var a = this.props.player;
            var b = prevProps.player;
            var ui = this.props.ui;
            //console.log(a);
            var player = this.refs._player; //document.getElementById("player");
            if (!this.hasbeenplayed && a.cmd == "play") {
                this.hasbeenplayed = true;
                //console.log(1);
                return true;
            }
            if (player.paused && a.cmd == "play") {
                return true;
            }

            if (!a.cmd) {
                //console.log(2);
                return false;
            }
            if (a.cmd != b.cmd || a.cmd == "pause" && !player.paused) {
                //console.log(3);
                return true;
            }
            if (a.src != player.src && a.cmd == "play") {
                //console.log(4);
                return true;
            }
            return false;
        }

        return shouldComponentUpdate;
    }(),

    componentDidUpdate: function () {
        function componentDidUpdate(prevProps, prevState) {
            var player = this.refs._player; //document.getElementById("player");
            var p = this.props.player;
            player.src = p.src;
            player.load();

            if (p.cmd == "play") {
                player.load();
                setTimeout(function () {
                    player.play();
                }, 800);

                var isplaying = setInterval(function () {
                    //console.log('in setInterval')
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
        }

        return componentDidUpdate;
    }(),
    componentWillUnmount: function () {
        function componentWillUnmount() {
            this.refs._player.pause();
        }

        return componentWillUnmount;
    }(),
    interact: function () {
        function interact(e) {
            this.props.updateplayer({ cmd: "pause" });
        }

        return interact;
    }(),
    render: function () {
        function render() {
            var p = this.props.player;
            var src = p.src;
            var image = this.props.ui.selectedchannelimage;
            return _react2["default"].createElement(
                "div",
                { className: "player-container" },
                _react2["default"].createElement(
                    "a",
                    { className: "player-pause", onClick: this.interact },
                    "\xA0"
                ),
                " ",
                _react2["default"].createElement(
                    "a",
                    { className: "player-pause", onClick: this.interact },
                    "\xA0"
                ),
                " ",
                _react2["default"].createElement(
                    "figure",
                    null,
                    _react2["default"].createElement("img", { src: image, className: "player-image" })
                ),
                _react2["default"].createElement(
                    "div",
                    { className: "player-content" },
                    _react2["default"].createElement(
                        "span",
                        { className: "player-title" },
                        p.program.title,
                        " ",
                        p.program.subtitle
                    ),
                    _react2["default"].createElement("audio", {
                        controls: "controls",
                        className: "player",
                        id: "player",
                        preload: "false",
                        ref: "_player"
                    })
                ),
                _react2["default"].createElement("div", { className: "clear" })
            );
        }

        return render;
    }()
});

});

require.register("components/Program.jsx", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports["default"] = _react2["default"].createClass({
  displayName: "Program",

  getInitialState: function () {
    function getInitialState() {
      return {};
    }

    return getInitialState;
  }(),
  programs: function () {
    function programs() {
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

      var items = function () {
        function items(arr) {
          return arr.map(function (c, n) {
            return _react2["default"].createElement(
              "li",
              { key: n },
              _react2["default"].createElement(
                "div",
                { className: "program" },
                _react2["default"].createElement("img", { src: c.programimage, className: "small" }),
                _react2["default"].createElement(
                  "div",
                  { className: "content-item" },
                  _react2["default"].createElement(
                    "span",
                    { className: "title" },
                    c.name
                  ),
                  _react2["default"].createElement(
                    "p",
                    { className: "description" },
                    c.description
                  ),
                  _react2["default"].createElement("span", { className: "small" })
                )
              )
            );
          });
        }

        return items;
      }();
      var keys = Object.keys(obj).sort();
      var result = [];

      for (var k = 0; k < keys.length; k++) {

        result.push(_react2["default"].createElement(
          "div",
          { key: k, className: "program-bundle" },
          _react2["default"].createElement(
            "span",
            { className: "program-key" },
            keys[k]
          ),
          _react2["default"].createElement(
            "ul",
            null,
            items(obj[keys[k]])
          )
        ));
      }

      return result;
    }

    return programs;
  }(),

  render: function () {
    function render() {
      return _react2["default"].createElement(
        "div",
        { className: "program-group program-list" },
        this.programs()
      );
    }

    return render;
  }()
});

});

require.register("components/Tracker.jsx", function(exports, require, module) {
"use strict";

module.exports = function (channelId, channelImage, callback) {
    var url = GLOBAL_TRACKER_URL;
    var oReq = new XMLHttpRequest();
    var params = "channelId=" + channelId + "&channelImage=" + channelImage;
    oReq.open("POST", url, true);
    oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    oReq.onreadystatechange = function () {
        if (oReq.readyState == 4 && oReq.status == 200) {
            callback(oReq.responseText);
        }
    };
    oReq.send(params);
};

});

require.register("initialize.js", function(exports, require, module) {
'use strict';

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _App = require('components/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

document.addEventListener('DOMContentLoaded', function () {
  _reactDom2['default'].render(_react2['default'].createElement(_App2['default'], null), document.querySelector('#app'));
});

});

require.alias("assert/assert.js", "assert");
require.alias("buffer/index.js", "buffer");
require.alias("crypto-browserify/index.js", "crypto");
require.alias("events/events.js", "events");
require.alias("stream-http/index.js", "http");
require.alias("https-browserify/index.js", "https");
require.alias("os-browserify/browser.js", "os");
require.alias("path-browserify/index.js", "path");
require.alias("process/browser.js", "process");
require.alias("punycode/punycode.js", "punycode");
require.alias("querystring-es3/index.js", "querystring");
require.alias("stream-browserify/index.js", "stream");
require.alias("string_decoder/index.js", "string_decoder");
require.alias("util/util.js", "sys");
require.alias("url/url.js", "url");
require.alias("vm-browserify/index.js", "vm");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

