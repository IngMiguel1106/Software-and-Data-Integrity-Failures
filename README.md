# Software-and-Data-Integrity-Failures
**Fecha:** 2025-10-29  
**Autor:** Juan david Landazabal y Miguel Paternina
## ⚙️ Requisitos
- Docker + Docker Compose
- HTML5
- CSS
- JavaScript

## 📂 Estructura del repositorio

```
software_y_data_integrity_failures/
├── README.md
├── run_lab.sh
├── index.html
├── css/
│   └── style.css
└── js/
    └── integrity.js
```
## ▶️ Instrucciones de uso

### 1.Instala Python 3.9
```bash
sudo apt install python3.9 -y
```
### 1.dd
```bash
ls -la
```
### 2. dd
```bash
chmod +x (Nombre del)
```
### 3. Ejecutar 
```bash
./run_lab.sh
```
### 3. Apagar el servidor 
Ejecuta esto para ver qué proceso está usando el puerto 8000:
```bash
sudo lsof -i :8000
```
### .1  Detén el proceso que ocupa el puerto (mirar bien el número de proceso (PID))
```bash
kill -9 10456
```
1. Clonar el repositorio y entrar al directorio:
```bash
git clone <repo-url>
cd software_y_data_integrity_failures
```




