Add-Type -AssemblyName System.Drawing

$public = Join-Path $PSScriptRoot '..\public' | Resolve-Path
$teal = [System.Drawing.ColorTranslator]::FromHtml('#0D9488')
$cream = [System.Drawing.ColorTranslator]::FromHtml('#F0FDFA')
$orange = [System.Drawing.ColorTranslator]::FromHtml('#FB923C')

function New-RoundedPath([single]$x, [single]$y, [single]$w, [single]$h, [single]$r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-Glyph($g, [double]$ox, [double]$oy, [double]$s) {
  $pen = New-Object System.Drawing.Pen($cream, [single](6 * $s))
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $g.DrawLine($pen, [single]($ox + 19 * $s), [single]($oy + 17 * $s), [single]($ox + 19 * $s), [single]($oy + 47 * $s))
  $g.DrawLine($pen, [single]($ox + 37 * $s), [single]($oy + 17 * $s), [single]($ox + 37 * $s), [single]($oy + 47 * $s))
  $g.DrawLine($pen, [single]($ox + 19 * $s), [single]($oy + 32 * $s), [single]($ox + 37 * $s), [single]($oy + 32 * $s))
  $pen.Dispose()

  $brush = New-Object System.Drawing.SolidBrush($orange)
  $g.FillEllipse($brush, [single]($ox + 44 * $s), [single]($oy + 41 * $s), [single](10 * $s), [single](10 * $s))
  $brush.Dispose()
}

function New-Icon([int]$size, [string]$path, [string]$mode) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::Transparent)

  $brush = New-Object System.Drawing.SolidBrush($teal)

  if ($mode -eq 'any') {
    $radius = [single]($size * 0.22)
    $pathShape = New-RoundedPath 0 0 $size $size $radius
    $g.FillPath($brush, $pathShape)
    $pathShape.Dispose()
    $scale = $size / 64.0
    Draw-Glyph $g 0 0 $scale
  } else {
    $g.FillRectangle($brush, 0, 0, $size, $size)
    $scale = ($size / 64.0) * 0.72
    $ox = $size / 2.0 - 36 * $scale
    $oy = $size / 2.0 - 33.5 * $scale
    Draw-Glyph $g $ox $oy $scale
  }

  $brush.Dispose()
  $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output "saved $path"
}

New-Icon 192 (Join-Path $public 'pwa-192.png') 'any'
New-Icon 512 (Join-Path $public 'pwa-512.png') 'any'
New-Icon 512 (Join-Path $public 'pwa-maskable-512.png') 'maskable'
New-Icon 180 (Join-Path $public 'apple-touch-icon.png') 'maskable'
