/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const MajSoulHelper = __webpack_require__(1)

let majSoulHelper = new MajSoulHelper();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

class MajSoulHelper {
    constructor() {
        console.log('this is a hacked file!');
    }
    startGame(matchRoomID) {
        app.NetAgent.sendReq2Lobby("Lobby", "matchGame", {
            match_mode: matchRoomID
        })
    }
    syncGameByStep(cmd, msg) {
        try {
            if (cmd == 'ActionDiscardTile' ||
                cmd == 'ActionDealTile' ||
                cmd == 'ActionChiPengGang' ||
                cmd == 'ActionAnGangAddGang' ||
                cmd == 'ActionNewRound')
                console.log(cmd, msg);
            else return;

            if (!msg) return;
            switch (cmd) {
                case 'ActionDiscardTile':
                    majAI.discardTile(msg.seat, msg.tile, msg.is_liqi, msg.is_wliqi, msg.moqie, msg.doras);
                    break;
                case 'ActionDealTile':
                    majAI.dealTile(msg.seat, msg.tile, msg.doras);
                    break;
                case 'ActionChiPengGang':
                    majAI.chiPengGang(msg.seat, msg.tiles, msg.type);
                    break;
                case 'ActionAnGangAddGang':
                    majAI.anGangAddGang(msg.seat, msg.tiles, msg.type);
                    break;
                case 'ActionNewRound':
                    majAI.setSeat(view.DesktopMgr.Inst.seat);
                    majAI.newRound(msg.ju, msg.ben, msg.liqibang, msg.scores, msg.dora, msg.tiles);
                    break;
                default:
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }
    onMessage(cmd, msg) {
        try {
            if (cmd == 'ActionDiscardTile' ||
                cmd == 'ActionDealTile' ||
                cmd == 'ActionChiPengGang' ||
                cmd == 'ActionNewRound' ||
                cmd == 'ActionAnGangAddGang' ||
                cmd == 'ActionHule')
                console.log(cmd, msg);
            else return;

            if (!msg) return;
            switch (cmd) {
                case 'ActionDiscardTile':
                    majAI.discardTile(msg.seat, msg.tile, msg.is_liqi, msg.is_wliqi, msg.moqie, msg.doras);
                    break;
                case 'ActionDealTile':
                    majAI.dealTile(msg.seat, msg.tile, msg.doras);
                    break;
                case 'ActionChiPengGang':
                    majAI.chiPengGang(msg.seat, msg.tiles, msg.type);
                    break;
                case 'ActionAnGangAddGang':
                    majAI.anGangAddGang(msg.seat, msg.tiles, msg.type);
                    break;
                case 'ActionNewRound':
                    majAI.setSeat(view.DesktopMgr.Inst.seat);
                    majAI.newRound(msg.ju, msg.ben, msg.liqibang, msg.scores, msg.dora, msg.tiles);
                    break;
                case 'ActionHule':
                    majAI.roundEnded();
                    break;
                default:
                    break;
            }

            if (!msg || !msg.operation) return;

            let flag_hu = 0,
                flag_rong = 0,
                flag_other = 0,
                flag_self = 0;
            for (let i = 0; i < msg.operation.operation_list.length; i++) {
                switch (msg.operation.operation_list[i].type) {
                    case mjcore.E_PlayOperation.rong:
                        flag_rong = !0;
                    case mjcore.E_PlayOperation.eat:
                    case mjcore.E_PlayOperation.peng:
                    case mjcore.E_PlayOperation.ming_gang:
                        flag_other = !0;
                        break;
                    case mjcore.E_PlayOperation.zimo:
                        flag_hu = !0;
                    case mjcore.E_PlayOperation.an_gang:
                    case mjcore.E_PlayOperation.add_gang:
                    case mjcore.E_PlayOperation.liqi:
                    case mjcore.E_PlayOperation.dapai:
                        flag_self = !0;
                        break;
                }
            }
            console.log('fatse flag ', flag_rong, flag_hu, flag_other, flag_self);

            majAI.work(this, this.doAction);
        } catch (e) {
            console.log(e);
        }
    }
    /**
     * type和args需要一一对应
     */
    doAction(args) {
        if (args == null || args == undefined) return;
        console.log('fatest doAction ', args);
        switch (args.type) {
            case 'cancel':
                app.NetAgent.sendReq2MJ("FastTest", "inputChiPengGang", {
                    cancel_operation: !0
                }), view.DesktopMgr.Inst.ClearOperationShow();
                break;
            case 'dapai':
                app.NetAgent.sendReq2MJ("FastTest", "inputOperation", {
                    type: mjcore.E_PlayOperation.dapai,
                    tile: args.tile.toString(),
                    moqie: args.isMoqie,
                    timeuse: uiscript.UI_DesktopInfo.Inst._timecd.timeuse
                }), view.DesktopMgr.Inst.ClearOperationShow();
                break;
            case 'lizhi':
                app.NetAgent.sendReq2MJ("FastTest", "inputOperation", {
                    type: mjcore.E_PlayOperation.liqi,
                    tile: e.toString(),
                    moqie: t,
                    timeuse: uiscript.UI_DesktopInfo.Inst._timecd.timeuse
                }), view.DesktopMgr.Inst.ClearOperationShow();
                break;
            case 'zimo':
                app.NetAgent.sendReq2MJ("FastTest", "inputOperation", {
                    type: mjcore.E_PlayOperation.zimo,
                    index: 0
                }), view.DesktopMgr.Inst.ClearOperationShow();
                break;
            case 'rong':
                app.NetAgent.sendReq2MJ("FastTest", "inputChiPengGang", {
                    type: mjcore.E_PlayOperation.rong,
                    index: 0
                }), view.DesktopMgr.Inst.ClearOperationShow();
                break;
            default:
                console.log('fatest doAction error type');
                break;
        }
    }
}

module.exports = MajSoulHelper;

/***/ })
/******/ ]);