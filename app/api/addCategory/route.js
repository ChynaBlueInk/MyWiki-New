import AWS from "aws-sdk";

AWS.config.update({ region: "ap-southeast-2" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Category"; // Ensure this matches your AWS table name

export async function POST(req) {
  try {
    const { name } = await req.json();
    console.log("📥 Received category name:", name);

    if (!name) {
      return new Response(JSON.stringify({ error: "Category name is required" }), { status: 400 });
    }

    // ✅ Fix: Correctly check for existing category using scan & filter
    const checkParams = {
      TableName: TABLE_NAME,
      FilterExpression: "CategoryName = :name",
      ExpressionAttributeValues: { ":name": name }
    };

    const existingCategory = await dynamoDB.scan(checkParams).promise();
    if (existingCategory.Items.length > 0) {
      return new Response(JSON.stringify({ error: "Category already exists" }), { status: 400 });
    }

    // ✅ Fix: Ensure consistent category object
    const params = {
      TableName: TABLE_NAME,
      Item: {
        CategoryName: name.trim(),
        CreatedAt: new Date().toISOString(),
      },
    };

    await dynamoDB.put(params).promise();
    console.log("✅ Category added:", name);

    return new Response(JSON.stringify({ message: "Category added successfully" }), { status: 200 });
  } catch (error) {
    console.error("❌ Error adding category:", error);
    return new Response(JSON.stringify({ error: "Failed to add category" }), { status: 500 });
  }
}
