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
require('constants');

module.exports.loop = function () {
	Game.CPU_LIMIT = 2 * Game.cpu.limit * Game.cpu.bucket / 10000;
	Game.STATS_SIZE = 100;
	//
	let cpu = 0;
    console.log("####################################################################################");
	// 
	delete Memory.sources;
	delete Memory.resources;
	delete Memory.toMines;
	delete Memory.toFills;
	delete Memory.toEmptys;
	// Stats
	if(!Memory.stats) {
		Memory.stats = {};
	}
	Memory.stats[Game.time] = {};
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
            'maxBodyType':10,
            'bodyType':CARRY,
			'body': {
                'min':[MOVE, CARRY],
                'loop':[MOVE, CARRY],
                'filler':[]
            }
        },{
            'id':'rangedAttacker',
			'maxBodyType':MAX_CREEP_SIZE/3,
            'bodyType':RANGED_ATTACK,
			'body': {
                'min':[RANGED_ATTACK, MOVE],
                'loop':[RANGED_ATTACK, MOVE],
                'filler':[TOUGH]
            }
        },{
            'id':'attacker',
			'maxBodyType':MAX_CREEP_SIZE/3,
            'bodyType':ATTACK,
			'body': {
                'min':[ATTACK, MOVE],
                'loop':[ATTACK, MOVE],
                'filler':[TOUGH]
            }
        },{
            'id':'upgrader',
            'maxBodyType':MAX_CREEP_SIZE,
            'bodyType':WORK,
			'body': {
                'min':[CARRY, WORK, MOVE],
                'loop':[WORK, CARRY, MOVE],
                'filler':[]
            }
        },{
            'id':'builder',
            'maxBodyType':MAX_CREEP_SIZE,
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
	console.log("Bucket\t\t"+ ("     " + Game.cpu.bucket.toFixed(1)).slice(-8));
	console.log("Total CPU\t"+ ("     " + cpu.toFixed(1)).slice(-8));
	console.log("CPU limit\t"+ ("     " + Game.CPU_LIMIT.toFixed(1)).slice(-8));
	// Stats
	Memory.stats[Game.time].cpu = {};
	Memory.stats[Game.time].cpu.bucket = Game.cpu.bucket;
	Memory.stats[Game.time].cpu.used = cpu;
	Memory.stats[Game.time].cpu.limit = Game.cpu.limit;
	Memory.stats[Game.time].cpu.dynamicLimit = Game.CPU_LIMIT;
	//
	for(let i in Memory.stats) {
		if (i < Game.time-Game.STATS_SIZE) {
			delete Memory.stats[i];
		}
	}
}
