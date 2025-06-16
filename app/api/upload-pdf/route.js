import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(process.cwd(), 'public', 'uploads', filename);

    // Ensure uploads directory exists
    try {
      await writeFile(filepath, buffer);
    } catch (error) {
      console.error("File write error:", error);
      // If we can't write to file system, return the blob URL approach
      return NextResponse.json({ 
        error: "File upload not available, using direct processing",
        useBlob: true 
      }, { status: 200 });
    }

    // Return the public URL
    const url = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      url: url,
      filename: filename,
      size: file.size 
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Upload failed",
      useBlob: true 
    }, { status: 200 });
  }
}
