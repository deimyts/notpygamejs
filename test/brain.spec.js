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
    expect(brain).to.have.property('size')
    expect(brain.size).to.equal(20);
    expect(brain).to.have.property('density')
    expect(brain.density).to.equal(3);
    expect(brain).to.have.property('mutationRate')
    expect(brain.mutationRate).to.equal(0.1);
    expect(brain).to.have.property('mutationSeverity')
    expect(brain.mutationSeverity).to.equal(1.3);
  })

  test('it should allow customization of the default properties', () => {
    const options = {
      size: 10,
      density: 1,
      mutationRate: 0.5,
      mutationSeverity: 0.5
    }

    const brain = new Brain(options);

    expect(brain.size).to.equal(10);
    expect(brain.density).to.equal(1);
    expect(brain.mutationRate).to.equal(0.5);
    expect(brain.mutationSeverity).to.equal(0.5);
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
        const child = Brain.mutateFrom(parent, 1); 

        expect(child).not.to.eql(parent);

        expect(child.weights[0]).not.to.eql(parent.weights[0]);
        expect(child.weights[0]).to.be.an('array');
        expect(child.weights[0][0]).not.to.equal(parent.weights[0][0]);
        expect(child.weights[0][0]).to.be.finite;
        expect(child.index[0]).not.to.eql(parent.index[0]);
        expect(child.index[0]).to.be.an('array');
        expect(child.index[0][0]).not.to.equal(parent.index[0][0]);
      })
    })
  })

  describe('when calculating a neuron\'s output', () => {
    it('should multiply the base output by the weight', () => {
      const baseOutput = 1;
      const weight = 2;
      expect(Brain.applyWeight(baseOutput, weight)).to.equal(2);
    })
  })

  describe('when calculating the brain\'s output', () => {
    it('should produce two output values', () => {
      const brain = new Brain();
      const output = brain.tick();
      
      expect(output).to.be.an('object');
      expect(output).to.have.property('out0');
      expect(output).to.have.property('out1');
    })

    it('should set the first two neurons to the input values', () => {
      const brain = new Brain();
      expect(brain.neurons[0]).to.equal(0);
      const output = brain.tick(0.25, 0.75);
      expect(brain.neurons[0]).to.equal(0.25);
      expect(brain.neurons[1]).to.equal(0.75);
    })

    it('should set neurons 3—7 to 1, as a bias', () => {
      const brain = new Brain();
      const output = brain.tick(0.25, 0.75);
      expect(brain.neurons[2]).to.equal(1);
      expect(brain.neurons[3]).to.equal(1);
      expect(brain.neurons[4]).to.equal(1);
      expect(brain.neurons[5]).to.equal(1);
      expect(brain.neurons[6]).to.equal(1);
    })

    it.skip('should set the values of the inner neurons', () => {
      const brain = new Brain();
      const output = brain.tick(0.25, 0.75);
      expect(brain.neurons[7]).to.equal(1);
      expect(brain.neurons[8]).to.equal(1);
      expect(brain.neurons[9]).to.equal(1);
      expect(brain.neurons[10]).to.equal(1);
    })
  })
})

function mutateBrainWithParent() {
  const parentBrain = new Brain();
  const childBrain = Brain.mutateFrom(parentBrain);
}
