#!/bin/bash
# SmarterOS CLI - Installer
# Install: curl -sSL smarter.sh | bash
# Version: 3.0

set -e

# Colors
BLUE='\033[1;34m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "   _____                      _            ____  ____ "
echo "  / ____|                    | |          / __ \/ __ \\"
echo " | (___  _ __ ___   __ _ _ __| |_ ___ _ _| |  | | |  | |"
echo "  \___ \| '_ \` _ \ / _\` | '__| __/ _ \ '__| |  | | |  | |"
echo "  ____) | | | | | | (_| | |  | ||  __/ |  | |__| | |__| |"
echo " |_____/|_| |_| |_|\__,_|_|   \__\___|_|   \____/ \____/"
echo ""
echo "      SmarterOS CLI - Installer"
echo -e "${NC}"
echo ""

# Check environment
echo -e "${YELLOW}[1/4] Checking environment...${NC}"

if command -v git >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} git installed"
else
    echo -e "${YELLOW}!${NC} git not found - installing..."
    if command -v pkg >/dev/null 2>&1; then
        pkg install git -y
    elif command -v brew >/dev/null 2>&1; then
        brew install git
    fi
fi

if command -v curl >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} curl installed"
else
    echo -e "${YELLOW}!${NC} curl not found - installing..."
    if command -v pkg >/dev/null 2>&1; then
        pkg install curl -y
    elif command -v apt >/dev/null 2>&1; then
        apt install curl -y
    fi
fi

# Clone repository
echo ""
echo -e "${YELLOW}[2/4] Cloning SmarterOS Specs...${NC}"

SPECS_DIR="${HOME}/smarteros-specs"

if [ -d "$SPECS_DIR" ]; then
    echo -e "${GREEN}✓${NC} Specs directory exists"
    cd "$SPECS_DIR" && git pull origin main
else
    git clone https://github.com/SmarterCL/smarteros-specs.git "$SPECS_DIR"
    echo -e "${GREEN}✓${NC} Repository cloned"
fi

# Install CLI
echo ""
echo -e "${YELLOW}[3/4] Installing Smarter CLI...${NC}"

CLI_DIR="/usr/local/bin"
if [ ! -w "$CLI_DIR" ]; then
    CLI_DIR="${HOME}/.local/bin"
    mkdir -p "$CLI_DIR"
fi

cp "$SPECS_DIR/deploy/smarter-cli.sh" "$CLI_DIR/smarter"
chmod +x "$CLI_DIR/smarter"

echo -e "${GREEN}✓${NC} CLI installed to: $CLI_DIR/smarter"

# Add to PATH if needed
if [[ ":$PATH:" != *":$CLI_DIR:"* ]]; then
    echo ""
    echo -e "${YELLOW}[4/4] Adding to PATH...${NC}"
    
    if [ -f "$HOME/.bashrc" ]; then
        echo "export PATH=\"$CLI_DIR:\$PATH\"" >> "$HOME/.bashrc"
        echo -e "${GREEN}✓${NC} Added to .bashrc"
    fi
    
    if [ -f "$HOME/.zshrc" ]; then
        echo "export PATH=\"$CLI_DIR:\$PATH\"" >> "$HOME/.zshrc"
        echo -e "${GREEN}✓${NC} Added to .zshrc"
    fi
    
    echo ""
    echo -e "${YELLOW}Note: Restart your terminal or run:${NC}"
    echo "  export PATH=\"$CLI_DIR:\$PATH\""
fi

# Success
echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ SmarterOS CLI installed successfully!${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo "Quick Start:"
echo "  smarter help              # Show all commands"
echo "  smarter agent list        # List agents"
echo "  smarter health check      # Run health check"
echo "  smarter factory view      # View agent factory"
echo "  smarter docs              # Open documentation"
echo ""
echo "Documentation:"
echo "  https://docs.smarterbot.cl"
echo "  https://github.com/SmarterCL/smarteros-specs"
echo ""
echo -e "${GREEN}Welcome to SmarterOS!${NC}"
