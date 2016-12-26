Creep.prototype.main = function() {
    if(this.spawning) {
		console.log(this.memory.roleId+" spawning in "+this.room.name+" "+JSON.stringify(this.body));
        return;
    }
    if (this.memory.roleId == 'miner') {
        this.mine();
    } else if (this.memory.roleId == 'carrier'){
        this.carry_();
    } else if (this.memory.roleId == 'upgrader'){
        this.upgrade();
    } else if (this.memory.roleId == 'attacker'){
        this.attack_();
    } else if (this.memory.roleId == 'rangedAttacker'){
        this.rangedAttack_();
    } else if (this.memory.roleId == 'upgrader'){
        this.upgrade();
    } else if (this.memory.roleId == 'builder'){
        this.build_();
    } else if (this.memory.roleId == 'claimer'){
        this.claim_();
    }
};

Creep.prototype.sayMoving = function(pos) {
	//this.say(pos.x+"  "+pos.y);
}

Creep.prototype.countBodyPart = function(bodyType) {
    var count = 0;
    for(var i in this.body) {
        if(this.body[i].type == bodyType) {
            count++;
        }
    }
    return count;
}

Creep.prototype.assignCreepToFill = function(creepId, toFillId) {
    this.unassignCreepToEmpty();
    this.memory.toFillId = toFillId;
    if(!Memory.toFills[toFillId].creeps) {
        Memory.toFills[toFillId].creeps = {};
    }
    Memory.toFills[toFillId].creeps[creepId]=creepId;
}
Creep.prototype.unassignCreepToFill = function() {
    try {
        delete Memory.toFills[this.memory.toFillId].creeps[this.id];
    } catch (e) {}
    this.memory.toFillId = null;
}

Creep.prototype.assignCreepToEmpty = function(creepId, toEmptyId) {
    this.unassignCreepToFill(this.id, this.memory.toEmptyId);
    this.memory.toEmptyId = toEmptyId;
    if(!Memory.toEmptys[toEmptyId].creeps) {
        Memory.toEmptys[toEmptyId].creeps = {};
    }
    Memory.toEmptys[toEmptyId].creeps[creepId] = creepId;
}
Creep.prototype.unassignCreepToEmpty = function() {
    try {
        delete Memory.toEmptys[this.memory.toEmptyId].creeps[this.id];
    } catch (e) {}
    this.memory.toEmptyId = null;
}
Creep.prototype.addToToEmptys = function() {
    if(!Memory.toEmptys) {
        Memory.toEmptys = {};
    }
    if(!Memory.toEmptys[this.id]) {
        Memory.toEmptys[this.id] = {};
    }
    Memory.toEmptys[this.id].id = this.id;
}


// Carry
Creep.prototype.freeToCarry = function() {
    return this.carryCapacity - _.sum(this.carry);
}
Creep.prototype.getTotalCarrying = function() {
    return _.sum(this.carry);
}
Creep.prototype.getFreeCapacity = function () {
    return this.carryCapacity - _.sum(this.carry);
}
