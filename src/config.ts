export const config = {
  deploymentUrl:
    process.env.NEXT_PUBLIC_API_DEPLOYMENT_URL || "http://localhost:3000",
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  wisp: {
    blogId: process.env.NEXT_PUBLIC_WISP_BLOG_ID || "clvxv39ma00002zbc7j4heyj1",
  },
};
