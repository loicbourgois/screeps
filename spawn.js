Spawn.prototype.main = function() {
    var role, body;
    this.addToToFills();
    if(!(role = this.getRoleToCreate())) {
        return;
    }
    if(this.room.energyAvailable < this.room.energyCapacityAvailable) {
        //return;
    }
    if(role.id == 'miner') {
        this.createCreepMiner(role);
        return;
    }
    if(!(body = this.getBody(role))) {
        return;
    }
    // Create
    this.createCreep_(body, role.id);
}

Spawn.prototype.getBody = function(role) {
	var body = [], cost = 0, i = 0, bodyTypeCount=0;
	// Min body
	for(var i = 0 ; i < role.body.min.length ; i++) {
		cost += BODYPART_COST[role.body.min[i]];
		body.push(role.body.min[i]);
		if(role.body.min[i] == role.bodyType) {
			bodyTypeCount++;
		}
		if(cost > this.room.energyAvailable) {
			return;
		}
	}
	// Loop
	var i = 0;
	while(bodyTypeCount < role.maxBodyType
			&& cost + BODYPART_COST[role.body.loop[i]] <= this.room.energyAvailable
			&& body.length < MAX_CREEP_SIZE) {
		cost += BODYPART_COST[role.body.loop[i]];
		body.push(role.body.loop[i]);
		if(role.body.loop[i] == role.bodyType) {
			bodyTypeCount++;
		}
		i++;
		i%=role.body.loop.length;
	}
	// Filler
	var i = 0;
	while(role.body.filler.length
			&& body.length < MAX_CREEP_SIZE
			&& cost + BODYPART_COST[role.body.loop[i]] <= this.room.energyAvailable) {
		cost += BODYPART_COST[role.body.loop[i]];
		body.push(role.body.filler[i]);
		i++;
		i%=role.body.filler.length;
	}
	//console.log(role.id, JSON.stringify(body));
    if(cost > this.room.energyAvailable) {
        return;
    }
    return body.reverse();
}

Spawn.prototype.createCreep_ = function(body, roleId) {
    var code;
    switch(code = this.createCreep(body)) {
        case ERR_BUSY: {
            break;
        }
        default: {
            Memory.creeps[code].roleId = roleId;
            Memory.creeps[code].originalRoom = this.room.name;
            break;
        }
    }
}

Spawn.prototype.createCreepMiner = function(role) { 
    var body = [], cost = 0, i = 0;
    var toMines = Memory.toMines;
    if(!toMines) {
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
    var assignedSourceId;
    for(var i in toMines) {
        var aa = Game.getObjectById(toMines[i].id).getAvailablePositionCount();
        if(aa > 0) {
            assignedSourceId = toMines[i].id;
            break;
        }
    }
    //
    if(!assignedSourceId) {
        console.log("can't do worker");
        return;
    }
    var neededWorking = Game.getObjectById(assignedSourceId).getNeededWorking();
    var maxBodyCount = neededWorking+1;
    var bodyCount = 0;
    // Min body
    var i = 0;
    while(i < role.body.min.length) {
        cost += BODYPART_COST[role.body.min[i]];
        body.push(role.body.min[i]);
        if(role.body.min[i] == role.bodyType) {
            bodyCount++;
        }
        if(cost > this.room.energyAvailable) {
            return;
        }
        i++;
    }
    // Loop
    var i = 0;
    while(bodyCount < maxBodyCount 
            && cost + BODYPART_COST[role.body.loop[i]] <= this.room.energyAvailable
            && body.length < MAX_CREEP_SIZE) {
        cost += BODYPART_COST[role.body.loop[i]];
        body.push(role.body.loop[i]);
        if(role.body.loop[i] == role.bodyType) {
            bodyCount++;
        }
        i++;
        i%=role.body.loop.length;
    }
    // Filler
    var i = 0;
    while(body.length < MAX_CREEP_SIZE
            && cost + BODYPART_COST[role.body.loop[i]] <= this.room.energyAvailable) {
        cost += BODYPART_COST[role.body.loop[i]];
        body.push(role.body.filler[i]);
        i++;
        i%=role.body.filler.length;
    }
    // Creation
    var code;
    switch(code = this.createCreep(body)) {
        case ERR_BUSY: {
            break;
        }
        default: {
            Memory.creeps[code].roleId = role.id;
            Memory.creeps[code].assignedSourceId = assignedSourceId;
            //Game.creeps[code].assignToMine(assignedSourceId);
            break;
        }
    }
}

Spawn.prototype.getMySources = function() {
	var rooms = Game.rooms;
	var sources = [];
	rooms = Object.keys(rooms).map(function (key) { return rooms[key]; });
	rooms = rooms.filter(function (room) {
		var my = room.controller.my;
		return (my);
	});
	for(var i in rooms) {
		var sources = sources.concat(rooms[i].find(FIND_SOURCES));
	}
	return sources;
}

Spawn.prototype.getRoleToCreate = function() {
    // Set min & max
    var roles = Memory.roles;
	var sources = this.getMySources();
    //return findById(roles, 'carrier');
    for(var i in roles) {
        switch(roles[i].id) {
            case 'miner' : {
                var maxBodyCount = 0;
                var max = 0;
                for(var j in sources) {
                    maxBodyCount += sources[j].energyCapacity/600 + 1;
                    max += sources[j].getAllPositions().length;
                }
                roles[i].max = max;
                roles[i].maxBodyCount = maxBodyCount;
                roles[i].minBodyCount = sources.length;
                break;
            }
            case 'carrier' : {
                var sourceCount = sources.length;
                roles[i].min = sourceCount * 2;
                roles[i].max = sourceCount * 10;
                roles[i].minBodyCount = sourceCount * 2;
                roles[i].maxBodyCount = sourceCount * 15;
                break;
            }
            case 'attacker' : {
                roles[i].min = this.room.find(FIND_HOSTILE_CREEPS).length * 1;
                roles[i].max = this.room.find(FIND_HOSTILE_CREEPS).length * 4+1;
                break;
            }
            case 'rangedAttacker' : {
                roles[i].min = this.room.find(FIND_HOSTILE_CREEPS).length * 1;
                roles[i].max = this.room.find(FIND_HOSTILE_CREEPS).length * 4+1;
                break;
            }
            case 'upgrader' : {
                roles[i].min = 1;
                roles[i].max = 3;
                roles[i].minBodyCount = 1;
                roles[i].maxBodyCount = roles[i].max * roles[i].maxBodyType;
                break;
            }
            case 'builder' : {
                roles[i].min = 0;
                roles[i].max = 2;
                break;
            }
			case 'claimer' : {
                roles[i].min = 0;
                roles[i].max = 0;
				if(this.room.energyAvailable >= 650) {
					roles[i].min = 0;
					roles[i].max = 2;
				}
                break;
            }
            default : {
                //console.log("unknownm role!");
                break;
            }
        }
    }
    // Set counts
	var creeps = Game.creeps;
	var name = this.room.name;
	creeps = Object.keys(creeps).map(function (key) { return creeps[key]; });
	creeps.filter(function (creep) {
		return (creep.memory.originalRoom == name);
	});
    for(var i in creeps) {
		var creep = creeps[i];
		var roleId = creep.memory.roleId;
		var role = findById(roles, roleId);
		role.count += 1;
		var bodyCount = 0;
		for(var j in creep.body) {
		    var part = creep.body[j];
		    if(part.hits && part.type == role.bodyType) {
		        bodyCount += 1;
		    }
		}
		role.bodyCount += bodyCount;
	}
	// Set priority
	for(var i in roles) {
	    var r = roles[i];
	    if(r.maxBodyCount) {
	        if(r.bodyCount < r.minBodyCount) {
    	        r.priority = r.bodyCount / r.minBodyCount ;
    	        r.priority = 1 - r.priority;
    	        r.priority += 1;
    	    } else {
    	        r.priority = (r.bodyCount - r.minBodyCount) / (r.maxBodyCount - r.minBodyCount);
    	        r.priority = 1 - r.priority;
    	    }
    	    if(r.count >= r.max) {
    	        r.priority = 0;
    	    }
	    } else {
    	    if(r.count < r.min) {
    	        r.priority = r.count / r.min ;
    	        r.priority = 1 - r.priority;
    	        r.priority += 1;
    	    } else {
    	        r.priority = (r.count - r.min) / (r.max - r.min);
    	        r.priority = 1 - r.priority;
    	    } 
	    }
	}
	// Sort
	roles.sort(function(a, b) {
        return parseFloat(b.priority) - parseFloat(a.priority);
    });
    // Logs
    var message = "";
    while(message.length < 16) {
        message = message + " ";
    }
    message += "\tcount\t";
    message += "\tbody count";
    message += "\tprio";
    console.log(message);
    for(var i in roles) {
        var message = roles[i].id;
	    while(message.length < 16) {
	        message = message + " ";
	    }
        message += "\t" + ("   " + roles[i].count).slice(-3) 
            + " /" + ("   " + roles[i].max).slice(-3) ;
        message += "\t" + ("   " + roles[i].bodyCount).slice(-3) 
            + " /" + ("   " + roles[i].maxBodyCount).slice(-3) ;
        message += "\t" + roles[i].priority.toFixed(2);
	    console.log(message);
    }
    //
    if(roles[0].priority > 0) {
        return roles[0];
    } else {
        return null;
    }
}

Spawn.prototype.getFreeCapacity = function () {
    return this.energyCapacity - this.energy;
}

function findById(source, id) {
  for (var i = 0; i < source.length; i++) {
    if (source[i].id === id) {
      return source[i];
    }
  }
  throw "Couldn't find object with id: " + id;
}
