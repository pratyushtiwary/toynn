import toynn from "../index.js";

const classes = {
  "Iris-setosa": 0,
  "Iris-versicolor": 1,
  "Iris-virginica": 2,
};

const datasetURL =
  "https://ocw.mit.edu/courses/15-097-prediction-machine-learning-and-statistics-spring-2012/89d88c5528513adc4002a1618ce2efb0_iris.csv";

const irisDataset = await toynn.Dataset.from(datasetURL);

const X = irisDataset.slice(0, -1); // every column except for the last one
const y = irisDataset.slice(-1); // last column

X.onGet = (element) => {
  return element.reshape(1, -1);
};

y.onGet = (element) => {
  element = element.flatten()[0];
  element = toynn.utils.onehotEncode(classes[element], 3);
  return new toynn.NArray(element).reshape(-1);
};

const [trainX, testX, trainY, testY] = toynn.utils.trainTestSplit(X, y, {
  testSize: 0.2,
  shuffle: true,
});

const model = new toynn.NN("irisClassifier");

const layer1 = new toynn.Layer(4, 5);
layer1.use(toynn.functions.sigmoid);
const layer2 = new toynn.Layer(5, 3);
layer2.use(toynn.functions.softmax);

model.add(layer1);
model.add(layer2);
model.train({
  x: trainX,
  y: trainY,
  epochs: 10,
  alpha: 0.005,
  verbose: true,
  loss: toynn.errors.MSE,
});

console.log(model.structure);

// get accuracy
let accuracy = 0,
  prediction;

for (let i = 0; i < testX.length; i++) {
  prediction = model.forward(testX.get(i)).max().index;

  if (prediction === testY.get(i).max().index) {
    accuracy += 1;
  }
}

console.log(`Accuracy: ${(accuracy / testX.length) * 100}%`);
