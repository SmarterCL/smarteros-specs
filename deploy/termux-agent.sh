#!/data/data/com.termux/files/usr/bin/bash
# SmarterOS - Termux Agent Factory
# TAG: TERMUX, AGENT, DEMO

APP="SmarterOS"
VERSION="3.0"

BLUE='\033[1;34m'
GREEN='\033[1;32m'
RED='\033[1;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear

echo -e "${BLUE}"
echo "   _____                      _            ____  ____ "
echo "  / ____|                    | |          / __ \/ __ \\"
echo " | (___  _ __ ___   __ _ _ __| |_ ___ _ _| |  | | |  | |"
echo "  \___ \| '_ \` _ \ / _\` | '__| __/ _ \ '__| |  | | |  | |"
echo "  ____) | | | | | | (_| | |  | ||  __/ |  | |__| | |__| |"
echo " |_____/|_| |_| |_|\__,_|_|   \__\___|_|   \____/ \____/"
echo ""
echo "      SmarterOS Agent Factory (Termux Demo)"
echo -e "               version ${VERSION}${NC}"
echo ""

# --- DEPENDENCIAS ---
echo "[*] checking environment..."

for pkgname in python nodejs curl git; do
 if ! command -v $pkgname >/dev/null 2>&1; then
   echo "[+] installing $pkgname"
   pkg install $pkgname -y
 fi
done

API_PORT=8000

# --- HEALTH CHECK LOOP (3 VUELTAS) ---
echo ""
echo -e "${YELLOW}[LOOP] Starting 3-cycle health check...${NC}"
echo ""

for i in 1 2 3; do
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE} CYCLE $i/3 - $(date +%H:%M:%S)${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo ""
    
    # Check MCP Agents
    echo "[*] Checking MCP Agents..."
    for port in 3050 3052 3053 3054 3057 3058 3059; do
        if curl -s http://localhost:$port/health >/dev/null 2>&1; then
            echo -e "  ${GREEN}✓${NC} Port $port: ONLINE"
        else
            echo -e "  ${RED}✗${NC} Port $port: OFFLINE"
        fi
    done
    
    # Check GitHub Sync
    echo ""
    echo "[*] Checking GitHub Sync..."
    cd /Users/mac/Downloads/smarteros-specs 2>/dev/null && git fetch origin 2>/dev/null && echo -e "  ${GREEN}✓${NC} GitHub: SYNCED" || echo -e "  ${YELLOW}!${NC} GitHub: PENDING"
    
    # Check PicoClaw
    echo ""
    echo "[*] Checking PicoClaw Telemetry..."
    telemetry=$(curl -s http://localhost:3059/telemetry 2>/dev/null)
    if [ -n "$telemetry" ]; then
        echo -e "  ${GREEN}✓${NC} PicoClaw: READING"
        echo "    Voltaje: $(echo $telemetry | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"{d['data'][0]['value']}{d['data'][0]['unit']}\")" 2>/dev/null || echo "N/A")"
        echo "    RPM: $(echo $telemetry | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"{d['data'][1]['value']}{d['data'][1]['unit']}\")" 2>/dev/null || echo "N/A")"
        echo "    Temp: $(echo $telemetry | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"{d['data'][2]['value']}{d['data'][2]['unit']}\")" 2>/dev/null || echo "N/A")"
    else
        echo -e "  ${RED}✗${NC} PicoClaw: NO DATA"
    fi
    
    # Check Dokploy/VPS
    echo ""
    echo "[*] Checking Dokploy/VPS Health..."
    if [ -n "$VPS_IP" ]; then
        vps_status=$(curl -s --connect-timeout 5 "http://$VPS_IP:80" 2>/dev/null && echo "ONLINE" || echo "OFFLINE")
        echo "  VPS: $vps_status"
    else
        echo -e "  ${YELLOW}!${NC} VPS_IP: NOT CONFIGURED"
    fi
    
    echo ""
    echo -e "${YELLOW}Waiting 5 seconds before next cycle...${NC}"
    sleep 5
    echo ""
done

echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN} 3-CYCLE HEALTH CHECK COMPLETE${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""

# --- MENU ---
echo "Smarter Modules:"
echo ""
echo "1) Agent Node (API demo)"
echo "2) RAG Reader"
echo "3) Agent Factory View"
echo "4) System Status"
echo "5) SmarterMCP Query"
echo "q) Exit"
echo ""

read -p "Select module: " opt

case $opt in

1)
echo -e "${GREEN}Starting Agent Node on port ${API_PORT}${NC}"
python3 -m http.server $API_PORT
;;

2)
echo ""
echo "RAG simulation:"
echo "reading company data..."
sleep 2
echo "analyzing flows..."
sleep 2
echo "suggested action:"
echo "→ optimize whatsapp node"
echo ""
;;

3)
echo ""
echo "AGENT FACTORY"
echo ""
echo "[agent-sales]"
echo " nodes: landing → whatsapp → payment"

echo ""
echo "[agent-support]"
echo " nodes: telegram → AI → ticket"

echo ""
echo "[agent-logistics]"
echo " nodes: order → dispatch → delivery"

;;

4)
echo ""
echo "SYSTEM STATUS"
echo "--------------"
echo "IP: $(hostname -I 2>/dev/null || echo 'N/A')"
echo "Uptime: $(uptime -p 2>/dev/null || echo 'N/A')"
echo "Memory:"
free -h 2>/dev/null || echo "N/A"
;;

5)
echo ""
echo "SMARTERMCP QUERY"
echo "----------------"
echo "Querying SmarterMCP for agent status..."
curl -s http://localhost:3050/status 2>/dev/null | python3 -m json.tool || echo "SmarterMCP not available"
;;

q)
exit
;;

*)
echo "invalid option"
;;

esac
