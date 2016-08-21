(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

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
    var hot = null;
    hot = hmr && hmr.createHot(name);
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
    if (typeof bundle === 'object') {
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
var global = window;
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
require.register("animations/Roll.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bulma = require("utils/bulma");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Roll = function () {
  function Roll() {
    _classCallCheck(this, Roll);
  }

  _createClass(Roll, null, [{
    key: "animate",
    value: function animate(ctrl, ele) {
      setTimeout(Roll.addClass(ele), Roll.timers.scalar(ele));
    }
  }, {
    key: "addClass",
    value: function addClass(ele) {
      return function () {
        return ele.classList.add(Roll.ranClass);
      };
    }
  }]);

  return Roll;
}();

exports.default = Roll;


Roll.timing = {
  x: 100,
  scalar: .5,
  initial: 500,
  fuzz: 7500
};

Roll.timers = {
  scalar: function scalar(ele) {
    var baseX = parseInt(ele.dataset.x);
    var baseY = parseInt(ele.dataset.y);

    return Roll.timing.initial + baseX * Roll.timing.x + Roll.timing.x * Roll.timing.scalar * baseY;
  }
};

Roll.ranClass = _bulma.raw.pale;
});

;require.register("components/Landscape.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mithril = require("mithril");

var _mithril2 = _interopRequireDefault(_mithril);

var _bulma = require("utils/bulma");

var _lazy = require("utils/lazy");

var _lazy2 = _interopRequireDefault(_lazy);

var _Matrix = require("utils/Matrix");

var _Matrix2 = _interopRequireDefault(_Matrix);

var _List = require("utils/List");

var _List2 = _interopRequireDefault(_List);

var _Coin = require("utils/Coin");

var _Coin2 = _interopRequireDefault(_Coin);

var _Euclidean = require("utils/Euclidean");

var _Euclidean2 = _interopRequireDefault(_Euclidean);

var _Roll = require("animations/Roll");

var _Roll2 = _interopRequireDefault(_Roll);

var _images = require("images");

var _images2 = _interopRequireDefault(_images);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function randomImage(images) {
  return "/images/" + images[Math.floor(Math.random() * images.length)];
}

function double(x) {
  return x * 2;
}

var Landscape = function () {
  _createClass(Landscape, null, [{
    key: "dimensions",
    value: function dimensions() {
      var x = _Euclidean2.default.nearestTen(window.innerWidth),
          y = _Euclidean2.default.nearestTen(window.innerHeight),
          gcd = _Euclidean2.default.gcd(x, y);

      var dimensions = [double(Math.floor(Math.pow(y / gcd, 1 / 3))), double(Math.floor(Math.pow(x / gcd, 1 / 3)))];

      return dimensions;
    }
  }, {
    key: "dataset",
    value: function dataset(ctrl) {
      return {
        className: _lazy2.default.class,
        "data-background": randomImage(_images2.default),
        config: function config(ele, isInitialized, ctx) {
          if (isInitialized) {
            return ctrl.animate();
          }

          ctrl.preload();

          (0, _lazy2.default)(ele).bind(ctrl).then(ctrl.reset).then(ctrl.animate);
        }
      };
    }
  }, {
    key: "column",
    value: function column(ctrl) {
      return function (row, x) {
        return _bulma.bulma.landscapeColumn({ "data-y": x }, row.map(Landscape.tile(ctrl, x)));
      };
    }
  }, {
    key: "tile",
    value: function tile(ctrl, x) {
      return function (_, y) {
        return _bulma.bulma.landscapeTile({
          "data-y": x,
          "data-x": y,
          onmouseenter: function onmouseenter(evt) {
            return evt.target.classList.add(_bulma.raw.zoom);
          },
          onmouseleave: function onmouseleave(evt) {
            return evt.target.classList.remove(_bulma.raw.zoom);
          },
          config: function config(ele, isInitialized, ctx) {
            if (isInitialized) return;

            ctrl.nodes.inactive.push(ele);

            ctrl.queue(function (_) {
              return _Roll2.default.animate(ctrl, ele);
            });
          }
        });
      };
    }
  }, {
    key: "view",
    value: function view(ctrl) {
      return (0, _mithril2.default)(_bulma.styles.landscape(), Landscape.dataset(ctrl), _bulma.bulma.headline((0, _mithril2.default)("h1", "Benjamin Clos"), (0, _mithril2.default)("h2", "Full / Stack")), _Matrix2.default.create.apply(_Matrix2.default, Landscape.dimensions()).map(Landscape.column(ctrl)));
    }
  }, {
    key: "controller",
    value: function controller(outer) {
      return new Landscape(outer);
    }
  }]);

  function Landscape(outer) {
    _classCallCheck(this, Landscape);

    this.schedule = [];
    this.nodes = {
      inactive: [],
      active: []
    };
  }

  _createClass(Landscape, [{
    key: "animate",
    value: function animate() {
      this.loaded = true;
      this.schedule.forEach(function (job) {
        return setTimeout(job, 0);
      });
    }
  }, {
    key: "queue",
    value: function queue(fn) {
      this.schedule.push(fn);
      return this;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.nodes.active.forEach(function (node) {
        return node.classList.remove(_bulma.raw.pixel);
      });
    }
  }, {
    key: "preload",
    value: function preload() {
      var _this = this;

      var _nodes = this.nodes;
      var active = _nodes.active;
      var inactive = _nodes.inactive;

      var again = function again() {
        return setTimeout(function (_) {
          return _this.preload();
        }, 100);
      };
      if (this.loaded) return;

      var _List$random = _List2.default.random(inactive);

      var _List$random2 = _slicedToArray(_List$random, 2);

      var ele = _List$random2[0];
      var rest = _List$random2[1];

      if (!ele) return again();

      this.nodes.inactive = rest;
      ele.classList.add(_bulma.raw.pixel);
      active.push(ele);

      if (active.length < 10) {
        return again();
      }

      var _List$random3 = _List2.default.random(active);

      var _List$random4 = _slicedToArray(_List$random3, 2);

      ele = _List$random4[0];
      rest = _List$random4[1];

      this.nodes.active = rest;
      ele.classList.remove(_bulma.raw.pixel);
      again();
    }
  }]);

  return Landscape;
}();

exports.default = Landscape;
});

;require.register("config/about.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = [{
  title: "hobbies",
  text: "I am an outdoor enthusiast who loves coffee, plants, and building things out of wood. During my younger years I played a lot of tennis, and still play on occassion, though my preference has shifted to soccer these days. I have a small, but growing collection of bonsai, carnivorous plants, and orchids. "
}, {
  title: "open source",
  text: "During high school I was lucky enough to take a class on javascript, and found it incredibly interesting. In college, I furthered my coding skills and taught myself more about web development as I studied business. My self-taught, nontraditional education in web development would not have been possible without the hard work of a lot of open source contributions which taught me an even more important skill, how to teach myself anything. As a product of those contributions, I try to keep that knowledge growing through publising codebases I've found useful, and sending pull requests when I feel I can contribute."
}];
});

;require.register("config/navigation.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = [{ href: "/", text: "home" }, { href: "/about", text: "about" }, { href: "external:/blog", text: "blog" }];
});

;require.register("config/social.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = [{ href: "external:https://github.com/ondreian", icon: "ion-social-github" }, { href: "external:https://twitter.com/benjaminclos", icon: "ion-social-twitter" }];
});

;require.register("images.js", function(exports, require, module) {
"use strict";

//this file is autogenerated
module.exports = ["fields.jpg", "gorge.jpg", "japan-garden.jpg", "moth.jpg", "mountains.jpg", "rock-face.jpg"];
});

;require.register("initialize.js", function(exports, require, module) {
"use strict";

var _mithril = require("mithril");

var _mithril2 = _interopRequireDefault(_mithril);

var _Home = require("views/Home");

var _Home2 = _interopRequireDefault(_Home);

var _About = require("views/About");

var _About2 = _interopRequireDefault(_About);

var _onlyEvery = require("utils/onlyEvery");

var _onlyEvery2 = _interopRequireDefault(_onlyEvery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function boot() {
  _mithril2.default.route(document.body, "/", {
    "/": _Home2.default,
    "/about": _About2.default
  });
}

window.onresize = (0, _onlyEvery2.default)(1000 / 28, _mithril2.default.redraw);

document.addEventListener('DOMContentLoaded', boot);
});

;require.register("layouts/App.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = App;

var _mithril = require("mithril");

var _mithril2 = _interopRequireDefault(_mithril);

var _navigation = require("config/navigation");

var _navigation2 = _interopRequireDefault(_navigation);

var _social = require("config/social");

var _social2 = _interopRequireDefault(_social);

var _bulma = require("utils/bulma");

var _onlyEvery = require("utils/onlyEvery");

var _onlyEvery2 = _interopRequireDefault(_onlyEvery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function route(href) {
  return function (evt) {
    if (href.match(/^external:/)) return;
    _mithril2.default.route(href);
    return false;
  };
}

function nav(items) {
  return _bulma.bulma.nav(_bulma.bulma.navCenter(items.map(function (item) {
    return (0, _mithril2.default)("a." + _bulma.styles.navItem() + "[href=" + item.href.replace(/^external:/, "") + "]", { onclick: route(item.href) }, !item.icon ? item.text : [(0, _mithril2.default)("i." + item.icon), item.text]);
  })));
}

function affix(ele) {
  if (!document.getElementsByClassName(_bulma.raw.landscape).length && !ele.classList.contains(_bulma.raw.detached)) {
    ele.classList.add(_bulma.raw.detached);
    return;
  }

  document.onscroll = (0, _onlyEvery2.default)(200, function (evt) {

    var isDetached = ele.classList.contains(_bulma.raw.detached);

    var atTop = window.scrollY <= 30;

    if (document.getElementsByClassName(_bulma.raw.landscape).length === 0) {
      return ele.classList.add(_bulma.raw.detached);
    }

    if (!atTop && isDetached) return;

    if (atTop && !isDetached) return;

    if (atTop && isDetached) {
      return ele.classList.remove(_bulma.raw.detached);
    }

    if (!atTop && !isDetached) {
      return ele.classList.add(_bulma.raw.detached);
    }
  });
}

/*
function persist (ele, isInitialized, ctx) {
  if (isInitialized) return
  ctx.retain = true
  affix(ele)
}
*/

function menu(name, items) {
  var className = _bulma.styles.isPaddingless(_bulma.styles.navigation(name));

  return _bulma.pipe.section(_bulma.pipe.container(nav(items)), className);
}

function header(items) {
  var className = _bulma.styles.navigation(_bulma.styles.top((0, _bulma.styles)()));

  var inner = _bulma.pipe.container(nav(items));

  return (0, _mithril2.default)(className, { config: affix }, inner);
}

function App(view) {
  return _bulma.bulma.app(header(_navigation2.default), view, menu(_bulma.styles.bottom(), _social2.default));
}
});

;require.register("styles/app.sass", function(exports, require, module) {
module.exports = {"block":"_block_kqw8u_238","box":"_box_kqw8u_238","content":"_content_kqw8u_238","notification":"_notification_kqw8u_238","progress":"_progress_kqw8u_238","title":"_title_kqw8u_238","subtitle":"_subtitle_kqw8u_239","highlight":"_highlight_kqw8u_239","level":"_level_kqw8u_239","message":"_message_kqw8u_239","tabs":"_tabs_kqw8u_239","container":"_container_kqw8u_242","is-fluid":"_is-fluid_kqw8u_248","fa":"_fa_kqw8u_255","is-block":"_is-block_kqw8u_260","is-block-mobile":"_is-block-mobile_kqw8u_264","is-block-tablet":"_is-block-tablet_kqw8u_268","is-block-tablet-only":"_is-block-tablet-only_kqw8u_272","is-block-touch":"_is-block-touch_kqw8u_276","is-block-desktop":"_is-block-desktop_kqw8u_280","is-block-desktop-only":"_is-block-desktop-only_kqw8u_284","is-block-widescreen":"_is-block-widescreen_kqw8u_288","is-flex":"_is-flex_kqw8u_291","is-flex-mobile":"_is-flex-mobile_kqw8u_295","is-flex-tablet":"_is-flex-tablet_kqw8u_299","is-flex-tablet-only":"_is-flex-tablet-only_kqw8u_303","is-flex-touch":"_is-flex-touch_kqw8u_307","is-flex-desktop":"_is-flex-desktop_kqw8u_311","is-flex-desktop-only":"_is-flex-desktop-only_kqw8u_315","is-flex-widescreen":"_is-flex-widescreen_kqw8u_319","is-inline":"_is-inline_kqw8u_322","is-inline-mobile":"_is-inline-mobile_kqw8u_326","is-inline-tablet":"_is-inline-tablet_kqw8u_330","is-inline-tablet-only":"_is-inline-tablet-only_kqw8u_334","is-inline-touch":"_is-inline-touch_kqw8u_338","is-inline-desktop":"_is-inline-desktop_kqw8u_342","is-inline-desktop-only":"_is-inline-desktop-only_kqw8u_346","is-inline-widescreen":"_is-inline-widescreen_kqw8u_350","is-inline-block":"_is-inline-block_kqw8u_353","is-inline-block-mobile":"_is-inline-block-mobile_kqw8u_357","is-inline-block-tablet":"_is-inline-block-tablet_kqw8u_361","is-inline-block-tablet-only":"_is-inline-block-tablet-only_kqw8u_365","is-inline-block-touch":"_is-inline-block-touch_kqw8u_369","is-inline-block-desktop":"_is-inline-block-desktop_kqw8u_373","is-inline-block-desktop-only":"_is-inline-block-desktop-only_kqw8u_377","is-inline-block-widescreen":"_is-inline-block-widescreen_kqw8u_381","is-inline-flex":"_is-inline-flex_kqw8u_384","is-inline-flex-mobile":"_is-inline-flex-mobile_kqw8u_388","is-inline-flex-tablet":"_is-inline-flex-tablet_kqw8u_392","is-inline-flex-tablet-only":"_is-inline-flex-tablet-only_kqw8u_396","is-inline-flex-touch":"_is-inline-flex-touch_kqw8u_400","is-inline-flex-desktop":"_is-inline-flex-desktop_kqw8u_404","is-inline-flex-desktop-only":"_is-inline-flex-desktop-only_kqw8u_408","is-inline-flex-widescreen":"_is-inline-flex-widescreen_kqw8u_412","is-clearfix":"_is-clearfix_kqw8u_415","is-pulled-left":"_is-pulled-left_kqw8u_420","is-pulled-right":"_is-pulled-right_kqw8u_423","is-clipped":"_is-clipped_kqw8u_426","is-overlay":"_is-overlay_kqw8u_429","has-text-centered":"_has-text-centered_kqw8u_436","has-text-left":"_has-text-left_kqw8u_439","has-text-right":"_has-text-right_kqw8u_442","is-hidden":"_is-hidden_kqw8u_445","is-hidden-mobile":"_is-hidden-mobile_kqw8u_449","is-hidden-tablet":"_is-hidden-tablet_kqw8u_453","is-hidden-tablet-only":"_is-hidden-tablet-only_kqw8u_457","is-hidden-touch":"_is-hidden-touch_kqw8u_461","is-hidden-desktop":"_is-hidden-desktop_kqw8u_465","is-hidden-desktop-only":"_is-hidden-desktop-only_kqw8u_469","is-hidden-widescreen":"_is-hidden-widescreen_kqw8u_473","is-disabled":"_is-disabled_kqw8u_476","is-marginless":"_is-marginless_kqw8u_479","button":"_button_kqw8u_494","is-active":"_is-active_kqw8u_518","icon":"_icon_kqw8u_541","tag":"_tag_kqw8u_542","is-white":"_is-white_kqw8u_553","is-inverted":"_is-inverted_kqw8u_563","is-loading":"_is-loading_kqw8u_568","is-outlined":"_is-outlined_kqw8u_570","is-black":"_is-black_kqw8u_578","is-light":"_is-light_kqw8u_603","is-dark":"_is-dark_kqw8u_628","is-primary":"_is-primary_kqw8u_653","is-info":"_is-info_kqw8u_678","is-success":"_is-success_kqw8u_703","is-warning":"_is-warning_kqw8u_728","is-danger":"_is-danger_kqw8u_753","is-link":"_is-link_kqw8u_778","is-small":"_is-small_kqw8u_786","is-medium":"_is-medium_kqw8u_793","is-large":"_is-large_kqw8u_798","is-fullwidth":"_is-fullwidth_kqw8u_805","input":"_input_kqw8u_886","textarea":"_textarea_kqw8u_886","checkbox":"_checkbox_kqw8u_980","radio":"_radio_kqw8u_980","select":"_select_kqw8u_999","label":"_label_kqw8u_1114","help":"_help_kqw8u_1121","control-label":"_control-label_kqw8u_1145","control":"_control_kqw8u_1145","has-addons":"_has-addons_kqw8u_1159","is-expanded":"_is-expanded_kqw8u_1202","has-addons-centered":"_has-addons-centered_kqw8u_1207","has-addons-right":"_has-addons-right_kqw8u_1209","has-addons-fullwidth":"_has-addons-fullwidth_kqw8u_1211","has-icon":"_has-icon_kqw8u_1216","has-icon-right":"_has-icon-right_kqw8u_1240","is-grouped":"_is-grouped_kqw8u_1272","is-grouped-centered":"_is-grouped-centered_kqw8u_1280","is-grouped-right":"_is-grouped-right_kqw8u_1282","is-horizontal":"_is-horizontal_kqw8u_1285","image":"_image_kqw8u_1295","is-square":"_is-square_kqw8u_1302","is-1by1":"_is-1by1_kqw8u_1302","is-4by3":"_is-4by3_kqw8u_1302","is-3by2":"_is-3by2_kqw8u_1302","is-16by9":"_is-16by9_kqw8u_1302","is-2by1":"_is-2by1_kqw8u_1302","is-16x16":"_is-16x16_kqw8u_1320","is-24x24":"_is-24x24_kqw8u_1323","is-32x32":"_is-32x32_kqw8u_1326","is-48x48":"_is-48x48_kqw8u_1329","is-64x64":"_is-64x64_kqw8u_1332","is-96x96":"_is-96x96_kqw8u_1335","is-128x128":"_is-128x128_kqw8u_1338","delete":"_delete_kqw8u_1351","modal-close":"_modal-close_kqw8u_1351","table":"_table_kqw8u_1445","is-icon":"_is-icon_kqw8u_1456","is-narrow":"_is-narrow_kqw8u_1488","is-bordered":"_is-bordered_kqw8u_1509","is-striped":"_is-striped_kqw8u_1533","is-1":"_is-1_kqw8u_1302","is-2":"_is-2_kqw8u_1302","is-3":"_is-3_kqw8u_1302","is-4":"_is-4_kqw8u_1302","is-5":"_is-5_kqw8u_1588","is-6":"_is-6_kqw8u_1332","is-normal":"_is-normal_kqw8u_1596","hamburger":"_hamburger_kqw8u_1722","nav-toggle":"_nav-toggle_kqw8u_1722","heading":"_heading_kqw8u_1760","loader":"_loader_kqw8u_1777","spin-around":"_spin-around_kqw8u_1","number":"_number_kqw8u_1789","unselectable":"_unselectable_kqw8u_1860","is-unselectable":"_is-unselectable_kqw8u_1860","card-header":"_card-header_kqw8u_1867","card-header-title":"_card-header-title_kqw8u_1873","card-header-icon":"_card-header-icon_kqw8u_1881","card-image":"_card-image_kqw8u_1888","card-content":"_card-content_kqw8u_1892","card-footer":"_card-footer_kqw8u_1897","card-footer-item":"_card-footer-item_kqw8u_1902","card":"_card_kqw8u_1867","media":"_media_kqw8u_1918","is-rounded":"_is-rounded_kqw8u_1922","column":"_column_kqw8u_1925","columns":"_columns_kqw8u_1930","is-mobile":"_is-mobile_kqw8u_1930","is-full":"_is-full_kqw8u_805","is-three-quarters":"_is-three-quarters_kqw8u_1935","is-two-thirds":"_is-two-thirds_kqw8u_1938","is-half":"_is-half_kqw8u_1941","is-one-third":"_is-one-third_kqw8u_1944","is-one-quarter":"_is-one-quarter_kqw8u_1947","is-offset-three-quarters":"_is-offset-three-quarters_kqw8u_1950","is-offset-two-thirds":"_is-offset-two-thirds_kqw8u_1952","is-offset-half":"_is-offset-half_kqw8u_1954","is-offset-one-third":"_is-offset-one-third_kqw8u_1956","is-offset-one-quarter":"_is-offset-one-quarter_kqw8u_1958","is-offset-1":"_is-offset-1_kqw8u_1963","is-offset-2":"_is-offset-2_kqw8u_1968","is-offset-3":"_is-offset-3_kqw8u_1973","is-offset-4":"_is-offset-4_kqw8u_1978","is-offset-5":"_is-offset-5_kqw8u_1983","is-offset-6":"_is-offset-6_kqw8u_1988","is-7":"_is-7_kqw8u_1990","is-offset-7":"_is-offset-7_kqw8u_1993","is-8":"_is-8_kqw8u_1995","is-offset-8":"_is-offset-8_kqw8u_1998","is-9":"_is-9_kqw8u_1335","is-offset-9":"_is-offset-9_kqw8u_2003","is-10":"_is-10_kqw8u_2005","is-offset-10":"_is-offset-10_kqw8u_2008","is-11":"_is-11_kqw8u_2010","is-offset-11":"_is-offset-11_kqw8u_2013","is-12":"_is-12_kqw8u_1338","is-offset-12":"_is-offset-12_kqw8u_2018","is-narrow-mobile":"_is-narrow-mobile_kqw8u_2021","is-full-mobile":"_is-full-mobile_kqw8u_2023","is-three-quarters-mobile":"_is-three-quarters-mobile_kqw8u_2026","is-two-thirds-mobile":"_is-two-thirds-mobile_kqw8u_2029","is-half-mobile":"_is-half-mobile_kqw8u_2032","is-one-third-mobile":"_is-one-third-mobile_kqw8u_2035","is-one-quarter-mobile":"_is-one-quarter-mobile_kqw8u_2038","is-offset-three-quarters-mobile":"_is-offset-three-quarters-mobile_kqw8u_2041","is-offset-two-thirds-mobile":"_is-offset-two-thirds-mobile_kqw8u_2043","is-offset-half-mobile":"_is-offset-half-mobile_kqw8u_2045","is-offset-one-third-mobile":"_is-offset-one-third-mobile_kqw8u_2047","is-offset-one-quarter-mobile":"_is-offset-one-quarter-mobile_kqw8u_2049","is-1-mobile":"_is-1-mobile_kqw8u_2051","is-offset-1-mobile":"_is-offset-1-mobile_kqw8u_2054","is-2-mobile":"_is-2-mobile_kqw8u_2056","is-offset-2-mobile":"_is-offset-2-mobile_kqw8u_2059","is-3-mobile":"_is-3-mobile_kqw8u_2061","is-offset-3-mobile":"_is-offset-3-mobile_kqw8u_2064","is-4-mobile":"_is-4-mobile_kqw8u_2066","is-offset-4-mobile":"_is-offset-4-mobile_kqw8u_2069","is-5-mobile":"_is-5-mobile_kqw8u_2071","is-offset-5-mobile":"_is-offset-5-mobile_kqw8u_2074","is-6-mobile":"_is-6-mobile_kqw8u_2076","is-offset-6-mobile":"_is-offset-6-mobile_kqw8u_2079","is-7-mobile":"_is-7-mobile_kqw8u_2081","is-offset-7-mobile":"_is-offset-7-mobile_kqw8u_2084","is-8-mobile":"_is-8-mobile_kqw8u_2086","is-offset-8-mobile":"_is-offset-8-mobile_kqw8u_2089","is-9-mobile":"_is-9-mobile_kqw8u_2091","is-offset-9-mobile":"_is-offset-9-mobile_kqw8u_2094","is-10-mobile":"_is-10-mobile_kqw8u_2096","is-offset-10-mobile":"_is-offset-10-mobile_kqw8u_2099","is-11-mobile":"_is-11-mobile_kqw8u_2101","is-offset-11-mobile":"_is-offset-11-mobile_kqw8u_2104","is-12-mobile":"_is-12-mobile_kqw8u_2106","is-offset-12-mobile":"_is-offset-12-mobile_kqw8u_2109","is-narrow-tablet":"_is-narrow-tablet_kqw8u_2112","is-full-tablet":"_is-full-tablet_kqw8u_2114","is-three-quarters-tablet":"_is-three-quarters-tablet_kqw8u_2117","is-two-thirds-tablet":"_is-two-thirds-tablet_kqw8u_2120","is-half-tablet":"_is-half-tablet_kqw8u_2123","is-one-third-tablet":"_is-one-third-tablet_kqw8u_2126","is-one-quarter-tablet":"_is-one-quarter-tablet_kqw8u_2129","is-offset-three-quarters-tablet":"_is-offset-three-quarters-tablet_kqw8u_2132","is-offset-two-thirds-tablet":"_is-offset-two-thirds-tablet_kqw8u_2134","is-offset-half-tablet":"_is-offset-half-tablet_kqw8u_2136","is-offset-one-third-tablet":"_is-offset-one-third-tablet_kqw8u_2138","is-offset-one-quarter-tablet":"_is-offset-one-quarter-tablet_kqw8u_2140","is-1-tablet":"_is-1-tablet_kqw8u_2142","is-offset-1-tablet":"_is-offset-1-tablet_kqw8u_2145","is-2-tablet":"_is-2-tablet_kqw8u_2147","is-offset-2-tablet":"_is-offset-2-tablet_kqw8u_2150","is-3-tablet":"_is-3-tablet_kqw8u_2152","is-offset-3-tablet":"_is-offset-3-tablet_kqw8u_2155","is-4-tablet":"_is-4-tablet_kqw8u_2157","is-offset-4-tablet":"_is-offset-4-tablet_kqw8u_2160","is-5-tablet":"_is-5-tablet_kqw8u_2162","is-offset-5-tablet":"_is-offset-5-tablet_kqw8u_2165","is-6-tablet":"_is-6-tablet_kqw8u_2167","is-offset-6-tablet":"_is-offset-6-tablet_kqw8u_2170","is-7-tablet":"_is-7-tablet_kqw8u_2172","is-offset-7-tablet":"_is-offset-7-tablet_kqw8u_2175","is-8-tablet":"_is-8-tablet_kqw8u_2177","is-offset-8-tablet":"_is-offset-8-tablet_kqw8u_2180","is-9-tablet":"_is-9-tablet_kqw8u_2182","is-offset-9-tablet":"_is-offset-9-tablet_kqw8u_2185","is-10-tablet":"_is-10-tablet_kqw8u_2187","is-offset-10-tablet":"_is-offset-10-tablet_kqw8u_2190","is-11-tablet":"_is-11-tablet_kqw8u_2192","is-offset-11-tablet":"_is-offset-11-tablet_kqw8u_2195","is-12-tablet":"_is-12-tablet_kqw8u_2197","is-offset-12-tablet":"_is-offset-12-tablet_kqw8u_2200","is-narrow-desktop":"_is-narrow-desktop_kqw8u_2203","is-full-desktop":"_is-full-desktop_kqw8u_2205","is-three-quarters-desktop":"_is-three-quarters-desktop_kqw8u_2208","is-two-thirds-desktop":"_is-two-thirds-desktop_kqw8u_2211","is-half-desktop":"_is-half-desktop_kqw8u_2214","is-one-third-desktop":"_is-one-third-desktop_kqw8u_2217","is-one-quarter-desktop":"_is-one-quarter-desktop_kqw8u_2220","is-offset-three-quarters-desktop":"_is-offset-three-quarters-desktop_kqw8u_2223","is-offset-two-thirds-desktop":"_is-offset-two-thirds-desktop_kqw8u_2225","is-offset-half-desktop":"_is-offset-half-desktop_kqw8u_2227","is-offset-one-third-desktop":"_is-offset-one-third-desktop_kqw8u_2229","is-offset-one-quarter-desktop":"_is-offset-one-quarter-desktop_kqw8u_2231","is-1-desktop":"_is-1-desktop_kqw8u_2233","is-offset-1-desktop":"_is-offset-1-desktop_kqw8u_2236","is-2-desktop":"_is-2-desktop_kqw8u_2238","is-offset-2-desktop":"_is-offset-2-desktop_kqw8u_2241","is-3-desktop":"_is-3-desktop_kqw8u_2243","is-offset-3-desktop":"_is-offset-3-desktop_kqw8u_2246","is-4-desktop":"_is-4-desktop_kqw8u_2248","is-offset-4-desktop":"_is-offset-4-desktop_kqw8u_2251","is-5-desktop":"_is-5-desktop_kqw8u_2253","is-offset-5-desktop":"_is-offset-5-desktop_kqw8u_2256","is-6-desktop":"_is-6-desktop_kqw8u_2258","is-offset-6-desktop":"_is-offset-6-desktop_kqw8u_2261","is-7-desktop":"_is-7-desktop_kqw8u_2263","is-offset-7-desktop":"_is-offset-7-desktop_kqw8u_2266","is-8-desktop":"_is-8-desktop_kqw8u_2268","is-offset-8-desktop":"_is-offset-8-desktop_kqw8u_2271","is-9-desktop":"_is-9-desktop_kqw8u_2273","is-offset-9-desktop":"_is-offset-9-desktop_kqw8u_2276","is-10-desktop":"_is-10-desktop_kqw8u_2278","is-offset-10-desktop":"_is-offset-10-desktop_kqw8u_2281","is-11-desktop":"_is-11-desktop_kqw8u_2283","is-offset-11-desktop":"_is-offset-11-desktop_kqw8u_2286","is-12-desktop":"_is-12-desktop_kqw8u_2288","is-offset-12-desktop":"_is-offset-12-desktop_kqw8u_2291","is-narrow-widescreen":"_is-narrow-widescreen_kqw8u_2294","is-full-widescreen":"_is-full-widescreen_kqw8u_2296","is-three-quarters-widescreen":"_is-three-quarters-widescreen_kqw8u_2299","is-two-thirds-widescreen":"_is-two-thirds-widescreen_kqw8u_2302","is-half-widescreen":"_is-half-widescreen_kqw8u_2305","is-one-third-widescreen":"_is-one-third-widescreen_kqw8u_2308","is-one-quarter-widescreen":"_is-one-quarter-widescreen_kqw8u_2311","is-offset-three-quarters-widescreen":"_is-offset-three-quarters-widescreen_kqw8u_2314","is-offset-two-thirds-widescreen":"_is-offset-two-thirds-widescreen_kqw8u_2316","is-offset-half-widescreen":"_is-offset-half-widescreen_kqw8u_2318","is-offset-one-third-widescreen":"_is-offset-one-third-widescreen_kqw8u_2320","is-offset-one-quarter-widescreen":"_is-offset-one-quarter-widescreen_kqw8u_2322","is-1-widescreen":"_is-1-widescreen_kqw8u_2324","is-offset-1-widescreen":"_is-offset-1-widescreen_kqw8u_2327","is-2-widescreen":"_is-2-widescreen_kqw8u_2329","is-offset-2-widescreen":"_is-offset-2-widescreen_kqw8u_2332","is-3-widescreen":"_is-3-widescreen_kqw8u_2334","is-offset-3-widescreen":"_is-offset-3-widescreen_kqw8u_2337","is-4-widescreen":"_is-4-widescreen_kqw8u_2339","is-offset-4-widescreen":"_is-offset-4-widescreen_kqw8u_2342","is-5-widescreen":"_is-5-widescreen_kqw8u_2344","is-offset-5-widescreen":"_is-offset-5-widescreen_kqw8u_2347","is-6-widescreen":"_is-6-widescreen_kqw8u_2349","is-offset-6-widescreen":"_is-offset-6-widescreen_kqw8u_2352","is-7-widescreen":"_is-7-widescreen_kqw8u_2354","is-offset-7-widescreen":"_is-offset-7-widescreen_kqw8u_2357","is-8-widescreen":"_is-8-widescreen_kqw8u_2359","is-offset-8-widescreen":"_is-offset-8-widescreen_kqw8u_2362","is-9-widescreen":"_is-9-widescreen_kqw8u_2364","is-offset-9-widescreen":"_is-offset-9-widescreen_kqw8u_2367","is-10-widescreen":"_is-10-widescreen_kqw8u_2369","is-offset-10-widescreen":"_is-offset-10-widescreen_kqw8u_2372","is-11-widescreen":"_is-11-widescreen_kqw8u_2374","is-offset-11-widescreen":"_is-offset-11-widescreen_kqw8u_2377","is-12-widescreen":"_is-12-widescreen_kqw8u_2379","is-offset-12-widescreen":"_is-offset-12-widescreen_kqw8u_2382","is-centered":"_is-centered_kqw8u_2393","is-gapless":"_is-gapless_kqw8u_2395","is-grid":"_is-grid_kqw8u_2407","is-multiline":"_is-multiline_kqw8u_2417","is-vcentered":"_is-vcentered_kqw8u_2419","is-desktop":"_is-desktop_kqw8u_2422","tile":"_tile_kqw8u_2428","is-ancestor":"_is-ancestor_kqw8u_2434","is-child":"_is-child_kqw8u_2442","is-parent":"_is-parent_kqw8u_2444","is-vertical":"_is-vertical_kqw8u_2446","c":"_c_kqw8u_238","err":"_err_kqw8u_2495","g":"_g_kqw8u_2496","k":"_k_kqw8u_2498","l":"_l_kqw8u_239","n":"_n_kqw8u_238","o":"_o_kqw8u_2503","x":"_x_kqw8u_2505","p":"_p_kqw8u_238","cm":"_cm_kqw8u_2509","cp":"_cp_kqw8u_2511","c1":"_c1_kqw8u_2513","cs":"_cs_kqw8u_2515","gd":"_gd_kqw8u_2517","ge":"_ge_kqw8u_2519","gr":"_gr_kqw8u_2522","gh":"_gh_kqw8u_2524","gi":"_gi_kqw8u_2526","go":"_go_kqw8u_2528","gp":"_gp_kqw8u_2529","gs":"_gs_kqw8u_2531","gu":"_gu_kqw8u_2534","gt":"_gt_kqw8u_2536","kc":"_kc_kqw8u_2538","kd":"_kd_kqw8u_2540","kn":"_kn_kqw8u_2542","kp":"_kp_kqw8u_2543","kr":"_kr_kqw8u_2545","kt":"_kt_kqw8u_2547","ld":"_ld_kqw8u_2549","m":"_m_kqw8u_239","s":"_s_kqw8u_239","na":"_na_kqw8u_1722","nb":"_nb_kqw8u_2556","nc":"_nc_kqw8u_2558","no":"_no_kqw8u_238","nd":"_nd_kqw8u_2562","ni":"_ni_kqw8u_2564","ne":"_ne_kqw8u_2565","nf":"_nf_kqw8u_2567","nl":"_nl_kqw8u_2569","nn":"_nn_kqw8u_2570","nx":"_nx_kqw8u_2571","py":"_py_kqw8u_2572","nt":"_nt_kqw8u_2574","nv":"_nv_kqw8u_2575","ow":"_ow_kqw8u_2577","w":"_w_kqw8u_2579","mf":"_mf_kqw8u_2581","mh":"_mh_kqw8u_2582","mi":"_mi_kqw8u_2583","mo":"_mo_kqw8u_1351","sb":"_sb_kqw8u_2586","sc":"_sc_kqw8u_2588","sd":"_sd_kqw8u_2590","s2":"_s2_kqw8u_2592","se":"_se_kqw8u_999","sh":"_sh_kqw8u_2596","si":"_si_kqw8u_2598","sx":"_sx_kqw8u_2599","sr":"_sr_kqw8u_2601","s1":"_s1_kqw8u_2603","ss":"_ss_kqw8u_2604","bp":"_bp_kqw8u_2606","vc":"_vc_kqw8u_2607","vg":"_vg_kqw8u_2608","vi":"_vi_kqw8u_2609","il":"_il_kqw8u_2611","level-item":"_level-item_kqw8u_2614","level-left":"_level-left_kqw8u_2621","level-right":"_level-right_kqw8u_2622","is-flexible":"_is-flexible_kqw8u_2624","media-number":"_media-number_kqw8u_2662","media-left":"_media-left_kqw8u_2680","media-right":"_media-right_kqw8u_2683","media-content":"_media-content_kqw8u_2686","menu-nav":"_menu-nav_kqw8u_2718","menu-list":"_menu-list_kqw8u_2722","menu-label":"_menu-label_kqw8u_2738","message-body":"_message-body_kqw8u_2747","message-header":"_message-header_kqw8u_2754","modal-background":"_modal-background_kqw8u_2841","modal-content":"_modal-content_kqw8u_2849","modal-card":"_modal-card_kqw8u_2849","modal-card-head":"_modal-card-head_kqw8u_2877","modal-card-foot":"_modal-card-foot_kqw8u_2878","modal-card-title":"_modal-card-title_kqw8u_2890","modal-card-body":"_modal-card-body_kqw8u_2901","modal":"_modal_kqw8u_1351","nav-item":"_nav-item_kqw8u_2925","is-tab":"_is-tab_kqw8u_2953","nav-menu":"_nav-menu_kqw8u_2970","nav-left":"_nav-left_kqw8u_2987","nav-center":"_nav-center_kqw8u_2997","nav-right":"_nav-right_kqw8u_3005","nav":"_nav_kqw8u_1722","has-shadow":"_has-shadow_kqw8u_3033","is-brand":"_is-brand_kqw8u_3036","pagination":"_pagination_kqw8u_3039","panel-icon":"_panel-icon_kqw8u_3074","panel-heading":"_panel-heading_kqw8u_3089","panel-list":"_panel-list_kqw8u_3098","panel-tabs":"_panel-tabs_kqw8u_3103","panel-block":"_panel-block_kqw8u_3118","panel":"_panel_kqw8u_3074","is-left":"_is-left_kqw8u_3166","is-center":"_is-center_kqw8u_2393","is-right":"_is-right_kqw8u_3173","is-boxed":"_is-boxed_kqw8u_3184","is-toggle":"_is-toggle_kqw8u_3198","hero-video":"_hero-video_kqw8u_3243","is-transparent":"_is-transparent_kqw8u_3257","hero-buttons":"_hero-buttons_kqw8u_3263","hero-head":"_hero-head_kqw8u_3277","hero-foot":"_hero-foot_kqw8u_3278","hero-body":"_hero-body_kqw8u_3281","hero":"_hero_kqw8u_3243","is-bold":"_is-bold_kqw8u_3340","is-fullheight":"_is-fullheight_kqw8u_3767","section":"_section_kqw8u_3775","footer":"_footer_kqw8u_3784","app":"_app_kqw8u_3804","main":"_main_kqw8u_3810","is-paddingless":"_is-paddingless_kqw8u_3814","header":"_header_kqw8u_3828","navigation":"_navigation_kqw8u_3838","top":"_top_kqw8u_3838","detached":"_detached_kqw8u_3855","landscape":"_landscape_kqw8u_3860","landscape-column":"_landscape-column_kqw8u_3867","landscape-tile":"_landscape-tile_kqw8u_3872","pale":"_pale_kqw8u_3878","pixel":"_pixel_kqw8u_3880","headline":"_headline_kqw8u_3882","bottom":"_bottom_kqw8u_3901","about":"_about_kqw8u_3910"};
});

require.register("styles/blog.sass", function(exports, require, module) {
module.exports = {"tag-list":"_tag-list_1hkab_14","index":"_index_1hkab_17","title":"_title_1hkab_21","tag":"_tag_1hkab_14","tldr":"_tldr_1hkab_27","content":"_content_1hkab_37"};
});

require.register("utils/Coin.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Coin = function () {
  function Coin() {
    _classCallCheck(this, Coin);
  }

  _createClass(Coin, null, [{
    key: "toss",
    value: function toss() {
      return Math.random() > .5;
    }
  }]);

  return Coin;
}();

exports.default = Coin;
});

;require.register("utils/Euclidean.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Euclidean = function () {
  function Euclidean() {
    _classCallCheck(this, Euclidean);
  }

  _createClass(Euclidean, null, [{
    key: "gcd",
    value: function gcd(x, y) {
      // make it order agnostic
      var _sort = [x, y].sort(function (a, b) {
        return b - a;
      });

      var _sort2 = _slicedToArray(_sort, 2);

      var max = _sort2[0];
      var min = _sort2[1];

      if (min === 0) return max;
      return Euclidean.gcd(min, max % min);
    }
  }, {
    key: "nearestTen",
    value: function nearestTen(x) {
      return Math.round(x * 10) / 10;
    }
  }]);

  return Euclidean;
}();

exports.default = Euclidean;
});

;require.register("utils/List.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var List = function () {
  function List() {
    _classCallCheck(this, List);
  }

  _createClass(List, null, [{
    key: "random",
    value: function random(list) {
      var idx = Math.floor(Math.random() * list.length);
      return [list[idx], list.filter(function (_, i) {
        return i != idx;
      })];
    }
  }]);

  return List;
}();

exports.default = List;
});

;require.register("utils/Matrix.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ZERO = 0;

function zeroedArray(x) {
  return Array(x).fill(ZERO);
}

function abs(n) {
  return Math.abs(n);
}

var Matrix = function () {
  _createClass(Matrix, null, [{
    key: "create",
    value: function create(width, height) {
      return new Matrix(width, height);
    }
  }, {
    key: "square",
    value: function square(n) {
      return new Matrix(n, n);
    }
  }]);

  function Matrix(width, height) {
    _classCallCheck(this, Matrix);

    this.rows = zeroedArray(height).map(function (_) {
      return zeroedArray(width);
    });
  }

  _createClass(Matrix, [{
    key: "map",
    value: function map() {
      return this.rows.map.apply(this.rows, arguments);
    }
  }]);

  return Matrix;
}();

exports.default = Matrix;


Matrix.random = {
  square: function square() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _args$map = args.map(abs);

    var _args$map2 = _slicedToArray(_args$map, 2);

    var min = _args$map2[0];
    var max = _args$map2[1];

    var n = Math.floor(Math.random() * (max - min + 1)) + min;
    return Matrix.square(n);
  }
};
});

;require.register("utils/Wrapper.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = require("eventemitter2");

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Wrapper = function (_EventEmitter) {
  _inherits(Wrapper, _EventEmitter);

  _createClass(Wrapper, null, [{
    key: "create",
    value: function create(ele) {
      return new Wrapper(ele);
    }
  }, {
    key: "isOnable",
    value: function isOnable(key) {
      return key[0] === "o" && key[1] === "n";
    }
  }, {
    key: "pair",
    value: function pair(key) {
      return [key, key.slice(2, key.length)];
    }
  }]);

  function Wrapper(ele) {
    _classCallCheck(this, Wrapper);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Wrapper).call(this));

    Object.keys(ele).filter(Wrapper.isOnable).map(Wrapper.pair).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var native = _ref2[0];
      var wrapped = _ref2[1];

      ele[native] = function (evt) {
        return _this.emit(wrapped, evt);
      };
      _this[wrapped] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        args.shift(wrapped);
        _this.on.apply(_this, args);
        return false;
      };
    });
    return _this;
  }

  return Wrapper;
}(_eventemitter2.default);

exports.default = Wrapper;
});

;require.register("utils/bulma.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pipe = exports.bulma = exports.styles = exports.raw = undefined;

var _mithril = require("mithril");

var _mithril2 = _interopRequireDefault(_mithril);

var _app = require("styles/app");

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classNames = Object.keys(_app2.default);

function camelCaseCSS(str) {
  return str.split("-").reduce(function (dromedary, str, i) {
    if (i == 0) return dromedary + str;
    return dromedary + str.charAt(0).toUpperCase() + str.slice(1);
  }, "");
}

function argParser(className) {
  return function (args) {
    if (typeof args[0] === "string") {
      args[0] = className + args[0];
    } else {
      args.unshift(className);
    }
    return args;
  };
}

var raw = exports.raw = classNames.reduce(function (raw, className) {
  raw[camelCaseCSS(className)] = _app2.default[className];
  return raw;
}, {});

var styles = exports.styles = classNames.reduce(function (styles, className) {
  styles[camelCaseCSS(className)] = function (prev) {
    var dynamicClass = "." + _app2.default[className];
    return !prev ? dynamicClass : prev + dynamicClass;
  };
  return styles;
}, function (className) {
  return className ? "." + className : "";
});

/**
 * translates all of our CSS definitions to Mithril definitions
 *
 * @type       {Object}
 */
var bulma = exports.bulma = classNames.reduce(function (helpers, className) {
  var parser = argParser("." + _app2.default[className]);
  helpers[camelCaseCSS(className)] = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    //console.log("ele : ", parser(args),  m.apply( m, parser(args) ))
    return _mithril2.default.apply(_mithril2.default, parser(args));
  };
  return helpers;
}, {});

/**
 * functional pipeline operators
 * 
 * @type       {Object}
 * 
 * @example
 *    eles
 *      |> pipe.ol(".example")
 */
var pipe = exports.pipe = classNames.reduce(function (helpers, className) {
  var parser = argParser("." + _app2.default[className]);

  helpers[camelCaseCSS(className)] = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    args.push(args.shift());
    return _mithril2.default.apply(_mithril2.default, parser(args));
  };
  return helpers;
}, {});
});

;require.register("utils/lazy.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Lazy;

var _mithril = require("mithril");

var _mithril2 = _interopRequireDefault(_mithril);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Lazy() {
  return Lazy.elements().map(Lazy.fetch);
}

Lazy.elements = function elements() {
  return _bluebird2.default.resolve([].slice.call(document.getElementsByClassName(Lazy.class)));
};

Lazy.class = "lazy";

Lazy.fetch = function fetch(ele) {

  if (!ele.dataset.background) throw new Error("no data-background attribute found");

  var lazy = new Image();

  return new _bluebird2.default(function (resolve, reject) {
    lazy.onload = function () {
      ele.style.backgroundImage = "url(" + ele.dataset.background + ")";
      resolve(ele);
    };

    lazy.onerror = reject;

    lazy.src = ele.dataset.background;
  });
};
});

;require.register("utils/onlyEvery.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = onlyEvery;
function onlyEvery(wait, fn) {
  var running = false;
  return function ratelimited() {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (running) return;
    running = setTimeout(function () {
      running = false;
      return fn.apply(_this, args);
    }, wait);
  };
}
});

;require.register("views/About.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mithril = require("mithril");

var _mithril2 = _interopRequireDefault(_mithril);

var _App = require("layouts/App");

var _App2 = _interopRequireDefault(_App);

var _bulma = require("utils/bulma");

var _about = require("config/about");

var _about2 = _interopRequireDefault(_about);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var About = function () {
  function About() {
    _classCallCheck(this, About);
  }

  _createClass(About, null, [{
    key: "controller",
    value: function controller() {}
  }, {
    key: "width",
    value: function width() {
      return _bulma.styles.isOffset4(_bulma.styles.is4(_bulma.styles.about()));
    }
  }, {
    key: "wrapper",
    value: function wrapper(view) {
      return _bulma.pipe.main(_bulma.pipe.columns(_bulma.pipe.column(_bulma.pipe.content(view), About.width())), _bulma.styles.section());
    }
  }, {
    key: "cipher",
    value: function cipher(text) {
      return atob(text);
    }
  }, {
    key: "section",
    value: function section(_ref) {
      var title = _ref.title;
      var text = _ref.text;

      return _bulma.bulma.section((0, _mithril2.default)('h3', title), (0, _mithril2.default)('p', text));
    }
  }, {
    key: "view",
    value: function view() {
      return (0, _App2.default)(About.wrapper(_about2.default.map(About.section)));
    }
  }]);

  return About;
}();

exports.default = About;
});

;require.register("views/Home.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mithril = require("mithril");

var _mithril2 = _interopRequireDefault(_mithril);

var _App = require("layouts/App");

var _App2 = _interopRequireDefault(_App);

var _bulma = require("utils/bulma");

var _Landscape = require("components/Landscape");

var _Landscape2 = _interopRequireDefault(_Landscape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Home = function () {
  function Home() {
    _classCallCheck(this, Home);
  }

  _createClass(Home, null, [{
    key: "controller",
    value: function controller() {
      return new Home();
    }
  }, {
    key: "view",
    value: function view(ctrl) {
      return (0, _App2.default)(_mithril2.default.component(_Landscape2.default, ctrl));
    }
  }]);

  return Home;
}();

exports.default = Home;
});

;require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map