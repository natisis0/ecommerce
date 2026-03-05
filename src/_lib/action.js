"use server";

import { signIn, signUp } from "./auth";


export async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await signIn({ email, password });
  } catch (error) {
    return { error: error.message, email };
  }

 
  return { success: true };
}

export async function signupAction(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", name, email };
  }

  try {
    await signUp({ email, password, name });
  } catch (error) {
    return { error: error.message, name, email };
  }

  return { success: true };
}
