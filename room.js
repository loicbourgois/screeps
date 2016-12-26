Room.prototype.main = function() {
    // 
    this.initMemory();
    //
    var sources = this.find(FIND_SOURCES);
    for(var j in sources) {
        var source = sources[j];
        source.main();
    }
    //
    var droppedEnergies = this.find(FIND_DROPPED_ENERGY);
    droppedEnergies.sort(function(a, b) { 
        return b.amount - a.amount
    });
    for(var j in droppedEnergies) {
        var droppedEnergy = droppedEnergies[j];
        droppedEnergy.main();
    }
    // Structures
    for(var structureType in CONTROLLER_STRUCTURES) {
        var max = CONTROLLER_STRUCTURES[structureType][this.controller.level];
        var current = (this.find(FIND_MY_STRUCTURES, {
            filter: { structureType: structureType }
        })).length;
       // console.log(structureType, current, max);
    }
    //this.checkExtension();
    
    
    // Spawns
    var spawns = this.find(FIND_MY_SPAWNS);
    for(var i in spawns) {
        spawns[i].main();
    }
    // Extensions
    var extensions = this.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
    });
    for(var i in extensions) {
        extensions[i].main();
    }
    // Creeps
    /*var creeps = this.find(FIND_MY_CREEPS);
    for(var i in creeps) {
		creeps[i].main();
    }*/
};

Room.prototype.init = function() {
    
}

Room.prototype.initMemory = function() {
    
}
