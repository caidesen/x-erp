import React, { useState } from "react";
import "./App.css";
import { routes } from "@/route";
import { useRoutes } from "react-router-dom";
import { TRPCProvider } from "@/shared";

function App() {
  return <>{useRoutes(routes)}</>;
}

export default App;
