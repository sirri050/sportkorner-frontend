"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const identifier = formData.get("identifier");
  const password = formData.get("password");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    },
  );

  const data = await res.json();

  if (data.error) {
    return { error: data.error.message, success: false };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", data.jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  // Redirecting outside the try/catch or after logic is safer
  redirect("/");
}

export async function getMe() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  if (!token) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // Keep it fresh
        cache: "no-store",
      },
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");
  redirect("/login");
}

export async function registerAction(prevState: any, formData: FormData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  // Basic validation
  if (password !== confirmPassword) {
    return { error: "Passwords do not match", success: false };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    },
  );

  const data = await res.json();

  if (data.error) {
    return { error: data.error.message, success: false };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", data.jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/profile");
}
