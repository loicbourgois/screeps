Creep.prototype.explore = function() {
	let roomName = this.memory.roomName;
	if(!roomName) {
		let rooms = Memory.rooms[this.memory.originalRoom].rooms;
		rooms = Object.keys(rooms).map(function (key) { return rooms[key]; });
		rooms = rooms.filter(function(room) {
			return room.status == 'null';
		});
		roomName = rooms[0].name;
		Memory.rooms[this.memory.originalRoom].rooms[roomName].status = 'explored';
	}
	//
	if(Game.map.isRoomAvailable(roomName)
			&& roomName == this.room.name
			&& this.room.find(FIND_SOURCES).length >= 2
			&& roomName!=this.memory.originalRoom) {
		this.say_('youpi');
		this.moveTo(this.room.controller);
		
		let room = Game.rooms[this.memory.originalRoom].addRoom(this.room.name);
		
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
				break;
			}
			default : {
				this.say_(code);
				break;
			}
		}
	} else {
		this.memory.tree.shift();
	}
}

