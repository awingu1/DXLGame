//==================================================================================================================
// Suit Display
//==================================================================================================================
/*:
 * @plugindesc  套装效果(套装窗口，场景的显示)
 * 
 * @author 芯☆淡茹水
 * 
*/
//==================================================================================================================
;var XdRsData = XdRsData || {};
XdRsData.suit = XdRsData.suit || {};
//==================================================================================================================
XdRsData.suit.changeScene = function(isItem) {
    SceneManager.push(isItem ? Scene_Item : Scene_Equip);
};
//==================================================================================================================
XdRsData.suit.GSTinitialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    XdRsData.suit.GSTinitialize.call(this);
    this.setSuitState(true);
};
Game_System.prototype.suitOpened = function() {
    return this._suitState;
};
Game_System.prototype.setSuitState = function(state) {
    this._suitState = state;
};
//==================================================================================================================
XdRsData.suit.GIpluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    XdRsData.suit.GIpluginCommand.call(this, command, args);
    command === 'ShowSuitCommand' && $gameSystem.setSuitState(true);
    command === 'HideSuitCommand' && $gameSystem.setSuitState(false);
    command === 'OpenSceneSuit'   && SceneManager.push(Scene_Suit);
    command === 'SubSuitMaxNum'   && this.subSuitData(args, 0);
    command === 'SubSuitActorNum' && this.subSuitData(args, 1);
};
Game_Interpreter.prototype.subSuitData = function(args, type) {
    var suitId = +args[1] || null;
    !type && XdRsData.suit.subSuitMaxNum(+args[0], suitId);
    type && XdRsData.suit.subSuitActorNum(+args[0], suitId, $gameActors.actor(+args[2]));
};
//==================================================================================================================
function Suit_List() {
    this.initialize.apply(this, arguments);
}
Suit_List.prototype = Object.create(Window_Selectable.prototype);
Suit_List.prototype.constructor = Suit_List;
Suit_List.prototype.initialize = function() {
    Window_Selectable.prototype.initialize.call(this, 0, 162, 240, Graphics.boxHeight-162);
    this._idData = $gameParty.allSuitId();
    this._index = 0;
    this.refresh();
    this.activate();
};
Suit_List.prototype.maxItems = function() {
    return this._idData ? (this._idData.length || 1) : 0;
};
Suit_List.prototype.itemTextAlign = function() {
    return 'center';
};
Suit_List.prototype.lineHeight = function() {
    return 34;
};
Suit_List.prototype.standardPadding = function() {
    return 10;
};
Suit_List.prototype.suitId = function() {
    return this._idData[this._index];
};
Suit_List.prototype.suitName = function(suitId) {
    var event = $dataCommonEvents[suitId];
    return event ? event.name : '(空)';
};
Suit_List.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    var suitId = this._idData[index];
    var aced = $gameParty.suitActivation(suitId);
    var color = XdRsData.suit.getColor(aced ? 0 : 1);
    this.changeTextColor(color);
    this.drawText(this.suitName(suitId), rect.x, rect.y, rect.width, align);
};
Suit_List.prototype.isCurrentItemEnabled = function() {
    return !!this.suitId();
};
//==================================================================================================================
function Suit_State() {
    this.initialize.apply(this, arguments);
}
Suit_State.prototype = Object.create(Window_Base.prototype);
Suit_State.prototype.constructor = Suit_State;
Suit_State.prototype.initialize = function(index) {
    Window_Base.prototype.initialize.call(this, index * 162, 0, 162, 162);
    this._actorIndex = index;
    this.createOutLayer();
    this.drawFace();
    this.deactivate();
};
Suit_State.prototype.standardPadding = function() {
    return 9;
};
Suit_State.prototype.actorIndex = function() {
    return this._actorIndex;
};
Suit_State.prototype.actor = function() {
    if (!this._actorIndex) return null;
    return $gameParty.members()[this._actorIndex-1];
};
Suit_State.prototype.setTouchHandler = function(handler) {
    this._touchHandler = handler;
};
Suit_State.prototype.setSuitId = function(suitId) {
    var lastId = this._suitId;
    this._suitId = suitId;
    lastId !== this._suitId && this.refreshEquipIcon();
};
Suit_State.prototype.createOutLayer = function() {
    this._outLayer = new Sprite(new Bitmap(144,144));
    var n = this.standardPadding();
    this._outLayer.move(n,n);
    this.addChild(this._outLayer);
};
Suit_State.prototype.refreshEquipIcon = function() {
    this._outLayer.bitmap.clear();
    if (!this._suitId) return;
    var equips = this.setupEquips();
    var size = this.iconSize(equips.length);
    var n = Math.floor(144 / size);
    for (var i=0;i<equips.length;i++) {
        var x = i % n * size;
        var y = (n- 1 - Math.floor(i/n)) * size;
        this.drawEquipIcon(equips[i], x, y, size);
    }
};
Suit_State.prototype.iconSize = function(length) {
    var size = 36, max = 8;
    while (max < 32 && max < length){max *=2; size /=2;}
    return size;
};
Suit_State.prototype.setupEquips = function() {
    var equips;
    if (this.actor()) equips = this.actor().equips();
    else equips = $gameParty.equipItems();
    return equips.filter(function(e){
        return XdRsData.suit.id(e) === this._suitId;
    }, this);
};
Suit_State.prototype.getBitmap = function() {
    if (!this.actor()) return ImageManager.loadPicture('Ui_Suit');
    return ImageManager.loadFace(this.actor().faceName());
};
Suit_State.prototype.drawFace = function() {
    var pw = this.actor() ? Window_Base._faceWidth  : 144;
    var ph = this.actor() ? Window_Base._faceHeight : 144;
    var index = this.actor() ? this.actor().faceIndex() : 0;
    var sx = index % 4 * pw;
    var sy = Math.floor(index / 4) * ph;
    var bitmap = this.getBitmap();
    bitmap.addLoadListener(function() {
        this.contents.blt(bitmap, sx, sy, pw, ph, 0, 0, 144, 144);  
    }.bind(this));
};
Suit_State.prototype.drawEquipIcon = function(equip, x, y, size) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var index = equip.iconIndex;
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = index % 16 * pw;
    var sy = Math.floor(index / 16) * ph;
    this._outLayer.bitmap.blt(bitmap, sx, sy, pw, ph, x, y, size, size);
};
Suit_State.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.updateTouch();
};
Suit_State.prototype.updateTouch = function() {
    if (!this.active) return;
    if (TouchInput.isTriggered() && this.isTouched()) {
        this._touchHandler && this._touchHandler(this._actorIndex);
    }
};
Suit_State.prototype.isTouched = function() {
    var x = TouchInput.x, y = TouchInput.y;
    return x > this.x && x < (this.x + this.width) &&
    y > this.y  && y < (this.y + this.height);
};
//==================================================================================================================
function SuitHelp() {
    this.initialize.apply(this, arguments);
}
SuitHelp.prototype = Object.create(Window_Base.prototype);
SuitHelp.prototype.constructor = Spriteset_Base;
SuitHelp.prototype.initialize = function() {
    var width  = Graphics.boxWidth - 240;
    var height = Graphics.boxHeight - 162;
    Window_Base.prototype.initialize.call(this,240,162,width,height);
    this._suitId = null;
    this._objIndex = 0;
};
SuitHelp.prototype.refreshObj = function(index) {
    var lastIndex = this._objIndex;
    this._objIndex = index;
    lastIndex !== this._objIndex && this.refresh();
};
SuitHelp.prototype.refreshSuit = function(suitId) {
    var lastId = this._suitId;
    this._suitId = suitId;
    lastId !== this._suitId && this.refresh();
};
SuitHelp.prototype.setPage = function(page) {
    if (page < 0) return;
    var lastPage = this._page;
    this._page = page;
    if (lastPage !== this._page) {
        SoundManager.playCursor();
        this.refreshEffcive();
    }
};
SuitHelp.prototype.actor = function() {
    if (!this._objIndex) return null;
    return $gameParty.members()[this._objIndex-1];
};
SuitHelp.prototype.needDrawNum = function() {
    return !!this.actor();
};
SuitHelp.prototype.objEquips = function() {
    if (!this._objIndex) return $gameParty.equipItems();
    return this.actor().equips();
};
SuitHelp.prototype.isEquipped = function(equip) {
    return XdRsData.suit.isEquipped(this.actor(), equip);
};
SuitHelp.prototype.maxNum = function() {
    return XdRsData.suit.total(this._suitId);
};
SuitHelp.prototype.efcMax = function() {
    return this.maxNum() - 1;
};
SuitHelp.prototype.isStage = function() {
    if (!this._objIndex) return false;
    return (this.actor().suitNum(this._suitId) - 2) >= this._page;
};
SuitHelp.prototype.maxHeight = function() {
    var equips = XdRsData.suit.suitEquips(this._suitId);
    return Math.ceil(equips.length / 3) * this.lineHeight();
};
SuitHelp.prototype.isEffective = function() {
    return !!this._suitId;
};
SuitHelp.prototype.lineHeight = function() {
    return 30;
};
SuitHelp.prototype.rightX = function() {
    return this.contents.width / 3 * 2;
};
SuitHelp.prototype.titHeight = function() {
    return 50;
};
SuitHelp.prototype.refresh = function() {
    this.contents.clear();
    this._page = 0;
    if (!this.isEffective()) return;
    this.makeSuit();
    this.drawTitle();
    this.refreshStage();
};
SuitHelp.prototype.getColor = function(data, a) {
    a = a || 1;
    return 'rgba('+data.join()+','+a+')';
};
SuitHelp.prototype.makeSuit = function() {
    this._suit = new Suit(this._suitId, 1);
};
SuitHelp.prototype.drawBg = function(x, y, w, h, color) {
    var data = [100,100,100];
    for (var i=0;i<5;i++) {
        this.contents.fillRect(x,y,w,h,this.getColor(data, 0.5));
        var add = i < 2 ? -50 : 50;
        data = data.map(function(n){return n+add;});
        x++;y++;w-=2;h-=2;
        this.contents.clearRect(x,y,w,h);
    }
    color = color || XdRsData.suit.getColor(4, 0.5);
    this.contents.fillRect(x,y,w,h,color);
};
SuitHelp.prototype.drawTitle = function() {
    this.resetFontSettings();
    var aw = this.contents.width;
    this.drawBg(0,0,aw,this.titHeight());
    this.changeTextColor(XdRsData.suit.getColor(2));
    this.drawText(XdRsData.suit.name(this._suit),0,10,aw,'center');
};
SuitHelp.prototype.refreshStage = function() {
    var y = this.titHeight();
    this.contents.clearRect(0,y,this.width,this.height-y);
    this.drawTip(y);
    y += this.lineHeight();
    var mh = this.contents.height - y;
    var x = this.rightX();
    this.drawBg(x,y,this.contents.width-x,mh);
    y = this.drawNumText(y);
    this.drawEquips(x, y+10);
    this.refreshEffcive();
};
SuitHelp.prototype.refreshEffcive = function() {
    var y = this.titHeight()+this.lineHeight();
    var width = this.rightX();
    this.contents.clearRect(0,y,width,this.height-y);
    this.drawCommands();
    y = this.drawStageState(y+40);
    this.drawEffect(y);
};
SuitHelp.prototype.drawTip = function(y) {
    this.contents.fontSize = 20;
    this.changeTextColor(XdRsData.suit.getColor(3));
    this.drawText(XdRsData.suit.tipWord(),0,y,this.contents.width,'center');
};
SuitHelp.prototype.drawNumText = function(y) {
    if (!this.needDrawNum()) return y;
    this.contents.fontSize = 20;
    this.changeTextColor(XdRsData.suit.getColor(0));
    var x = this.rightX();
    var aw = this.contents.width - x;
    this.drawBg(x, y, aw, 32, 'rgba(0,0,0,0.5)');
    var text = XdRsData.suit.numText(this.actor(), this._suitId);
    this.drawText(text,x,y,aw,'center');
    return y + 30;
};
SuitHelp.prototype.drawEquips = function(x, y) {
    this.contents.fontSize = 22;
    var equips = XdRsData.suit.suitEquips(this._suitId);
    var mw = x / 2;
    for (var i=0;i<equips.length;i++){
        var name = equips[i].name;
        var cw = this.contents.measureTextWidth(name);
        var ny = i * this.lineHeight() + y;
        this.drawSmallIcon(x+10, ny, equips[i].iconIndex);
        var n = this.isEquipped(equips[i]) ? 0 : 1;
        this.changeTextColor(XdRsData.suit.getColor(n));
        this.drawText(name,x+38,ny-2,cw);
    }
};
SuitHelp.prototype.drawSmallIcon = function(x, y, index) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = index % 16 * pw;
    var sy = Math.floor(index / 16) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, 24, 24);
};
SuitHelp.prototype.drawCommands = function() {
    this.contents.fontSize = 20;
    var y = this.titHeight()+this.lineHeight();
    var width = this.rightX() / this.efcMax();
    for (var i=0;i<this.efcMax();i++) {
        var x = i * width;
        this.drawBg(x,y,width,40);
        var n = this._page === i ? 3 : 1;
        var text = '装备'+(i+2)+'件';
        this.changeTextColor(XdRsData.suit.getColor(n));
        this.drawText(text,x+5,y+5,width-10,'center');
    }
};
SuitHelp.prototype.drawStageState = function(y) {
    if (this.maxNum() < 2 || !this.needDrawNum()) return y;
    this.contents.fontSize = 20;
    var width = this.rightX();
    var n = this.isStage() ? 0 : 1;
    var text = this.isStage() ? '<已激活>' : '<未激活>';
    this.changeTextColor(XdRsData.suit.getColor(n));
    this.drawText(text,0,y,width,'center');
    return y+30;
};
SuitHelp.prototype.drawEffect = function(y) {
    if (this.maxNum() < 2) return;
    var width = this.rightX();
    this.drawBg(0,y,width,this.contents.height-y);
    y += 20;
    var words = XdRsData.suit.words(this._suit.stageEffects(this._page));
    var n = (this.isStage() && words.length) ? 0 : 1;
    this.changeTextColor(XdRsData.suit.getColor(n));
    if (!words.length) this.drawText('(无)',0,y,width,'center');
    else {
        for (var i=0;i<words.length;i++) {
            var ny = i * (this.lineHeight()-4) + y;
            this.drawText(words[i],0,ny,width,'center');
        }
    }
};
SuitHelp.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.updateInput();
    this.updateTouch();
};
SuitHelp.prototype.updateInput = function() {
    Input.isTriggered('pagedown') && this.setPage((this._page+1)%this.efcMax());
    Input.isTriggered('pageup')   && this.setPage((this._page+this.efcMax()-1)%this.efcMax());
};
SuitHelp.prototype.updateTouch = function() {
    if (!TouchInput.isTriggered()) return;
    var page = this.touchPage();
    page !== null && this.setPage(page);
};
SuitHelp.prototype.touchPage = function() {
    var width = this.rightX() / this.efcMax();
    var y = this.y + this.titHeight() + this.lineHeight() + this.standardPadding();
    var tx = TouchInput.x, ty = TouchInput.y;
    for (var i=0;i<this.efcMax();i++) {
        var x = this.x + i * width + this.standardPadding();
        if (tx > x && tx < (x + width) && ty > y  && ty < (y + 40)) {
            return i;
        }
    }
    return null;
};
//==================================================================================================================
function Suit_Arrow() {
    this.initialize.apply(this, arguments);
}
Suit_Arrow.prototype = Object.create(Sprite.prototype);
Suit_Arrow.prototype.constructor = Suit_Arrow;
Suit_Arrow.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._count = 0;
    this.initImage();
    this.hide();
};
Suit_Arrow.prototype.initImage = function() {
    this.bitmap = ImageManager.loadPicture('Ui_Suit');
    this.anchor.x = this.anchor.y = 0.5;
    this.setFrame(144,0,42,42);
};
Suit_Arrow.prototype.show = function(){this.visible = true;};
Suit_Arrow.prototype.hide = function(){this.visible = false;};
Suit_Arrow.prototype.refreshPlace = function(obj) {
    var x = obj.x + obj.width / 2;
    var y = obj.y +  obj.height;
    this.move(x, y);
    this._count = 0;
};
Suit_Arrow.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateAction();
};
Suit_Arrow.prototype.updateAction = function() {
    if (!this.visible) return;
    this._count = (this._count + 1) % 20;
    var add = this._count < 10 ? -1 : 1;
    this.y += add;
};
//==================================================================================================================
function Scene_Suit() {
    this.initialize.apply(this, arguments);
}
Scene_Suit.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Suit.prototype.constructor = Scene_Suit;
Scene_Suit.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this._index = 0;
};
Scene_Suit.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createList();
    this.createFacies();
    this.createHelp();
    this.createArrow();
};
Scene_Suit.prototype.createList = function() {
    this._list = new Suit_List();
    this._list.setHandler('ok',     this.viewItems.bind(this));
    this._list.setHandler('cancel', this.exitScene.bind(this));
    this.addChild(this._list);
};
Scene_Suit.prototype.createFacies = function() {
    this._facies = [];
    var max = $gameParty.members().length + 1;
    for (var i=0;i<max;i++){
        var face = new Suit_State(i);
        face.setTouchHandler(this.touchFace.bind(this));
        this._facies.push(face);
        this.addChild(face);
    }
    this.refreshFacies();
};
Scene_Suit.prototype.createHelp = function() {
    this._help = new SuitHelp();
    this.refreshHelp();
    this.addChild(this._help);
};
Scene_Suit.prototype.createArrow = function() {
    this._arrow = new Suit_Arrow();
    this.addChild(this._arrow);
};
Scene_Suit.prototype.isSuitIdChanged = function() {
    return this._dataId !== this._list.suitId();
};
Scene_Suit.prototype.refreshFacies = function() {
    this._dataId = this._list.suitId();
    this._facies.forEach(function(f){f.setSuitId(this._dataId);},this);
};
Scene_Suit.prototype.refreshHelp = function(setObj) {
    this._help.refreshSuit(this._list.suitId());
    this._help.refreshObj(setObj ? this._index : 0);
};
Scene_Suit.prototype.refreshArrow = function() {
    this._arrow.refreshPlace(this._facies[this._index]);
};
Scene_Suit.prototype.actor = function() {
    var index = this._index ? this._index - 1 : 0;
    return $gameParty.members()[index];
};
Scene_Suit.prototype.setFaciesActive = function(state) {
    this._facies.forEach(function(f){state ? f.activate() : f.deactivate();});
};
Scene_Suit.prototype.setIndex = function(index) {
    var lastIndex = this._index;
    this._index = index;
    if (lastIndex !== this._index) {
        SoundManager.playCursor();
        $gameParty.setMenuActor(this.actor());
        this.refreshArrow();
        this.refreshHelp(true);
    }
};
Scene_Suit.prototype.touchFace = function(index) {
    if (index === this._index) this.changeScene(index);
    else this.setIndex(index);
};
Scene_Suit.prototype.choiceItem = function(type) {
    var max = this._facies.length;
    var num = type ? 1 : max-1;
    this.setIndex((this._index+num) % max);
};
Scene_Suit.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    this.updateSuitChanged();
    this.updateItemChoice();
};
Scene_Suit.prototype.updateSuitChanged = function() {
    if (this.isSuitIdChanged()) {
        this.refreshFacies();
        this.refreshHelp();
    }
};
Scene_Suit.prototype.updateItemChoice = function() {
    if (!this._arrow.visible) return;
    Input.isTriggered('left')  && this.choiceItem(0);
    Input.isTriggered('right') && this.choiceItem(1);
    Input.isTriggered('ok')    && this.changeScene(this._index);
    this.someCancelled()       && this.viewSuits();
};
Scene_Suit.prototype.viewItems = function() {
    this._index = 0;
    this.setFaciesActive(true);
    this.refreshArrow();
    this._arrow.show();
};
Scene_Suit.prototype.viewSuits = function() {
    SoundManager.playCancel();
    this.setFaciesActive(false);
    this._arrow.hide();
    this.refreshHelp();
    this._list.activate();
};
Scene_Suit.prototype.someCancelled = function() {
    return Input.isTriggered('menu') || TouchInput.isCancelled();
};
Scene_Suit.prototype.changeScene = function(index) {
    SoundManager.playOk();
    XdRsData.suit.changeScene(!index);
};
Scene_Suit.prototype.exitScene = function() {
    SceneManager.pop();
};
//==================================================================================================================
XdRsData.suit.WMaddOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
    XdRsData.suit.WMaddOriginalCommands.call(this);
    if (this.needsCommand('suit')) {
        this.addCommand(XdRsData.suit.commandWord(), 'suit');
    }
};
XdRsData.suit.WMneedsCommand = Window_MenuCommand.prototype.needsCommand;
Window_MenuCommand.prototype.needsCommand = function(name) {
    if (name === 'suit') return $gameSystem.suitOpened();
    return XdRsData.suit.WMneedsCommand.call(this, name);
};
//==================================================================================================================
XdRsData.suit.SMcreateCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    XdRsData.suit.SMcreateCommandWindow.call(this);
    this._commandWindow.setHandler('suit',  this.commandSuit.bind(this));
};
Scene_Menu.prototype.commandSuit = function() {
    SceneManager.push(Scene_Suit);
};
//==================================================================================================================