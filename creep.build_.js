Creep.prototype.build_ = function() {
    this.addToToFills();
    var sites = this.room.find(FIND_CONSTRUCTION_SITES);
    if(sites.length) {
        var site = sites[0];
        var code;
        switch(code = this.build(site)) {
            case ERR_NOT_IN_RANGE : {
                this.moveTo(site);
                break;
            }
            case ERR_NOT_ENOUGH_RESOURCES : {
                this.moveToFlag('builders-'+this.room.name);
                break;
            }
            default : {
                break;
            }
        }
        return;
    }
    var structures = this.room.find(FIND_STRUCTURES, { 
        filter: { structureType: STRUCTURE_WALL }
    });
    
    var structure;
    for(var i in structures) {
        if(!structures[i].hits) {
            continue;
        }
        if(structures[i].hits < 100000) {
            structure = structures[i];
            break;
        }
    }
    if(structure) {
        var code;
        switch(code = this.repair(structure)) {
            case ERR_NOT_IN_RANGE : {
                this.moveTo(structure);
                break;
            }
            case ERR_NOT_ENOUGH_RESOURCES : {
                //this.moveToFlag('builders-'+this.room.name);
                break;
            }
            default : {
                break;
            }
        }
        return;
    }
    this.moveToFlag('builders-'+this.room.name);
    
}

Creep.prototype.moveToFlag = function(flagName) {
    var flags = this.room.find(FIND_FLAGS, {
        filter: {  name: flagName}
    });
    this.moveTo(flags[0]);
}