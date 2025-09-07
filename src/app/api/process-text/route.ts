import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' }, 
        { status: 400 }
      );
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum length is 50,000 characters' }, 
        { status: 400 }
      );
    }

    // Smart text processing - preserve content in parentheses, filter special characters
    const processedText = text
      // Remove most special characters but keep basic punctuation and parentheses
      .replace(/[^\w\s\(\).,!?;:'"]/g, ' ')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();

    // Extract parentheses content for analysis
    const parenthesesContent = text.match(/\([^)]*\)/g) || [];
    
    // Count filtered characters
    const originalLength = text.length;
    const processedLength = processedText.length;
    const filteredCharacters = originalLength - processedLength;

    // Analyze text for TTS optimization
    const wordCount = processedText.split(' ').filter(Boolean).length;
    const sentenceCount = processedText.split(/[.!?]+/).filter(Boolean).length;
    const avgWordsPerSentence = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;

    // Estimate reading time (average 150 words per minute for TTS)
    const estimatedDuration = Math.ceil(wordCount / 150 * 60); // in seconds

    return NextResponse.json({
      success: true,
      originalText: text,
      processedText: processedText,
      metadata: {
        originalLength,
        processedLength,
        filteredCharacters,
        wordCount,
        sentenceCount,
        avgWordsPerSentence,
        estimatedDuration,
        parenthesesContent: parenthesesContent.length,
      },
      recommendations: {
        ttsReadyness: processedText.length > 0 ? 'ready' : 'empty',
        complexity: avgWordsPerSentence > 20 ? 'high' : avgWordsPerSentence > 10 ? 'medium' : 'low',
        suggestedRate: avgWordsPerSentence > 20 ? 0.8 : avgWordsPerSentence < 8 ? 1.2 : 1.0,
      }
    });

  } catch (error) {
    console.error('Text processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process text' }, 
      { status: 500 }
    );
  }
}