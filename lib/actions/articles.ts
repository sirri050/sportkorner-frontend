"use server";

import { cookies } from "next/headers";
import slugify from "slugify";

export type CreateArticleState = {
  success: boolean;
  message: string;
};

export async function createCommunityArticle(
  locale: string,
  prevState: CreateArticleState,
  formData: FormData,
): Promise<CreateArticleState> {
  let shouldRedirect = false;
  try {
    // Get auth token
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login again.",
      };
    }

    // Form values
    const title = formData.get("title") as string;
    const rawContent = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const imageFile = formData.get("image") as File;

    // Generate slug
    const randomId = Math.random().toString(36).substring(2, 7);

    const generatedSlug =
      slugify(title, {
        lower: true,
        strict: true,
        locale: locale === "ar" ? "ar" : "en",
      }) +
      "-" +
      randomId;

    // Upload image
    let imageId = null;

    if (imageFile && imageFile.size > 0) {
      const imageFormData = new FormData();
      imageFormData.append("files", imageFile);

      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imageFormData,
        },
      );

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        console.log("image upload failed", err);
        return {
          success: false,
          message: err?.error?.message ?? "Failed to upload image.",
        };
      }

      const uploadData = await uploadRes.json();
      console.log("image res", uploadData)
      imageId = uploadData[0].id;
    }

    // Convert content into Strapi blocks
    const contentBlocks = rawContent
      .split(/\n+/)
      .filter((line) => line.trim() !== "")
      .map((line) => ({
        type: "paragraph",
        children: [
          {
            type: "text",
            text: line.trim(),
          },
        ],
      }));

    // Create article
    const articleRes = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles`,
      {
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
            locale,
          },
        }),
      },
    );

    if (!articleRes.ok) {
      const errorData = await articleRes.json();
      console.log("article upload failed", errorData);
      return {
        success: false,
        message: errorData?.error?.message ?? "Failed to create article.",
      };
    }

    return {
      success: true,
      message: "Article created successfully",
    };
  } catch (err) {
    console.error("final error: ", err);

    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong.",
    };
  }
}
