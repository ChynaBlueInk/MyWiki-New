export async function GET() {
    console.log("✅ API `/api/testApi` reached");
    return Response.json({ message: "API is working!" });
  }
  