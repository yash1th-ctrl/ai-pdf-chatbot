# PowerShell Script to Test PDF File for AI PDF Chatbot
# Run this script to verify your PDF file before uploading

$pdfPath = "C:\Users\Yashwanth Peralta\OneDrive\Desktop\samp.pdf"

Write-Host "🧪 AI PDF Chatbot - File Testing Script" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if file exists
Write-Host "📁 Test 1: File Existence Check" -ForegroundColor Yellow
if (Test-Path $pdfPath) {
    Write-Host "✅ File exists at: $pdfPath" -ForegroundColor Green
} else {
    Write-Host "❌ File NOT found at: $pdfPath" -ForegroundColor Red
    Write-Host "Please check the file path and try again." -ForegroundColor Red
    exit 1
}

# Test 2: Get file properties
Write-Host ""
Write-Host "📊 Test 2: File Properties" -ForegroundColor Yellow
try {
    $fileInfo = Get-ItemProperty $pdfPath
    $fileSizeBytes = $fileInfo.Length
    $fileSizeMB = [math]::Round($fileSizeBytes / 1MB, 2)
    
    Write-Host "✅ File Size: $fileSizeBytes bytes ($fileSizeMB MB)" -ForegroundColor Green
    Write-Host "✅ Created: $($fileInfo.CreationTime)" -ForegroundColor Green
    Write-Host "✅ Modified: $($fileInfo.LastWriteTime)" -ForegroundColor Green
    
    # Check size limit
    if ($fileSizeMB -gt 5) {
        Write-Host "⚠️  WARNING: File size ($fileSizeMB MB) exceeds 5MB limit!" -ForegroundColor Red
        Write-Host "   The upload may fail. Consider using a smaller PDF." -ForegroundColor Red
    } else {
        Write-Host "✅ File size is within 5MB limit" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error getting file properties: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Check file accessibility
Write-Host ""
Write-Host "🔐 Test 3: File Accessibility" -ForegroundColor Yellow
try {
    $fileStream = [System.IO.File]::OpenRead($pdfPath)
    $fileStream.Close()
    Write-Host "✅ File is readable and accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ File access error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   File may be locked, corrupted, or have permission issues." -ForegroundColor Red
}

# Test 4: Verify PDF format
Write-Host ""
Write-Host "📄 Test 4: PDF Format Verification" -ForegroundColor Yellow
try {
    $bytes = [System.IO.File]::ReadAllBytes($pdfPath)
    $header = [System.Text.Encoding]::ASCII.GetString($bytes[0..3])
    
    if ($header -eq "%PDF") {
        Write-Host "✅ Valid PDF file format detected" -ForegroundColor Green
        
        # Try to read PDF version
        $versionBytes = [System.Text.Encoding]::ASCII.GetString($bytes[0..7])
        Write-Host "✅ PDF Header: $versionBytes" -ForegroundColor Green
    } else {
        Write-Host "❌ Invalid PDF format - header: $header" -ForegroundColor Red
        Write-Host "   This file may not be a valid PDF." -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error reading PDF format: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Check for password protection (basic check)
Write-Host ""
Write-Host "🔒 Test 5: Password Protection Check" -ForegroundColor Yellow
try {
    $content = [System.IO.File]::ReadAllText($pdfPath, [System.Text.Encoding]::ASCII)
    if ($content -match "/Encrypt") {
        Write-Host "⚠️  WARNING: PDF may be password protected or encrypted" -ForegroundColor Red
        Write-Host "   Encrypted PDFs cannot be processed by the chatbot." -ForegroundColor Red
    } else {
        Write-Host "✅ PDF appears to be unencrypted" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not check encryption status" -ForegroundColor Yellow
}

# Summary and next steps
Write-Host ""
Write-Host "📋 Summary & Next Steps" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If all tests passed ✅, you can proceed with uploading to the chatbot:" -ForegroundColor Green
Write-Host "1. Open your browser and go to: http://localhost:3001/dashboard" -ForegroundColor White
Write-Host "2. Sign in with your Google account" -ForegroundColor White
Write-Host "3. Click 'Upload PDF File' button" -ForegroundColor White
Write-Host "4. Select the file: $pdfPath" -ForegroundColor White
Write-Host "5. Enter a descriptive filename" -ForegroundColor White
Write-Host "6. Click 'Upload' and wait for processing" -ForegroundColor White
Write-Host ""
Write-Host "Expected processing time: 15-45 seconds" -ForegroundColor Yellow
Write-Host "Watch browser console for detailed processing logs" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎯 Test Questions to Try After Upload:" -ForegroundColor Cyan
Write-Host "- 'Summarize this document'" -ForegroundColor White
Write-Host "- 'What is this document about?'" -ForegroundColor White
Write-Host "- 'What are the main points?'" -ForegroundColor White
Write-Host "- Ask specific questions about content you know is in the PDF" -ForegroundColor White
Write-Host ""
Write-Host "Happy testing! 🚀" -ForegroundColor Green
