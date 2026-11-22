Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Starting Stitchlyn Microservices Stack  " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$services = @(
    @{ Name = "API Gateway"; Path = "services\api-gateway"; Port = 5001 },
    @{ Name = "Auth Service"; Path = "services\auth-service"; Port = 5002 },
    @{ Name = "Product Service"; Path = "services\product-service"; Port = 5003 },
    @{ Name = "Cart Service"; Path = "services\cart-service"; Port = 5004 },
    @{ Name = "Order Service"; Path = "services\order-service"; Port = 5005 }
)

foreach ($svc in $services) {
    Write-Host "Launching $($svc.Name) on port $($svc.Port)..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$($svc.Path)'; npm run dev"
}

Write-Host "All 5 backend microservices launched!" -ForegroundColor Yellow
Write-Host "Gateway URL: http://localhost:5001" -ForegroundColor Yellow
Write-Host "Health Check: http://localhost:5001/health" -ForegroundColor Yellow

