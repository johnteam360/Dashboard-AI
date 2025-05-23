@echo off
echo.
echo ========================================
echo  DASHBOARD JOHNTEAM - INSTALACION
echo ========================================
echo.

echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado
    echo 📥 Instala Node.js desde: https://nodejs.org
    pause
    exit /b 1
) else (
    echo ✅ Node.js detectado
)

echo.
echo [2/3] Instalando dependencias...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
) else (
    echo ✅ Dependencias instaladas correctamente
)

echo.
echo [3/3] Iniciando servidor de desarrollo...
echo.
echo 🚀 El dashboard se abrirá en: http://localhost:5173
echo 📧 Usuario demo: admin@demo.com
echo 🔑 Password: cualquier texto
echo.
echo ⏹️  Para detener el servidor: Ctrl + C
echo.

call npm run dev

pause 