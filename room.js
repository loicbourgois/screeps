var USERNAME = _.find(Game.structures).owner.username;

Room.prototype.main = function() {
	this.reset_();
	this.handleSources();
	this.handleSpawns();
}

Room.prototype.getRoomList = function(roomName, count) {
	let exits = Game.map.describeExits(roomName);
	let roomList = [roomName];
	if(count <= 0) {
		return roomList;
	}
	for(let i in exits) {
		roomList.push(exits[i]);
	}
	for(let i in roomList) {
		roomList = roomList.concat(this.getRoomList(roomList[i], count-1));
	}
	roomList = roomList.filter(function(item, pos) {
		return roomList.indexOf(item) == pos;
	});
	roomList = roomList.sort(function(a, b) {
		let aD = Game.map.findRoute(this.name, a).length;
		let bD = Game.map.findRoute(this.name, b).length;
		return (aD-bD);
	});
	return roomList;
}

Room.prototype.reset_ = function() {
	// Reset rooms
	if(! Memory.rooms[this.name].rooms) {
		Memory.rooms[this.name].rooms = {};
	}
	let roomList = this.getRoomList(this.name, 2);
	//console.log(JSON.stringify(roomList, null, 2));
	let rooms = Memory.rooms[this.name].rooms;
	for(let i in roomList) {
		let roomName = roomList[i];
		if(!rooms[roomName]) {
			rooms[roomName] = {}
		}
		if(!rooms[roomName].name) {
			rooms[roomName].name = roomName;
		}
		if(!rooms[roomName].status) {
			rooms[roomName].status = 'null';
		}
		let room = Game.rooms[roomName];
		if(room) {
			let mined = room.find(FIND_MY_CREEPS);
			mined = mined.filter(function(creep) {
				return creep.memory.roleId == 'miner';
			});
			mined = mined.length;
			if(room.controller.my) {
				rooms[roomName].status = 'controlled';
			}
			else if(room.controller.reservation
				&& room.controller.reservation.username == USERNAME) {
				rooms[roomName].status = 'reserved';
			}
			else if(room.controller.owner
				&& room.controller.owner.username != USERNAME) {
				rooms[roomName].status = 'ennemyControlled';
			}
			else if(room.controller.reservation
				&& room.controller.reservation.username != USERNAME) {
				rooms[roomName].status = 'ennemyReserved';
			}
			else if(mined) {
				rooms[roomName].status = 'mined';
			} else {
				rooms[roomName].status = 'null';
			}
		} else {
			rooms[roomName].status = 'null';
		}
	}
	// Rooms ?
	let roomToManages = this.getRoomToManage();
	console.log("Rooms: "+JSON.stringify(roomToManages.length, null, 2));
	// Reset roles
	Memory.rooms[this.name].roles = JSON.parse(JSON.stringify(Memory.roles));
	// Reset toMines
	if(! Memory.rooms[this.name].toMines) {
		Memory.rooms[this.name].toMines = {};
	}
	let toMines = Memory.rooms[this.name].toMines;
	for(let i in roomToManages) {
		let room = roomToManages[i];
		if(!room) {
		    continue;
		}
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
	for(let i in toMines) {
		let object = Game.getObjectById(toMines[i].id);
		if(!object) {
			delete toMines[i];
		}
	}
	// Reset fills
	if(! Memory.rooms[this.name].toFills) {
	     Memory.rooms[this.name].toFills = {};
	}
	let toFills = Memory.rooms[this.name].toFills;
	for(let i in roomToManages) {
		let room = roomToManages[i];
		if(!room) {
		    continue;
		}
		let spawns = room.find(FIND_MY_SPAWNS);
		let extensions = this.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
		});
		let creeps = room.find(FIND_MY_CREEPS);
		creeps = creeps.filter(function (creep) {
			return creep.memory.roleId == 'upgrader'
					|| creep.memory.roleId == 'builder';
		});
		let objects = [];
		objects = objects.concat(spawns);
		objects = objects.concat(extensions);
		objects = objects.concat(creeps);
		for(let j in objects) {
			let object = objects[j];
			if(!toFills[object.id]) {
				toFills[object.id] = {};
			}
			if(!toFills[object.id].creeps) {
				toFills[object.id].creeps = {};
			}
			toFills[object.id].id = object.id;
		}
	}
	for(let i in toFills) {
		let object = Game.getObjectById(toFills[i].id);
		if(!object) {
			delete toFills[i];
		}
	}
	// Reset toEmptys
	if(! Memory.rooms[this.name].toEmptys) {
	     Memory.rooms[this.name].toEmptys = {};
	}
	let toEmptys = Memory.rooms[this.name].toEmptys;
	for(let i in roomToManages) {
		let room = roomToManages[i];
		if(!room) {
		    continue;
		}
		let creeps = room.find(FIND_MY_CREEPS);
		creeps = creeps.filter(function (creep) {
			return creep.memory.roleId == 'miner';
		});
		let droppedEnergies = room.find(FIND_DROPPED_ENERGY);
		let objects = [];
		objects = objects.concat(creeps);
		objects = objects.concat(droppedEnergies);
		for(let j in objects) {
			let object = objects[j];
			if(!toEmptys[object.id]) {
				toEmptys[object.id] = {};
			}
			if(!toEmptys[object.id].creeps) {
				toEmptys[object.id].creeps = {};
			}
			toEmptys[object.id].id = object.id;
		}
	}
	for(let i in toEmptys) {
		let object = Game.getObjectById(toEmptys[i].id);
		if(!object) {
			delete toEmptys[i];
		}
		try {
			for(let j in toEmptys[i].creeps) {
				let object = Game.getObjectById(toEmptys[i].creeps[j]);
				if(!object) {
					delete toEmptys[i].creeps[j];
				}
			}
		} catch (e){}
	}
}

Room.prototype.getRoomToManage = function() {
	let roomToManages = [];
	for(let i in Memory.rooms[this.name].rooms) {
		let name = Memory.rooms[this.name].rooms[i].name;
		let status = Memory.rooms[this.name].rooms[i].status;
		if(status=='controlled'
				||status=='mined'
				/*||status=='explored'*/) {
			roomToManages.push(Game.rooms[name]);
		}
	}
	return roomToManages;
}

Room.prototype.getRoomCount = function() {
	return this.getRoomToManage().length;
}

Room.prototype.getMySources = function() {
	let roomToManages = this.getRoomToManage();
	let sources = [];
	for(let i in roomToManages) {
		if(!roomToManages[i]) {
		    continue;
		}
		sources = sources.concat(roomToManages[i].find(FIND_SOURCES));
	}
	return sources;
}

Room.prototype.addRoom = function(roomName) {
	if(!Memory.rooms[this.name].rooms[roomName]) {
		Memory.rooms[this.name].rooms[roomName] = {};
	}
	Memory.rooms[this.name].rooms[roomName].name = roomName;
}

Room.prototype.handleSources = function() {
	let sources = this.getMySources();
    for(var j in sources) {
        var source = sources[j];
        source.main();
    }
}

Room.prototype.handleSpawns = function() {
	let spawns = this.find(FIND_MY_SPAWNS);
    for(var i in spawns) {
        spawns[i].main();
    }
}
