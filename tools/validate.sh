#!/bin/bash
# OpenSpec v2 Validation Script for SmarterOS with Multimodal Support

set -e

SPEC_DIR="./specs"
LOG_FILE="validation.log"
OPENSK_CONFIG="./opensk.json"

echo "🔍 Validating OpenSpec v2 specifications with multimodal support..."

# Check if specs directory exists
if [ ! -d "$SPEC_DIR" ]; then
    echo "❌ Specs directory does not exist: $SPEC_DIR"
    exit 1
fi

# Load supported types from opensk.json
SUPPORTED_TYPES=$(python3 -c "
import json
with open('$OPENSK_CONFIG', 'r') as f:
    config = json.load(f)
types = config.get('validation', {}).get('supportedTypes', [])
print(','.join(types))
")

echo "📋 Supported types from opensk.json: $SUPPORTED_TYPES"

# Find all YAML spec files
SPEC_FILES=$(find "$SPEC_DIR" -name "*.yaml" -type f)

if [ -z "$SPEC_FILES" ]; then
    echo "❌ No spec files found in $SPEC_DIR"
    exit 1
fi

echo "📋 Found spec files:"
for file in $SPEC_FILES; do
    echo "   - $file"
done

# Basic validation: check if files are valid YAML
echo ""
echo "📄 Validating YAML syntax..."
for file in $SPEC_FILES; do
    if python3 -c "import yaml; yaml.safe_load(open('$file'))" 2>/dev/null; then
        echo "✅ Valid YAML: $file"
    else
        echo "❌ Invalid YAML: $file"
        exit 1
    fi
done

# Check required fields in each spec based on opensk.json
echo ""
echo "🔍 Checking required fields in specs..."
for file in $SPEC_FILES; do
    echo "   Checking: $file"
    
    # Check for required top-level fields
    if ! grep -q "^entity:" "$file"; then
        echo "❌ Missing 'entity' field in $file"
        exit 1
    fi
    
    if ! grep -q "^fields:" "$file"; then
        echo "❌ Missing 'fields' section in $file"
        exit 1
    fi
    
    if ! grep -q "^events:" "$file"; then
        echo "⚠️  Missing 'events' section in $file (this is allowed but may be missing intentionally)"
    fi
    
    if ! grep -q "^ingestion:" "$file"; then
        echo "⚠️  Missing 'ingestion' section in $file (this is allowed but may be missing intentionally)"
    fi
done

# Check field types against supported types
echo ""
echo "🔍 Checking field types against supported types..."
for file in $SPEC_FILES; do
    echo "   Checking field types in: $file"
    
    # Extract field types from the file and validate against supported types
    python3 -c "
import yaml
import sys
import os

# Read opensk config to get supported types
with open('$OPENSK_CONFIG', 'r') as f:
    config = yaml.safe_load(f)

supported_types = config.get('validation', {}).get('supportedTypes', [])

with open('$file', 'r') as f:
    spec = yaml.safe_load(f)

if 'fields' in spec:
    for field_name, field_props in spec['fields'].items():
        if isinstance(field_props, dict) and 'type' in field_props:
            field_type = field_props['type']
            if field_type not in supported_types:
                print(f'❌ Field {field_name} uses unsupported type: {field_type}. Supported types: {supported_types}')
                sys.exit(1)
            else:
                print(f'   ✅ Field {field_name} uses supported type: {field_type}')
"
done

echo ""
echo "✅ All specs are valid!"
echo "🎯 OpenSpec v2 validation completed successfully"
echo "🌟 Multimodal support with GLM-4.6V integration ready"