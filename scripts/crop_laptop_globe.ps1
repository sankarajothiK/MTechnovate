Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("$PSScriptRoot\..\client\public\landing_hero_mockup.png")
$cropX = [int]($img.Width * 0.44)
$cropWidth = $img.Width - $cropX
$cropRect = New-Object System.Drawing.Rectangle $cropX, 0, $cropWidth, $img.Height
$bitmap = New-Object System.Drawing.Bitmap $cropWidth, $img.Height
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $cropWidth, $img.Height), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$bitmap.Save("$PSScriptRoot\..\client\public\hero_laptop_globe.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bitmap.Dispose()
$img.Dispose()
Write-Host "Cropped hero_laptop_globe.png successfully!"
