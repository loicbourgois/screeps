Source.prototype.main = function() {
	// too expensive ?
    //this.say_(this.getNeededWorking());
};

Source.prototype.say_ = function(message) {
	console.log("mine"
		+ "\t"+this.room.name
		+ "\t"+this.pos.x+","+this.pos.y
		+ "\t"+message);
}

Source.prototype.getCreeps = function() {
	let creeps;
	for(let i in Memory.rooms) {
		let toMines = Memory.rooms[i].toMines;
		for(let j in toMines) {
			let toMine = toMines[j];
			if(toMine.id == this.id) {
				creeps = toMine.creeps;
				//console.log("yy",JSON.stringify(creeps));
			}
		}
	}
	return creeps;
}

Source.prototype.getNeededWorking = function() { 
    let n = this.energyCapacity / 600;
	let creeps = this.getCreeps();
    creeps = Object.keys(creeps).map(function (key) { return creeps[key]; });
    for(var i in creeps) {
        var creep = Game.getObjectById(creeps[i]);
        if(!creep) {
            delete this.getCreeps[i];
            continue;
        }
        n -= creep.countBodyPart(WORK);
    }
    return n;
}

Source.prototype.getAvailablePositionCount = function() { 
    var a = this.getAllPositions().length;
	let creeps = this.getCreeps();
    creeps = Object.keys(creeps).map(function (key) { return creeps[key]; });
    var b = 0;
    for(var i in creeps) {
        var creep = Game.getObjectById(creeps[i]);
        if(!creep) {
            delete this.getCreeps[i];
            continue;
        }
        b++;
    }
    return  a-b ;
}













Source.prototype.getAllPositions = function() {
    var positions = [];
    for(var x = this.pos.x-1 ; x <= this.pos.x+1 ; x++) {
        for(var y = this.pos.y-1 ; y <= this.pos.y+1 ; y++) {
            var position = new RoomPosition(x, y, this.room.name);
            var looks = position.look();
            for(var i in looks) {
                var look = looks[i];
                if(look.type == "terrain") {
                    if(look.terrain != "wall") {
                        positions.push(position);
                    }
                }
            }
        }
    }
    if(!positions.length) {
        return null;
    }
    return positions;
}

Source.prototype.getAssignablePositions = function() {
    var assignablePositions = [];
    var positions = this.getAllPositions();
    var assignedPositions = this.getAssignedPositions();
    
    for(var i in positions) {
        //console.log("---------------");
        var position = positions[i];
        var assign = true;
        for(var j in assignedPositions) {
            //console.log("  ---------------");
            var assignedPosition = assignedPositions[j];
            //console.log(JSON.stringify(assignedPosition));
            //console.log(JSON.stringify(position));
            if(position.x == assignedPosition.x && position.y == assignedPosition.y) {
                assign = false;
                break;
            }
        }
        if(assign) {
            assignablePositions.push(positions[i]);
        }
    } 
   // console.log(JSON.stringify(assignablePositions,null,2));
    if(!assignablePositions.length ||
            this.id == '17f2ad95e866bc5c707317b9') {
        return null;
    }
    return assignablePositions;
}

Source.prototype.getAssignedPositions = function() {
    var positions = [];
    for(var i in Memory.sources[this.id].assignations) {
        var assignation = Memory.sources[this.id].assignations[i];
        positions.push(assignation.position);
    }
    return positions;
}

Source.prototype.assignCreep = function(creep) {
    var positions = this.getAssignablePositions();
    if(!positions) {
        return false;
    }
    console.log()
    Memory.sources[this.id].assignations[creep.id] = {
        'cid':creep.id,
        'position':{
            x:positions[0].x,
            y:positions[0].y
        }
    };
    console.log("New assignation " +positions[0].x  +";" +positions[0].y)
    return positions[0];
}

