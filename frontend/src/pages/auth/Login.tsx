import React from "react";

import { PageMeta } from "@components/common";
import LoginForm from "@components/auth/LoginForm";

const Login = () => {
  return (
    <>
      <PageMeta
        title="IntroHub | SignIn"
        description="Login to your IntroHub account"
      />
      <LoginForm />
    </>
  );
};

export default Login;
