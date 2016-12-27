'use strict';
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
    // 
	delete Memory.sources;
	delete Memory.resources;
	delete Memory.toMines;
	// Roles
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
    for(let i in Memory.roles) {
		let role = Memory.roles[i];
        role.min = 0;
        role.max = 0;
        role.priority = 0;
        role.count = 0;
        role.bodyCount = 0;
    }
	// Rooms
	if(!Memory.rooms) {
		Memory.rooms = {};
	}
	for(let i in Game.rooms) {
		let room = Game.rooms[i];
		if(!Memory.rooms[room.name] && room.controller.my) {
			Memory.rooms[room.name] = {
				name : room.name
			}
		}
	}
	for(let i in Memory.rooms) {
		let room = Game.rooms[Memory.rooms[i].name];
		room.main();
	}
	// Creeps
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
		//try {
		var username, my, res;
		try {
			my = Game.getObjectById(Memory.toMines[i].id).room.controller.my;
		} catch (e) {}
		try {
			res = Game.getObjectById(Memory.toMines[i].id).room.controller.reservation;
		} catch (e) {}
		if(res) {
			username = res.username;
		}
		if(!res && !my && username != 'loicbourgois') {
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
		//try {
			var my, res;
			try {
				my = room.controller.my;
			} catch (e) {}
			try {
				res = room.controller.reservation;
			} catch (e) {}
			return (my || (res&&res.username == 'loicbourgois') );
		/*} catch (e) {
			return;
		}*/
	});
    for(var i in rooms) {
        var room = rooms[i];
        room.main_();
    }
    // Creeps
    var creeps = Game.creeps
    for(var i in creeps) {
		creeps[i].main();
    }
    // Stats
    console.log("CPU : "+Game.cpu.getUsed());
}
