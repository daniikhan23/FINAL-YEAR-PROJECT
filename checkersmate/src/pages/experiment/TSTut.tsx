import * as React from "react";
import { useState } from "react";
// import "../../css/tic-tac-toe.css";
// import Navbar from "../../components/navbar/Navbar";

interface MyButtonProps {
  title: string;
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return <button disabled={disabled}>{title}</button>;
}

export default function TSTut() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="This is a button" disabled={true} />
    </div>
  );
}
