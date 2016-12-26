Room.prototype.main = function() {
    // Memory
    this.initMemory();
    // 
    var sources = this.find(FIND_SOURCES);
    for(var j in sources) {
        var source = sources[j];
        source.main();
    }
    // Dropped energies
    var droppedEnergies = this.find(FIND_DROPPED_ENERGY);
    for(var j in droppedEnergies) {
        var droppedEnergy = droppedEnergies[j];
        droppedEnergy.main();
    }
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
};

Room.prototype.init = function() {
    
}

Room.prototype.initMemory = function() {
    
}
