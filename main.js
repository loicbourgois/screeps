'use strict';
require('creep');
require('creep.attack_');
require('creep.build_');
require('creep.carry_');
require('creep.claim_');
require('creep.explore');
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
	let cpu = 0;
    console.log("####################################################################################");
	// 
	delete Memory.sources;
	delete Memory.resources;
	delete Memory.toMines;
	delete Memory.toFills;
	delete Memory.toEmptys;
	// Roles
	Memory.roles = [ {
            'id':'miner',
            'bodyType':WORK,
            'body': {
                'min':[WORK, CARRY, CARRY, CARRY, MOVE],
                'loop':[CARRY, MOVE, WORK],
                'filler':[]
            }
        },{
            'id':'carrier',
            'maxBodyType':4,
            'bodyType':CARRY,
			'body': {
                'min':[MOVE, CARRY],
                'loop':[MOVE, CARRY],
                'filler':[]
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
            'id':'attacker',
			'maxBodyType':5,
            'bodyType':ATTACK,
			'body': {
                'min':[ATTACK, MOVE],
                'loop':[ATTACK, MOVE],
                'filler':[TOUGH]
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
            'id':'claimer',
			'maxBodyType':5,
            'bodyType':CLAIM,
			'body': {
                'min':[CLAIM, MOVE],
                'loop':[MOVE, CLAIM],
                'filler':[TOUGH]
            }
        },{
            'id':'explorer',
            'bodyType':MOVE,
            'body': {
                'min':[MOVE],
                'loop':[],
                'filler':[]
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
	for(var i in Memory.creeps) {
		if(!Game.creeps[i]) {
			delete Memory.creeps[i];
		}
	}
	// Creeps
    var creeps = Game.creeps
    for(var i in creeps) {
		creeps[i].main();
    }
    console.log("----------------------------------------------------------------");
	let creepCpu = (Game.cpu.getUsed()-cpu);
	cpu += creepCpu;
	// Rooms
	if(!Memory.rooms) {
		Memory.rooms = {};
	}
	for(let i in Game.rooms) {
		let room = Game.rooms[i];
		if(!Memory.rooms[room.name] 
				&& room.controller 
				&&room.controller.my) {
			Memory.rooms[room.name] = {
				name : room.name
			}
		}
	}
	for(let i in Memory.rooms) {
		let room = Game.rooms[Memory.rooms[i].name];
		if(!room) {
		    continue;
		}
		room.main();
	}
	let roomCpu = (Game.cpu.getUsed()-cpu);
	cpu += roomCpu;
    // CPU
	console.log("----------------------------------------------------------------");
	console.log("Creep CPU :\t"+ ("    " + creepCpu.toFixed(1)).slice(-5));
	console.log("Room CPU :\t"+ ("    " + roomCpu.toFixed(1)).slice(-5));
	console.log("CPU :\t\t"+ ("    " + cpu.toFixed(1)).slice(-5));
}
