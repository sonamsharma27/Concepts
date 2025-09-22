import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [input, setInput] = useState("0");
  const [isDotAllowded, setIsDotAllowed] = useState(true);
  const isOperator = (op) => {
    const regex = /[+\-/%*]/;
    return regex.test(op);
  };

  const handleInputChange = (val) => {
    const lastChar = input[input.length - 1];
    //two operators cant be consecutive
    if (isOperator(val) && isOperator(lastChar)) return;
    if (!isDotAllowded && val === ".") return;
    if (val === ".") {
      setIsDotAllowed(false);
    }
    if (isOperator(val)) {
      setIsDotAllowed(true);
    }
    setInput((prev) => {
      if (input === "0" && !isOperator(val)) {
        return val;
      } else {
        return prev + val;
      }
    });
  };

  const calculateResult = () => {
    if (input.length === 0 || isOperator(input[input.length - 1])) {
      return;
    }
    try {
      const res = eval(input).toString();
      setInput(res);
      if (res.includes(".")) {
        setIsDotAllowed(false);
      } else {
        setIsDotAllowed(true);
      }
    } catch (err) {
      console.log(err);
      alert("Invalid input");
      setInput("0");
    }
  };
  const buttons = [
    {
      label: input === "0" ? "AC" : "X",
      action: () => {
        if (input.length > 0) {
          const lastChar = input[input.length - 1];
          if (lastChar === ".") {
            setIsDotAllowed(true);
          }
          setInput(input.slice(0, input.length - 1));
        }
      },
    },
    {
      label: "+/-",
      action: () => {},
    },
    {
      label: "%",
      action: () => {},
    },
    {
      label: "/",
      action: () => handleInputChange("/"),
    },
    {
      label: "7",
      action: () => handleInputChange("7"),
    },
    {
      label: "8",
      action: () => handleInputChange("8"),
    },
    {
      label: "9",
      action: () => handleInputChange("9"),
    },
    {
      label: "x",
      action: () => handleInputChange("*"),
    },
    {
      label: "4",
      action: () => handleInputChange("4"),
    },
    {
      label: "5",
      action: () => handleInputChange("5"),
    },
    {
      label: "6",
      action: () => handleInputChange("6"),
    },
    {
      label: "-",
      action: () => handleInputChange("-"),
    },
    {
      label: "1",
      action: () => handleInputChange("1"),
    },
    {
      label: "2",
      action: () => handleInputChange("2"),
    },
    {
      label: "3",
      action: () => handleInputChange("3"),
    },
    {
      label: "+",
      action: () => handleInputChange("+"),
    },
    {
      label: "R",
      action: () => {
        setInput("");
      },
    },
    {
      label: "0",
      action: () => handleInputChange("0"),
    },
    {
      label: ".",
      action: () => handleInputChange("."),
    },
    {
      label: "=",
      action: () => calculateResult(),
    },
  ];
  useEffect(() => {
    if (input.length === 0) {
      setInput("0");
    }
  }, [input]);
  return (
    <div className="App">
      <div className="input">
        <input value={input} />
      </div>
      <div className="keypad">
        {buttons.map((button, index) => (
          <button
            key={button.label}
            onClick={button.action}
            className={index % 4 === 3 ? "orange" : ""}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
