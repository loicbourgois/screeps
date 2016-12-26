require('creep');
require('creep.attack_');
require('creep.build_');
require('creep.carry_');
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
    if(!Memory.sources) {
        Memory.sources = {};
    }
    if(!Memory.resources) {
        Memory.resources = {};
    }
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
    
    
    //
    for(var i in Game.rooms) {
        var room = Game.rooms[i];
        room.main();
    }
    // Stats
    console.log("CPU : "+Game.cpu.getUsed());
}
