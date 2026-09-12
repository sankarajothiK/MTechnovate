Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("$PSScriptRoot\..\client\public\landing_hero_mockup.png")
$cropX = [int]($img.Width * 0.08)
$cropY = [int]($img.Height * 0.04)
$cropWidth = [int]($img.Width * 0.26)
$cropHeight = [int]($img.Height * 0.34)
$cropRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropWidth, $cropHeight
$bitmap = New-Object System.Drawing.Bitmap $cropWidth, $cropHeight
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $cropWidth, $cropHeight), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$bitmap.Save("$PSScriptRoot\..\client\public\mt_official_logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bitmap.Dispose()
$img.Dispose()
Write-Host "Cropped mt_official_logo.png successfully!"
