Creep.prototype.attack_ = function() {
    var ennemies = Game.rooms[this.memory.originalRoom].findEnnemies();
    if(!ennemies.length) {
        this.moveTo(new RoomPosition(25, 25, this.memory.assignedRoomName));
        return;
    }
    var ennemy = ennemies[0];
    var code;
    switch(code = this.attack(ennemy)) {
        case ERR_NOT_IN_RANGE : {
            this.moveTo(ennemy);
            break;
        }
        default : {
            break;
        }
    }
}

Creep.prototype.assignRoom = function(roomName) {
	this.memory.assignedRoomName = roomName;
}

Creep.prototype.rangedAttack_ = function() {
    var ennemies = Game.rooms[this.memory.originalRoom].findEnnemies();
    if(!ennemies.length) {
        this.moveTo(new RoomPosition(25, 25, this.memory.assignedRoomName));
        return;
    }
    var ennemy = ennemies[0];
    var code;
    switch(code = this.rangedAttack(ennemy)) {
        case ERR_NOT_IN_RANGE : {
            this.moveTo(ennemy);
            break;
        }
        default : {
            break;
        }
    }
}
