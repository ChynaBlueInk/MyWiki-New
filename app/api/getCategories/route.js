export const dynamic = "force-dynamic";
import AWS from "aws-sdk";

AWS.config.update({ region: "ap-southeast-2" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Category"; // ✅ Using the correct table

export async function GET() {
  try {
    console.log("📡 Fetching categories from AWS DynamoDB...");

    // ✅ Fetch categories from the "Category" table
    const params = { TableName: TABLE_NAME };
    const { Items } = await dynamoDB.scan(params).promise();

    if (!Items || Items.length === 0) {
      console.log("⚠️ No categories found in AWS.");
      return new Response(JSON.stringify([]), { 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // ✅ Ensure correct attribute name (`CategoryName`)
    const categories = Items.map((item) => item.CategoryName.trim());

    console.log("✅ Categories retrieved:", categories);

    return new Response(JSON.stringify(categories), { 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch categories" }), { 
      status: 500 
    });
  }
}
