Creep.prototype.claim_ = function() {
	this.say("reserve");
	room = 'W22N77';
	if(this.room.name != room) {
	   	this.moveTo(new RoomPosition(25,25, room));
	   	return;
	} else {
	    var code;
	    switch (code = this.reserveController(this.room.controller)) {
	        case ERR_NOT_IN_RANGE : {
	            this.moveTo(this.room.controller);
	        }
	        default : {
	            console.log(code);
	            break;
	        }
	    }
	}
}
