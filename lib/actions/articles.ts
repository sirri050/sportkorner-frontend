"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import slugify from "slugify";

export async function createCommunityArticle(locale: string, formData: FormData) {
  // 1. Get the Auth Token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  if (!token) {
    throw new Error("Unauthorized: No active session found.");
  }

  // 2. Extract Data from Form
  const title = formData.get("title") as string;
  const rawContent = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const imageFile = formData.get("image") as File;

  // 3. Generate a Unique Slug
  // We add a short random string to prevent 404s if titles are identical
  const randomId = Math.random().toString(36).substring(2, 7);
  const generatedSlug = slugify(title, {
    lower: true,
    strict: true,
    locale: locale === 'ar' ? 'ar' : 'en',
  }) + "-" + randomId;

  // 4. Handle Image Upload to Strapi
  let imageId = null;
  if (imageFile && imageFile.size > 0) {
    const imageFormData = new FormData();
    imageFormData.append("files", imageFile);

    try {
      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`, {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}` 
        },
        body: imageFormData,
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        imageId = uploadData[0].id;
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      // We continue even if image fails, or you can throw error here
    }
  }

  // 5. Transform Plain Text into Strapi Blocks (JSON)
  // This splits the text by new lines so each paragraph becomes a real block
  const contentBlocks = rawContent
    .split(/\n+/) // Split by one or more new lines
    .filter((line) => line.trim() !== "") // Remove empty lines
    .map((line) => ({
      type: "paragraph",
      children: [{ type: "text", text: line.trim() }],
    }));

  // 6. Create the Article Entry in Strapi
  const articleRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        title,
        slug: generatedSlug,
        excerpt: excerpt || rawContent.substring(0, 150) + "...",
        content: contentBlocks,
        coverImage: imageId,
        locale: locale,
        // Removing 'status' to avoid Validation Errors
        // By NOT sending 'publishedAt', Strapi automatically saves this as a DRAFT.
      },
    }),
  });

// ... rest of the function

  // 7. Handle Response and Redirect
  if (articleRes.ok) {
    // Redirect to the articles list with a success message in the URL
    redirect(`/${locale}/articles?status=submitted`);
  } else {
    const errorData = await articleRes.json();
    console.error("Strapi Creation Error:", errorData);
    throw new Error("Failed to create article entry.");
  }
}