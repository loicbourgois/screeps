Creep.prototype.attack_ = function() {
    var ennemies = this.room.find(FIND_HOSTILE_CREEPS);
    if(!ennemies.length) {
        var flags = this.room.find(FIND_FLAGS, {
            filter: {  name: 'casern-'+this.room.name}
        });
        this.moveTo(flags[0]);
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

Creep.prototype.rangedAttack_ = function() {
    var ennemies = this.room.find(FIND_HOSTILE_CREEPS);
    if(!ennemies.length) {
        var flags = this.room.find(FIND_FLAGS, {
            filter: {  name: 'casern-'+this.room.name}
        });
        this.moveTo(flags[0]);
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