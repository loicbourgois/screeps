Creep.prototype.explore = function() {
	let roomName = this.memory.roomName;
	if(!roomName) {
		let rooms = Memory.rooms[this.memory.originalRoom].rooms;
		rooms = Object.keys(rooms).map(function (key) { return rooms[key]; });
		rooms = rooms.filter(function(room) {
			return room.status == 'null' || room.status == 'youpi';
		});
		if(!rooms.length) {
			this.say_('no room');
			delete Memory.rooms[this.memory.originalRoom].rooms;
			return;
		}
		roomName = rooms[0].name;
		Memory.rooms[this.memory.originalRoom].rooms[roomName].status = 'exploring';
	}
	//
	if(Game.map.isRoomAvailable(roomName)
			&& roomName == this.room.name
			&& this.room.find(FIND_SOURCES).length >= 1
			&& roomName!=this.memory.originalRoom
			&& this.room.controller) {
		this.say_('youpi');
		this.moveTo(this.room.controller);
		Memory.rooms[this.memory.originalRoom].rooms[roomName].status = 'youpi';
	} 
	//
	else if(Game.map.isRoomAvailable(roomName) 
			&& roomName != this.room.name) {
		let code;
		switch(code = this.moveTo(new RoomPosition(25, 25, roomName))) {
			case OK : {
				this.say_("to "+roomName);
				break;
			}
			case ERR_NO_PATH: {
				this.say_(code);
				Memory.rooms[this.memory.originalRoom].rooms[roomName].status = 'problem';
				delete this.memory.roomName;
				break;
			}
			default : {
				this.say_(code);
				break;
			}
		}
	} else {
		Memory.rooms[this.memory.originalRoom].rooms[roomName].status = 'problem';
		delete this.memory.roomName;
	}
}
