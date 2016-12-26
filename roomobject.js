RoomObject.prototype.addToToFills = function() {
    if(!Memory.toFills) {
        Memory.toFills = {};
    }
    if(!Memory.toFills[this.id]) {
        Memory.toFills[this.id] = {};
    }
    Memory.toFills[this.id].id = this.id;
}