Resource.prototype.main = function() {
    this.init();
    this.addToToMines();
    //console.log("Ressource - "+ this.resourceType + " : " + this.amount);
};

Resource.prototype.init = function() {
    if(!Memory.resources[this.id]) {
        Memory.resources[this.id] = {};
    }
    if(!Memory.resources[this.id].assignations) {
        Memory.resources[this.id].assignations = {};
    }
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

Creep.prototype.addToToEmptys = function() {
    if(!Memory.toEmptys) {
        Memory.toEmptys = {};
    }
    if(!Memory.toEmptys[this.id]) {
        Memory.toEmptys[this.id] = {};
    }
    Memory.toEmptys[this.id].id = this.id;
}
