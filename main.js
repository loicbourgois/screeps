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
            'bodyType':CARRY,
            'body':[
                MOVE, CARRY, MOVE, CARRY
            ],
            'minBodyCount':2
        },{
            'id':'upgrader',
            'bodyType':WORK,
            'body':[
                CARRY, WORK, WORK, MOVE, 
                WORK, CARRY, WORK, CARRY, MOVE,
            ],
            'minBodyCount':4
        },{
            'id':'builder',
            'minBodyCount':3,
            'bodyType':WORK,
            'body':[
                CARRY, WORK, MOVE, 
                WORK, CARRY, WORK, CARRY,
                WORK, CARRY, WORK, CARRY,
                WORK, CARRY, WORK, CARRY,
            ]
        },{
            'id':'attacker',
            'minBodyCount':2,
            'bodyType':ATTACK,
            'body':[
                ATTACK, MOVE,
                TOUGH, ATTACK, TOUGH, MOVE,
                TOUGH, ATTACK, TOUGH, MOVE,
                TOUGH, ATTACK, TOUGH, MOVE,
            ],
        },{
            'id':'rangedAttacker',
            'bodyType':RANGED_ATTACK,
            'body':[
                RANGED_ATTACK, MOVE,
                TOUGH, RANGED_ATTACK, MOVE,
                TOUGH, RANGED_ATTACK, MOVE,
            ],
            'minBodyCount':2
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
