Creep.prototype.mine = function() {
    // Assign source
    if(!this.memory.assignedSourceId) {
		var toMines = Memory.rooms[this.memory.originalRoom].toMines;
		if(!toMines) {
			this.say_("no mine");
			return;
		}
		toMines = Object.keys(toMines).map(function (key) { return toMines[key]; });
		toMines.sort(function(a, b) { 
			// a
			var aObject = Game.getObjectById(a.id);
			if(!aObject) {
				delete Memory.toMines[a.id];
				return 1;
			}
			var aNeededWorking = aObject.getNeededWorking();
			// b
			var bObject = Game.getObjectById(b.id);
			if(!bObject) {
				delete Memory.toMines[b.id];
				return -1;
			}
			var bNeededWorking = bObject.getNeededWorking();
			return bNeededWorking-aNeededWorking;
		});
		// Get source
		for(var i in toMines) {
			var aa = Game.getObjectById(toMines[i].id).getAvailablePositionCount();
			if(aa > 0) {
				this.memory.assignedSourceId = toMines[i].id;
				break;
			}
		}
        this.say_("mine ?");
        return;
    }
    // Harvest
    else {
        var code;
        this.assignToMines();
        switch (code = this.harvest(Game.getObjectById(this.memory.assignedSourceId))) {
            case OK:{
                break;
            }
            case ERR_NOT_IN_RANGE:{
                this.moveTo(Game.getObjectById(this.memory.assignedSourceId));
                break;
            }
			case ERR_INVALID_TARGET:{
                this.say_("invalid target : "+this.memory.assignedSourceId);
				delete this.memory.assignedSourceId;
                break;
            }
            default:{
                //this.say_(code);
                break;
            }
        }
    }
}

Creep.prototype.assignToMines = function() {
    try {
    	let source = Game.getObjectById(this.memory.assignedSourceId);
    	let creeps = source.getCreeps();
    	creeps[this.id] = this.id;
    } catch(e){}
}
