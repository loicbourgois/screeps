Resource.prototype.main = function() {
    this.addToToEmptys();
}

Resource.prototype.getAvailableAmount = function() {
    var avalaibleAmount = this.amount;
    for(var i in Memory.resources[this.id].assignations) {
        var assignation = Memory.resources[this.id].assignations[i];
        var creep = Game.getObjectById(assignation.creepId);
        avalaibleAmount -= creep.getFreeCary();
    }
    return avalaibleAmount;
}

Resource.prototype.assignCreep = function() {
    return true;
}

Resource.prototype.addToToEmptys = function() {
    if(!Memory.toEmptys) {
        Memory.toEmptys = {};
    }
    if(!Memory.toEmptys[this.id]) {
        Memory.toEmptys[this.id] = {};
    }
    Memory.toEmptys[this.id].id = this.id;
}

Resource.prototype.getTotalCarrying = function() {
	return this.amount;
}
 