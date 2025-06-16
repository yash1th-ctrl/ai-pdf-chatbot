import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log("Test Upload: Starting...");

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({
        error: "No file provided"
      }, { status: 400 });
    }

    console.log("Test Upload: File received:", file.name, "Type:", file.type, "Size:", file.size);

    return NextResponse.json({
      success: true,
      message: "File upload test successful",
      fileInfo: {
        name: file.name,
        type: file.type,
        size: file.size
      }
    });

  } catch (error) {
    console.error("Test Upload Error:", error);
    return NextResponse.json({
      error: "Test upload failed",
      details: error.message
    }, { status: 500 });
  }
}
