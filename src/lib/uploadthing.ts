import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 10 },
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
