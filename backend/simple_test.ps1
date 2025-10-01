$body = @{
    name = 'Test Customer'
    email = 'test@example.com'
    number = '1234567890'
} | ConvertTo-Json

Write-Host "Testing API connectivity..."
Write-Host "Body: $body"

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/customers' -Method POST -Body $body -ContentType 'application/json'
    Write-Host "✅ SUCCESS: Customer created successfully!"
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)"
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)"
    }
}