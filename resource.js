Resource.prototype.main = function() {
    this.say_(this.amount + "\t" + this.getCarryResserved());
}

Resource.prototype.say_ = function(message) {
	console.log(this.resourceType
		+ "\t"+this.room.name
		+ "\t"+this.pos.x+","+this.pos.y
		+ "\t"+message);
}

Resource.prototype.getAvailableAmount = function() {
    let avalaibleAmount = this.amount;
    for(let i in Memory.resources[this.id].assignations) {
        let assignation = Memory.resources[this.id].assignations[i];
        let creep = Game.getObjectById(assignation.creepId);
        avalaibleAmount -= creep.getFreeCary();
    }
    return avalaibleAmount;
}

Resource.prototype.getTotalCarrying = function() {
	return this.amount;
}

Resource.prototype.getCarryResserved = function() {
	let roomName = Memory.resources[this.id].originalRoom.name;
	let toEmpty = Memory.rooms[roomName].toEmptys[this.id];
	let reserved = 0;
	for(let i in toEmpty.creeps) {
		let creep = Game.getObjectById(toEmpty.creeps[i]);
		if(!creep) {
			delete Memory.toEmptys[toEmpty.id].creeps[i];
			continue;
		}
		reserved += creep.freeToCarry();
	}
	return reserved;
}

Resource.prototype.getOriginalRoomName = function() {
	if(Memory.resources && Memory.resources[this.id]) {
		return Memory.resources[this.id].originalRoom.name;
	}
}
