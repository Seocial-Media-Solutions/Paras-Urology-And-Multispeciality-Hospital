# 🚀 Quick Start - Running with Docker

## Current Status: Docker Not Installed ❌

You tried to run `docker` but got this error:
```
docker : The term 'docker' is not recognized
```

This means Docker Desktop is not installed on your Windows system.

---

## 📥 Install Docker Desktop (One-Time Setup)

### Step-by-Step:

**1️⃣ Download**
   - Open your browser
   - Go to: https://www.docker.com/products/docker-desktop/
   - Click the blue "Download for Windows" button
   - Wait for `Docker Desktop Installer.exe` to download

**2️⃣ Install**
   - Double-click the downloaded installer
   - When asked, choose "Use WSL 2 instead of Hyper-V"
   - Click "OK" and wait for installation
   - Click "Close and restart" when done

**3️⃣ Restart**
   - Your computer will restart
   - This is required for Docker to work properly

**4️⃣ Launch Docker**
   - After restart, find "Docker Desktop" in your Start menu
   - Click to launch it
   - Wait for the Docker whale icon to appear in your system tray (bottom-right)
   - When the whale stops animating, Docker is ready!

**5️⃣ Verify**
   - Open PowerShell
   - Type: `docker --version`
   - Press Enter
   - You should see something like: `Docker version 24.0.x`

---

## 🎯 After Installation - Run Your App

Once Docker is installed, navigate to your project folder and run:

```powershell
.\start-docker.ps1
```

**What this does:**
1. ✅ Checks if Docker is running
2. ✅ Builds your application into a Docker image
3. ✅ Starts the container
4. ✅ Opens your app at http://localhost:3000

**First build takes 5-10 minutes** (downloads dependencies)
**Subsequent builds are much faster** (uses cache)

---

## 🔄 Alternative: Run Without Docker

If you don't want to install Docker right now, you can run the app normally:

```powershell
npm run dev
```

Your app will be available at: http://localhost:3000

**Difference:**
- `npm run dev` = Development mode (hot reload, debugging)
- `Docker` = Production mode (optimized, containerized)

---

## ❓ Need Help?

**Docker won't start?**
- Make sure you restarted your computer after installation
- Check if Docker Desktop is running (whale icon in system tray)
- Try running Docker Desktop as Administrator

**Port 3000 already in use?**
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Stop it (replace PID with the number from above)
taskkill /PID <PID> /F
```

**Still having issues?**
- Check `DOCKER.md` for detailed troubleshooting
- Make sure your `.env` file has all required variables
