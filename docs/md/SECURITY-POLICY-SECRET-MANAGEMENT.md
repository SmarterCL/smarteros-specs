# SmarterOS Security Policy - Secrets Management

## Incident: Supabase Service Key Leak (2025-12-13)
**Status**: RESOLVED - Tokens rotated and secured

### Summary
A Supabase Service Role key was detected in public GitHub repositories. The key was immediately rotated and security measures were implemented.

### Immediate Actions Taken
1. ✅ Created new secure configuration files with placeholder tokens
2. ✅ Updated all affected repositories with dummy tokens 
3. ✅ Applied proper branch protection workflows
4. ✅ Generated remediation script to prevent future leaks

### Permanent Security Measures

#### 1. GitGuardian/Secret Scanning Integration
```yaml
# .github/workflows/secret-scan.yml
name: Secret Scan
on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Scan for secrets
        uses: GitGuardian/ggshield-action@v1
        env:
          GITGUARDIAN_API_KEY: ${{ secrets.GITGUARDIAN_API_KEY }}
```

#### 2. Environment File Protection
```bash
# Add to .gitignore
**/.env
**/env/**
**/config/**
**/*.env.local
**/*.env.production
```

#### 3. Token Management Best Practices
- Never commit actual tokens to repository
- Use environment variables exclusively in production
- Implement vault-based secret injection via MCP
- Use GitHub Secrets for CI/CD workflows

### MCP Enforcement Policy
```yaml
security:
  secret_scan: true
  commit_validation: 
    patterns:
      - "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"  # JWT token pattern
      - "SUPABASE_SERVICE_ROLE_KEY="
      - "apikey.*[a-zA-Z0-9]{32}"
  enforcement:
    block_commit_on_secret_detection: true
    required_review_for_secrets: 2
    notify_security_team: true
```

### Vault Integration (Future Implementation)
The actual production keys should be managed by:
- Vault via MCP for runtime injection
- Environment-based configuration for containers
- Cloudflare Zero Trust for developer access
- Encrypted secrets in GitHub Actions

This incident has been addressed with immediate remediation and preventive measures to ensure the security posture of the platform moving forward.