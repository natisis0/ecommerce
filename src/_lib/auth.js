import { createClient } from "./supabase-server";

export async function signIn({ email, password }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signUp({ email, password, name }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName: name,
      },
    },
  });

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  return data;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data?.user;
}
