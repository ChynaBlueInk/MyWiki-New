import { NextResponse } from "next/server";
import AWS from "aws-sdk";

AWS.config.update({ region: "ap-southeast-2" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "MyWikiTools";

export async function GET() {
  try {
    console.log("📡 Fetching tools from AWS DynamoDB...");
    
    const params = {
      TableName: TABLE_NAME,
    };

    const data = await dynamoDB.scan(params).promise();
    
    if (!data.Items) {
      return NextResponse.json([], { status: 200 });
    }

    console.log("✅ Tools retrieved:", data.Items);
    return NextResponse.json(data.Items, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching tools:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
