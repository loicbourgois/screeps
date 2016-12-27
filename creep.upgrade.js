Creep.prototype.upgrade = function() {
    var code;
    switch(code = this.upgradeController(this.room.controller)) {
        case ERR_NOT_IN_RANGE: {
            this.moveTo(this.room.controller);
            break;
        }
        default:{
            break;
        }
    }
}