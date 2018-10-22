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

    it.only('should generate the output values correctly', () => {
      const brain = new Brain();
      brain.weights = [ [ -0.3986550087463271, -0.33366586354612426, 0.6603439927577222 ],
      [ 0.3885910277032498,
        -0.21376607786209934,
        -0.39203667385283936 ],
      [ -0.0736661853310785, 0.3088512918463453, -0.8500398962254727 ],
      [ -1.1909748572819172, 0.45327412725165117, -0.9962819086655731 ],
      [ -0.4977306915224794,
        -0.19094616238277173,
        -0.5044867408569162 ],
      [ 0.3446603803540804, -0.27970572805634897, -0.6760643611385159 ],
      [ -0.10363727853004656, -1.090823397698178, -0.4595269218600798 ],
      [ -0.24677674243861492, -0.9553924663894481, 1.1432854970929844 ],
      [ -0.13819495698864737, -1.1753476912325729, 1.0831737703980953 ],
      [ -1.1429703356468466,
        -0.30789588137137847,
        -0.047781999317904056 ],
      [ -0.5237190418491657, 0.02163370386536867, 1.0974458759227346 ],
      [ -0.46128256449654403,
        -0.08142609211642671,
        0.5808377036963048 ],
      [ 0.20967757964269595, 0.9822788199007351, 0.08871109899443619 ],
      [ -0.2609492504589145, -0.9175165416762091, 1.0410739643058238 ],
      [ 0.13159010377654323,
        -0.24193211848147855,
        0.19454522296943377 ],
      [ -0.8257392137106224, 0.0790590218326257, -0.8738935948831461 ],
      [ -0.4407176385566556, 0.37226187249840925, 0.14720821511345106 ],
      [ -0.08097677306439999, 0.973161515985151, -0.9764552056727837 ],
      [ -0.7383157289720801, 0.6936583856302834, -0.9858107488493683 ],
      [ 0.19071401692595247, -0.804139530346279, 0.6395621471512516 ] ]

      brain.index = [ [ 9, 19, 13 ],
      [ 14, 5, 8 ],
      [ 3, 0, 12 ],
      [ 14, 12, 15 ],
      [ 17, 1, 5 ],
      [ 12, 13, 13 ],
      [ 2, 7, 2 ],
      [ 10, 8, 7 ],
      [ 0, 12, 1 ],
      [ 3, 7, 5 ],
      [ 16, 8, 5 ],
      [ 2, 7, 17 ],
      [ 6, 16, 10 ],
      [ 16, 6, 6 ],
      [ 15, 10, 3 ],
      [ 10, 8, 9 ],
      [ 13, 13, 1 ],
      [ 18, 14, 1 ],
      [ 16, 14, 1 ],
      [ 6, 2, 6 ] ]

      const { out0, out1 } = brain.tick(.05, .01);
      expect(out0).to.be.closeTo(0.33747, 0.00001);
      expect(out1).to.be.closeTo(0.50003, 0.00001);
    })
  })
})

function mutateBrainWithParent() {
  const parentBrain = new Brain();
  const childBrain = Brain.mutateFrom(parentBrain);
}
