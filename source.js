Source.prototype.main = function() {
    this.addToToMines();
};

Source.prototype.addToToMines = function() { 
    if(!Memory.toMines) {
        Memory.toMines = {};
    }
    if(!Memory.toMines[this.id]) {
        Memory.toMines[this.id] = {};
    }
    if(!Memory.toMines[this.id].creeps) {
        Memory.toMines[this.id].creeps = {};
    }
    Memory.toMines[this.id].id = this.id;
}

Source.prototype.getNeededWorking = function() { 
    var n = this.energyCapacity / 600;
    var creeps = Memory.toMines[this.id].creeps;
    creeps = Object.keys(creeps).map(function (key) { return creeps[key]; });
    for(var i in creeps) {
        var creep = Game.getObjectById(creeps[i]);
        if(!creep) {
            delete Memory.toMines[this.id].creeps[i];
            continue;
        }
        n -= creep.countBodyPart(WORK);
    }
    return n;
}


Source.prototype.getAvailablePositionCount = function() { 
    var a = this.getAllPositions().length;
    var creeps = Memory.toMines[this.id].creeps;
    creeps = Object.keys(creeps).map(function (key) { return creeps[key]; });
    var b = 0;
    for(var i in creeps) {
        var creep = Game.getObjectById(creeps[i]);
        if(!creep) {
            delete Memory.toMines[this.id].creeps[i];
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

