import functions from "../../functions";
import NArray from "../../narray";

describe("test in-build activation functions", () => {
  test("Linear Test", () => {
    const linear1 = new functions.Linear(1);
    const linear2 = functions.linear;

    expect(linear2).toBeInstanceOf(functions.Linear);

    const value = new NArray([1, 2, 3, 4, 5]);
    const output = [1, 2, 3, 4, 5];

    const output2 = [1, 1, 1, 1, 1];

    const formula = "a*x";
    const gradient = "a";

    const calculation1 = linear1.calculate(value),
      calculation2 = linear2.calculate(value);

    const gradient1 = linear1.calcGradient(calculation1),
      gradient2 = linear2.calcGradient(calculation2);

    expect(calculation1.real).toStrictEqual(output);
    expect(calculation2.real).toStrictEqual(output);
    expect(gradient1.real).toStrictEqual(output2);
    expect(gradient2.real).toStrictEqual(output2);

    expect(linear1.formula).toBe(formula);
    expect(linear2.formula).toBe(formula);
    expect(linear1.gradient).toBe(gradient);
    expect(linear2.gradient).toBe(gradient);

    expect(linear1.toString()).toBe("linear(1)");
    expect(linear2.toString()).toBe("linear(1)");
  });

  test("Sigmoid Test", () => {
    const sigmoid1 = new functions.Sigmoid();
    const sigmoid2 = functions.sigmoid;

    expect(sigmoid2).toBeInstanceOf(functions.Sigmoid);

    const value = new NArray([1, 2, 3, 4, 5]);
    const output = [
      0.7310585786300049, 0.8807970779778823, 0.9525741268224331,
      0.9820137900379085, 0.9933071490757153,
    ];

    const output2 = [
      0.19661193324148185, 0.10499358540350662, 0.0451766597309122,
      0.017662706213291107, 0.006648056670790033,
    ];

    const formula = "1/(1+e^-x)";
    const gradient = "sigmoid(x)*(1-sigmoid(x))";

    const calculation1 = sigmoid1.calculate(value),
      calculation2 = sigmoid2.calculate(value);

    const gradient1 = sigmoid1.calcGradient(calculation1),
      gradient2 = sigmoid2.calcGradient(calculation2);

    expect(calculation1.real).toStrictEqual(output);
    expect(calculation2.real).toStrictEqual(output);
    expect(gradient1.real).toStrictEqual(output2);
    expect(gradient2.real).toStrictEqual(output2);

    expect(sigmoid1.formula).toBe(formula);
    expect(sigmoid2.formula).toBe(formula);
    expect(sigmoid1.gradient).toBe(gradient);
    expect(sigmoid2.gradient).toBe(gradient);

    expect(sigmoid1.toString()).toBe("sigmoid");
    expect(sigmoid2.toString()).toBe("sigmoid");
  });

  test("Tanh Test", () => {
    const tanh1 = new functions.Tanh();
    const tanh2 = functions.tanh;

    expect(tanh2).toBeInstanceOf(functions.Tanh);

    const value = new NArray([1, 2, 3, 4, 5]);
    const output = [
      0.7615941559557646, 0.9640275800758169, 0.9950547536867307,
      0.9993292997390673, 0.9999092042625952,
    ];

    const output2 = [
      0.41997434161402647, 0.07065082485316443, 0.009866037165439767,
      0.0013409506830254214, 0.00018158323094363826,
    ];

    const formula = "2 * sigmoid(2x) - 1";
    const gradient = "1 - tanh^2(x)";

    const calculation1 = tanh1.calculate(value),
      calculation2 = tanh2.calculate(value);

    const gradient1 = tanh1.calcGradient(calculation1),
      gradient2 = tanh2.calcGradient(calculation2);

    expect(calculation1.real).toStrictEqual(output);
    expect(calculation2.real).toStrictEqual(output);
    expect(gradient1.real).toStrictEqual(output2);
    expect(gradient2.real).toStrictEqual(output2);

    expect(tanh1.formula).toBe(formula);
    expect(tanh2.formula).toBe(formula);
    expect(tanh1.gradient).toBe(gradient);
    expect(tanh2.gradient).toBe(gradient);

    expect(tanh1.toString()).toBe("tanh");
    expect(tanh2.toString()).toBe("tanh");
  });

  test("Softmax Test", () => {
    const softmax1 = new functions.Softmax();
    const softmax2 = functions.softmax;

    expect(softmax2).toBeInstanceOf(functions.Softmax);

    const value = new NArray([1, 2, 3, 4, 5]);
    const output = [
      0.011656230956039609, 0.03168492079612427, 0.0861285444362687,
      0.23412165725273662, 0.6364086465588308,
    ];

    const output2 = [
      -2.3302779885553515, -2.3102492987152665, -2.255805675075122,
      -2.1078125622586543, -1.7055255729525602,
    ];

    const formula = "exp(xi)/sum(exp(x))";
    const gradient = `x.diag().sub(x.T.dot(x)).sum(0)\n    \n    Note: X is a 1 dimensional array\n    Axis 0 means column wise sum`;

    const calculation1 = softmax1.calculate(value),
      calculation2 = softmax2.calculate(value);

    const gradient1 = softmax1.calcGradient(calculation1),
      gradient2 = softmax2.calcGradient(calculation2);

    expect(calculation1.real).toStrictEqual(output);
    expect(calculation2.real).toStrictEqual(output);
    expect(gradient1.real).toStrictEqual(output2);
    expect(gradient2.real).toStrictEqual(output2);

    expect(softmax1.formula).toBe(formula);
    expect(softmax2.formula).toBe(formula);
    expect(softmax1.gradient).toBe(gradient);
    expect(softmax2.gradient).toBe(gradient);

    expect(softmax1.toString()).toBe("softmax");
    expect(softmax2.toString()).toBe("softmax");
  });

  test("Relu Test", () => {
    const relu1 = new functions.Relu();
    const relu2 = functions.relu;

    expect(relu2).toBeInstanceOf(functions.Relu);

    const value = new NArray([1, 2, 3, 4, 5]);
    const output = [1, 2, 3, 4, 5];

    const output2 = [1, 1, 1, 1, 1];

    const formula = "x, x>=0, 0, x<0";
    const gradient = "1, x>0, 0, x<=0";

    const calculation1 = relu1.calculate(value),
      calculation2 = relu2.calculate(value);

    const gradient1 = relu1.calcGradient(calculation1),
      gradient2 = relu2.calcGradient(calculation2);

    expect(calculation1.real).toStrictEqual(output);
    expect(calculation2.real).toStrictEqual(output);
    expect(gradient1.real).toStrictEqual(output2);
    expect(gradient2.real).toStrictEqual(output2);

    expect(relu1.formula).toBe(formula);
    expect(relu2.formula).toBe(formula);
    expect(relu1.gradient).toBe(gradient);
    expect(relu2.gradient).toBe(gradient);

    expect(relu1.toString()).toBe("relu");
    expect(relu2.toString()).toBe("relu");
  });

  test("LeakyRelu Test", () => {
    const leakyRelu1 = new functions.LeakyRelu();
    const leakyRelu2 = functions.leakyRelu;

    expect(leakyRelu2).toBeInstanceOf(functions.LeakyRelu);

    const value = new NArray([-1, 2, 3, 4, 5]);
    const output = [-0.01, 2, 3, 4, 5];

    const output2 = [0.01, 1, 1, 1, 1];

    const formula = "x, x>=0, 0.01x, x<0";
    const gradient = "1, x>0, 0.01, x<=0";

    const calculation1 = leakyRelu1.calculate(value),
      calculation2 = leakyRelu2.calculate(value);

    const gradient1 = leakyRelu1.calcGradient(calculation1),
      gradient2 = leakyRelu2.calcGradient(calculation2);

    expect(calculation1.real).toStrictEqual(output);
    expect(calculation2.real).toStrictEqual(output);
    expect(gradient1.real).toStrictEqual(output2);
    expect(gradient2.real).toStrictEqual(output2);

    expect(leakyRelu1.formula).toBe(formula);
    expect(leakyRelu2.formula).toBe(formula);
    expect(leakyRelu1.gradient).toBe(gradient);
    expect(leakyRelu2.gradient).toBe(gradient);

    expect(leakyRelu1.toString()).toBe("leakyRelu");
    expect(leakyRelu2.toString()).toBe("leakyRelu");
  });
});
