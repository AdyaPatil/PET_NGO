import React, { createContext, useEffect, useState } from "react";


const LoginContext = createContext();

const LoginState = (props) => {


  const sUserId = sessionStorage.getItem("userId");
  const sToken = sessionStorage.getItem("token");

  const [isLogedIn, setIsLogedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const logOut = () => {
    setIsLogedIn(false);
    setUserId(null);
    setToken(null);
    sessionStorage.clear();
  };

  useEffect(() => {
    if (sUserId && sToken) {
      setUserId(sUserId);
      setToken(sToken);
      setIsLogedIn(true);
    }
  }, [sToken]);

  return (
    <LoginContext.Provider
      value={{
        isLogedIn,
        setIsLogedIn,
        userId,
        setUserId,
        token,
        setToken,
        logOut,
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
};
export { LoginContext, LoginState };
