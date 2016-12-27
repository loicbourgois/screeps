Room.prototype.main = function() {
	// Reset roles
	Memory.rooms[this.name].roles = JSON.parse(JSON.stringify(Memory.roles));
	// Reset mines
	let toMines = Memory.rooms[this.name].toMines;
	let rooms = [];
	rooms[0] = this;
	for(let i in rooms) {
		let room = rooms[i];
		let sources = room.find(FIND_SOURCES);
		for(let j in sources) {
			let source = sources[j];
			if(!toMines[source.id]) {
				toMines[source.id] = {};
			}
			if(!toMines[source.id].creeps) {
				toMines[source.id].creeps = {};
			}
			toMines[source.id].id = source.id;
		}
	}
}

Room.prototype.main_ = function() {
    // Roles
	
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
