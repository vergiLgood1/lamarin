import { ourFileRouter } from "@/lib/uploadthing";
import { createRouteHandler } from "uploadthing/next";

// export const runtime = "nodejs";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    callbackUrl: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/uploadthing`,
  },
});
