const npg = require('./include/npgmain');
const randf = npg.randf;
const randi = npg.randi;
const randn = npg.randn;


class Brain {
  constructor() {
    this.size = 20;
    this.density = 3;
    this.mutationRate = 0.1; //how common are mutations?
    this.mutationSeverity = 1.3; //how severe are they when they do occur?
    //1D array of neuron activations
    this.neurons = neuronActivations(this);
    
    //2D array of synapse weights and indexes of neurons they connect to
    this.weights = synapseWeights(this);
    this.index = neuronIndex(this);
  }
    //brain takes inputs and sets its outputs
  tick(s1, s2) {

    this.neurons[0]= s1; //set inputs
    this.neurons[1]= s2;
    this.neurons[3]= 1; //some bias neurons are always on
    this.neurons[4]= 1;
    this.neurons[5]= 1;
    this.neurons[6]= 1;

    for (var i=7;i<this.size;i++) {
      let output = 0;
      for (var j=0;j<this.density;j++) {
        const weight = this.weights[i][j];
        const neuronIndex = this.index[i][j];
        const baseOutput = this.neurons[neuronIndex]
        output += weight * baseOutput
      }
      this.neurons[i]= activate(output)  //pass through sigmoid
    }

    //assume last 2 neurons are the outputs
    return {
      out0: this.neurons[this.size-1] - 0.5, 
      out1: this.neurons[this.size-2]
    };
  }
}

//feeds forward the brain. s1 and s2 are the two senses, both in [0,1]

//used during reproduction
//copy over the brain with some mutation. crude. for now
Brain.mutateFrom = function(parent, mutationRate) {
  if(!parent) throw new Error('Must have a parent brain to mutate from'); 
  const child = new Brain();
  child.neurons = parent.neurons.map(n => n);
  child.weights = parent.weights.map(weightGroup => {
    return mutateArray(weightGroup, mutationRate, child.mutationSeverity)
  });
  child.index = parent.index.map(indexGroup => {
    return mutateArray(indexGroup, mutationRate, child.mutationSeverity);
  });
  return child;
}

function mutateArray(arr, rate, severity) {
  return arr.map(value => {
    return mutateValue(value, rate, severity);
  })
}

function mutateValue(val, rate, severity) {
  const shouldMutate = randf(0, 1) < rate;
  if (shouldMutate) return val + randn(0, severity);
  return val;
}

function activate(output) {
  return 1.0/(1.0 + Math.exp(-output));
}

function neuronActivations(brain) {
  return new Array(brain.size).fill(0);
}

function synapses(brain) {
  return new Array(brain.size).fill([]);
}

function fillSynapses(brain, cb) {
  return new Array(brain.density)
    .fill(0)
    .map(() => cb(brain))
}

function assignIndex(brain) {
  return randi(0, brain.size);
}

function assignWeight() {
  return randf(-1.2, 1.2);
}

function synapseWeights(brain) {
  return synapses(brain).map(() => fillSynapses(brain, assignWeight));
}

function neuronIndex(brain) {
  return synapses(brain).map(() => fillSynapses(brain, assignIndex));
}

module.exports = Brain;
