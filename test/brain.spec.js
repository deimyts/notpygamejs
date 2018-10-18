const expect = require('chai').expect;

const Brain = require('../src/Brain.js')

describe('an agent\'s brain', () => {
  let brain;

  beforeEach(() => {
    brain = new Brain();
  })

  test('it should exist', () => {
    expect(brain).to.be.an('object');
  })

  test('it should set the default properties', () => {
    expect(brain).to.have.property('size');
    expect(brain).to.have.property('density');
    expect(brain).to.have.property('mutationRate');
    expect(brain).to.have.property('mutationSeverity');
  })

  describe('creating the array of neuron activations', () => {
    test('the neuron activation should be an array of length "brain.size"', () => {
      expect(brain.neurons).to.be.an('array'); 
      expect(brain.neurons).to.have.length(brain.size);
    })

    test('the neuron activations should all be set to 0', () => {
      brain.neurons.forEach(activation => {
        expect(activation).to.equal(0);
      })
    })
  })

  describe('creating the array of synapse weights', () => {
    test('the synapse weights should be an array of length "brain.size"', () => {
      expect(brain.weights).to.be.an('array'); 
      expect(brain.weights).to.have.length(brain.size);
    })

    test('each element in the synapse array should be an array of length "brain.density"', () => {
      brain.weights.forEach(weight => {
        expect(weight).to.be.an('array');
        expect(weight).to.have.length(brain.density);
      })
    })

    test('each weight should be a number between -1.2 and 1.2', () => {
      brain.weights.forEach(weightGroup => {
        weightGroup.forEach(weight => {
          expect(weight).to.be.a('number');
          expect(weight).to.be.greaterThan(-1.2);
          expect(weight).to.be.lessThan(1.2);
        })
      }) 
    })
  })

  describe('creating the neuron index', () => {
    test('the neuron index should be an array of length "brain.size"', () => {
      expect(brain.index).to.be.an('array'); 
      expect(brain.index).to.have.length(brain.size);
    })

    test('each element in the synapse array should be an array of length "brain.density"', () => {
      brain.index.forEach(index => {
        expect(index).to.be.an('array');
        expect(index).to.have.length(brain.density);
      })
    })
  })

  describe('when mutating a brain', () => {
    describe('when no brain is given to mutate from', () => {
      it('the brain should throw an error', () => {
        expect(Brain.mutateFrom).to.throw();
        expect(mutateBrainWithParent).not.to.throw();
      })
    })

    describe.skip('equal objects', () => {
      function Thing() {
        this.foo = 'bar';
      }
      const obj1 = new Thing();
      Thing.prototype.test = function() {
        console.log('this is only a test');
      }
      Thing.prototype.test1 = function() {
        console.log('this is only a test');
      }
      const obj2 = Object.assign({}, obj1);
      expect(obj1).to.eql(obj2);
      expect(obj1).not.to.equal(obj2);
    })

    describe('when the mutation rate is zero', () => {
      it('should create an identical copy', () => {
        const parent = new Brain();
        const child = Brain.mutateFrom(parent, 0); 

        expect(child).to.eql(parent);
        expect(child).not.to.equal(parent);

        expect(child.neurons).to.eql(parent.neurons);
        expect(child.neurons).not.to.equal(parent.neurons);

        expect(child.weights).to.eql(parent.weights);
        expect(child.weights).not.to.equal(parent.weights);

        expect(child.index).to.eql(parent.index);
        expect(child.index).not.to.equal(parent.index);
      })
    })

    describe('when the mutation rate is 1', () => {
      it('should create a mutated copy', () => {
        const parent = new Brain();
        const child = Brain.mutateFrom(parent, 0); 

        expect(child).not.to.eql(parent);
        expect(child.brain).not.to.eql(parent.brain);
        expect(child.brain.index[0]).not.to.eql(parent.brain.index[0]);
      })
    })
  })
})

function mutateBrainWithParent() {
  const parentBrain = new Brain();
  const childBrain = Brain.mutateFrom(parentBrain);
}
