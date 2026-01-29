@echo off
echo 正在启动梦境宇宙本地服务器...
echo 请稍候...
echo.

:: 尝试使用 Python
python -m http.server 8080 >nul 2>&1
if %errorlevel% == 0 (
    echo 服务器已启动: http://localhost:8080
    start http://localhost:8080
    pause
    exit
)

:: 尝试使用 PHP
php -S localhost:8080 >nul 2>&1
if %errorlevel% == 0 (
    echo 服务器已启动: http://localhost:8080
    start http://localhost:8080
    pause
    exit
)

echo 无法自动启动服务器，请手动安装 Python 或使用 VS Code Live Server
echo.
pause
