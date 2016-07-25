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
  initial: 1000,
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        "data-background": "/images/fields.jpg",
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
module.exports = {"block":"_block_5bt5x_238","box":"_box_5bt5x_238","content":"_content_5bt5x_238","notification":"_notification_5bt5x_238","progress":"_progress_5bt5x_238","title":"_title_5bt5x_238","subtitle":"_subtitle_5bt5x_239","highlight":"_highlight_5bt5x_239","level":"_level_5bt5x_239","message":"_message_5bt5x_239","tabs":"_tabs_5bt5x_239","container":"_container_5bt5x_242","is-fluid":"_is-fluid_5bt5x_248","fa":"_fa_5bt5x_255","is-block":"_is-block_5bt5x_260","is-block-mobile":"_is-block-mobile_5bt5x_264","is-block-tablet":"_is-block-tablet_5bt5x_268","is-block-tablet-only":"_is-block-tablet-only_5bt5x_272","is-block-touch":"_is-block-touch_5bt5x_276","is-block-desktop":"_is-block-desktop_5bt5x_280","is-block-desktop-only":"_is-block-desktop-only_5bt5x_284","is-block-widescreen":"_is-block-widescreen_5bt5x_288","is-flex":"_is-flex_5bt5x_291","is-flex-mobile":"_is-flex-mobile_5bt5x_295","is-flex-tablet":"_is-flex-tablet_5bt5x_299","is-flex-tablet-only":"_is-flex-tablet-only_5bt5x_303","is-flex-touch":"_is-flex-touch_5bt5x_307","is-flex-desktop":"_is-flex-desktop_5bt5x_311","is-flex-desktop-only":"_is-flex-desktop-only_5bt5x_315","is-flex-widescreen":"_is-flex-widescreen_5bt5x_319","is-inline":"_is-inline_5bt5x_322","is-inline-mobile":"_is-inline-mobile_5bt5x_326","is-inline-tablet":"_is-inline-tablet_5bt5x_330","is-inline-tablet-only":"_is-inline-tablet-only_5bt5x_334","is-inline-touch":"_is-inline-touch_5bt5x_338","is-inline-desktop":"_is-inline-desktop_5bt5x_342","is-inline-desktop-only":"_is-inline-desktop-only_5bt5x_346","is-inline-widescreen":"_is-inline-widescreen_5bt5x_350","is-inline-block":"_is-inline-block_5bt5x_353","is-inline-block-mobile":"_is-inline-block-mobile_5bt5x_357","is-inline-block-tablet":"_is-inline-block-tablet_5bt5x_361","is-inline-block-tablet-only":"_is-inline-block-tablet-only_5bt5x_365","is-inline-block-touch":"_is-inline-block-touch_5bt5x_369","is-inline-block-desktop":"_is-inline-block-desktop_5bt5x_373","is-inline-block-desktop-only":"_is-inline-block-desktop-only_5bt5x_377","is-inline-block-widescreen":"_is-inline-block-widescreen_5bt5x_381","is-inline-flex":"_is-inline-flex_5bt5x_384","is-inline-flex-mobile":"_is-inline-flex-mobile_5bt5x_388","is-inline-flex-tablet":"_is-inline-flex-tablet_5bt5x_392","is-inline-flex-tablet-only":"_is-inline-flex-tablet-only_5bt5x_396","is-inline-flex-touch":"_is-inline-flex-touch_5bt5x_400","is-inline-flex-desktop":"_is-inline-flex-desktop_5bt5x_404","is-inline-flex-desktop-only":"_is-inline-flex-desktop-only_5bt5x_408","is-inline-flex-widescreen":"_is-inline-flex-widescreen_5bt5x_412","is-clearfix":"_is-clearfix_5bt5x_415","is-pulled-left":"_is-pulled-left_5bt5x_420","is-pulled-right":"_is-pulled-right_5bt5x_423","is-clipped":"_is-clipped_5bt5x_426","is-overlay":"_is-overlay_5bt5x_429","has-text-centered":"_has-text-centered_5bt5x_436","has-text-left":"_has-text-left_5bt5x_439","has-text-right":"_has-text-right_5bt5x_442","is-hidden":"_is-hidden_5bt5x_445","is-hidden-mobile":"_is-hidden-mobile_5bt5x_449","is-hidden-tablet":"_is-hidden-tablet_5bt5x_453","is-hidden-tablet-only":"_is-hidden-tablet-only_5bt5x_457","is-hidden-touch":"_is-hidden-touch_5bt5x_461","is-hidden-desktop":"_is-hidden-desktop_5bt5x_465","is-hidden-desktop-only":"_is-hidden-desktop-only_5bt5x_469","is-hidden-widescreen":"_is-hidden-widescreen_5bt5x_473","is-disabled":"_is-disabled_5bt5x_476","is-marginless":"_is-marginless_5bt5x_479","button":"_button_5bt5x_494","is-active":"_is-active_5bt5x_518","icon":"_icon_5bt5x_541","tag":"_tag_5bt5x_542","is-white":"_is-white_5bt5x_553","is-inverted":"_is-inverted_5bt5x_563","is-loading":"_is-loading_5bt5x_568","is-outlined":"_is-outlined_5bt5x_570","is-black":"_is-black_5bt5x_578","is-light":"_is-light_5bt5x_603","is-dark":"_is-dark_5bt5x_628","is-primary":"_is-primary_5bt5x_653","is-info":"_is-info_5bt5x_678","is-success":"_is-success_5bt5x_703","is-warning":"_is-warning_5bt5x_728","is-danger":"_is-danger_5bt5x_753","is-link":"_is-link_5bt5x_778","is-small":"_is-small_5bt5x_786","is-medium":"_is-medium_5bt5x_793","is-large":"_is-large_5bt5x_798","is-fullwidth":"_is-fullwidth_5bt5x_805","input":"_input_5bt5x_886","textarea":"_textarea_5bt5x_886","checkbox":"_checkbox_5bt5x_980","radio":"_radio_5bt5x_980","select":"_select_5bt5x_999","label":"_label_5bt5x_1114","help":"_help_5bt5x_1121","control-label":"_control-label_5bt5x_1145","control":"_control_5bt5x_1145","has-addons":"_has-addons_5bt5x_1159","is-expanded":"_is-expanded_5bt5x_1202","has-addons-centered":"_has-addons-centered_5bt5x_1207","has-addons-right":"_has-addons-right_5bt5x_1209","has-addons-fullwidth":"_has-addons-fullwidth_5bt5x_1211","has-icon":"_has-icon_5bt5x_1216","has-icon-right":"_has-icon-right_5bt5x_1240","is-grouped":"_is-grouped_5bt5x_1272","is-grouped-centered":"_is-grouped-centered_5bt5x_1280","is-grouped-right":"_is-grouped-right_5bt5x_1282","is-horizontal":"_is-horizontal_5bt5x_1285","image":"_image_5bt5x_1295","is-square":"_is-square_5bt5x_1302","is-1by1":"_is-1by1_5bt5x_1302","is-4by3":"_is-4by3_5bt5x_1302","is-3by2":"_is-3by2_5bt5x_1302","is-16by9":"_is-16by9_5bt5x_1302","is-2by1":"_is-2by1_5bt5x_1302","is-16x16":"_is-16x16_5bt5x_1320","is-24x24":"_is-24x24_5bt5x_1323","is-32x32":"_is-32x32_5bt5x_1326","is-48x48":"_is-48x48_5bt5x_1329","is-64x64":"_is-64x64_5bt5x_1332","is-96x96":"_is-96x96_5bt5x_1335","is-128x128":"_is-128x128_5bt5x_1338","delete":"_delete_5bt5x_1351","modal-close":"_modal-close_5bt5x_1351","table":"_table_5bt5x_1445","is-icon":"_is-icon_5bt5x_1456","is-narrow":"_is-narrow_5bt5x_1488","is-bordered":"_is-bordered_5bt5x_1509","is-striped":"_is-striped_5bt5x_1533","is-1":"_is-1_5bt5x_1302","is-2":"_is-2_5bt5x_1302","is-3":"_is-3_5bt5x_1302","is-4":"_is-4_5bt5x_1302","is-5":"_is-5_5bt5x_1588","is-6":"_is-6_5bt5x_1332","is-normal":"_is-normal_5bt5x_1596","hamburger":"_hamburger_5bt5x_1722","nav-toggle":"_nav-toggle_5bt5x_1722","heading":"_heading_5bt5x_1760","loader":"_loader_5bt5x_1777","spin-around":"_spin-around_5bt5x_1","number":"_number_5bt5x_1789","unselectable":"_unselectable_5bt5x_1860","is-unselectable":"_is-unselectable_5bt5x_1860","card-header":"_card-header_5bt5x_1867","card-header-title":"_card-header-title_5bt5x_1873","card-header-icon":"_card-header-icon_5bt5x_1881","card-image":"_card-image_5bt5x_1888","card-content":"_card-content_5bt5x_1892","card-footer":"_card-footer_5bt5x_1897","card-footer-item":"_card-footer-item_5bt5x_1902","card":"_card_5bt5x_1867","media":"_media_5bt5x_1918","is-rounded":"_is-rounded_5bt5x_1922","column":"_column_5bt5x_1925","columns":"_columns_5bt5x_1928","is-mobile":"_is-mobile_5bt5x_1928","is-full":"_is-full_5bt5x_805","is-three-quarters":"_is-three-quarters_5bt5x_1933","is-two-thirds":"_is-two-thirds_5bt5x_1936","is-half":"_is-half_5bt5x_1939","is-one-third":"_is-one-third_5bt5x_1942","is-one-quarter":"_is-one-quarter_5bt5x_1945","is-offset-three-quarters":"_is-offset-three-quarters_5bt5x_1948","is-offset-two-thirds":"_is-offset-two-thirds_5bt5x_1950","is-offset-half":"_is-offset-half_5bt5x_1952","is-offset-one-third":"_is-offset-one-third_5bt5x_1954","is-offset-one-quarter":"_is-offset-one-quarter_5bt5x_1956","is-offset-1":"_is-offset-1_5bt5x_1961","is-offset-2":"_is-offset-2_5bt5x_1966","is-offset-3":"_is-offset-3_5bt5x_1971","is-offset-4":"_is-offset-4_5bt5x_1976","is-offset-5":"_is-offset-5_5bt5x_1981","is-offset-6":"_is-offset-6_5bt5x_1986","is-7":"_is-7_5bt5x_1988","is-offset-7":"_is-offset-7_5bt5x_1991","is-8":"_is-8_5bt5x_1993","is-offset-8":"_is-offset-8_5bt5x_1996","is-9":"_is-9_5bt5x_1335","is-offset-9":"_is-offset-9_5bt5x_2001","is-10":"_is-10_5bt5x_2003","is-offset-10":"_is-offset-10_5bt5x_2006","is-11":"_is-11_5bt5x_2008","is-offset-11":"_is-offset-11_5bt5x_2011","is-12":"_is-12_5bt5x_1338","is-offset-12":"_is-offset-12_5bt5x_2016","is-narrow-mobile":"_is-narrow-mobile_5bt5x_2019","is-full-mobile":"_is-full-mobile_5bt5x_2021","is-three-quarters-mobile":"_is-three-quarters-mobile_5bt5x_2024","is-two-thirds-mobile":"_is-two-thirds-mobile_5bt5x_2027","is-half-mobile":"_is-half-mobile_5bt5x_2030","is-one-third-mobile":"_is-one-third-mobile_5bt5x_2033","is-one-quarter-mobile":"_is-one-quarter-mobile_5bt5x_2036","is-offset-three-quarters-mobile":"_is-offset-three-quarters-mobile_5bt5x_2039","is-offset-two-thirds-mobile":"_is-offset-two-thirds-mobile_5bt5x_2041","is-offset-half-mobile":"_is-offset-half-mobile_5bt5x_2043","is-offset-one-third-mobile":"_is-offset-one-third-mobile_5bt5x_2045","is-offset-one-quarter-mobile":"_is-offset-one-quarter-mobile_5bt5x_2047","is-1-mobile":"_is-1-mobile_5bt5x_2049","is-offset-1-mobile":"_is-offset-1-mobile_5bt5x_2052","is-2-mobile":"_is-2-mobile_5bt5x_2054","is-offset-2-mobile":"_is-offset-2-mobile_5bt5x_2057","is-3-mobile":"_is-3-mobile_5bt5x_2059","is-offset-3-mobile":"_is-offset-3-mobile_5bt5x_2062","is-4-mobile":"_is-4-mobile_5bt5x_2064","is-offset-4-mobile":"_is-offset-4-mobile_5bt5x_2067","is-5-mobile":"_is-5-mobile_5bt5x_2069","is-offset-5-mobile":"_is-offset-5-mobile_5bt5x_2072","is-6-mobile":"_is-6-mobile_5bt5x_2074","is-offset-6-mobile":"_is-offset-6-mobile_5bt5x_2077","is-7-mobile":"_is-7-mobile_5bt5x_2079","is-offset-7-mobile":"_is-offset-7-mobile_5bt5x_2082","is-8-mobile":"_is-8-mobile_5bt5x_2084","is-offset-8-mobile":"_is-offset-8-mobile_5bt5x_2087","is-9-mobile":"_is-9-mobile_5bt5x_2089","is-offset-9-mobile":"_is-offset-9-mobile_5bt5x_2092","is-10-mobile":"_is-10-mobile_5bt5x_2094","is-offset-10-mobile":"_is-offset-10-mobile_5bt5x_2097","is-11-mobile":"_is-11-mobile_5bt5x_2099","is-offset-11-mobile":"_is-offset-11-mobile_5bt5x_2102","is-12-mobile":"_is-12-mobile_5bt5x_2104","is-offset-12-mobile":"_is-offset-12-mobile_5bt5x_2107","is-narrow-tablet":"_is-narrow-tablet_5bt5x_2110","is-full-tablet":"_is-full-tablet_5bt5x_2112","is-three-quarters-tablet":"_is-three-quarters-tablet_5bt5x_2115","is-two-thirds-tablet":"_is-two-thirds-tablet_5bt5x_2118","is-half-tablet":"_is-half-tablet_5bt5x_2121","is-one-third-tablet":"_is-one-third-tablet_5bt5x_2124","is-one-quarter-tablet":"_is-one-quarter-tablet_5bt5x_2127","is-offset-three-quarters-tablet":"_is-offset-three-quarters-tablet_5bt5x_2130","is-offset-two-thirds-tablet":"_is-offset-two-thirds-tablet_5bt5x_2132","is-offset-half-tablet":"_is-offset-half-tablet_5bt5x_2134","is-offset-one-third-tablet":"_is-offset-one-third-tablet_5bt5x_2136","is-offset-one-quarter-tablet":"_is-offset-one-quarter-tablet_5bt5x_2138","is-1-tablet":"_is-1-tablet_5bt5x_2140","is-offset-1-tablet":"_is-offset-1-tablet_5bt5x_2143","is-2-tablet":"_is-2-tablet_5bt5x_2145","is-offset-2-tablet":"_is-offset-2-tablet_5bt5x_2148","is-3-tablet":"_is-3-tablet_5bt5x_2150","is-offset-3-tablet":"_is-offset-3-tablet_5bt5x_2153","is-4-tablet":"_is-4-tablet_5bt5x_2155","is-offset-4-tablet":"_is-offset-4-tablet_5bt5x_2158","is-5-tablet":"_is-5-tablet_5bt5x_2160","is-offset-5-tablet":"_is-offset-5-tablet_5bt5x_2163","is-6-tablet":"_is-6-tablet_5bt5x_2165","is-offset-6-tablet":"_is-offset-6-tablet_5bt5x_2168","is-7-tablet":"_is-7-tablet_5bt5x_2170","is-offset-7-tablet":"_is-offset-7-tablet_5bt5x_2173","is-8-tablet":"_is-8-tablet_5bt5x_2175","is-offset-8-tablet":"_is-offset-8-tablet_5bt5x_2178","is-9-tablet":"_is-9-tablet_5bt5x_2180","is-offset-9-tablet":"_is-offset-9-tablet_5bt5x_2183","is-10-tablet":"_is-10-tablet_5bt5x_2185","is-offset-10-tablet":"_is-offset-10-tablet_5bt5x_2188","is-11-tablet":"_is-11-tablet_5bt5x_2190","is-offset-11-tablet":"_is-offset-11-tablet_5bt5x_2193","is-12-tablet":"_is-12-tablet_5bt5x_2195","is-offset-12-tablet":"_is-offset-12-tablet_5bt5x_2198","is-narrow-desktop":"_is-narrow-desktop_5bt5x_2201","is-full-desktop":"_is-full-desktop_5bt5x_2203","is-three-quarters-desktop":"_is-three-quarters-desktop_5bt5x_2206","is-two-thirds-desktop":"_is-two-thirds-desktop_5bt5x_2209","is-half-desktop":"_is-half-desktop_5bt5x_2212","is-one-third-desktop":"_is-one-third-desktop_5bt5x_2215","is-one-quarter-desktop":"_is-one-quarter-desktop_5bt5x_2218","is-offset-three-quarters-desktop":"_is-offset-three-quarters-desktop_5bt5x_2221","is-offset-two-thirds-desktop":"_is-offset-two-thirds-desktop_5bt5x_2223","is-offset-half-desktop":"_is-offset-half-desktop_5bt5x_2225","is-offset-one-third-desktop":"_is-offset-one-third-desktop_5bt5x_2227","is-offset-one-quarter-desktop":"_is-offset-one-quarter-desktop_5bt5x_2229","is-1-desktop":"_is-1-desktop_5bt5x_2231","is-offset-1-desktop":"_is-offset-1-desktop_5bt5x_2234","is-2-desktop":"_is-2-desktop_5bt5x_2236","is-offset-2-desktop":"_is-offset-2-desktop_5bt5x_2239","is-3-desktop":"_is-3-desktop_5bt5x_2241","is-offset-3-desktop":"_is-offset-3-desktop_5bt5x_2244","is-4-desktop":"_is-4-desktop_5bt5x_2246","is-offset-4-desktop":"_is-offset-4-desktop_5bt5x_2249","is-5-desktop":"_is-5-desktop_5bt5x_2251","is-offset-5-desktop":"_is-offset-5-desktop_5bt5x_2254","is-6-desktop":"_is-6-desktop_5bt5x_2256","is-offset-6-desktop":"_is-offset-6-desktop_5bt5x_2259","is-7-desktop":"_is-7-desktop_5bt5x_2261","is-offset-7-desktop":"_is-offset-7-desktop_5bt5x_2264","is-8-desktop":"_is-8-desktop_5bt5x_2266","is-offset-8-desktop":"_is-offset-8-desktop_5bt5x_2269","is-9-desktop":"_is-9-desktop_5bt5x_2271","is-offset-9-desktop":"_is-offset-9-desktop_5bt5x_2274","is-10-desktop":"_is-10-desktop_5bt5x_2276","is-offset-10-desktop":"_is-offset-10-desktop_5bt5x_2279","is-11-desktop":"_is-11-desktop_5bt5x_2281","is-offset-11-desktop":"_is-offset-11-desktop_5bt5x_2284","is-12-desktop":"_is-12-desktop_5bt5x_2286","is-offset-12-desktop":"_is-offset-12-desktop_5bt5x_2289","is-narrow-widescreen":"_is-narrow-widescreen_5bt5x_2292","is-full-widescreen":"_is-full-widescreen_5bt5x_2294","is-three-quarters-widescreen":"_is-three-quarters-widescreen_5bt5x_2297","is-two-thirds-widescreen":"_is-two-thirds-widescreen_5bt5x_2300","is-half-widescreen":"_is-half-widescreen_5bt5x_2303","is-one-third-widescreen":"_is-one-third-widescreen_5bt5x_2306","is-one-quarter-widescreen":"_is-one-quarter-widescreen_5bt5x_2309","is-offset-three-quarters-widescreen":"_is-offset-three-quarters-widescreen_5bt5x_2312","is-offset-two-thirds-widescreen":"_is-offset-two-thirds-widescreen_5bt5x_2314","is-offset-half-widescreen":"_is-offset-half-widescreen_5bt5x_2316","is-offset-one-third-widescreen":"_is-offset-one-third-widescreen_5bt5x_2318","is-offset-one-quarter-widescreen":"_is-offset-one-quarter-widescreen_5bt5x_2320","is-1-widescreen":"_is-1-widescreen_5bt5x_2322","is-offset-1-widescreen":"_is-offset-1-widescreen_5bt5x_2325","is-2-widescreen":"_is-2-widescreen_5bt5x_2327","is-offset-2-widescreen":"_is-offset-2-widescreen_5bt5x_2330","is-3-widescreen":"_is-3-widescreen_5bt5x_2332","is-offset-3-widescreen":"_is-offset-3-widescreen_5bt5x_2335","is-4-widescreen":"_is-4-widescreen_5bt5x_2337","is-offset-4-widescreen":"_is-offset-4-widescreen_5bt5x_2340","is-5-widescreen":"_is-5-widescreen_5bt5x_2342","is-offset-5-widescreen":"_is-offset-5-widescreen_5bt5x_2345","is-6-widescreen":"_is-6-widescreen_5bt5x_2347","is-offset-6-widescreen":"_is-offset-6-widescreen_5bt5x_2350","is-7-widescreen":"_is-7-widescreen_5bt5x_2352","is-offset-7-widescreen":"_is-offset-7-widescreen_5bt5x_2355","is-8-widescreen":"_is-8-widescreen_5bt5x_2357","is-offset-8-widescreen":"_is-offset-8-widescreen_5bt5x_2360","is-9-widescreen":"_is-9-widescreen_5bt5x_2362","is-offset-9-widescreen":"_is-offset-9-widescreen_5bt5x_2365","is-10-widescreen":"_is-10-widescreen_5bt5x_2367","is-offset-10-widescreen":"_is-offset-10-widescreen_5bt5x_2370","is-11-widescreen":"_is-11-widescreen_5bt5x_2372","is-offset-11-widescreen":"_is-offset-11-widescreen_5bt5x_2375","is-12-widescreen":"_is-12-widescreen_5bt5x_2377","is-offset-12-widescreen":"_is-offset-12-widescreen_5bt5x_2380","is-centered":"_is-centered_5bt5x_2391","is-gapless":"_is-gapless_5bt5x_2393","is-grid":"_is-grid_5bt5x_2405","is-multiline":"_is-multiline_5bt5x_2416","is-vcentered":"_is-vcentered_5bt5x_2418","is-desktop":"_is-desktop_5bt5x_2421","tile":"_tile_5bt5x_2427","is-ancestor":"_is-ancestor_5bt5x_2431","is-child":"_is-child_5bt5x_2439","is-parent":"_is-parent_5bt5x_2441","is-vertical":"_is-vertical_5bt5x_2443","c":"_c_5bt5x_238","err":"_err_5bt5x_2492","g":"_g_5bt5x_2493","k":"_k_5bt5x_2495","l":"_l_5bt5x_239","n":"_n_5bt5x_238","o":"_o_5bt5x_2500","x":"_x_5bt5x_2502","p":"_p_5bt5x_238","cm":"_cm_5bt5x_2506","cp":"_cp_5bt5x_2508","c1":"_c1_5bt5x_2510","cs":"_cs_5bt5x_2512","gd":"_gd_5bt5x_2514","ge":"_ge_5bt5x_2516","gr":"_gr_5bt5x_2519","gh":"_gh_5bt5x_2521","gi":"_gi_5bt5x_2523","go":"_go_5bt5x_2525","gp":"_gp_5bt5x_2526","gs":"_gs_5bt5x_2528","gu":"_gu_5bt5x_2531","gt":"_gt_5bt5x_2533","kc":"_kc_5bt5x_2535","kd":"_kd_5bt5x_2537","kn":"_kn_5bt5x_2539","kp":"_kp_5bt5x_2540","kr":"_kr_5bt5x_2542","kt":"_kt_5bt5x_2544","ld":"_ld_5bt5x_2546","m":"_m_5bt5x_239","s":"_s_5bt5x_239","na":"_na_5bt5x_1722","nb":"_nb_5bt5x_2553","nc":"_nc_5bt5x_2555","no":"_no_5bt5x_238","nd":"_nd_5bt5x_2559","ni":"_ni_5bt5x_2561","ne":"_ne_5bt5x_2562","nf":"_nf_5bt5x_2564","nl":"_nl_5bt5x_2566","nn":"_nn_5bt5x_2567","nx":"_nx_5bt5x_2568","py":"_py_5bt5x_2569","nt":"_nt_5bt5x_2571","nv":"_nv_5bt5x_2572","ow":"_ow_5bt5x_2574","w":"_w_5bt5x_2576","mf":"_mf_5bt5x_2578","mh":"_mh_5bt5x_2579","mi":"_mi_5bt5x_2580","mo":"_mo_5bt5x_1351","sb":"_sb_5bt5x_2583","sc":"_sc_5bt5x_2585","sd":"_sd_5bt5x_2587","s2":"_s2_5bt5x_2589","se":"_se_5bt5x_999","sh":"_sh_5bt5x_2593","si":"_si_5bt5x_2595","sx":"_sx_5bt5x_2596","sr":"_sr_5bt5x_2598","s1":"_s1_5bt5x_2600","ss":"_ss_5bt5x_2601","bp":"_bp_5bt5x_2603","vc":"_vc_5bt5x_2604","vg":"_vg_5bt5x_2605","vi":"_vi_5bt5x_2606","il":"_il_5bt5x_2608","level-item":"_level-item_5bt5x_2611","level-left":"_level-left_5bt5x_2618","level-right":"_level-right_5bt5x_2619","is-flexible":"_is-flexible_5bt5x_2621","media-number":"_media-number_5bt5x_2659","media-left":"_media-left_5bt5x_2677","media-right":"_media-right_5bt5x_2680","media-content":"_media-content_5bt5x_2683","menu-nav":"_menu-nav_5bt5x_2715","menu-list":"_menu-list_5bt5x_2719","menu-label":"_menu-label_5bt5x_2735","message-body":"_message-body_5bt5x_2744","message-header":"_message-header_5bt5x_2751","modal-background":"_modal-background_5bt5x_2838","modal-content":"_modal-content_5bt5x_2846","modal-card":"_modal-card_5bt5x_2846","modal-card-head":"_modal-card-head_5bt5x_2874","modal-card-foot":"_modal-card-foot_5bt5x_2875","modal-card-title":"_modal-card-title_5bt5x_2887","modal-card-body":"_modal-card-body_5bt5x_2898","modal":"_modal_5bt5x_1351","nav-item":"_nav-item_5bt5x_2922","is-tab":"_is-tab_5bt5x_2950","nav-menu":"_nav-menu_5bt5x_2967","nav-left":"_nav-left_5bt5x_2981","nav-center":"_nav-center_5bt5x_2990","nav-right":"_nav-right_5bt5x_2996","nav":"_nav_5bt5x_1722","has-shadow":"_has-shadow_5bt5x_3023","pagination":"_pagination_5bt5x_3026","panel-icon":"_panel-icon_5bt5x_3061","panel-heading":"_panel-heading_5bt5x_3076","panel-list":"_panel-list_5bt5x_3085","panel-tabs":"_panel-tabs_5bt5x_3090","panel-block":"_panel-block_5bt5x_3105","panel":"_panel_5bt5x_3061","is-left":"_is-left_5bt5x_3153","is-center":"_is-center_5bt5x_2391","is-right":"_is-right_5bt5x_3160","is-boxed":"_is-boxed_5bt5x_3171","is-toggle":"_is-toggle_5bt5x_3185","hero-video":"_hero-video_5bt5x_3230","is-transparent":"_is-transparent_5bt5x_3244","hero-buttons":"_hero-buttons_5bt5x_3250","hero-head":"_hero-head_5bt5x_3264","hero-foot":"_hero-foot_5bt5x_3265","hero-body":"_hero-body_5bt5x_3268","hero":"_hero_5bt5x_3230","is-bold":"_is-bold_5bt5x_3327","is-fullheight":"_is-fullheight_5bt5x_3754","section":"_section_5bt5x_3762","footer":"_footer_5bt5x_3771","app":"_app_5bt5x_3791","main":"_main_5bt5x_3796","is-paddingless":"_is-paddingless_5bt5x_3800","header":"_header_5bt5x_3814","navigation":"_navigation_5bt5x_3824","top":"_top_5bt5x_3824","detached":"_detached_5bt5x_3841","landscape":"_landscape_5bt5x_3846","landscape-column":"_landscape-column_5bt5x_3853","landscape-tile":"_landscape-tile_5bt5x_3858","pale":"_pale_5bt5x_3864","pixel":"_pixel_5bt5x_3866","headline":"_headline_5bt5x_3868","bottom":"_bottom_5bt5x_3887","about":"_about_5bt5x_3895"};
});

require.register("styles/blog.sass", function(exports, require, module) {
module.exports = {"index":"_index_1p9ra_15","title":"_title_1p9ra_19","tag":"_tag_1p9ra_22","timestamp":"_timestamp_1p9ra_25","tldr":"_tldr_1p9ra_29"};
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