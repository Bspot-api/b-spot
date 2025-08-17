#!/bin/bash

# Auto-switch Git Identity Script
# This script automatically detects and switches to the correct Git identity
# based on the repository configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[AUTO-SWITCH]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to get current remote URL
get_remote_url() {
    git remote get-url origin 2>/dev/null || echo ""
}

# Function to detect identity based on remote URL
detect_identity() {
    local remote_url="$1"
    
    if [[ "$remote_url" == *"Bspot-api"* ]] || [[ "$remote_url" == *"github.com-bspot"* ]]; then
        echo "bspot"
    elif [[ "$remote_url" == *"github.com"* ]]; then
        echo "tatiana"
    else
        echo "unknown"
    fi
}

# Function to switch to B-Spot identity
switch_to_bspot() {
    print_status "Switching to B-Spot identity..."
    
    # Remove other keys from SSH agent
    ssh-add -d ~/.ssh/id_ed25519 2>/dev/null || true
    
    # Add B-Spot key
    if ssh-add ~/.ssh/id_ed25519_bspot 2>/dev/null; then
        print_success "Now using B-Spot identity (bspot.api@gmail.com)"
        return 0
    else
        print_error "Failed to add B-Spot SSH key"
        return 1
    fi
}

# Function to switch to Tatiana identity
switch_to_tatiana() {
    print_status "Switching to Tatiana identity..."
    
    # Remove other keys from SSH agent
    ssh-add -d ~/.ssh/id_ed25519_bspot 2>/dev/null || true
    
    # Add Tatiana key
    if ssh-add ~/.ssh/id_ed25519 2>/dev/null; then
        print_success "Now using Tatiana identity (tatiana@lonestone.studio)"
        return 0
    else
        print_error "Failed to add Tatiana SSH key"
        return 1
    fi
}

# Main execution
main() {
    # Check if we're in a git repository
    if [ ! -d ".git" ]; then
        print_error "Not in a git repository"
        exit 1
    fi
    
    # Get current remote URL
    local remote_url=$(get_remote_url)
    if [ -z "$remote_url" ]; then
        print_warning "No remote origin found. Using default identity (Tatiana)"
        switch_to_tatiana
        exit 0
    fi
    
    # Detect which identity to use
    local identity=$(detect_identity "$remote_url")
    
    case $identity in
        "bspot")
            print_status "Detected B-Spot repository: $remote_url"
            switch_to_bspot
            ;;
        "tatiana")
            print_status "Detected personal repository: $remote_url"
            switch_to_tatiana
            ;;
        "unknown")
            print_warning "Unknown repository type: $remote_url"
            print_warning "Using default identity (Tatiana)"
            switch_to_tatiana
            ;;
    esac
}

# Run main function
main "$@"
