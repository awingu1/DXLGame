//==================================================================================================================
 /*:
 * @plugindesc 物品得失动态提示 。
 * 
 * @author 芯☆淡茹水
 * 
 * @help  该插件不提供插件命令！
 *
 * 说明：1，该插件仅提供 金钱，道具，武器，防具的得失提示。并且仅在 地图场景 有效！
 *           2，该插件提示类型为  实际提示 。实际得到/失去多少会相应的提示。
 *                    比如：拥有金币 0，失去金币 100  =>  不会提示；
 *                      拥有金币 10，失去金币 100  =>  提示 失去 10 金币；
 *                      拥有铜剑 99（上限），得到铜剑 10  =>  不会提示；
 *                      拥有皮衣 90，得到皮衣 20  =>  提示 得到皮衣 9；
 *
 * 道具（物品，武器，防具）备注：<PCTipColor:color>  该道具提示时描绘物品名字的颜色(默认为白色)。
 *                                                                  color：颜色。格式 rgb 或 #ff 都行。比如白色 rgb(255,255,255) 或 #ffffff
 *
 *                                                                          <NotPCTip>   无论什么时候，该物品的得失都不会提示。
 *
 *未显示提示的情况：   1，插件设置的 控制物品得失提示 的开关未打开。
 *                                    2，当前未在地图场景。
 *                                    3，需要提示的道具备注了不提示的标识 <NotPCTip> 。
 *                                    4，说明 2。
 *                                    5，其它。
 *---------------------------------------------------------------
 * @param ---------功能效果---------
 *---------------------------------------------------------------
 * @param conSwitch
 * @desc 控制物品得失提示的开关ID（打开：提示；关闭：不提示）。
 * @default 5
 *---------------------------------------------------------------
 * @param waitCount
 * @desc 提示框停留持续时间（帧）。
 * @default 200
 *---------------------------------------------------------------
 * @param goldIndex
 * @desc 金钱的ICON图标序号。
 * @default 314
 *---------------------------------------------------------------
 * @param targetPX
 * @desc 得到物品时，物品图标落向的画面X坐标。X,Y都写 0 默认落向角色。
 * @default 0
 *---------------------------------------------------------------
 * @param targetPY
 * @desc 得到物品时，物品图标落向的画面Y坐标。X,Y都写 0 默认落向角色。
 * @default 0
 *---------------------------------------------------------------
 * @param fadeAnm
 * @desc 失去物品时，提示框消失的动画ID(不播放动画写 0)。
 * @default 39
 *---------------------------------------------------------------
 * @param ---------音效类---------
 **---------------------------------------------------------------
 * @param goldSe
 * @desc 得到金钱时播放的SE。
 * @default Coin
 *---------------------------------------------------------------
 * @param itemSe
 * @desc 得到道具时播放的SE。
 * @default Up1
 *---------------------------------------------------------------
 * @param weaponSe
 * @desc 得到武器时播放的SE。
 * @default Hammer
 *---------------------------------------------------------------
 * @param armorSe
 * @desc 得到防具时播放的SE。
 * @default Equip1
 *---------------------------------------------------------------
 * @param ---------颜色类---------
 *---------------------------------------------------------------
 * @param colorGold
 * @desc 得失金钱的背景颜色（格式：红,绿,蓝）。
 * @default 255,160,0
 *---------------------------------------------------------------
 * @param colorItem
 * @desc 得失道具的背景颜色（格式：红,绿,蓝）。
 * @default 200,200,200
 *---------------------------------------------------------------
 * @param colorWeapon
 * @desc 得失武器的背景颜色（格式：红,绿,蓝）。
 * @default 255,0,200
 *---------------------------------------------------------------
 * @param colorArmor
 * @desc 得失防具的背景颜色（格式：红,绿,蓝）。
 * @default 0,255,200
 *---------------------------------------------------------------
 * @param colorGain
 * @desc 得到物品时，描绘数量的 描边色（格式：红,绿,蓝）。
 * @default 0,200,0
 *---------------------------------------------------------------
 * @param colorLose
 * @desc 失去物品时，描绘数量的 描边色（格式：红,绿,蓝）。
 * @default 200,0,0
 *---------------------------------------------------------------
 * @param ---------用语---------
 *---------------------------------------------------------------
 * @param wordGold
 * @desc 货币的用语（不写默认为 数据库 货币用语）。
 * @default 金币
*/
//==================================================================================================================
var XdRsData = XdRsData || {};
XdRsData.PCTips = {};
XdRsData.PCTips.pamers      =    PluginManager.parameters('XdRs_PCTips');
XdRsData.PCTips.conSwitch   =   +XdRsData.PCTips.pamers['conSwitch']  || 0;
XdRsData.PCTips.waitCount   =   +XdRsData.PCTips.pamers['waitCount']  || 0;
XdRsData.PCTips.fadeAnm     =   +XdRsData.PCTips.pamers['fadeAnm']    || 0;
XdRsData.PCTips.goldIndex   =   +XdRsData.PCTips.pamers['goldIndex']  || 0;
XdRsData.PCTips.targetPX    =   +XdRsData.PCTips.pamers['targetPX']   || '';
XdRsData.PCTips.targetPY    =   +XdRsData.PCTips.pamers['targetPY']   || '';
XdRsData.PCTips.goldSe      = ''+XdRsData.PCTips.pamers['goldSe']     || '';
XdRsData.PCTips.itemSe      = ''+XdRsData.PCTips.pamers['itemSe']     || '';
XdRsData.PCTips.weaponSe    = ''+XdRsData.PCTips.pamers['weaponSe']   || '';
XdRsData.PCTips.armorSe     = ''+XdRsData.PCTips.pamers['armorSe']    || '';
XdRsData.PCTips.colorGold   = ''+XdRsData.PCTips.pamers['colorGold']  || '';
XdRsData.PCTips.colorItem   = ''+XdRsData.PCTips.pamers['colorItem']  || '';
XdRsData.PCTips.colorWeapon = ''+XdRsData.PCTips.pamers['colorWeapon']|| '';
XdRsData.PCTips.colorArmor  = ''+XdRsData.PCTips.pamers['colorArmor'] || '';
XdRsData.PCTips.colorGain   = ''+XdRsData.PCTips.pamers['colorGain']  || '';
XdRsData.PCTips.colorLose   = ''+XdRsData.PCTips.pamers['colorLose']  || '';
XdRsData.PCTips.wordGold    = ''+XdRsData.PCTips.pamers['wordGold']   || '';
//==================================================================================================================
XdRsData.PCTips.tipNameColor = function(item) {
    var color = 'rgb(255,255,255)';
    if (!item || !item.note) return color;
    var data = item.note.match(/<PCTipColor:(\S*)>/);
    if (!!data) color = data[1] ? data[1] : color;
    return color;
};
XdRsData.PCTips.notTip = function(item) {
    if (!item || !item.note) return false;
    return item.note.match(/<NotPCTip>/);
};
XdRsData.PCTips.colorType = function(type) {
    return [this.colorGold,this.colorItem,this.colorWeapon,this.colorArmor][type];
};
XdRsData.PCTips.pcSe = function(type) {
    return [this.goldSe,this.itemSe,this.weaponSe,this.armorSe][type];
};
XdRsData.PCTips.place = function() {
    if (!this.targetPX && !this.targetPY) return null;
    return [this.targetPX,this.targetPY];
};
//==================================================================================================================
SceneManager.isNowScene = function(sceneClass) {
    return this._scene.constructor === sceneClass;
};
//==================================================================================================================
Bitmap.prototype.setLineColor = function(color) {
    this.outlineColor = color || 'rgba(0, 0, 0, 0.5)';
};
//==================================================================================================================
function XdRs_PCTip() {
    this.initialize.apply(this, arguments);
}
XdRs_PCTip.prototype = Object.create(Sprite_Base.prototype);
XdRs_PCTip.prototype.constructor = XdRs_PCTip;

XdRs_PCTip.prototype.initialize = function(item,num) {
    Sprite_Base.prototype.initialize.call(this);
    this.iniData(item,num);
};
XdRs_PCTip.prototype.iniData = function(item,num) {
    this._item = item;
    this._num = num;
    this._moving = this._canRemove = this._showFinish = false;
    this._waitCount = XdRsData.PCTips.waitCount;
    this._waitAnm = 0;
    this._height = Window_Base._iconHeight + 10;
    this.countDimensionWidth();
};
XdRs_PCTip.prototype.canRemove = function() {
    return this._canRemove;
};
XdRs_PCTip.prototype.isShow = function() {
    return !this._showFinish;
};
XdRs_PCTip.prototype.createBitmap = function() {
    this.bitmap = new Bitmap(this._width, this._height);
};
XdRs_PCTip.prototype.bitHeight = function() {
    return this._height;
};
XdRs_PCTip.prototype.iconIndex = function() {
    if (!!this._item) return this._item.iconIndex;
    return XdRsData.PCTips.goldIndex;
};
XdRs_PCTip.prototype.textFront = function() {
    if (!!this._item) return this._item.name;
    var word = XdRsData.PCTips.wordGold;
    return !!word ? XdRsData.PCTips.wordGold : TextManager.currencyUnit;
};
XdRs_PCTip.prototype.textBack = function() {
    var num = Math.abs(this._num);
    return this._num > 0 ? '  + '+ num : '  - '+ num;
};
XdRs_PCTip.prototype.countDimensionWidth = function() {
    var bitmap = new Bitmap(10,10);
    bitmap.fontSize = Math.floor(this._height*3/5);
    this._dmsWidth = Window_Base._iconWidth + 8;
    this._dmsWidth += bitmap.measureTextWidth(this.textFront());
    this._dmsWidth += bitmap.measureTextWidth(this.textBack());
    this._width = this._dmsWidth * 2.5;
    if (this.createBitmap() || this.setPlace(20)){}
};
XdRs_PCTip.prototype.setPlace = function(y) {
    this.anchor.x = 0.5;
    this.move(Graphics.width / 2, y);
    if (this.drawBack() || this.drawIcon() || this.drawMessage()){}
};
XdRs_PCTip.prototype.baseColor = function() {
    switch(true){
        case DataManager.isItem(this._item):  return XdRsData.PCTips.colorType(1);
        case DataManager.isWeapon(this._item):return XdRsData.PCTips.colorType(2);
        case DataManager.isArmor(this._item): return XdRsData.PCTips.colorType(3);
    }
    return XdRsData.PCTips.colorType(0);
};
XdRs_PCTip.prototype.color = function(a) {
    var color = this.baseColor();
    color = !!color ? color : '0,0,0';
    return 'rgba('+color+','+a+')';
};
XdRs_PCTip.prototype.drawBack = function() {
    this.bitmap.clear();
    if (this._showFinish){if (this._num > 0 && this.drawIcon()){}return;}
    var cx = this._width / 2;
    this.bitmap.gradientFillRect(0,0,cx,this._height,this.color(0),this.color(0.6));
    this.bitmap.gradientFillRect(cx,0,cx,this._height,this.color(0.6),this.color(0));
};
XdRs_PCTip.prototype.drawIcon = function() {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth,ph = Window_Base._iconHeight;
    var sx = this.iconIndex() % 16 * pw,sy = Math.floor(this.iconIndex() / 16) * ph;
    var x = (this._width-this._dmsWidth) / 2;
    this.bitmap.blt(bitmap, sx, sy, pw, ph, x, 5);
};
XdRs_PCTip.prototype.drawMessage = function() {
    this.bitmap.setLineColor();
    this.bitmap.fontSize = Math.floor(this._height*3/5);
    var x = (this._width-this._dmsWidth) / 2 + Window_Base._iconWidth + 8;
    var y = this._height / 5;
    var tw = this.bitmap.measureTextWidth(this.textFront());
    this.bitmap.textColor = XdRsData.PCTips.tipNameColor(this._item);
    this.bitmap.drawText(this.textFront(),x,y,tw,this.bitmap.fontSize);
    var color = this._num > 0 ? XdRsData.PCTips.colorGain : XdRsData.PCTips.colorLose;
    color = !!color ? 'rgba('+color+',0.5)' : 'rgba(0,0,0,0.5)';
    this.bitmap.setLineColor(color);this.bitmap.textColor = 'rgb(255,255,255)';
    var aw = this.bitmap.measureTextWidth(this.textBack());
    this.bitmap.drawText(this.textBack(),x+tw,y,aw,this.bitmap.fontSize);
};
XdRs_PCTip.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this.updateWait();
    this.updateMove();
    this.updateAnm();
};
XdRs_PCTip.prototype.updateWait = function() {
    if (!this._waitCount) return;
    this._waitCount--;
    if (!this._waitCount && this.startAction()){}
};
XdRs_PCTip.prototype.updateMove = function() {
    if (!this._showFinish || !this._moving) return;
    if (this.updateCenter() || this.updateRange()){}
    if (!this.touchJudge() && this.moveTo()){}
};
XdRs_PCTip.prototype.updateAnm = function() {
    if (!this._waitAnm) return;
    this._waitAnm--;
    if (!this._waitAnm) this._canRemove = true;
};
XdRs_PCTip.prototype.startAction = function() {
    this._showFinish = true;
    this.drawBack();
    if (this._num < 0) {this.playAnm();return;}
    this._moving = true;
};
XdRs_PCTip.prototype.updateCenter = function() {
    var ax = (this._width - this._dmsWidth) / 2 + Window_Base._iconWidth / 2;
    var ay = Window_Base._iconHeight + 5;
    ax *= this.scale.x; ay *= this.scale.x;
    this._centerX = this.x - this._width * this.scale.x / 2 + ax;
    this._centerY = this.y + ay;
};
XdRs_PCTip.prototype.updateRange = function() {
    var rx = this._centerX - this.targetPlace()[0];
    var ry = this._centerY - this.targetPlace()[1];
    var rangeAbs = Math.abs(rx)+Math.abs(ry);
    var speed = rangeAbs < 30 ? 10 : (rangeAbs < 60 ? 9 : 8);
    var sx = Math.min(speed * Math.abs(rx) / rangeAbs, Math.abs(rx));
    var sy = Math.min(speed * Math.abs(ry) / rangeAbs, Math.abs(ry));
    sx = rx > 0 ? -sx : sx; sy = ry > 0 ? -sy : sy;
    this.scale.x = this.scale.y = (12-speed) * 0.1 + 0.3;
    this._speed = this._speed || [];
    this._speed.length = 0;this._speed.push(sx,sy);
};
XdRs_PCTip.prototype.touchJudge = function() {
    if (this.isTuch()) {
        if (!this._canRemove) {this.playSe();this._canRemove = true;}
        return true;
    }
    return false;
};
XdRs_PCTip.prototype.isTuch = function() {
    if (this._centerX > this.targetPlace()[0]+8 || this._centerX+8 < this.targetPlace()[0]) return false;
    if (this._centerY > this.targetPlace()[1]+8 || this._centerY+8 < this.targetPlace()[1]) return false;
    return true;
};
XdRs_PCTip.prototype.moveTo = function() {
    this.move(this.x + this._speed[0], this.y + this._speed[1]);
};
XdRs_PCTip.prototype.targetPlace = function() {
    if (!!XdRsData.PCTips.place()) return XdRsData.PCTips.place();
    return [$gamePlayer.screenX(), $gamePlayer.screenY()];
};
XdRs_PCTip.prototype.seName = function() {
    switch (true){
        case DataManager.isItem(this._item):  return XdRsData.PCTips.pcSe(1);
        case DataManager.isWeapon(this._item):return XdRsData.PCTips.pcSe(2);
        case DataManager.isArmor(this._item): return XdRsData.PCTips.pcSe(3);
    }
    return XdRsData.PCTips.pcSe(0);
};
XdRs_PCTip.prototype.playSe = function() {
    if (this._num < 0 || !this.seName()) return;
    AudioManager.playSe({"name":this.seName(),"volume":100,"pitch":100,"pan":0});
};
XdRs_PCTip.prototype.playAnm = function() {
    this._waitAnm = 1;
    if (!XdRsData.PCTips.fadeAnm) return;
    var animation = $dataAnimations[XdRsData.PCTips.fadeAnm];
    this._waitAnm = animation.frames.length * 5;
    this.startAnimation(animation, false, 0);
};
//==================================================================================================================
Game_Temp.prototype.pcTips = function() {
    return this._pcTips || [];
};
Game_Temp.prototype.addPcTip = function(data) {
    if (!$gameSwitches.value(XdRsData.PCTips.conSwitch)) return;
    if (!SceneManager.isNowScene(Scene_Map)) return;
    this._pcTips = this._pcTips || [];
    this._pcTips.push(data);
};
Game_Temp.prototype.shiftTip = function() {
    return this._pcTips.shift();
};
//==================================================================================================================
XdRsData.PCTips.GPgainGold = Game_Party.prototype.gainGold;
Game_Party.prototype.gainGold = function(amount) {
    this.gainTipGold(amount);
    XdRsData.PCTips.GPgainGold.call(this,amount);
};
XdRsData.PCTips.GPgainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    this.gainTipItem(item, amount, includeEquip);
    XdRsData.PCTips.GPgainItem.call(this,item, amount, includeEquip);
};
Game_Party.prototype.gainTipGold = function(amount) {
    if (!amount || !this._gold && amount < 0) return;
    if (amount > 0) {amount = Math.min(this.maxGold()-this._gold, amount);}
    else {amount = -Math.min(Math.abs(amount), this._gold);}
    if (!amount) return;
    $gameTemp.addPcTip({'item':0,'num':amount});
};
Game_Party.prototype.gainTipItem = function(item, amount, includeEquip) {
    if (XdRsData.PCTips.notTip(item)) return;
    if (amount < 0 && !this.hasItem(item,includeEquip)) return;
    var container = this.itemContainer(item);
    if (!container) return;
    if (amount > 0) {amount = Math.min(this.maxItems(item)-this.numItems(item), amount);}
    else {amount = -Math.min(Math.abs(amount), this.numItems(item));}
    if (!amount) return;
    $gameTemp.addPcTip({'item':item,'num':amount});
};
//==================================================================================================================
XdRsData.PCTips.SMupdate = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
    XdRsData.PCTips.SMupdate.call(this);
    this.updatePcTips();
};
Spriteset_Map.prototype.updatePcTips = function() {
    if (!!$gameTemp.pcTips().length) this.addTip($gameTemp.shiftTip());
    if (!this._pcTips || !this._pcTips.length) return;
    for (var i=0;i<this._pcTips.length;i++){
        if (!this._pcTips[i]) continue;
        if (this._pcTips[i].canRemove()) {
            this.removeChild(this._pcTips[i]);
            this._pcTips.splice(i,1);
        }
    }
    this.refreshPlace();
};
Spriteset_Map.prototype.addTip = function(data) {
    this._pcTips = this._pcTips || [];
    var tip = new XdRs_PCTip(data.item,data.num);
    this._pcTips.push(tip);this.addChild(tip);
};
Spriteset_Map.prototype.refreshPlace = function() {
    if (!this._pcTips || !this._pcTips.length) return;
    var ay = Math.max((Graphics.height - this.allHeight()) / 2 - 80,8);
    for (var i=0;i<this._pcTips.length;i++){
        if (!this._pcTips[i] || !this._pcTips[i].isShow()) continue;
        this._pcTips[i].y = ay;
        ay += this._pcTips[i].bitHeight() + 4;
    }
};
Spriteset_Map.prototype.allHeight = function() {
    var height = 0;
    this._pcTips.forEach(function(tip) {
        if (!!tip && tip.isShow()) height += tip.bitHeight() + 4; 
        }, this);
    return height;
};
//==================================================================================================================