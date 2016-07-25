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
module.exports = {"block":"_block_17fkt_238","box":"_box_17fkt_238","content":"_content_17fkt_238","notification":"_notification_17fkt_238","progress":"_progress_17fkt_238","title":"_title_17fkt_238","subtitle":"_subtitle_17fkt_239","highlight":"_highlight_17fkt_239","level":"_level_17fkt_239","message":"_message_17fkt_239","tabs":"_tabs_17fkt_239","container":"_container_17fkt_242","is-fluid":"_is-fluid_17fkt_248","fa":"_fa_17fkt_255","is-block":"_is-block_17fkt_260","is-block-mobile":"_is-block-mobile_17fkt_264","is-block-tablet":"_is-block-tablet_17fkt_268","is-block-tablet-only":"_is-block-tablet-only_17fkt_272","is-block-touch":"_is-block-touch_17fkt_276","is-block-desktop":"_is-block-desktop_17fkt_280","is-block-desktop-only":"_is-block-desktop-only_17fkt_284","is-block-widescreen":"_is-block-widescreen_17fkt_288","is-flex":"_is-flex_17fkt_291","is-flex-mobile":"_is-flex-mobile_17fkt_295","is-flex-tablet":"_is-flex-tablet_17fkt_299","is-flex-tablet-only":"_is-flex-tablet-only_17fkt_303","is-flex-touch":"_is-flex-touch_17fkt_307","is-flex-desktop":"_is-flex-desktop_17fkt_311","is-flex-desktop-only":"_is-flex-desktop-only_17fkt_315","is-flex-widescreen":"_is-flex-widescreen_17fkt_319","is-inline":"_is-inline_17fkt_322","is-inline-mobile":"_is-inline-mobile_17fkt_326","is-inline-tablet":"_is-inline-tablet_17fkt_330","is-inline-tablet-only":"_is-inline-tablet-only_17fkt_334","is-inline-touch":"_is-inline-touch_17fkt_338","is-inline-desktop":"_is-inline-desktop_17fkt_342","is-inline-desktop-only":"_is-inline-desktop-only_17fkt_346","is-inline-widescreen":"_is-inline-widescreen_17fkt_350","is-inline-block":"_is-inline-block_17fkt_353","is-inline-block-mobile":"_is-inline-block-mobile_17fkt_357","is-inline-block-tablet":"_is-inline-block-tablet_17fkt_361","is-inline-block-tablet-only":"_is-inline-block-tablet-only_17fkt_365","is-inline-block-touch":"_is-inline-block-touch_17fkt_369","is-inline-block-desktop":"_is-inline-block-desktop_17fkt_373","is-inline-block-desktop-only":"_is-inline-block-desktop-only_17fkt_377","is-inline-block-widescreen":"_is-inline-block-widescreen_17fkt_381","is-inline-flex":"_is-inline-flex_17fkt_384","is-inline-flex-mobile":"_is-inline-flex-mobile_17fkt_388","is-inline-flex-tablet":"_is-inline-flex-tablet_17fkt_392","is-inline-flex-tablet-only":"_is-inline-flex-tablet-only_17fkt_396","is-inline-flex-touch":"_is-inline-flex-touch_17fkt_400","is-inline-flex-desktop":"_is-inline-flex-desktop_17fkt_404","is-inline-flex-desktop-only":"_is-inline-flex-desktop-only_17fkt_408","is-inline-flex-widescreen":"_is-inline-flex-widescreen_17fkt_412","is-clearfix":"_is-clearfix_17fkt_415","is-pulled-left":"_is-pulled-left_17fkt_420","is-pulled-right":"_is-pulled-right_17fkt_423","is-clipped":"_is-clipped_17fkt_426","is-overlay":"_is-overlay_17fkt_429","has-text-centered":"_has-text-centered_17fkt_436","has-text-left":"_has-text-left_17fkt_439","has-text-right":"_has-text-right_17fkt_442","is-hidden":"_is-hidden_17fkt_445","is-hidden-mobile":"_is-hidden-mobile_17fkt_449","is-hidden-tablet":"_is-hidden-tablet_17fkt_453","is-hidden-tablet-only":"_is-hidden-tablet-only_17fkt_457","is-hidden-touch":"_is-hidden-touch_17fkt_461","is-hidden-desktop":"_is-hidden-desktop_17fkt_465","is-hidden-desktop-only":"_is-hidden-desktop-only_17fkt_469","is-hidden-widescreen":"_is-hidden-widescreen_17fkt_473","is-disabled":"_is-disabled_17fkt_476","is-marginless":"_is-marginless_17fkt_479","button":"_button_17fkt_494","is-active":"_is-active_17fkt_518","icon":"_icon_17fkt_541","tag":"_tag_17fkt_542","is-white":"_is-white_17fkt_553","is-inverted":"_is-inverted_17fkt_563","is-loading":"_is-loading_17fkt_568","is-outlined":"_is-outlined_17fkt_570","is-black":"_is-black_17fkt_578","is-light":"_is-light_17fkt_603","is-dark":"_is-dark_17fkt_628","is-primary":"_is-primary_17fkt_653","is-info":"_is-info_17fkt_678","is-success":"_is-success_17fkt_703","is-warning":"_is-warning_17fkt_728","is-danger":"_is-danger_17fkt_753","is-link":"_is-link_17fkt_778","is-small":"_is-small_17fkt_786","is-medium":"_is-medium_17fkt_793","is-large":"_is-large_17fkt_798","is-fullwidth":"_is-fullwidth_17fkt_805","input":"_input_17fkt_886","textarea":"_textarea_17fkt_886","checkbox":"_checkbox_17fkt_980","radio":"_radio_17fkt_980","select":"_select_17fkt_999","label":"_label_17fkt_1114","help":"_help_17fkt_1121","control-label":"_control-label_17fkt_1145","control":"_control_17fkt_1145","has-addons":"_has-addons_17fkt_1159","is-expanded":"_is-expanded_17fkt_1202","has-addons-centered":"_has-addons-centered_17fkt_1207","has-addons-right":"_has-addons-right_17fkt_1209","has-addons-fullwidth":"_has-addons-fullwidth_17fkt_1211","has-icon":"_has-icon_17fkt_1216","has-icon-right":"_has-icon-right_17fkt_1240","is-grouped":"_is-grouped_17fkt_1272","is-grouped-centered":"_is-grouped-centered_17fkt_1280","is-grouped-right":"_is-grouped-right_17fkt_1282","is-horizontal":"_is-horizontal_17fkt_1285","image":"_image_17fkt_1295","is-square":"_is-square_17fkt_1302","is-1by1":"_is-1by1_17fkt_1302","is-4by3":"_is-4by3_17fkt_1302","is-3by2":"_is-3by2_17fkt_1302","is-16by9":"_is-16by9_17fkt_1302","is-2by1":"_is-2by1_17fkt_1302","is-16x16":"_is-16x16_17fkt_1320","is-24x24":"_is-24x24_17fkt_1323","is-32x32":"_is-32x32_17fkt_1326","is-48x48":"_is-48x48_17fkt_1329","is-64x64":"_is-64x64_17fkt_1332","is-96x96":"_is-96x96_17fkt_1335","is-128x128":"_is-128x128_17fkt_1338","delete":"_delete_17fkt_1351","modal-close":"_modal-close_17fkt_1351","table":"_table_17fkt_1445","is-icon":"_is-icon_17fkt_1456","is-narrow":"_is-narrow_17fkt_1488","is-bordered":"_is-bordered_17fkt_1509","is-striped":"_is-striped_17fkt_1533","is-1":"_is-1_17fkt_1302","is-2":"_is-2_17fkt_1302","is-3":"_is-3_17fkt_1302","is-4":"_is-4_17fkt_1302","is-5":"_is-5_17fkt_1588","is-6":"_is-6_17fkt_1332","is-normal":"_is-normal_17fkt_1596","hamburger":"_hamburger_17fkt_1722","nav-toggle":"_nav-toggle_17fkt_1722","heading":"_heading_17fkt_1760","loader":"_loader_17fkt_1777","spin-around":"_spin-around_17fkt_1","number":"_number_17fkt_1789","unselectable":"_unselectable_17fkt_1860","is-unselectable":"_is-unselectable_17fkt_1860","card-header":"_card-header_17fkt_1867","card-header-title":"_card-header-title_17fkt_1873","card-header-icon":"_card-header-icon_17fkt_1881","card-image":"_card-image_17fkt_1888","card-content":"_card-content_17fkt_1892","card-footer":"_card-footer_17fkt_1897","card-footer-item":"_card-footer-item_17fkt_1902","card":"_card_17fkt_1867","media":"_media_17fkt_1918","is-rounded":"_is-rounded_17fkt_1922","column":"_column_17fkt_1925","columns":"_columns_17fkt_1928","is-mobile":"_is-mobile_17fkt_1928","is-full":"_is-full_17fkt_805","is-three-quarters":"_is-three-quarters_17fkt_1933","is-two-thirds":"_is-two-thirds_17fkt_1936","is-half":"_is-half_17fkt_1939","is-one-third":"_is-one-third_17fkt_1942","is-one-quarter":"_is-one-quarter_17fkt_1945","is-offset-three-quarters":"_is-offset-three-quarters_17fkt_1948","is-offset-two-thirds":"_is-offset-two-thirds_17fkt_1950","is-offset-half":"_is-offset-half_17fkt_1952","is-offset-one-third":"_is-offset-one-third_17fkt_1954","is-offset-one-quarter":"_is-offset-one-quarter_17fkt_1956","is-offset-1":"_is-offset-1_17fkt_1961","is-offset-2":"_is-offset-2_17fkt_1966","is-offset-3":"_is-offset-3_17fkt_1971","is-offset-4":"_is-offset-4_17fkt_1976","is-offset-5":"_is-offset-5_17fkt_1981","is-offset-6":"_is-offset-6_17fkt_1986","is-7":"_is-7_17fkt_1988","is-offset-7":"_is-offset-7_17fkt_1991","is-8":"_is-8_17fkt_1993","is-offset-8":"_is-offset-8_17fkt_1996","is-9":"_is-9_17fkt_1335","is-offset-9":"_is-offset-9_17fkt_2001","is-10":"_is-10_17fkt_2003","is-offset-10":"_is-offset-10_17fkt_2006","is-11":"_is-11_17fkt_2008","is-offset-11":"_is-offset-11_17fkt_2011","is-12":"_is-12_17fkt_1338","is-offset-12":"_is-offset-12_17fkt_2016","is-narrow-mobile":"_is-narrow-mobile_17fkt_2019","is-full-mobile":"_is-full-mobile_17fkt_2021","is-three-quarters-mobile":"_is-three-quarters-mobile_17fkt_2024","is-two-thirds-mobile":"_is-two-thirds-mobile_17fkt_2027","is-half-mobile":"_is-half-mobile_17fkt_2030","is-one-third-mobile":"_is-one-third-mobile_17fkt_2033","is-one-quarter-mobile":"_is-one-quarter-mobile_17fkt_2036","is-offset-three-quarters-mobile":"_is-offset-three-quarters-mobile_17fkt_2039","is-offset-two-thirds-mobile":"_is-offset-two-thirds-mobile_17fkt_2041","is-offset-half-mobile":"_is-offset-half-mobile_17fkt_2043","is-offset-one-third-mobile":"_is-offset-one-third-mobile_17fkt_2045","is-offset-one-quarter-mobile":"_is-offset-one-quarter-mobile_17fkt_2047","is-1-mobile":"_is-1-mobile_17fkt_2049","is-offset-1-mobile":"_is-offset-1-mobile_17fkt_2052","is-2-mobile":"_is-2-mobile_17fkt_2054","is-offset-2-mobile":"_is-offset-2-mobile_17fkt_2057","is-3-mobile":"_is-3-mobile_17fkt_2059","is-offset-3-mobile":"_is-offset-3-mobile_17fkt_2062","is-4-mobile":"_is-4-mobile_17fkt_2064","is-offset-4-mobile":"_is-offset-4-mobile_17fkt_2067","is-5-mobile":"_is-5-mobile_17fkt_2069","is-offset-5-mobile":"_is-offset-5-mobile_17fkt_2072","is-6-mobile":"_is-6-mobile_17fkt_2074","is-offset-6-mobile":"_is-offset-6-mobile_17fkt_2077","is-7-mobile":"_is-7-mobile_17fkt_2079","is-offset-7-mobile":"_is-offset-7-mobile_17fkt_2082","is-8-mobile":"_is-8-mobile_17fkt_2084","is-offset-8-mobile":"_is-offset-8-mobile_17fkt_2087","is-9-mobile":"_is-9-mobile_17fkt_2089","is-offset-9-mobile":"_is-offset-9-mobile_17fkt_2092","is-10-mobile":"_is-10-mobile_17fkt_2094","is-offset-10-mobile":"_is-offset-10-mobile_17fkt_2097","is-11-mobile":"_is-11-mobile_17fkt_2099","is-offset-11-mobile":"_is-offset-11-mobile_17fkt_2102","is-12-mobile":"_is-12-mobile_17fkt_2104","is-offset-12-mobile":"_is-offset-12-mobile_17fkt_2107","is-narrow-tablet":"_is-narrow-tablet_17fkt_2110","is-full-tablet":"_is-full-tablet_17fkt_2112","is-three-quarters-tablet":"_is-three-quarters-tablet_17fkt_2115","is-two-thirds-tablet":"_is-two-thirds-tablet_17fkt_2118","is-half-tablet":"_is-half-tablet_17fkt_2121","is-one-third-tablet":"_is-one-third-tablet_17fkt_2124","is-one-quarter-tablet":"_is-one-quarter-tablet_17fkt_2127","is-offset-three-quarters-tablet":"_is-offset-three-quarters-tablet_17fkt_2130","is-offset-two-thirds-tablet":"_is-offset-two-thirds-tablet_17fkt_2132","is-offset-half-tablet":"_is-offset-half-tablet_17fkt_2134","is-offset-one-third-tablet":"_is-offset-one-third-tablet_17fkt_2136","is-offset-one-quarter-tablet":"_is-offset-one-quarter-tablet_17fkt_2138","is-1-tablet":"_is-1-tablet_17fkt_2140","is-offset-1-tablet":"_is-offset-1-tablet_17fkt_2143","is-2-tablet":"_is-2-tablet_17fkt_2145","is-offset-2-tablet":"_is-offset-2-tablet_17fkt_2148","is-3-tablet":"_is-3-tablet_17fkt_2150","is-offset-3-tablet":"_is-offset-3-tablet_17fkt_2153","is-4-tablet":"_is-4-tablet_17fkt_2155","is-offset-4-tablet":"_is-offset-4-tablet_17fkt_2158","is-5-tablet":"_is-5-tablet_17fkt_2160","is-offset-5-tablet":"_is-offset-5-tablet_17fkt_2163","is-6-tablet":"_is-6-tablet_17fkt_2165","is-offset-6-tablet":"_is-offset-6-tablet_17fkt_2168","is-7-tablet":"_is-7-tablet_17fkt_2170","is-offset-7-tablet":"_is-offset-7-tablet_17fkt_2173","is-8-tablet":"_is-8-tablet_17fkt_2175","is-offset-8-tablet":"_is-offset-8-tablet_17fkt_2178","is-9-tablet":"_is-9-tablet_17fkt_2180","is-offset-9-tablet":"_is-offset-9-tablet_17fkt_2183","is-10-tablet":"_is-10-tablet_17fkt_2185","is-offset-10-tablet":"_is-offset-10-tablet_17fkt_2188","is-11-tablet":"_is-11-tablet_17fkt_2190","is-offset-11-tablet":"_is-offset-11-tablet_17fkt_2193","is-12-tablet":"_is-12-tablet_17fkt_2195","is-offset-12-tablet":"_is-offset-12-tablet_17fkt_2198","is-narrow-desktop":"_is-narrow-desktop_17fkt_2201","is-full-desktop":"_is-full-desktop_17fkt_2203","is-three-quarters-desktop":"_is-three-quarters-desktop_17fkt_2206","is-two-thirds-desktop":"_is-two-thirds-desktop_17fkt_2209","is-half-desktop":"_is-half-desktop_17fkt_2212","is-one-third-desktop":"_is-one-third-desktop_17fkt_2215","is-one-quarter-desktop":"_is-one-quarter-desktop_17fkt_2218","is-offset-three-quarters-desktop":"_is-offset-three-quarters-desktop_17fkt_2221","is-offset-two-thirds-desktop":"_is-offset-two-thirds-desktop_17fkt_2223","is-offset-half-desktop":"_is-offset-half-desktop_17fkt_2225","is-offset-one-third-desktop":"_is-offset-one-third-desktop_17fkt_2227","is-offset-one-quarter-desktop":"_is-offset-one-quarter-desktop_17fkt_2229","is-1-desktop":"_is-1-desktop_17fkt_2231","is-offset-1-desktop":"_is-offset-1-desktop_17fkt_2234","is-2-desktop":"_is-2-desktop_17fkt_2236","is-offset-2-desktop":"_is-offset-2-desktop_17fkt_2239","is-3-desktop":"_is-3-desktop_17fkt_2241","is-offset-3-desktop":"_is-offset-3-desktop_17fkt_2244","is-4-desktop":"_is-4-desktop_17fkt_2246","is-offset-4-desktop":"_is-offset-4-desktop_17fkt_2249","is-5-desktop":"_is-5-desktop_17fkt_2251","is-offset-5-desktop":"_is-offset-5-desktop_17fkt_2254","is-6-desktop":"_is-6-desktop_17fkt_2256","is-offset-6-desktop":"_is-offset-6-desktop_17fkt_2259","is-7-desktop":"_is-7-desktop_17fkt_2261","is-offset-7-desktop":"_is-offset-7-desktop_17fkt_2264","is-8-desktop":"_is-8-desktop_17fkt_2266","is-offset-8-desktop":"_is-offset-8-desktop_17fkt_2269","is-9-desktop":"_is-9-desktop_17fkt_2271","is-offset-9-desktop":"_is-offset-9-desktop_17fkt_2274","is-10-desktop":"_is-10-desktop_17fkt_2276","is-offset-10-desktop":"_is-offset-10-desktop_17fkt_2279","is-11-desktop":"_is-11-desktop_17fkt_2281","is-offset-11-desktop":"_is-offset-11-desktop_17fkt_2284","is-12-desktop":"_is-12-desktop_17fkt_2286","is-offset-12-desktop":"_is-offset-12-desktop_17fkt_2289","is-narrow-widescreen":"_is-narrow-widescreen_17fkt_2292","is-full-widescreen":"_is-full-widescreen_17fkt_2294","is-three-quarters-widescreen":"_is-three-quarters-widescreen_17fkt_2297","is-two-thirds-widescreen":"_is-two-thirds-widescreen_17fkt_2300","is-half-widescreen":"_is-half-widescreen_17fkt_2303","is-one-third-widescreen":"_is-one-third-widescreen_17fkt_2306","is-one-quarter-widescreen":"_is-one-quarter-widescreen_17fkt_2309","is-offset-three-quarters-widescreen":"_is-offset-three-quarters-widescreen_17fkt_2312","is-offset-two-thirds-widescreen":"_is-offset-two-thirds-widescreen_17fkt_2314","is-offset-half-widescreen":"_is-offset-half-widescreen_17fkt_2316","is-offset-one-third-widescreen":"_is-offset-one-third-widescreen_17fkt_2318","is-offset-one-quarter-widescreen":"_is-offset-one-quarter-widescreen_17fkt_2320","is-1-widescreen":"_is-1-widescreen_17fkt_2322","is-offset-1-widescreen":"_is-offset-1-widescreen_17fkt_2325","is-2-widescreen":"_is-2-widescreen_17fkt_2327","is-offset-2-widescreen":"_is-offset-2-widescreen_17fkt_2330","is-3-widescreen":"_is-3-widescreen_17fkt_2332","is-offset-3-widescreen":"_is-offset-3-widescreen_17fkt_2335","is-4-widescreen":"_is-4-widescreen_17fkt_2337","is-offset-4-widescreen":"_is-offset-4-widescreen_17fkt_2340","is-5-widescreen":"_is-5-widescreen_17fkt_2342","is-offset-5-widescreen":"_is-offset-5-widescreen_17fkt_2345","is-6-widescreen":"_is-6-widescreen_17fkt_2347","is-offset-6-widescreen":"_is-offset-6-widescreen_17fkt_2350","is-7-widescreen":"_is-7-widescreen_17fkt_2352","is-offset-7-widescreen":"_is-offset-7-widescreen_17fkt_2355","is-8-widescreen":"_is-8-widescreen_17fkt_2357","is-offset-8-widescreen":"_is-offset-8-widescreen_17fkt_2360","is-9-widescreen":"_is-9-widescreen_17fkt_2362","is-offset-9-widescreen":"_is-offset-9-widescreen_17fkt_2365","is-10-widescreen":"_is-10-widescreen_17fkt_2367","is-offset-10-widescreen":"_is-offset-10-widescreen_17fkt_2370","is-11-widescreen":"_is-11-widescreen_17fkt_2372","is-offset-11-widescreen":"_is-offset-11-widescreen_17fkt_2375","is-12-widescreen":"_is-12-widescreen_17fkt_2377","is-offset-12-widescreen":"_is-offset-12-widescreen_17fkt_2380","is-centered":"_is-centered_17fkt_2391","is-gapless":"_is-gapless_17fkt_2393","is-grid":"_is-grid_17fkt_2405","is-multiline":"_is-multiline_17fkt_2416","is-vcentered":"_is-vcentered_17fkt_2418","is-desktop":"_is-desktop_17fkt_2421","tile":"_tile_17fkt_2427","is-ancestor":"_is-ancestor_17fkt_2431","is-child":"_is-child_17fkt_2439","is-parent":"_is-parent_17fkt_2441","is-vertical":"_is-vertical_17fkt_2443","c":"_c_17fkt_238","err":"_err_17fkt_2492","g":"_g_17fkt_2493","k":"_k_17fkt_2495","l":"_l_17fkt_239","n":"_n_17fkt_238","o":"_o_17fkt_2500","x":"_x_17fkt_2502","p":"_p_17fkt_238","cm":"_cm_17fkt_2506","cp":"_cp_17fkt_2508","c1":"_c1_17fkt_2510","cs":"_cs_17fkt_2512","gd":"_gd_17fkt_2514","ge":"_ge_17fkt_2516","gr":"_gr_17fkt_2519","gh":"_gh_17fkt_2521","gi":"_gi_17fkt_2523","go":"_go_17fkt_2525","gp":"_gp_17fkt_2526","gs":"_gs_17fkt_2528","gu":"_gu_17fkt_2531","gt":"_gt_17fkt_2533","kc":"_kc_17fkt_2535","kd":"_kd_17fkt_2537","kn":"_kn_17fkt_2539","kp":"_kp_17fkt_2540","kr":"_kr_17fkt_2542","kt":"_kt_17fkt_2544","ld":"_ld_17fkt_2546","m":"_m_17fkt_239","s":"_s_17fkt_239","na":"_na_17fkt_1722","nb":"_nb_17fkt_2553","nc":"_nc_17fkt_2555","no":"_no_17fkt_238","nd":"_nd_17fkt_2559","ni":"_ni_17fkt_2561","ne":"_ne_17fkt_2562","nf":"_nf_17fkt_2564","nl":"_nl_17fkt_2566","nn":"_nn_17fkt_2567","nx":"_nx_17fkt_2568","py":"_py_17fkt_2569","nt":"_nt_17fkt_2571","nv":"_nv_17fkt_2572","ow":"_ow_17fkt_2574","w":"_w_17fkt_2576","mf":"_mf_17fkt_2578","mh":"_mh_17fkt_2579","mi":"_mi_17fkt_2580","mo":"_mo_17fkt_1351","sb":"_sb_17fkt_2583","sc":"_sc_17fkt_2585","sd":"_sd_17fkt_2587","s2":"_s2_17fkt_2589","se":"_se_17fkt_999","sh":"_sh_17fkt_2593","si":"_si_17fkt_2595","sx":"_sx_17fkt_2596","sr":"_sr_17fkt_2598","s1":"_s1_17fkt_2600","ss":"_ss_17fkt_2601","bp":"_bp_17fkt_2603","vc":"_vc_17fkt_2604","vg":"_vg_17fkt_2605","vi":"_vi_17fkt_2606","il":"_il_17fkt_2608","level-item":"_level-item_17fkt_2611","level-left":"_level-left_17fkt_2618","level-right":"_level-right_17fkt_2619","is-flexible":"_is-flexible_17fkt_2621","media-number":"_media-number_17fkt_2659","media-left":"_media-left_17fkt_2677","media-right":"_media-right_17fkt_2680","media-content":"_media-content_17fkt_2683","menu-nav":"_menu-nav_17fkt_2715","menu-list":"_menu-list_17fkt_2719","menu-label":"_menu-label_17fkt_2735","message-body":"_message-body_17fkt_2744","message-header":"_message-header_17fkt_2751","modal-background":"_modal-background_17fkt_2838","modal-content":"_modal-content_17fkt_2846","modal-card":"_modal-card_17fkt_2846","modal-card-head":"_modal-card-head_17fkt_2874","modal-card-foot":"_modal-card-foot_17fkt_2875","modal-card-title":"_modal-card-title_17fkt_2887","modal-card-body":"_modal-card-body_17fkt_2898","modal":"_modal_17fkt_1351","nav-item":"_nav-item_17fkt_2922","is-tab":"_is-tab_17fkt_2950","nav-menu":"_nav-menu_17fkt_2967","nav-left":"_nav-left_17fkt_2981","nav-center":"_nav-center_17fkt_2990","nav-right":"_nav-right_17fkt_2996","nav":"_nav_17fkt_1722","has-shadow":"_has-shadow_17fkt_3023","pagination":"_pagination_17fkt_3026","panel-icon":"_panel-icon_17fkt_3061","panel-heading":"_panel-heading_17fkt_3076","panel-list":"_panel-list_17fkt_3085","panel-tabs":"_panel-tabs_17fkt_3090","panel-block":"_panel-block_17fkt_3105","panel":"_panel_17fkt_3061","is-left":"_is-left_17fkt_3153","is-center":"_is-center_17fkt_2391","is-right":"_is-right_17fkt_3160","is-boxed":"_is-boxed_17fkt_3171","is-toggle":"_is-toggle_17fkt_3185","hero-video":"_hero-video_17fkt_3230","is-transparent":"_is-transparent_17fkt_3244","hero-buttons":"_hero-buttons_17fkt_3250","hero-head":"_hero-head_17fkt_3264","hero-foot":"_hero-foot_17fkt_3265","hero-body":"_hero-body_17fkt_3268","hero":"_hero_17fkt_3230","is-bold":"_is-bold_17fkt_3327","is-fullheight":"_is-fullheight_17fkt_3754","section":"_section_17fkt_3762","footer":"_footer_17fkt_3771","app":"_app_17fkt_3791","main":"_main_17fkt_3797","is-paddingless":"_is-paddingless_17fkt_3801","header":"_header_17fkt_3815","navigation":"_navigation_17fkt_3825","top":"_top_17fkt_3825","detached":"_detached_17fkt_3842","landscape":"_landscape_17fkt_3847","landscape-column":"_landscape-column_17fkt_3854","landscape-tile":"_landscape-tile_17fkt_3859","pale":"_pale_17fkt_3865","pixel":"_pixel_17fkt_3867","headline":"_headline_17fkt_3869","bottom":"_bottom_17fkt_3888","about":"_about_17fkt_3897"};
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