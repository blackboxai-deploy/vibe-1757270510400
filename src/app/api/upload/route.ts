import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type' }, 
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' }, 
        { status: 400 }
      );
    }

    let extractedText = '';

    if (file.type === 'text/plain') {
      // Handle text files
      extractedText = await file.text();
    } else if (file.type === 'application/pdf') {
      // For PDF files, we would need a PDF parsing library on the server
      // For now, return a placeholder
      extractedText = `PDF processing not yet implemented for server-side. File name: ${file.name}`;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For DOCX files, we would need mammoth.js or similar on the server
      // For now, return a placeholder
      extractedText = `DOCX processing not yet implemented for server-side. File name: ${file.name}`;
    }

    // Process text - remove special characters except parentheses content
    const processedText = extractedText
      .replace(/[^\w\s\(\).,!?;:'"]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return NextResponse.json({
      success: true,
      text: processedText,
      originalLength: extractedText.length,
      processedLength: processedText.length,
      filename: file.name,
      type: file.type,
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' }, 
      { status: 500 }
    );
  }
}