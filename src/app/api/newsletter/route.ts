import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const NewsletterSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  list: z.string(),
});

export async function POST(request: NextRequest) {
  const req = await request.json();
  const { name, email, list } = NewsletterSchema.parse(req);
  const formData = new FormData();
  formData.append("email", email);
  formData.append("list", list);
  formData.append("subform", "yes");
  formData.append("boolean", "true");
  if (name) formData.append("name", name);

  const response = await axios.post(
    "https://mail.wielded.com/subscribe",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return NextResponse.json({
    email,
    success: response.data === 1,
    error: response.data === 1 ? undefined : response.data,
  });
}
