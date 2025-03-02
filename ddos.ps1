$serverUrl = "https://localhost:5000/log";
$endTime = (Get-Date).AddSeconds(10);  # Runs for 10 seconds
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::Tls12;
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true};

$lastRPS = Get-Random -Minimum 4 -Maximum 10  # Start with a random RPS between 4-10

while ((Get-Date) -lt $endTime) {
    # Adjust RPS dynamically within the range (fluctuate up & down)
    $change = Get-Random -Minimum -2 -Maximum 2  # Random increase or decrease by 0-2
    $newRPS = [math]::Max(4, [math]::Min(10, $lastRPS + $change))  # Keep RPS in 4-10 range
    $lastRPS = $newRPS  # Update lastRPS for next iteration

    1..$newRPS | ForEach-Object {
        try {
            $timestamp = Get-Date -Format "o";
            $body = @{ ip = "127.0.0.1"; timestamp = $timestamp } | ConvertTo-Json;
            Invoke-WebRequest -Uri $serverUrl -Method Post -Body $body -ContentType "application/json" -UseBasicParsing -ErrorAction Stop;
        } catch {
            Write-Host "Error sending request: $($_.Exception.Message)";
        }
    }
   Start-Sleep -Milliseconds 100;
};

[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$null};
