StructureExtension.prototype.main = function() {
}

StructureExtension.prototype.getFreeCapacity = function () {
    return this.energyCapacity - this.energy;
}