Add-Type -AssemblyName System.Drawing

$srcPath = "$PSScriptRoot\..\client\public\hero_showcase.png"
$dstPath = "$PSScriptRoot\..\client\public\hero_pedestal.png"

$img = [System.Drawing.Bitmap]::FromFile($srcPath)

# The 3D emblem with pedestal is on the right side
# Image is 1024 x 682
# Crop rectangle: x=420, y=70, width=580, height=450
$rect = New-Object System.Drawing.Rectangle(430, 80, 560, 440)
$cropped = $img.Clone($rect, $img.PixelFormat)

$cropped.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)

$cropped.Dispose()
$img.Dispose()

Write-Output "Successfully cropped pedestal emblem to client/public/hero_pedestal.png"
