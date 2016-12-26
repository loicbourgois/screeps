Creep.prototype.mine = function() {
    // Assign source
    if(!this.memory.assignedSourceId) {
        this.say("mine ?");
        return;
    }
    // Harvest
    else {
        var code;
        this.assignToMines();
        switch (code = this.harvest(Game.getObjectById(this.memory.assignedSourceId))) {
            case OK:{
                this.addToToEmptys();
                break;
            }
            case ERR_NOT_IN_RANGE:{
                this.moveTo(Game.getObjectById(this.memory.assignedSourceId));
                break;
            }
            default:{
                this.say(code);
                break;
            }
        }
    }
}

Creep.prototype.assignToMines = function() {
	try {
		Memory.toMines[this.memory.assignedSourceId].creeps[this.id] = this.id;
	} catch (e) {
		his.memory.assignedSourceId = null;
	}
}