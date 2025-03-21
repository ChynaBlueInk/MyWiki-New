import { NextResponse } from "next/server";
import AWS from "aws-sdk";

AWS.config.update({ region: "ap-southeast-2" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TOOLS_TABLE = process.env.AWS_TABLE_NAME || "MyWikiTools"; // ✅ Ensure correct table
const CATEGORY_TABLE = "Category"; // ✅ Ensure this matches AWS table name

export async function PUT(req) {
  try {
    console.log("🛠️ UPDATE Request Received");

    // ✅ Parse API request URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL || req.headers.get("origin") || "http://localhost:3000";
    const { searchParams } = new URL(req.url, API_URL);
        const toolId = searchParams.get("id");

    if (!toolId) {
      console.log("❌ ERROR: Missing Tool ID");
      return NextResponse.json({ error: "Tool ID is required" }, { status: 400 });
    }

    console.log(`🔍 Checking if tool exists in database: ${toolId}`);

    // ✅ Check if the tool exists before updating
    const checkParams = {
      TableName: TOOLS_TABLE,
      Key: { toolId },
    };

    const checkResult = await dynamoDB.get(checkParams).promise();
    if (!checkResult.Item) {
      console.log(`⚠️ ERROR: Tool not found in database: ${toolId}`);
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    // ✅ Parse request body
    const body = await req.json();
    console.log(`✏️ Updating tool ${toolId} with:`, body);

    if (!body || Object.keys(body).length === 0) {
      console.log("❌ ERROR: No valid fields provided for update.");
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    // ✅ Extract categories
    const newCategories = body.categories || [];
    console.log("🔍 Categories to update:", newCategories);

    // ✅ Get existing categories from the `Category` table
    const existingCategories = await dynamoDB.scan({ TableName: CATEGORY_TABLE }).promise();
    const existingCategoryNames = existingCategories.Items ? existingCategories.Items.map(item => item.CategoryName) : [];

    // ✅ Filter out categories that are new
    const categoriesToAdd = newCategories.filter(category => !existingCategoryNames.includes(category));

    console.log("➕ New categories to add:", categoriesToAdd);

    // ✅ Add new categories to the `Category` table
    for (const category of categoriesToAdd) {
      const addCategoryParams = {
        TableName: CATEGORY_TABLE,
        Item: { CategoryName: category },
      };
      await dynamoDB.put(addCategoryParams).promise();
      console.log(`✅ Added new category to AWS: ${category}`);
    }

    // ✅ Update the tool in the `MyWikiTools` table
    let updateExpression = "set ";
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};

    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && key !== "toolId") {
        const attrName = `#${key}`;
        const attrValue = `:${key}`;
        updateExpression += `${attrName} = ${attrValue}, `;
        expressionAttributeNames[attrName] = key;
        expressionAttributeValues[attrValue] = value;
      }
    });

    updateExpression = updateExpression.slice(0, -2); // ✅ Remove trailing comma

    const updateParams = {
      TableName: TOOLS_TABLE,
      Key: { toolId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };

    console.log("🔄 Sending Update Request to DynamoDB...");
    const updatedTool = await dynamoDB.update(updateParams).promise();

    if (!updatedTool.Attributes) {
      console.log("⚠️ ERROR: Update operation succeeded but returned no attributes.");
      return NextResponse.json({ error: "Update failed, no attributes returned" }, { status: 500 });
    }

    console.log("✅ Tool updated successfully:", updatedTool.Attributes);
    return NextResponse.json(updatedTool.Attributes, { status: 200 });

  } catch (error) {
    console.error("❌ ERROR Updating Tool:", error);
    return NextResponse.json({ error: "Failed to update tool", details: error.message }, { status: 500 });
  }
}
