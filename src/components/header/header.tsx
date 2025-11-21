import React from "react";
import "./header.css";

interface Props {
  iconLeft?: string;
  iconRight?: string;
  centerText?: string;
  actionIconLeft?: () => void;
  actionIconRight?: () => void;
}

export default function Header({
  iconLeft,
  iconRight,
  centerText,
  actionIconLeft,
  actionIconRight,
}: Props) {
  return (
    <header className="header">
      <div className="header-left" onClick={actionIconLeft}>
        {iconLeft && <img src={iconLeft} alt="left icon" />}
      </div>

      <div className="header-center">{centerText && <h1>{centerText}</h1>}</div>

      <div className="header-right" onClick={actionIconRight}>
        {iconRight && <img src={iconRight} alt="right icon" />}
      </div>
    </header>
  );
}
