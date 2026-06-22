"use client";

import React, { useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Box, Button, Stack, Typography, TextField, IconButton } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { loginFormInitialValues, loginFormValidationSchema } from "../authForm.utils";
import { handleUserLogin } from "../services/authForm.service";

import { LOCAL_STORE } from "@/constants/key";
import { REDIRECT_ROUTE } from "@/constants/data";
import { UserStoreUserType } from "@/type/common.types";
import { handleSaveCookieToken, handleSaveCookieUser } from "@/utils/cookie.util";
import { LoginFormType } from "../authForm.types";


const AuthLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: LoginFormType, { resetForm }: { resetForm: () => void }) => {
    try {
      setIsLoading(true)
      const res = await handleUserLogin(values);
      if (res.success && res?.token) {
        localStorage.setItem(LOCAL_STORE.LOCAL_USER, res?.token);
        const decoded = jwt.decode(res?.token) as { user: UserStoreUserType };

        console.log("type", decoded)

        handleSaveCookieToken(res?.token);
        handleSaveCookieUser(JSON.stringify(decoded.user));

        toast.success("Login successful", { position: "bottom-center", autoClose: 2000 });

        router.push(REDIRECT_ROUTE[decoded.user.type] || "/admin/leads");
        resetForm();
        setIsLoading(false)

      } else {
        toast.error("Login failed. Please check your credentials.", { position: "bottom-center", autoClose: 2000 });
        resetForm();
        setIsLoading(false)

      }
    } catch (error) {
      setIsLoading(false)
    }
  };

  return (
    <Box>
      <div className="w-full max-w-xl mx-auto md:mx-0">
        <Formik
          initialValues={loginFormInitialValues}
          validationSchema={loginFormValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors }) => (
            <Form>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="id_number" mb="5px">
                    Email
                  </Typography>
                  <Field
                    as={TextField}
                    name="email"
                    type="text"
                    variant="outlined"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    error={Boolean(errors.email)}
                    helperText={<ErrorMessage name="email" />}
                    disabled={isLoading}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px">
                    Password
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Field
                      as={TextField}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      error={Boolean(errors.password)}
                      helperText={<ErrorMessage name="password" />}
                      disabled={isLoading}
                    />
                    <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Box>
                </Box>
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  type="submit"
                  sx={{
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Sign In"}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </div>
      <ToastContainer />
    </Box>
  );
};

export default AuthLogin;