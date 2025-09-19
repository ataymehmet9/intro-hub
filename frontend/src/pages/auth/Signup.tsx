import React from "react";

import { PageMeta } from "@components/common";
import SignupForm from "@components/auth/SignupForm";

const Signup = () => {
  return (
    <>
      <PageMeta
        title="IntroHub | SignUp"
        description="Create a new IntroHub account"
      />
      <SignupForm />
    </>
  );
};

export default Signup;

