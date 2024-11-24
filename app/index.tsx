import React from "react";
import { Redirect } from "expo-router";
import { setConfig } from "@/business";

setConfig({
  baseURl: process.env.EXPO_PUBLIC_URL,
  apiURl: process.env.EXPO_PUBLIC_API_URL,
});

const App = () => {
  return <Redirect href="/splash" />;
};

export default App;
