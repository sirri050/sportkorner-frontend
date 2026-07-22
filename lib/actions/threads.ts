"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export async function createThreadAction(prevState: any, formData: FormData) {
  const locale = await getLocale(); // Get current language (en or ar)
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  if (!token)
    return {
      error:
        locale === "ar" ? "يجب تسجيل الدخول أولاً" : "You must be logged in.",
    };

  const title = formData.get("title") as string;
  const categoryId = formData.get("category");
  const content = formData.get("content") as string;

  // Bilingual-Friendly Slugify
  // We remove special characters but KEEP Unicode (Arabic/non-Latin) characters
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // \p{L} matches any letter in any alphabet
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // 1. Get current user
  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const me = await meRes.json();

  // 2. Create the Thread with Locale
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/threads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        title,
        slug,
        locale, // IMPORTANT: Saves the thread in the correct language version
        categories: [categoryId],
        author: me.id,
        content: [
          { type: "paragraph", children: [{ type: "text", text: content }] },
        ],
      },
    }),
  });

  const data = await res.json();
  if (data.error) return { error: data.error.message };

  // 3. Revalidate and Redirect (Locale-Aware)
  revalidatePath(`/${locale}`);
  redirect(`/${locale}/thread/${data.data.slug}`);
}

export async function toggleLike(
  threadDocumentId: string,
  currentLikes: number,
) {
  const locale = await getLocale();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/threads/${threadDocumentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            likes: currentLikes + 1,
          },
        }),
      },
    );

    if (!response.ok) throw new Error("Failed to like thread");

    // Revalidate the localized home and category paths
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/category`);

    return { success: true };
  } catch (error) {
    console.error("Like Error:", error);
    return { success: false };
  }
}


export async function replyToThreadAction(formData: any): Promise<{ success: boolean; error?: string }> {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  if (!token) {
    return {
      success: false,
      error: locale === "ar" ? "يجب تسجيل الدخول أولاً" : "You must be logged in.",
    };
  }

  try {
    // 1. Ask Strapi who this token belongs to securely
    const userMeResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userMeResponse.ok) {
      return { success: false, error: "Authentication session invalid." };
    }

    const userData = await userMeResponse.json();
    const userId = userData.id; // This is the verified User ID from Strapi
    // 2. Inject the authoritative user ID safely into the payload
    const completePayload = {
      ...formData,
      thread: formData.thread,
      author: userId, // Attaching the relation field name you set in Strapi
    };

    // 3. Send the full package to Strapi
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/posts?locale=${encodeURIComponent(locale)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: completePayload }),
      },
    );

    const responseText = await response.text();
    console.log("Strapi Post Response:", responseText);

    if (!response.ok) {
      return { success: false, error: locale === "ar" ? "فشل إرسال الرد" : "Failed to send reply" };
    }

    return { success: true };
  } catch (error) {
    console.error("Reply Error:", error);
    return { success: false, error: locale === "ar" ? "فشل إرسال الرد" : "Failed to send reply" };
  }
}