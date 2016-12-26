StructureExtension.prototype.main = function() {
    this.addToToFills(); 
}

StructureExtension.prototype.getFreeCapacity = function () {
    return this.energyCapacity - this.energy;
}