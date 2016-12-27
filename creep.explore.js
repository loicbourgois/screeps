Creep.prototype.explore = function() {
	let roomName = this.memory.originalRoom;
	if(!(this.memory.tree&&this.memory.tree.length)) {
		this.memory.tree = [];
		this.memory.tree = this.memory.tree;
		this.memory.tree = completeTree(roomName, 2);
		this.memory.tree = this.memory.tree.sort(function(a, b) {
			let aD = Game.map.findRoute(roomName, a).length;
			let bD = Game.map.findRoute(roomName, b).length;
			return (aD-bD);
		});
	}
	//console.log(JSON.stringify(this.memory.tree, null, 2));
	//
	roomName = this.memory.tree[0];
	if(Game.map.isRoomAvailable(roomName)
			&& roomName == this.room.name
			&& this.room.find(FIND_SOURCES).length >= 2
			&& roomName!=this.memory.originalRoom) {
		this.say_('youpi');
		this.moveTo(this.room.controller);
		
		let room = Game.rooms[this.memory.originalRoom].addRoom(this.room.name);
		
	} else if(Game.map.isRoomAvailable(roomName) && roomName != this.room.name) {
		let code;
		switch(code = this.moveTo(new RoomPosition(25, 25, roomName))) {
			case OK : {
				this.say_("goto "+roomName);
				break;
			}
			case ERR_NO_PATH: {
				//this.say_(this.moveTo(this.room.controller));
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


completeTree = function(roomName, count) {
	let exits = Game.map.describeExits(roomName);
	let tree = [];
	for(let i in exits) {
		tree.push(exits[i]);
	}
	if(!count) {
		return tree;
	}
	for(let i in tree) {
		tree = tree.concat(completeTree(tree[i], count-1));
	}
	tree = tree.filter(function(item, pos) {
		return tree.indexOf(item) == pos;
	});
	return tree;
}
