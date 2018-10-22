const npg = require('./include/npgmain');
const randf = npg.randf;
const randi = npg.randi;
const randn = npg.randn;

class Brain {
  constructor(customOptions) {
    this.setOptions(customOptions);
    //1D array of neuron activations
    this.neurons = new Array(this.size).fill(0);
    
    //2D array of synapse weights and indexes of neurons they connect to
    this.weights = this.assignWeights();
    this.index = this.assignIndices();
  }

  setOptions(customOptions) {
    const defaultOptions = {
      size: 20,
      density: 3,
      mutationRate: 0.1,
      mutationSeverity: 1.3
    }
    const options = Object.assign({}, defaultOptions, customOptions);
    this.size =  options.size;
    this.density =  options.density;
    this.mutationRate =  options.mutationRate; //how common are mutations?
    this.mutationSeverity =  options.mutationSeverity; //how severe are they when they do occur?
  }

  assignWeights() {
    return this.assignSynapseValues(randomWeight)
  }

  assignIndices(brain) {
    return this.assignSynapseValues(randomIndex)
  }

  createSynapses() {
    return new Array(this.size).fill([]);
  }

  assignSynapseValues(cb) {
    return this.createSynapses().map(() => this.fillSynapses(cb))
  }

  fillSynapses(cb) {
    return new Array(this.density)
      .fill(0)
      .map(() => cb(this))
  }

  //brain takes inputs and sets its outputs
  tick(s1, s2) {

    this.neurons[0]= s1; //set inputs
    this.neurons[1]= s2;
    this.neurons[2]= 1; //some bias neurons are always on
    this.neurons[3]= 1; 
    this.neurons[4]= 1;
    this.neurons[5]= 1;
    this.neurons[6]= 1;

    // for each neuron in the brain, starting at index 7;
    for (var i=7;i<this.size;i++) {
      let output = 0;
      // for each weight in the weights array;
      for (var j=0;j<this.density;j++) {
        const weight = this.weights[i][j];
        output = this.getBaseOutput(i, j);
        // Brain.applyWeight(baseOutput, weight);
        output += Brain.applyWeight(output, weight);
      }
      this.neurons[i]= activate(output)  //pass through sigmoid
    }

    //assume last 2 neurons are the outputs
    return {
      out0: this.neurons[this.size-1] - 0.5, 
      out1: this.neurons[this.size-2]
    };

  }

  getBaseOutput(i, j) {
    const neuronIndex = this.index[i][j];
    return this.neurons[neuronIndex]
  }

  static applyWeight(baseOutput, weight) {
    return baseOutput * weight;
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

function randomIndex(brain) {
  return randi(0, brain.size);
}

function randomWeight() {
  return randf(-1.2, 1.2);
}

module.exports = Brain;
