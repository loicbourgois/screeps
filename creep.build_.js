Creep.prototype.build_ = function() {
    this.addToToFills();
    var sites = this.room.find(FIND_CONSTRUCTION_SITES);
    if(sites.length) {
        var site = sites[0];
		this.sayMoving(sites[0].pos);
        var code;
        switch(code = this.build(site)) {
            case ERR_NOT_IN_RANGE : {
                this.moveTo(site);
                break;
            }
            case ERR_NOT_ENOUGH_RESOURCES : {
                //this.moveToFlag('builders-'+this.room.name);
				this.moveTo(site);
                break;
            }
            default : {
                break;
            }
        }
        return;
    }
	//
    var structures = this.room.find(FIND_STRUCTURES, { 
		filter: (structure) => { 
			return (
				structure.hits < structure.hitsMax/2
				&& structure.hits > 0
				&& structure.hits < 200000)
	   }
	});
    var structure = structures[0];
    if(structure) {
		this.sayMoving(structure.pos);
        var code;
        switch(code = this.repair(structure)) {
            case ERR_NOT_IN_RANGE : {
                this.moveTo(structure);
                break;
            }
            case ERR_NOT_ENOUGH_RESOURCES : {
                //this.moveToFlag('builders-'+this.room.name);
				this.moveTo(structure);
                break;
            }
            default : {
                break;
            }
        }
        return;
    }
	//
    this.moveToFlag('builders-'+this.room.name);
    
}

Creep.prototype.moveToFlag = function(flagName) {
    var flags = this.room.find(FIND_FLAGS, {
        filter: {  name: flagName}
    });
	if(!flags[0]) {
		return;
	}
    this.moveTo(flags[0]);
	this.sayMoving(flags[0].pos);
}