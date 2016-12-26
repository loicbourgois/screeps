Creep.prototype.main = function() {
    if(this.spawning) {
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
    }
};

Creep.prototype.sayMoving = function(pos) {
	this.say(pos.x+"  "+pos.y);
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











Creep.prototype.freeToCarry = function() {
    return this.carryCapacity - _.sum(this.carry);
}

Creep.prototype.getTotalCarrying = function() {
    return _.sum(this.carry);
}

Creep.prototype.getFreeCapacity = function () {
    return this.carryCapacity - _.sum(this.carry);
}



/*Creep.prototype.upgrade = function() {
    var controller = this.room.controller;
    if(controller.level < 3) {
        var spawns = this.room.find(FIND_MY_SPAWNS);
        var spawn = spawns[0];
    	if(this.carry.energy < this.carryCapacity && this.memory.state == 'withdrawing') {
    	    var code;
    		switch(code = this.withdraw(spawn, RESOURCE_ENERGY)) {
    		    case ERR_NOT_IN_RANGE : {
        			this.moveTo(spawn);
        			break;
    		    } 
    		    case ERR_FULL : {
    		        this.memory.state = 'upgrading';
    		        break;
    		    }
    		    default : {
    		        //console.log(code);
    		        break;
    		    }
    		}		
    	} else if(this.memory.state == 'upgrading') {
    	    var code;
    	    switch(code = this.upgradeController(controller)) {
    	        case ERR_NOT_IN_RANGE: {
    	            this.moveTo(controller);
    	            break;
    	        }
    	        case ERR_NOT_ENOUGH_RESOURCES: {
    	            this.memory.state = 'withdrawing';
    		        break;
    	        }
    	        default: {
    	            //console.log(code);
    	            break;
    	        }
    	    }		
    	} else {
    	    this.memory.state = 'upgrading';
    	}
    }
}*/

Creep.prototype.harvester = function() {
	if(this.carry.energy < this.carryCapacity) {
		var sources = this.room.find(FIND_SOURCES);
		if(this.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
			this.moveTo(sources[0]);
		}			
	}
	else {
		if(this.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			this.moveTo(Game.spawns.Spawn1);
		}			
	}
}

Creep.prototype.protector = function() {
    var enemmies = this.room.find(FIND_HOSTILE_CREEPS);
    if(this.attack(enemmies[0]) !== OK) {
        this.moveTo(enemmies[0]);
    }
}

Creep.prototype.rangedProtector = function() {
    var enemmies = this.room.find(FIND_HOSTILE_CREEPS);
    if(this.rangedAttack(enemmies[0]) !== OK) {
        this.moveTo(enemmies[0]);
    }
}