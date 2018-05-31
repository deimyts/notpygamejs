const npg = require('./include/npgmain');
const randf = npg.randf;
const randi = npg.randi;
const randn = npg.randn;


function Brain()
{
  this.size = 20;
  this.density = 3;
  this.mutationRate = 0.1; //how common are mutations?
  this.mutationSeverity = 0.3; //how severe are they when they do occur?
  //1D array of neuron activations
  this.neurons = neuronActivations(this);
  
  //2D array of synapse weights and indexes of neurons they connect to
  this.weights = synapseWeights(this);
  this.index = neuronIndex(this);
}

//feeds forward the brain. s1 and s2 are the two senses, both in [0,1]
Brain.prototype = {
    
    //brain takes inputs and sets its outputs
    tick : function(s1, s2) {

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
    },
    
    //used during reproduction
    //copy over the brain with some mutation. crude. for now
    mutateFrom : function(brain) {
        
        //lossy copy of brain structure
        for (var i=0;i<this.size;i++) {
          for (var j=0;j<this.density;j++) {
            
            var m= this.weights[i][j];
            if(randf(0,1)<this.mutationRate) m += randn(0,this.mutationSeverity);
            this.weights[i][j]= m;
            
            m= brain.ix[i][j];
            if(randf(0,1)<this.mutationRate) m = randi(0,this.size);
            this.index[i][j]= m;
          }
        }
    },

    neuronActivations: neuronActivations,
    synapseWeights: synapseWeights,
    neuronIndex: neuronIndex,
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
