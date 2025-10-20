import React, { useRef, useState } from "react";
import "./inputCode.css";

interface IInputCodeProps {
  length?: number;
  label?: string;
  loading: boolean;
  onComplete: (code: string) => void;
  className?: string;
}
export default function InputCode({
  length = 6,
  label,
  loading,
  onComplete,
  className,
}: IInputCodeProps) {
  const [code, setCode] = useState([...Array(length)].map(() => ""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const processInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    slot: number
  ) => {
    const num = e.target.value;
    if (/[^0-9]/.test(num)) return;
    const newCode = [...code];
    newCode[slot] = num;
    setCode(newCode);

    if (slot !== length - 1) inputs.current[slot + 1]?.focus();
    if (newCode.every((num) => num !== "")) onComplete(newCode.join(""));
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, slot: number) => {
    if (e.key === "Backspace" && !code[slot] && slot !== 0) {
      const newCode = [...code];
      newCode[slot - 1] = "";
      setCode(newCode);
      inputs.current[slot - 1]?.focus();
    }
  };

  return (
    <div className={`code-input ${className}`}>
      {label && <label className="code-label">{label}</label>}
      <div className="code-inputs">
        {code.map((num, idx) => {
          return (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="text-foreground! border-2! border-chart-5!"
              value={num}
              autoFocus={!code[0].length && idx === 0}
              readOnly={loading}
              onChange={(e) => processInput(e, idx)}
              onKeyUp={(e) => onKeyUp(e, idx)}
              ref={(ref) => {
                inputs.current.push(ref);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
