import React from "react";
import { Redirect } from "expo-router";
import { store } from "@/business/store/redux/store";
import { Provider } from "react-redux";

const App = () => {
  return <Redirect href="/splash" />;
};

export default App;
