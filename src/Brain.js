const npg = require('./include/npgmain');
const randf = npg.randf;
const randi = npg.randi;
const randn = npg.randn;

var brainsize= 20; //how many neurons does each brain have. Must be bigger than about 10
var braindensity= 3; //how dense are the brains? (number of synapses per neuron)
var mutrate= 0.1; //how common are mutations?
var mutrate2= 0.3; //how severe are they when they do occur?

function Brain()
{

  this.size = 20;
  this.density = 3;
  //1D array of neuron activations
  this.act= new Array(brainsize);
  for (var i=0;i<brainsize;i++) {
    this.act[i]= 0;
  }
  
  //2D array of synapse weights and indexes of neurons they connect to
  this.w= new Array(brainsize);
  this.ix= new Array(brainsize);
  for (var i=0;i<brainsize;i++) {
    this.w[i]= new Array(braindensity);
    this.ix[i]= new Array(braindensity);
    for (var j=0;j<braindensity;j++) {
        this.w[i][j]= randf(-1.2, 1.2);
        this.ix[i][j]= randi(0, brainsize);
    }
  }
}

//feeds forward the brain. s1 and s2 are the two senses, both in [0,1]
//health is ... health
Brain.prototype = {
    
    //brain takes inputs and sets its outputs
    tick : function(s1, s2) {

        this.act[0]= s1; //set inputs
        this.act[1]= s2;
        this.act[3]= 1; //some bias neurons are always on
        this.act[4]= 1;
        this.act[5]= 1;
        this.act[6]= 1;
        
        for (var i=7;i<brainsize;i++) {
            var a=0;
            for (var j=0;j<braindensity;j++) {
                a+= this.w[i][j]*this.act[this.ix[i][j]]
            }
            this.act[i]= 1.0/(1.0 + Math.exp(-a));  //pass through sigmoid
        }
        
        //assume last 2 neurons are the outputs
        return {
            out0: this.act[brainsize-1] - 0.5, 
            out1: this.act[brainsize-2]
        };
    },
    
    //used during reproduction
    //copy over the brain with some mutation. crude. for now
    mutateFrom : function(brain) {
        
        //lossy copy of brain structure
        for (var i=0;i<brainsize;i++) {
          for (var j=0;j<braindensity;j++) {
            
            var m= brain.w[i][j];
            if(randf(0,1)<mutrate) m += randn(0,mutrate2);
            this.w[i][j]= m;
            
            m= brain.ix[i][j];
            if(randf(0,1)<mutrate) m = randi(0,brainsize);
            this.ix[i][j]= m;
          }
        }
    }
}

module.exports = Brain;