//==================================================================================================================
// Suit Equip Help
//==================================================================================================================
/*:
 * @plugindesc  套装效果(装备界面帮助窗口)
 * 
 * @author 芯☆淡茹水
 *
 *
 * @param helpWidth
 * @desc 帮助窗口的宽。
 * @default 320
 *
 * @param helpColor
 * @desc 帮助窗口背景色。
 * @default 0,255,200
 * 
*/
//==================================================================================================================
;var XdRsData = XdRsData || {};
XdRsData.suit = XdRsData.suit || {};
XdRsData.suit.helpWidth =   +PluginManager.parameters('XdRs_SuitEquipHelp')['helpWidth'] || 320;
XdRsData.suit.helpColor = ''+PluginManager.parameters('XdRs_SuitEquipHelp')['helpColor'] || '';
//==================================================================================================================
function Suit_EquipHelp() {
    this.initialize.apply(this, arguments);
}
Suit_EquipHelp.prototype = Object.create(Sprite.prototype);
Suit_EquipHelp.prototype.constructor = Suit_EquipHelp;
Suit_EquipHelp.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.refreshActor(null);
    this.refreshSuit(0);
};
Suit_EquipHelp.prototype.actor = function() {
    return this._actor;
};
Suit_EquipHelp.prototype.maxNum = function() {
    return XdRsData.suit.total(this._suitId) - 1;
};
Suit_EquipHelp.prototype.lineHeight = function() {
    return 20;
};
Suit_EquipHelp.prototype.cotWidth = function() {
    return this.bitmap ? this.bitmap.width-10 : 0;
};
Suit_EquipHelp.prototype.isEffective = function() {
    return this.actor() && !!this._suitId;
};
Suit_EquipHelp.prototype.isStage = function(index) {
    return this.actor().suitNum(this._suitId) - 2 >= index;
};
Suit_EquipHelp.prototype.refreshActor = function(actor) {
    var lastActor = this._actor;
    this._actor = actor;
    lastActor !== this._actor && this.refresh();
};
Suit_EquipHelp.prototype.refreshSuit = function(suitId) {
    var lastId = this._suitId;
    this._suitId = suitId;
    lastId !== this._suitId && this.refresh();
};
Suit_EquipHelp.prototype.refreshPlace = function(x, y) {
    if (!this.visible || !this.bitmap) return;
    x = Math.max(10, Math.min(Graphics.boxWidth-this.bitmap.width, x));
    y = Math.max(0, Math.min(Graphics.boxHeight-this.bitmap.height, y));
    (this.x !== x || this.y !== y) && this.move(x, y);
};
Suit_EquipHelp.prototype.refresh = function() {
    this.visible = false;
    if (!this.isEffective()) return;
    this.makeSuit();
    this.makeBitmap();
    this.drawAll();
    this.visible = true;
};
Suit_EquipHelp.prototype.makeSuit = function() {
    this._suit = new Suit(this._suitId, 1);
};
Suit_EquipHelp.prototype.makeBitmap = function() {
    this.bitmap && this.bitmap.clear();
    var width  = XdRsData.suit.helpWidth;
    var height = this.heightCount();
    this.bitmap = new Bitmap(width, height);
};
Suit_EquipHelp.prototype.heightCount = function() {
    var height = 113;
    for(var i=0;i<this.maxNum();i++){
        var data = XdRsData.suit.words(this._suit.stageEffects(i));
        height += (Math.max(data.length, 1) + 1) * this.lineHeight();
    }
    height += (this.maxNum() - 1) * 5;
    return height + XdRsData.suit.total(this._suitId) * this.lineHeight();
};
Suit_EquipHelp.prototype.drawAll = function() {
    this.drawBg(0,0,this.bitmap.width,this.bitmap.height);
    var y = 10;
    y = this.drawTitle(y);
    y = this.drawNum(y);
    y = this.drawEffects(y);
    this.drawEquips(y);
};
Suit_EquipHelp.prototype.drawBg = function(x, y, w, h, color) {
    var data = [100,100,100];
    for (var i=0;i<5;i++){
        var add = i < 2 ? -50 : 50;
        var lineColor = 'rgba('+data.join()+',0.5)';
        this.bitmap.fillRect(x,y,w,h,lineColor);
        data = data.map(function(n){return n+add;});
        x++;y++;w-=2;h-=2;
        this.bitmap.clearRect(x,y,w,h);
    }
    color = color || 'rgba('+XdRsData.suit.helpColor+',0.5)';
    this.bitmap.fillRect(x,y,w,h,color);
};
Suit_EquipHelp.prototype.drawTitle = function(y) {
    this.bitmap.clearRect(5,y,this.cotWidth(),48);
    this.bitmap.fillRect(5,y,this.cotWidth(),48,XdRsData.suit.getColor(0, 0.6));
    this.bitmap.fontSize = 22;
    this.bitmap.textColor = XdRsData.suit.getColor(2);
    this.bitmap.drawText(XdRsData.suit.name(this._suit),5,y,this.cotWidth(),48,'center');
    return y+53;
};
Suit_EquipHelp.prototype.drawNum = function(y) {
    this.bitmap.fontSize = 20;
    this.bitmap.textColor = XdRsData.suit.getColor(0);
    var text = XdRsData.suit.numText(this.actor(), this._suitId);
    this.bitmap.drawText(text,5,y,this.cotWidth(),20,'center');
    return y+30;
};
Suit_EquipHelp.prototype.drawEffects = function(y) {
    this.bitmap.fontSize = 18;
    for(var i=0;i<this.maxNum();i++) y = this.drawEffect(i, y);
    return y+5;
};
Suit_EquipHelp.prototype.drawEffect = function(index, y) {
    var tn = this.isStage(index) ? 3 : 1;
    var en = this.isStage(index) ? 0 : 1;
    var txa = this.isStage(index) ? '★' : '☆';
    var text = txa+'装备'+(index+2)+'件'+txa;
    this.bitmap.textColor = XdRsData.suit.getColor(tn);
    this.bitmap.drawText(text,5,y,this.cotWidth(),18,'center');
    y += this.lineHeight();
    var words = XdRsData.suit.words(this._suit.stageEffects(index));
    if (!words.length) {
        this.bitmap.textColor = XdRsData.suit.getColor(1);
        this.bitmap.drawText('(空)',5,y,this.cotWidth(),18,'center');
        y += this.lineHeight();
    }else {
        this.bitmap.textColor = XdRsData.suit.getColor(en);
        for(var i=0;i<words.length;i++){
           this.bitmap.drawText(words[i],5,y,this.cotWidth(),18,'center');
           y += this.lineHeight();
        }
    }
    return y+5;
};
Suit_EquipHelp.prototype.drawEquips = function(y) {
    var equips = XdRsData.suit.suitEquips(this._suitId);
    for(var i=0;i<equips.length;i++){
        var eb = XdRsData.suit.isEquipped(this.actor(), equips[i]);
        var cw = this.bitmap.measureTextWidth(equips[i].name);
        var ax = (this.cotWidth() - 22 - cw) / 2 + 5;
        this.bitmap.textColor = XdRsData.suit.getColor(eb ? 0 : 1);
        this.drawIcon(ax, y, equips[i].iconIndex, eb);
        this.bitmap.drawText(equips[i].name,ax+22,y,cw,18);
        y += this.lineHeight();
    }
};
Suit_EquipHelp.prototype.drawIcon = function(x, y, index, eb) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = index % 16 * pw;
    var sy = Math.floor(index / 16) * ph;
    this.bitmap.blt(bitmap, sx, sy, pw, ph, x, y, 18, 18);
    if (!eb) this.bitmap.fillRect(x, y, 18, 18, 'rgba(0,0,0,0.5)');
};
//==================================================================================================================
Window_EquipSlot.prototype.suitId = function() {
    return XdRsData.suit.id(this.item());
};
Window_EquipSlot.prototype.helpPlace = function() {
    var x = this.x - XdRsData.suit.helpWidth;
    var y = this.y + this.index() * this.lineHeight() + this.standardPadding();
    return [x, y];
};
//==================================================================================================================
Window_EquipItem.prototype.suitId = function() {
    return XdRsData.suit.id(this.item());
};
Window_EquipItem.prototype.helpPlace = function() {
    var x = this.x + (this.index() + 1) % 2 * this.width / 2;
    var y = this.y + Math.floor(this.index() / 2) * this.lineHeight() + this.standardPadding();
    return [x, y];
};
//==================================================================================================================
XdRsData.suit.SSEcreate = Scene_Equip.prototype.create;
Scene_Equip.prototype.create = function() {
    XdRsData.suit.SSEcreate.call(this);
    this.createSuitHelp();
};
Scene_Equip.prototype.createSuitHelp = function() {
    this._suitHelp = new Suit_EquipHelp();
    this.addChild(this._suitHelp);
    this.refreshActor();
};
XdRsData.suit.SSErefreshActor = Scene_Equip.prototype.refreshActor;
Scene_Equip.prototype.refreshActor = function() {
    XdRsData.suit.SSErefreshActor.call(this);
    this._suitHelp && this._suitHelp.refreshActor(this.actor());
};
XdRsData.suit.SSEupdate = Scene_Equip.prototype.update;
Scene_Equip.prototype.update = function() {
    XdRsData.suit.SSEupdate.call(this);
    this.updateSuitHelp();
};
Scene_Equip.prototype.updateSuitHelp = function() {
    this._suitHelp.refreshSuit(this.suitId());
    this.updateSuitPlace();
};
Scene_Equip.prototype.updateSuitPlace = function() {
    if (!this._suitHelp.visible) return;
    var place = this.getPlace();
    place && this._suitHelp.refreshPlace(place[0], place[1]);
};
Scene_Equip.prototype.suitId = function() {
    if (this._itemWindow.isOpenAndActive()) {
        return this._itemWindow.suitId();
    }
    if (this._slotWindow.isOpenAndActive()) {
        return this._slotWindow.suitId();
    }
    return 0;
};
Scene_Equip.prototype.getPlace = function() {
    if (this._itemWindow.isOpenAndActive()) {
        return this._itemWindow.helpPlace();
    }
    if (this._slotWindow.isOpenAndActive()) {
        return this._slotWindow.helpPlace();
    }
    return null;
};
//==================================================================================================================
// end
//==================================================================================================================