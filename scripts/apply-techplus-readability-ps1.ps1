# Mirrors scripts/techplus-pdf-fixes.mjs for environments without Node.
# Run: powershell -File scripts/apply-techplus-readability-ps1.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$dirs = @(
  (Join-Path $root "content\techplus-chapters")
  "f:\TechPlus_Lessons"
)

# (from, to) — order: longer phrases before shorter substrings where needed
$pairs = @(
  @("Android quick set tings", "Android quick settings")
  @("iPhone Set tings", "iPhone Settings")
  @("Android Set tings", "Android Settings")
  @("iOS Set tings", "iOS Settings")
  @("Set tings", "Settings")
  @("end user' s", "end user's")
  @("manufacturer' s", "manufacturer's")
  @("website' s", "website's")
  @("network' s", "network's")
  @("customer' s", "customer's")
  @("computer' s", "computer's")
  @("Intel' s", "Intel's")
  @("HP' s", "HP's")
  @("wouldn' t", "wouldn't")
  @("couldn' t", "couldn't")
  @("shouldn' t", "shouldn't")
  @("doesn' t", "doesn't")
  @("haven' t", "haven't")
  @("hasn' t", "hasn't")
  @("hadn' t", "hadn't")
  @("wasn' t", "wasn't")
  @("weren' t", "weren't")
  @("isn' t", "isn't")
  @("aren' t", "aren't")
  @("didn' t", "didn't")
  @("don' t", "don't")
  @("Don' t", "Don't")
  @("won' t", "won't")
  @("can' t", "can't")
  @("it' s", "it's")
  @("It' s", "It's")
  @("that' s", "that's")
  @("That' s", "That's")
  @("there' s", "there's")
  @("There' s", "There's")
  @("here' s", "here's")
  @("Here' s", "Here's")
  @("what' s", "what's")
  @("What' s", "What's")
  @("Let' s", "Let's")
  @("USB- C", "USB-C")
  @("Wi- Fi", "Wi-Fi")
  @("A C power", "AC power")
  @("touc hpad", "touchpad")
  @("Bluetoothenabled", "Bluetooth-enabled")
  @("Computing Devicesand", "Computing Devices and")
  @("Self- Service ", "Self-Service ")
  @("third- party", "third-party")
  @("dotted- decimal", "dotted-decimal")
  @("inser tion", "insertion")
  @("Point stic k", "Point stick")
  @("Por trait", "Portrait")
  @("P asscode", "Passcode")
  @("Screen loc k", "Screen lock")
  @("K- loc k", "K-lock")
  @("loc k type", "lock type")
  @("set tings", "settings")
)

function Repair-TechPlusReadabilityText([string]$t) {
  foreach ($p in $pairs) {
    $t = $t.Replace($p[0], $p[1])
  }
  return $t
}

foreach ($dir in $dirs) {
  if (-not (Test-Path $dir)) { continue }
  Get-ChildItem $dir -Filter "*.md" | ForEach-Object {
    $raw = [System.IO.File]::ReadAllText($_.FullName)
    $after = Repair-TechPlusReadabilityText $raw
    if ($after -ne $raw) {
      [System.IO.File]::WriteAllText($_.FullName, $after)
      Write-Host "updated $($_.Name)"
    }
  }
}
Write-Host "done."
