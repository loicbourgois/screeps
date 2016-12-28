Creep.prototype.main = function() {
    if(this.spawning) {
		console.log(this.memory.roleId+" spawning in "+this.room.name);
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
    } else if (this.memory.roleId == 'explorer'){
        this.explore();
    }
};

Creep.prototype.getOriginalRoomName = function(pos) {
	return this.memory.originalRoom;
}

Creep.prototype.sayMoving = function(pos) {
	//this.say(pos.x+"  "+pos.y);
}

Creep.prototype.say_ = function(message) {
	this.say(message);
	console.log(this.memory.roleId 
		+ "\t"+this.room.name
		+ "\t"+this.pos.x+","+this.pos.y
		+ "\t"+message);
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


/*Creep.prototype.addToToEmptys = function() {
    if(!Memory.toEmptys) {
        Memory.toEmptys = {};
    }
    if(!Memory.toEmptys[this.id]) {
        Memory.toEmptys[this.id] = {};
    }
    Memory.toEmptys[this.id].id = this.id;
}*/


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
Creep.prototype.getMaxCapacity = function () {
    return this.carryCapacity;
}