//==================================================================================================================
// Suit Core
//==================================================================================================================
/*:
 * @plugindesc  套装效果(套装核心，套装效果应用以及套装动画)
 * 
 * @author 芯☆淡茹水
 * 
 * @help 
 * 〓 套装编辑 〓
 * 1，欲加入套装的装备（武器/防具），在其备注里写：<SuitId:id>
 *    id : 公共事件ID（里面编辑套装效果），以下简称 套装ID。
 *    所有数据库里备注了相同 套装ID 的装备，它们就组合成了一套套装。
 *
 * 2，套装的公共事件编辑：
 *    A:套装名 = 公共事件名。
 *    
 *    B:事件项 说明/注释 备注： <DividLine>
 *      表示该套装装备不同件数效果的分割线（套装效果最低2件开始激活）
 *      例如，事件编辑：
 *          增加最大HP100         //<=   装备大于等于2件时激活的效果
 *          注释： <DividLine>
 *          物理防御增加 30       //<=   装备大于等于3件时激活的效果
 *          自动状态 蓄力         //<=   装备大于等于3件时激活的效果
 *          注释： <DividLine>
 *          获取经验 +20%         //<=   装备大于等于4件时激活的效果
 *          自动回复HP 10%        //<=   装备大于等于4件时激活的效果
 *          自动回复MP 5%         //<=   装备大于等于4件时激活的效果
 *          ....<以此类推>....
 *    
 *    C:套装效果与事件项编辑对照表（仅限当前支持的效果）
 *      套装效果      =>   事件项
 *      经验加成      =>   更改EXP（常量的值为加成百分比）
 *      金钱加成      =>   更改金币（常量的值为加成百分比）
 *      物品爆率加成  =>   更改道具（道具任意，不影响效果；更改的常量为加成百分比）
 *      增加属性      =>   更改参数（属性类型为事件项编辑的属性类型， 常量为增加的量）
 *      自动状态      =>   更改状态
 *      状态免疫      =>   更改敌人状态
 *      增加技能      =>   更改技能
 *      增加暴击率    =>   更改等级（常量为增加的暴击率）
 *      魔法反射率    =>   更改敌人MP（常量为增加的反射率）
 *      自动回复HP    =>   更改HP（常量的值为回复百分比）
 *      自动回复MP    =>   更改MP（常量的值为回复百分比）
 *
 *    D:套装动画编辑：在任意位置，写上 说明/注释 ， 备注：<Anm:id>
 *      id :动画ID。
 *      当某个角色穿上这套套装的所有装备时，这个人物就会循环播放备注的这个动画。
 *      不需要播放动画，可以不备注。
 *      
 * 〓 说明 〓
 * 1，套装各个效果之间为叠加模式，相同效果后面的不会取代前面的。
 * 2，一些公共效果（经验加成，金钱加成，物品爆率，，，），队伍各成员之间同样也是
 *    叠加模式。
 *
 * 〓 插件命令 〓
 * 1，菜单显示 套装 选项 => ShowSuitCommand
 * 
 * 2，菜单隐藏 套装 选项 => HideSuitCommand
 *    ※隐藏的只是菜单里能否选择进入套装界面，套装效果依然存在※
 *    
 * 3，打开套装界面 => OpenSceneSuit
 * 
 * 4，将某类套装的总件数代入一个变量 => SubSuitMaxNum valId suitId
 *    valId:  欲代入的变量ID。
 *    suitId: 套装ID（套装效果公共事件ID）。
 *    例：将 22 号套装的总件数代入变量 5  => SubSuitMaxNum 5 22
 *    
 * 5，将一个角色当前所装备的某类套装数量代入一个变量 => SubSuitActorNum valId suitId actorId
 *    valId:  欲代入的变量ID。
 *    suitId: 套装ID（套装效果公共事件ID）。
 *    actorId:角色ID。
 *    例：将 2 号角色当前装备的 15 号套装件数代入变量 11  => SubSuitActorNum 11 15 2
 * 
 * @param color0
 * @desc 一般文字颜色。格式：红,绿,蓝
 * @default 0,255,0
 *
 * @param color1
 * @desc 无效文字颜色。
 * @default 160,160,160
 *
 * @param color2
 * @desc 套装名字颜色。
 * @default 255,0,255
 *
 * @param color3
 * @desc 提示文字颜色。
 * @default 255,200,0
 *
 * @param color4
 * @desc 背景框颜色。
 * @default 160,160,160
 *
 * @param STword
 * @desc 套装的菜单选项用语。
 * @default 套装
 * 
 * @param NAword
 * @desc 套装名显示样式。（^v :套装名）
 * @default ★套装 【^v】★
 *
 * @param TPword
 * @desc 切换操作提示用语。
 * @default 切换件数效果: PageUp/PageDown
 * 
 * @param GRword
 * @desc 金钱加成用语。（^g :金钱用语； ^n : 加成百分数）
 * @default 获取^g +^n%
 *
 * @param ERword
 * @desc 经验加成用语。（^e :经验用语；^n : 加成百分数）
 * @default 获取^e +^n%
 *
 * @param IRword
 * @desc 物品爆率加成用语。（^n : 加成百分数）
 * @default 物品爆率 +^n%
 *
 * @param RHword
 * @desc 自动回血用语。（^h :HP用语；^n : 回复百分数）
 * @default 每回合自动回复^h ^n%
 *
 * @param RMword
 * @desc 自动回蓝用语。（^m :MP用语；^n : 回复百分数）
 * @default 每回合自动回复^m ^n%
 *
 * @param ASword
 * @desc 自动状态用语。（^s :状态名）
 * @default 自动状态 ^s
 *
 * @param SIword
 * @desc 状态免疫用语。（^s :状态名）
 * @default 免疫状态 ^s
 *
 * @param ALword
 * @desc 增加技能用语。（^k :技能用语；^l :技能名）
 * @default 增加^k ^l
 *
 * @param EAword
 * @desc 增加属性用语。（^a :属性用语；^n : 增加的量）
 * @default ^a +^n
 *
 * @param ABword
 * @desc 增加暴击用语。（^n : 增加的量）
 * @default 暴击率 +^n%
 *
 * @param MRword
 * @desc 魔防反射用语。（^n : 增加的量）
 * @default 魔防反射几率 +^n%
 *
*/
//==================================================================================================================
;var XdRsData = XdRsData || {};
XdRsData.suit = XdRsData.suit || {};
XdRsData.suit.parameters = PluginManager.parameters('XdRs_SuitCore');
//==================================================================================================================
// 求和（仅限各单元为数值的数组）。
Array.prototype.sum = function() {
    return !!this.length ? eval(this.join('+')) : 0;
};
// 转换多层数组为一层数组（仅限各单元为数值的数组）。
Array.prototype.flatten = function() {
    return this.join().split(',').map(function(n){return +n;});
};
// 去重。
Array.prototype.uniq = function() {
    if (this.length < 2) return this;
    var data = [];
    this.forEach(function(n){!data.contains(n) && data.push(n);});
    return data;
};
//==================================================================================================================
XdRsData.suit.DMonLoad = DataManager.onLoad;
DataManager.onLoad = function(object) {
    XdRsData.suit.DMonLoad.call(this, object);
    if (object === $dataWeapons || object === $dataArmors) {
        XdRsData.suit.setupBaseEquips(object);
    }
};
//==================================================================================================================
XdRsData.suit.setupBaseEquips = function(object) {
    object.forEach(function(e){this.setupEquipSuitData(e);}, this);
    var type = object === $dataWeapons ? 0 : 1;
    if (!type) this._baseWeapons = JSON.parse(JSON.stringify(object));
    if (type) this._baseArmors = JSON.parse(JSON.stringify(object));
};
XdRsData.suit.setupEquipSuitData = function(equip) {
    if (!equip) return;
    equip.baseSuitDataId = equip.id;
    equip.suitId = equip.note.match(/<SuitId:(\d+)>/) ? +RegExp.$1 : 0;
};
XdRsData.suit.allBaseEquips = function() {
    return this._baseWeapons.concat(this._baseArmors);
};
XdRsData.suit.isWeapon = function(item) {
    return item && this._baseWeapons.contains(item) || DataManager.isWeapon(item);
};
XdRsData.suit.isArmor = function(item) {
    return item && this._baseArmors.contains(item) || DataManager.isArmor(item);
};
XdRsData.suit.isEquip = function(equip) {
    return this.isWeapon(equip) || this.isArmor(equip);
};
XdRsData.suit.isSameEquip = function(equip1, equip2) {
    if (!this.isEquip(equip1) || !this.isEquip(equip2)) return false;
    var type1 = this.isWeapon(equip1) ? 0 : 1;
    var type2 = this.isWeapon(equip2) ? 0 : 1;
    return type1 === type2 && equip1.baseSuitDataId === equip2.baseSuitDataId;
};
XdRsData.suit.isSuit = function(equip) {
    return this.id(equip) > 0;
};
// 为兼容某些独立装备插件，重新判断角色某件装备情况。
XdRsData.suit.isEquipped = function(actor, equip) {
    if (!actor || !equip) return false;
    return actor.equips().some(function(e){
        return this.isSameEquip(e, equip);
    }, this);
};
XdRsData.suit.numEffective = function(num) {
    return num >= 2;
};
XdRsData.suit.id = function(equip) {
    return this.isEquip(equip) ? equip.suitId : 0;
};
XdRsData.suit.name = function(suit) {
    var text = ''+this.parameters['NAword'] || '';
    return text.replace(/\^v/g, suit.name());
};
XdRsData.suit.num = function(suitId, equips) {
    return equips.filter(function(e){
        return this.id(e) === suitId;
    }, this).length;
};
XdRsData.suit.total = function(suitId) {
    return this.num(suitId, this.allBaseEquips());
};
XdRsData.suit.suitEquips = function(suitId) {
    return this.allBaseEquips().filter(function(e){
        return this.id(e) === suitId;
    }, this);
};
XdRsData.suit.isDividLine = function(list) {
    return list.code === 108 && /<DividLine>/.test(list.parameters[0]);
};
// 判断是否有效的套装效果事件项代码（code）。
XdRsData.suit.isRealList = function(list) {
    return [125,126,311,312,313,315,316,317,318,332,333].contains(list.code);
};
// 事件项代码（code）与 套装效果缩写 相对应的记录。
XdRsData.suit.convertData = function() {
    return [['GR',125],['IR',126],['RH',311],['RM',312],
            ['AS',313],['ER',315],['AB',316],['EA',317],
            ['AL',318],['MR',332],['SI',333]];
};
// 根据 套装效果缩写 转换为 事件项代码（code）。
XdRsData.suit.convertType = function(type) {
    var data = this.convertData().filter(function(d){
        return d[0] === type;
    }).shift();
    return data ? data[1] : 0;
};
// 根据 事件项代码（code） 转换为 套装效果缩写。
XdRsData.suit.convertCode = function(code) {
    var data = this.convertData().filter(function(d){
        return d[1] === code;
    }).shift();
    return data ? data[0] : '';
};
// 转换对应事件项记录的ID（如：状态ID, 技能ID，，，）。
XdRsData.suit.convertDataId = function(list) {
    switch(list.code) {
        case 313:return list.parameters[3];
        case 317:return list.parameters[2];
        case 318:return list.parameters[3];
        case 333:return list.parameters[2];
    }
    return 0;
};
// 根据事件项，转换为其对应的数值。
XdRsData.suit.convertNum = function(list) {
    switch(list.code) {
        case 125 :return list.parameters[2];
        case 126 :return list.parameters[3];
        case 311 :return list.parameters[4];
        case 312 :return list.parameters[4];
        case 315 :return list.parameters[4];
        case 316 :return list.parameters[4];
        case 317 :return list.parameters[5];
        case 332 :return list.parameters[3];
    }
    return 0;
};
// 根据角色的其它属性ID（xparamId），转换为 套装效果缩写。（null 为未增添的套装效果）。
XdRsData.suit.convertXparam = function(xparamId) {
    return [null,null,'AB',null,null,'MR',null,'RH','RM'][xparamId];
};
// 将事件项集合转换为用语集合。
XdRsData.suit.words = function(lists) {
    return lists.map(function(l){return this.listWord(l);}, this);
};
// 将事件项转换为其对应的用语。
XdRsData.suit.listWord = function(list) {
    if (!list.code) return null;
    var sym = this.convertCode(list.code);
    var text = ''+this.parameters[sym+'word'] || '';
    text = text.replace(/\^n/g, ''+this.convertNum(list));
    text = text.replace(/\^s/g, this.stateName(list));
    text = text.replace(/\^l/g, this.skillName(list));
    text = text.replace(/\^g/g, TextManager.currencyUnit);
    text = text.replace(/\^e/g, TextManager.expA);
    text = text.replace(/\^h/g, TextManager.hpA);
    text = text.replace(/\^m/g, TextManager.mpA);
    text = text.replace(/\^k/g, TextManager.skill);
    return text.replace(/\^a/g, TextManager.param(this.convertDataId(list)));
};
XdRsData.suit.stateName = function(list) {
    var id = this.convertDataId(list);
    return $dataStates[id] ? $dataStates[id].name : '';
};
XdRsData.suit.skillName = function(list) {
    var id = this.convertDataId(list);
    return $dataSkills[id] ? $dataSkills[id].name : '';
};
XdRsData.suit.numText = function(actor, suitId) {
    if (!suitId) return '';
    var now = actor ? actor.suitNum(suitId) : 0;
    var max = this.total(suitId);
    return '< '+now+'/'+max+' >';
};
XdRsData.suit.getColor = function(type, a) {
    a = a || 1;
    var data = ''+this.parameters['color'+type] || '';
    return 'rgba('+data+','+a+')';
};
XdRsData.suit.commandWord = function() {
    return ''+this.parameters['STword'] || '';
};
XdRsData.suit.tipWord = function() {
    return ''+this.parameters['TPword'] || '';
};
XdRsData.suit.subSuitMaxNum = function(valId, suitId) {
    $gameVariables.setValue(valId, this.total(suitId));
};
XdRsData.suit.subSuitActorNum = function(valId, suitId, actor) {
    var num = actor ? actor.suitNum(suitId) : 0;
    $gameVariables.setValue(valId, num);
};
//==================================================================================================================
function Suit() {
    this.initialize.apply(this, arguments);
}
Suit.prototype.initialize = function(id, num) {
    this._id = id;
    this.initLine();
    this.refresh(num);
};
Suit.prototype.id = function() {
    return this._id;
};
Suit.prototype.name = function() {
    return this.event().name;
};
Suit.prototype.event = function() {
    return $dataCommonEvents[this._id];
};
Suit.prototype.anmId = function() {
    var data = this.event().list.filter(function(l){
        return l.code === 108 && /<Anm:(\d+)>/.test(l.parameters[0]);
    }).shift();
    var tx = data ? data.parameters[0] : '';
    return tx.match(/<Anm:(\d+)>/) ? +RegExp.$1 : 0;
};
Suit.prototype.initLine = function() {
    var data = this.event().list.map(function(l){
      return XdRsData.suit.isDividLine(l) ? this.event().list.indexOf(l) : 0;
    }, this);
    this._lineData = data.filter(function(n){return n > 0;});
};
Suit.prototype.refresh = function(num) {
    this._num = num;
};
Suit.prototype.stageEffects = function(index) {
    if (index > 0 && !this._lineData[index-1]) return [];
    var min = !index ? 0 : this._lineData[index-1];
    var max = this._lineData[index] || this.event().list.length;
    var data = [];
    for(var i=min;i<max;i++){data.push(this.event().list[i]);}
    return data.filter(function(l){return XdRsData.suit.isRealList(l);});
};
Suit.prototype.effectsList = function() {
    var index = this._lineData[this._num - 2];
    var data = this.event().list.slice(0, index);
    return data.filter(function(l){return XdRsData.suit.isRealList(l);});
};
Suit.prototype.effects = function(type) {
    return this.effectsList().filter(function(e){
        return XdRsData.suit.convertType(type) === e.code;
    });
};
Suit.prototype.efcId = function(list) {
    return XdRsData.suit.convertDataId(list);
};
Suit.prototype.efcNum = function(list) {
    return XdRsData.suit.convertNum(list);
};
Suit.prototype.numTotal = function(type) {
    return this.effects(type).map(function(l){return this.efcNum(l);},this).sum();
};
Suit.prototype.allDataId = function(type) {
    return this.effects(type).map(function(l){return this.efcId(l);},this);
};
Suit.prototype.param = function(paramId) {
    var data = this.effects('EA').filter(function(l){
        return this.efcId(l) === paramId;
    }, this);
    return data.map(function(l){return this.efcNum(l);},this).sum();
};
//==================================================================================================================
XdRsData.suit.GAsetup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
    XdRsData.suit.GAsetup.call(this, actorId);
    this.setupSuit();
};
Game_Actor.prototype.setupSuit = function() {
    this._suits = [];
    this.refreshSuit();
};
Game_Actor.prototype.suits = function() {
    return this.equips().map(function(e){return XdRsData.suit.id(e);}).uniq();
};
Game_Actor.prototype.suitNum = function(suitId) {
    return XdRsData.suit.num(suitId, this.equips());
};
Game_Actor.prototype.suitAnm = function() {
    return this._suitAnm || 0;
};
Game_Actor.prototype.isAllActivated = function(suitId) {
    return this.suitNum(suitId) === XdRsData.suit.total(suitId);
};
Game_Actor.prototype.suitParam = function(paramId) {
    if (!this._suits || !this._suits.length) return 0;
    return this._suits.map(function(s){return s.param(paramId);}).sum();
};
Game_Actor.prototype.suitDataId = function(type) {
    if (!this._suits || !this._suits.length) return [];
    return this._suits.map(function(s){return s.allDataId(type);}).flatten();
};
Game_Actor.prototype.suitsNumTotal = function(type) {
    return this._suits.map(function(s){return s.numTotal(type);}).sum();
};
Game_Actor.prototype.suitsXTotal = function(xparamId) {
    var type = XdRsData.suit.convertXparam(xparamId);
    return type ? this.suitsNumTotal(type) / 100 : 0;
};
Game_Actor.prototype.hasSuit = function(suitId) {
    return this._suits.some(function(s){return s.id() === suitId;});
};
Game_Actor.prototype.canAdd = function(suitId) {
    if (!suitId || this.hasSuit(suitId)) return false;
    return XdRsData.suit.numEffective(this.suitNum(suitId));
};
Game_Actor.prototype.addSuit = function(suitId) {
    if (!this.canAdd(suitId)) return;
    this._suits.push(new Suit(suitId, this.suitNum(suitId)));
};
Game_Actor.prototype.delSuit = function(suit) {
    var num = this.suitNum(suit.id());
    if (XdRsData.suit.numEffective(num)) return false;
    var index = this._suits.indexOf(suit);
    this._suits.splice(index, 1);
    return true;
};
Game_Actor.prototype.refreshSuit = function() {
    var lastHPrate = this._hp / this.mhp;
    var lastMPrate = this._mp / this.mmp;
    var lastStates = this.suitDataId('AS');
    for (var i=0;i<this._suits.length;i++){
        var suit = this._suits[i];
        if (this.delSuit(suit)) continue;
        suit.refresh(this.suitNum(suit.id()));
    }
    this.suits().forEach(function(id){this.addSuit(id);},this);
    this.refreshSuitHm(lastHPrate,lastMPrate);
    this.refreshSuitStates(lastStates);
    this.refreshSuitAnm();
};
Game_Actor.prototype.refreshSuitHm = function(hpRate, mpRate) {
    this.setHp(Math.round(this.mhp * hpRate));
    this.setMp(Math.round(this.mmp * mpRate));
};
Game_Actor.prototype.refreshSuitStates = function(lastStates) {
    lastStates.forEach(function(id){this.removeState(id);},this);
    this.suitDataId('AS').forEach(function(id){this.addState(id);},this);
};
Game_Actor.prototype.refreshSuitAnm = function() {
    this._suitAnm = this.firstSuitAnm();
};
Game_Actor.prototype.firstSuitAnm = function() {
    var data = this._suits.map(function(s){
        return this.isAllActivated(s.id()) ? s.anmId() : 0;
    }, this);
    data = data.filter(function(id){return !!$dataAnimations[id];});
    return data.shift() || 0;
};
XdRsData.suit.GAparamBase = Game_Actor.prototype.paramBase;
Game_Actor.prototype.paramBase = function(paramId) {
    var base = XdRsData.suit.GAparamBase.call(this, paramId);
    return base + this.suitParam(paramId);
};
XdRsData.suit.GAxparam = Game_Actor.prototype.xparam;
Game_Actor.prototype.xparam = function(xparamId) {
    return XdRsData.suit.GAxparam.call(this, xparamId) + this.suitsXTotal(xparamId);
};
XdRsData.suit.GAaddedSkills = Game_Actor.prototype.addedSkills;
Game_Actor.prototype.addedSkills = function() {
    return XdRsData.suit.GAaddedSkills.call(this).concat(this.suitDataId('AL'));
};
XdRsData.suit.GAstateResistSet = Game_Actor.prototype.stateResistSet;
Game_Actor.prototype.stateResistSet = function() {
    return XdRsData.suit.GAstateResistSet.call(this).concat(this.suitDataId('SI'));
};
XdRsData.suit.GAchangeEquip = Game_Actor.prototype.changeEquip;
Game_Actor.prototype.changeEquip = function(slotId, item) {
    XdRsData.suit.GAchangeEquip.call(this, slotId, item);
    this.refreshSuit();
};
//==================================================================================================================
XdRsData.suit.GEdropItemRate = Game_Enemy.prototype.dropItemRate;
Game_Enemy.prototype.dropItemRate = function() {
    return $gameParty.suitTotalAdd(XdRsData.suit.GEdropItemRate.call(this), 'IR');
};
//==================================================================================================================
Game_Party.prototype.allSuitId = function() {
    var data1 = this.members().map(function(m){return m.suits();}).flatten();
    var data2 = this.equipItems().map(function(e){return XdRsData.suit.id(e);});
    var data = data1.concat(data2).filter(function(id){return id > 0;});
    return data.uniq().sort();
};
Game_Party.prototype.suitActivation = function(suitId) {
    if (!suitId) return false;
    return this.members().some(function(m){return m.suitNum(suitId) > 1;});
};
Game_Party.prototype.suitAddRate = function(type) {
    return this.members().map(function(m){return m.suitsNumTotal(type);}).sum();
};
Game_Party.prototype.suitTotalAdd = function(base, type) {
    var add = base * this.suitAddRate(type) / 100;
    return base + (type !== 'IR' ? Math.round(add) : add);
};
//==================================================================================================================
XdRsData.suit.GTPexpTotal = Game_Troop.prototype.expTotal;
Game_Troop.prototype.expTotal = function() {
    return $gameParty.suitTotalAdd(XdRsData.suit.GTPexpTotal.call(this),  'ER');
};
XdRsData.suit.GTPgoldTotal = Game_Troop.prototype.goldTotal;
Game_Troop.prototype.goldTotal = function() {
    return $gameParty.suitTotalAdd(XdRsData.suit.GTPgoldTotal.call(this), 'GR');
};
//==================================================================================================================
Game_Player.prototype.suitAnm = function() {
    return $gameParty.leader().suitAnm();
};
//==================================================================================================================
Game_Follower.prototype.suitAnm = function() {
    return this.actor() ? this.actor().suitAnm() : 0;
};
//==================================================================================================================
XdRsData.suit.STBinitialize = Sprite_Base.prototype.initialize;
Sprite_Base.prototype.initialize = function() {
    XdRsData.suit.STBinitialize.call(this);
    this._suitAnm = 0;
    this._suitAnmCount = 0;
};
Sprite_Base.prototype.playSuitAnm = function(anmId) {
    this._suitAnm = anmId;
    this.setupSuitAnm();
};
Sprite_Base.prototype.setupSuitAnm = function() {
    var anm = $dataAnimations[this._suitAnm];
    if (!anm) return;
    this._suitAnmCount = anm.frames.length * 4 + 1;
    this.startAnimation(anm, false, false);
};
XdRsData.suit.STBupdate = Sprite_Base.prototype.update;
Sprite_Base.prototype.update = function() {
    XdRsData.suit.STBupdate.call(this);
    this.updateSuitAnm();
};
Sprite_Base.prototype.updateSuitAnm = function() {
    if (!this._suitAnm) return;
    if (this._suitAnmCount) this._suitAnmCount--;
    if (!this._suitAnmCount) this.setupSuitAnm();
};
Sprite_Base.prototype.isSuitAnmPlaying = function() {
    return !!this._suitAnm;
};
XdRsData.suit.STBisAnimationPlaying = Sprite_Base.prototype.isAnimationPlaying;
Sprite_Base.prototype.isAnimationPlaying = function() {
    if (this.isSuitAnmPlaying()) return this._animationSprites.length > 1;
    return XdRsData.suit.STBisAnimationPlaying.call(this);
};
//==================================================================================================================
Sprite_Character.prototype.isActor = function() {
    if (!this._character) return false;
    return this._character.constructor === Game_Player ||
    this._character.constructor === Game_Follower;
};
XdRsData.suit.SBCupdateAnimation = Sprite_Character.prototype.updateAnimation;
Sprite_Character.prototype.updateAnimation = function() {
    XdRsData.suit.SBCupdateAnimation.call(this);
    this.updateSuitLoopAnm();
};
Sprite_Character.prototype.updateSuitLoopAnm = function() {
    if (!this.isActor()) return;
    if (this._suitAnm !== this._character.suitAnm()) {
        this.playSuitAnm(this._character.suitAnm());
    }
};
//==================================================================================================================
Sprite_Battler.prototype.isActor = function() {
    return !!this._battler && this._battler.constructor === Game_Actor;
};
XdRsData.suit.SBBupdateAnimation = Sprite_Battler.prototype.updateAnimation;
Sprite_Battler.prototype.updateAnimation = function() {
    XdRsData.suit.SBBupdateAnimation.call(this);
    this.updateSuitLoopAnm();
};
Sprite_Battler.prototype.updateSuitLoopAnm = function() {
    if (!this.isActor()) return;
    if (this._suitAnm !== this._battler.suitAnm()) {
        this.playSuitAnm(this._battler.suitAnm());
    }
};
//==================================================================================================================
// end
//==================================================================================================================