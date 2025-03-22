// ✅ File: app/api/addTool/route.js

import { NextResponse } from "next/server";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

AWS.config.update({ region: "ap-southeast-2" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TOOLS_TABLE = "MyWikiTools";
const REVIEWS_TABLE = "Reviews";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      categories,
      pricing,
      website,
      rating,
      review,
    } = body;

    if (!name || !description || !categories || !website || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const toolId = uuidv4();
    const timestamp = new Date().toISOString();

    // ✅ Save tool
    await dynamoDB
      .put({
        TableName: TOOLS_TABLE,
        Item: {
          toolId,
          name,
          description,
          categories,
          pricing,
          website,
          submittedBy: "Unknown",
          createdAt: timestamp,
        },
      })
      .promise();

    // ✅ Save initial review
    if (review) {
      await dynamoDB
        .put({
          TableName: REVIEWS_TABLE,
          Item: {
            reviewId: `review-${Date.now()}`,
            toolId,
            username: "Anonymous",
            rating,
            comment: review,
            timestamp,
          },
        })
        .promise();
    }

    return NextResponse.json({ message: "Tool added successfully!", toolId }, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding tool:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
