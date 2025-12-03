const display = document.querySelector(".display");

// 数字の入力
function inputNumber(num) {
  const value = display.value;
  if (value === "0では除算できません") {
    if (num === "0" || num === "00") {
      display.value = "0";
      return;
    }
    display.value = num;
    return;
  }

  if (display.value === "0" && num !== "00") {
    display.value = num;
    return;
  }

  if (num == "00") {
    const expr = display.value;
    const lastNumber = expr.split(/[+\-×÷]/).pop();
    if (lastNumber === "" || display.value === "0") {
      return;
    } else {
      display.value += "00";
      return; 
    }
  }

  display.value += num;
};

// 小数点の入力
function inputDot() {
  const value = display.value;
  if (value === "0では除算できません") {
    display.value = '0';
    return;
  }

  const expr = display.value;
  const lastNumber = expr.split(/[+\-×÷]/).pop();
  if (expr === "") return;
  if (lastNumber === "" || lastNumber.includes(".")) return;

  display.value += ".";
};

// 演算子の入力
function inputOperator(op) {
  const value = display.value;
  const lastRaw = value.slice(-1);

  if (value === "0では除算できません") {
    display.value = "0";
    return;
  }

  // 画面表示のx÷を引数で受け取った時にそれを*/で返して内部側で処理
  const toInternal = (c) => {
    if (c === "×") return "*";
    if (c === "÷") return "/";
    return c;
  }
  const last = toInternal(lastRaw);  
  
  // 内部表示の*/を引数で受け取った時にそれをx÷で返して外部側で処理
  const toDisplay = (c) => {
    if (c === "*") return "×";
    if (c === "/") return "÷";
    return c;
  }

  const opForDisplay = toDisplay(op);

  if (display.value === "0" && op === "-") {
    display.value = "-";
    return;
  }

  if ("+-*/".includes(last)) {
    // 押したのが-で直前が-でない時-を符号として許可する、
    if (op === "-" && last !== "-") {
      display.value += "-";
      return;
    }
    //　演算子が連続で押された時に全部を捨てて1つにする処理
    // 6 + - x → 6x
    let trimmed = value;
    while ("+-*/".includes(toInternal(trimmed.slice(-1)))) {
      trimmed = trimmed.slice(0, -1);
    }
    display.value = trimmed + opForDisplay;
    return;
  };

  display.value += opForDisplay;
};

// -(マイナス)の処理 (符号か演算子を判定)
function mergeUnaryMinus(tokens) {
  const result = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const prev = result[result.length - 1];
    const next = tokens[i + 1];
    if (
      t === "-" &&
      next !== undefined && 
      !isNaN(Number(next)) &&
      (i === 0 || ["+", "-", "*", "/"].includes(prev))
    ) {
      result.push("-" + next);
      i++;
    } else {
      result.push(t);
    }
  }
  
  return result;
};

// 演算子*/を優先して計算する処理
function applyMulDiv(tokens) {
  const result = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t === "*" || t === "/"){
    const prev = Number(result.pop());
    const next = Number(tokens[i + 1]);
    
    let calc;
    if (t === "*" ) {
        calc = prev * next;
      } else {
        if (next === 0) {
          display.value = "0では除算できません";
          return null;
        }
        calc = prev / next;
      };

  result.push(String(calc));
    i += 2;
    } else {
      result.push(t);
      i++;
    };

  }
  return result;
};

// =(イコール)押下時の処理
function equal () {
  const exprDisplay = display.value;
  const exprForCalc = exprDisplay.replace(/×/g, "*").replace(/÷/g, "/");
  let tokens = exprForCalc.match(/(\d+(?:\.\d+)?|[+\-*/])/g);

  if (!tokens) return; 
  if (exprDisplay === "0では除算できません") {
    display.value = "0";
    return;
  }
  if (!exprDisplay) return;

  // 末尾が演算子なら、計算せずに何もしない
  const lastChar = exprDisplay.slice(-1); // 末尾1文字だけ取り出す
  if ("+-*/×÷".includes(lastChar)) {
    return;
  }

  tokens = mergeUnaryMinus(tokens);
  tokens = applyMulDiv(tokens);
  // mergeUnaryMinusとapplyMulDiv関数実行後のtokens配列の空列を防止
  if (!tokens) return;

  let result = Number(tokens[0]);

  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const num = Number(tokens[i+1]);
    if (op === "+") {
      result = result + num;  
    } else if (op === "-") {
      result = result - num;
    }
  }

  // 電卓で小数点以下9~10桁を四捨五入し値の誤差を防ぐ
  result = Math.round(result * 1000000000) / 1000000000;
  display.value = result;
};

// Cボタン
function reset() {
  display.value = "0";
};
