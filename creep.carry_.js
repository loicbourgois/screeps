Creep.prototype.carry_ = function() {
	//if(!this.memory.cpu) {
		this.memory.cpu = {};
	//}
    if(this.memory.toFillId && this.getTotalCarrying()) {
		let cpu = Game.cpu.getUsed();
        this.moveAndFill();
		this.memory.cpu.moveAndFill = (Game.cpu.getUsed()-cpu);
    }
    else if(!this.memory.toEmptyId && this.freeToCarry()) {
		let cpu = Game.cpu.getUsed();
		this.searchToEmpty();
		this.memory.cpu.searchToEmpty = (Game.cpu.getUsed()-cpu);
    }
    else if(this.memory.toEmptyId && this.freeToCarry()) {
		let cpu = Game.cpu.getUsed();
        this.moveAndEmpty();
		this.memory.cpu.moveAndEmpty = (Game.cpu.getUsed()-cpu);
    }
    else if(this.getTotalCarrying() && !this.memory.toFillId) {
		let cpu = Game.cpu.getUsed();
        this.searchToFill();
		this.memory.cpu.searchToFill = (Game.cpu.getUsed()-cpu);
    }
}

Creep.prototype.moveTo_ = function(pos) {
	this.moveTo(pos, {reusePath: 15});
}

Creep.prototype.assignCreepToFill = function(creepId, toFillId) {
    this.unassignCreepToEmpty();
    this.memory.toFillId = toFillId;
	let toFill = Memory.rooms[this.memory.originalRoom].toFills[toFillId];
	toFill.creeps[creepId] = creepId;
}
Creep.prototype.unassignCreepToFill = function() {
	let id = this.memory.toFillId;
	let object = Game.getObjectById(id);
	if(object) {
		let roomName = this.memory.originalRoom;
		if(Memory.rooms
				&& Memory.rooms[roomName] 
				&& Memory.rooms[roomName].toFills
				&& Memory.rooms[roomName].toFills[id]) {
			delete Memory.rooms[roomName].toFills[id].creeps[this.id];
		}
	}
    this.memory.toFillId = null;
}

Creep.prototype.assignCreepToEmpty = function(creepId, toEmptyId) {
	this.unassignCreepToFill();
    this.memory.toEmptyId = toEmptyId;
	let toEmpty = Memory.rooms[this.memory.originalRoom].toEmptys[toEmptyId];
	toEmpty.creeps[creepId] = creepId;
}
Creep.prototype.unassignCreepToEmpty = function() {
	let id = this.memory.toEmptyId;
	let object = Game.getObjectById(id);
	if(object) {
		let roomName = object.getOriginalRoomName();
		if(Memory.rooms
				&& Memory.rooms[roomName] 
				&& Memory.rooms[roomName].toEmptys
				&& Memory.rooms[roomName].toEmptys[id]) {
			delete Memory.rooms[roomName].toEmptys[id].creeps[this.id];
		}
	}
    this.memory.toEmptyId = null;
}

Creep.prototype.searchToFill = function() {
	var toFills = Memory.rooms[this.memory.originalRoom].toFills;
	if(!toFills) {
		this.say_("no fill");
		return;
	}
	toFills = Object.keys(toFills).map(function (key) { return toFills[key]; });
	let this_ = this;
	toFills.sort(function(a, b) { 
		if(!a || !a.id) {
			return 1;
		}
		var aObject = Game.getObjectById(a.id);
		if(!aObject) {
			if (Memory.toFills && Memory.toFills[a.id]) {
				delete Memory.toFills[a.id];
			}
			return 1;
		}
		var aFree = aObject.getFreeCapacity();
		var aMax = aObject.getMaxCapacity();
		for(var i in a.creeps) {
			var creep = Game.getObjectById(a.creeps[i]);
			if(!creep) {
				delete a.creeps[i];
				continue;
			}
			aFree -= creep.getTotalCarrying();
		}
		// b
		if(!a || !b.id) {
			return -1;
		}
		var bObject = Game.getObjectById(b.id);
		if(!bObject) {
			if (Memory.toFills && Memory.toFills[b.id]) {
				delete Memory.toFills[b.id];
			}
			return -1;
		}
		var bFree = bObject.getFreeCapacity();
		var bMax = bObject.getMaxCapacity();
		for(var i in b.creeps) {
			var creep = Game.getObjectById(b.creeps[i]);
			if(!creep) {
				delete b.creeps[i];
				continue;
			}
			bFree -= creep.getTotalCarrying();
		}
		return -(aFree/aMax-bFree/bMax);
	});
	this.assignCreepToFill(this.id, toFills[0].id);
}



Creep.prototype.searchToEmpty = function() {
	var toEmptys = Memory.rooms[this.memory.originalRoom].toEmptys;
	if(!toEmptys) {
		this.say_("no empty");
		return;
	}
	toEmptys = Object.keys(toEmptys).map(function (key) { return toEmptys[key]; });
	toEmptys.sort(function(a, b) { 
		try {
			// a
			var aObject = Game.getObjectById(a.id);
			if(!aObject) {
				delete Memory.toEmptys[a.id];
				return 1;
			}
			var aQuantity = aObject.getTotalCarrying();
			var reserved = 0;
			for(var i in a.creeps) {
				var creep = Game.getObjectById(a.creeps[i]);
				if(!creep) {
					delete Memory.toEmptys[a.id].creeps[i];
					continue;
				}
				reserved += creep.freeToCarry();
			}
			aQuantity -= reserved;
			// b
			var bObject = Game.getObjectById(b.id);
			if(!bObject) {
				delete Memory.toEmptys[b.id];
				return -1;
			}
			var bQuantity = bObject.getTotalCarrying();
			for(var i in b.creeps) {
				var creep = Game.getObjectById(b.creeps[i]);
				if(!creep) {
					delete Memory.toEmptys[b.id].creeps[i];
					continue;
				}
				bQuantity -= creep.freeToCarry();
			}
			return bQuantity-aQuantity;
		} catch(e) {}
	});
	this.assignCreepToEmpty(this.id, toEmptys[0].id);
}

Creep.prototype.moveAndEmpty = function() {
	var toEmpty = Game.getObjectById(this.memory.toEmptyId);
	if(!toEmpty) {
		this.unassignCreepToEmpty();
		this.carry_();
		return;
	}
	//console.log(toEmpty.getTotalCarrying());
	var code;
	switch (code = this.pickup(toEmpty)) {
		case ERR_NOT_IN_RANGE:{
			this.moveTo_(toEmpty);
			break;
		}
		case OK : {
			this.unassignCreepToEmpty();
			break;            
		}
		case ERR_INVALID_TARGET: { // not a source ?
			var code2;
			switch (code2 = toEmpty.transfer(this, RESOURCE_ENERGY)) {
				case ERR_NOT_IN_RANGE:{
					this.moveTo_(toEmpty);
					break;
				}
				case ERR_NOT_ENOUGH_RESOURCES: {
					this.unassignCreepToEmpty();
					break;
				}
				case OK : {
					this.unassignCreepToEmpty();
					break;
				}
				default : {
					this.say_("2  "+code2);
					break;
				}
			}
			break;
		}
		default : {
			this.say_("1  "+code);
			break;
		}
	}
	this.sayMoving(toEmpty.pos);
}

Creep.prototype.moveAndFill = function() {
	var toFill = Game.getObjectById(this.memory.toFillId);
	if(!toFill) {
		this.memory.toFillId = null;
		this.carry_();
	}
	var code;
	switch (code = this.transfer(toFill, RESOURCE_ENERGY)) {
		case ERR_NOT_IN_RANGE:{
			this.moveTo_(toFill);
			break;
		}
		case ERR_FULL:{
			this.unassignCreepToFill();
			this.searchToFill();
			break;
		}
		case ERR_INVALID_TARGET:{
			this.unassignCreepToFill();
			this.searchToFill();
			break;
		}
		default: {
			break;
		}
	}
	this.sayMoving(toFill.pos);
}

/*let roads = this.room.lookForAt(LOOK_STRUCTURES, this.pos);
	roads = roads.filter(function(e) {
		return e.structureType == STRUCTURE_ROAD;
	});
	if(!roads.length) {
		let code;
		switch(code = this.room.createConstructionSite(this.pos, STRUCTURE_ROAD)) {
			case OK :
			case ERR_INVALID_TARGET : {
				let sites = this.room.lookForAt(LOOK_CONSTRUCTION_SITES, this.pos);
				if(!sites.length) {
					break;
				}
				let code2;
				switch(code2 = this.build(sites[0])) {
					case OK :
					case ERR_NOT_ENOUGH_RESOURCES : {
						break;
					}
					default : {
						this.say_("2 "+code2);
						break;
					}
				}
				break;
			}
			case ERR_FULL : {
				break;
			}
			default : {
				this.say_(code);
				break;
			}
		}
	} else {
		let code;
		switch(code = this.repair(roads[0])) {
			case OK :
			case ERR_NOT_ENOUGH_RESOURCES : {
				break;
			}
			default : {
				this.say_(code);
				break;
			}
		}
	}*/