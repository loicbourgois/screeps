Creep.prototype.carry_ = function() {
    // Move & Fill
    if(this.memory.toFillId && this.getTotalCarrying()) {
        var toFill = Game.getObjectById(this.memory.toFillId);
        if(!toFill) {
            this.memory.toFillId = null;
            this.carry_();
        }
        var code;
        switch (code = this.transfer(toFill, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE:{
                this.moveTo(toFill);
                break;
            }
            case ERR_FULL:{
                this.unassignCreepToFill(this.id, toFill.id);
                break;
            }
            case ERR_INVALID_TARGET:{
                this.unassignCreepToFill(this.id, toFill.id);
                break;
            }
            default: {
                break;
            }
        }
		this.sayMoving(toFill.pos);
    }
    // Search toEmpty
    else if(!this.memory.toEmptyId && this.freeToCarry()) {
		var toEmptys = Memory.rooms[this.memory.originalRoom].toEmptys;
        if(!toEmptys) {
			this.say_("no empty");
            return;
        }
        toEmptys = Object.keys(toEmptys).map(function (key) { return toEmptys[key]; });
        toEmptys.sort(function(a, b) { 
            // a
			try {
				var aObject = Game.getObjectById(a.id);
				if(!aObject) {
					delete Memory.toEmptys[a.id];
					return 1;
				}
				var aQuantity = aObject.getTotalCarrying();
				for(var i in a.creeps) {
					var creep = Game.getObjectById(a.creeps[i]);
					if(!creep) {
						delete Memory.toEmptys[a.id].creeps[i];
						continue;
					}
					aQuantity -= creep.freeToCarry();
				}
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
			} catch(e) {
				//console.log(e);
			}
        });
		this.assignCreepToEmpty(this.id, toEmptys[0].id);
    }
    // Move & empty
    else if(this.memory.toEmptyId && this.freeToCarry()) {
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
                this.moveTo(toEmpty);
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
                        this.moveTo(toEmpty);
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
    // Search tofill
    else if(this.getTotalCarrying() && !this.memory.toFillId) {
        var toFills = Memory.rooms[this.memory.originalRoom].toFills;
        if(!toFills) {
			this.say_("no fill");
            return;
        }
        // object to array
        toFills = Object.keys(toFills).map(function (key) { return toFills[key]; });
        for(let i in toFills) {
			//console.log(JSON.stringify(toFills[i]));
		}
		let this_ = this;
		toFills.sort(function(a, b) { 
			try {
				// a
				var aObject = Game.getObjectById(a.id);
				if(!aObject) {
					delete Memory.toFills[a.id];
					return 1;
				}
				var aFree = aObject.getFreeCapacity();
				for(var i in a.creeps) {
					var creep = Game.getObjectById(a.creeps[i]);
					if(!creep) {
						delete a.creeps[i];
						continue;
					}
					aFree -= creep.getTotalCarrying();
				}
				// b
				var bObject = Game.getObjectById(b.id);
				if(!bObject) {
					delete Memory.toFills[b.id];
					return -1;
				}
				var bFree = bObject.getFreeCapacity();
				for(var i in b.creeps) {
					var creep = Game.getObjectById(b.creeps[i]);
					if(!creep) {
						delete b.creeps[i];
						continue;
					}
					bFree -= creep.getTotalCarrying();
				}
				return bFree-aFree;
			} catch(e) {
				this_.say_(a.id+ " " + b.id);
			}
		});
		
        this.assignCreepToFill(this.id, toFills[0].id);
    }
}