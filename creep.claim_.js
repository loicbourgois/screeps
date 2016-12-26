Creep.prototype.claim_ = function() {
	this.say("reserve");
	roomName = 'W22N77';
	if(this.room.name != roomName) {
	   	this.moveTo(new RoomPosition(25,25, roomName));
	   	return;
	} else {
	    var code;
	    switch (code = this.reserveController(this.room.controller)) {
			case OK : {
				break;
			}
	        case ERR_NOT_IN_RANGE : {
	            this.moveTo(this.room.controller);
				break;
	        }
	        default : {
	            console.log(code);
	            this.say(code);
	            break;
	        }
	    }
	}
}
