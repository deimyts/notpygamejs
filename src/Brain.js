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
  this.act = neuronActivations(this);
  
  //2D array of synapse weights and indexes of neurons they connect to
  this.w = synapseWeights(this);
  this.ix = neuronIndex(this);
}

//feeds forward the brain. s1 and s2 are the two senses, both in [0,1]
Brain.prototype = {
    
    //brain takes inputs and sets its outputs
    tick : function(s1, s2) {

        this.act[0]= s1; //set inputs
        this.act[1]= s2;
        this.act[3]= 1; //some bias neurons are always on
        this.act[4]= 1;
        this.act[5]= 1;
        this.act[6]= 1;
        
        for (var i=7;i<this.size;i++) {
            var a=0;
            for (var j=0;j<this.density;j++) {
                a+= this.w[i][j]*this.act[this.ix[i][j]]
            }
            this.act[i]= 1.0/(1.0 + Math.exp(-a));  //pass through sigmoid
        }
        
        //assume last 2 neurons are the outputs
        return {
            out0: this.act[this.size-1] - 0.5, 
            out1: this.act[this.size-2]
        };
    },
    
    //used during reproduction
    //copy over the brain with some mutation. crude. for now
    mutateFrom : function(brain) {
        
        //lossy copy of brain structure
        for (var i=0;i<this.size;i++) {
          for (var j=0;j<this.density;j++) {
            
            var m= brain.w[i][j];
            if(randf(0,1)<this.mutationRate) m += randn(0,this.mutationSeverity);
            this.w[i][j]= m;
            
            m= brain.ix[i][j];
            if(randf(0,1)<this.mutationRate) m = randi(0,this.size);
            this.ix[i][j]= m;
          }
        }
    },

    neuronActivations: neuronActivations,
    synapseWeights: synapseWeights,
    neuronIndex: neuronIndex,
}

function neuronActivations(brain) {
  return new Array(brain.size).fill(0);
}

function synapseWeights(brain) {
  const weights = new Array(brain.size).fill([]);
  return weights.map(() => createSynapses(brain.density));
}

function createSynapses(density) {
  return new Array(density)
    .fill(0)
    .map(assignWeight)
}

function assignWeight() {
  return randf(-1.2, 1.2);
}

function neuronIndex(brain) {
  const index = new Array(brain.size);
  for (var i=0;i<brain.size;i++) {
    index[i]= new Array(brain.density);
    for (var j=0;j<brain.density;j++) {
        index[i][j]= randi(0, brain.size);
    }
  }
  return index;
}

module.exports = Brain;
