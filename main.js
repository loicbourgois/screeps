require('creep');
require('creep.attack_');
require('creep.build_');
require('creep.carry_');
require('creep.claim_');
require('creep.mine');
require('creep.upgrade');
require('resource');
require('room');
require('roomobject');
require('source');
require('spawn');
require('structure');
require('structure.extension');

module.exports.loop = function () {
    console.log("--------------------------------");
    // Memory
	delete Memory.sources;
	delete Memory.resources;
    Memory.roles = [ {
            'id':'miner',
            'bodyType':WORK,
            'body': {
                'min':[WORK, CARRY, CARRY, CARRY, MOVE],
                'loop':[CARRY, WORK],
                'filler':[CARRY]
            }
        },{
            'id':'carrier',
            'maxBodyType':2,
            'bodyType':CARRY,
			'body': {
                'min':[MOVE, CARRY],
                'loop':[MOVE, CARRY],
                'filler':[]
            }
        },{
            'id':'upgrader',
            'maxBodyType':5,
            'bodyType':WORK,
			'body': {
                'min':[CARRY, WORK, MOVE],
                'loop':[WORK, CARRY, MOVE],
                'filler':[]
            }
        },{
            'id':'builder',
            'maxBodyType':5,
            'bodyType':WORK,
			'body': {
                'min':[CARRY, WORK, MOVE],
                'loop':[WORK, CARRY, MOVE],
                'filler':[]
            }
        },{
            'id':'attacker',
			'maxBodyType':5,
            'bodyType':ATTACK,
			'body': {
                'min':[ATTACK, MOVE],
                'loop':[ATTACK, MOVE],
                'filler':[TOUGH]
            }
        },{
            'id':'rangedAttacker',
			'maxBodyType':5,
            'bodyType':RANGED_ATTACK,
			'body': {
                'min':[RANGED_ATTACK, MOVE],
                'loop':[RANGED_ATTACK, MOVE],
                'filler':[TOUGH]
            }
        },{
            'id':'claimer',
			'maxBodyType':5,
            'bodyType':CLAIM,
			'body': {
                'min':[CLAIM, MOVE],
                'loop':[MOVE, CLAIM],
                'filler':[TOUGH]
            }
        }
    ];
    for(var i in Memory.roles) {
        Memory.roles[i].min = 0;
        Memory.roles[i].max = 0;
        Memory.roles[i].priority = 0;
        Memory.roles[i].count = 0;
        Memory.roles[i].bodyCount = 0;
    }
	// Clean creeps
	for(var i in Memory.creeps) {
		if(!Game.creeps[i]) {
			delete Memory.creeps[i];
		}
	}
	// Clean toMines
	for(var i in Memory.toMines) {
	    if(!Game.getObjectById(Memory.toMines[i].id)) {
	        delete Memory.toMines[i];
	        continue;
	    }
		var my = Game.getObjectById(Memory.toMines[i].id).room.controller.my;
		var res = Game.getObjectById(Memory.toMines[i].id).room.controller.reservation;
		if(!res && !my && res.username != 'loicbourgois') {
			delete Memory.toMines[i];
			continue;
		}
		for(var j in Memory.toMines[i].creeps){
			if(!Game.getObjectById(Memory.toMines[i].creeps[j])) {
				delete Memory.toMines[i].creeps[j];
			}
		}
	}
	// Clean toEmptys
	for(var i in Memory.toEmptys) {
		var object = Game.getObjectById(Memory.toEmptys[i].id);
		if(!object) {
			delete Memory.toEmptys[i];
		}
	}
	// Clean toFills
	for(var i in Memory.toFills) {
		var object = Game.getObjectById(Memory.toFills[i].id);
		if(!object) {
			delete Memory.toFills[i];
		}
	}
    // Rooms
	var rooms = Game.rooms
	rooms = Object.keys(rooms).map(function (key) { return rooms[key]; });
	rooms = rooms.filter(function (room) {
		var my = room.controller.my;
		var res = room.controller.reservation;
		return (my || (res&&res.username == 'loicbourgois') );
	});
    for(var i in rooms) {
        var room = rooms[i];
        room.main();
    }
    // Creeps
    var creeps = Game.creeps
    for(var i in creeps) {
		creeps[i].main();
    }
    // Stats
    console.log("CPU : "+Game.cpu.getUsed());
}
