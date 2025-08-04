# Code Quality Tools

This project includes several tools to help maintain code quality, detect unused code, and find code duplication.

## Available Scripts

### 🔍 Run All Checks
```bash
npm run code-quality
```
Runs all code quality checks in sequence.

### 🧹 Fix Issues Automatically
```bash
npm run code-quality:fix
```
Automatically fixes ESLint issues that can be auto-fixed.

### Individual Checks

#### ESLint - Code Quality & Style
```bash
npm run lint        # Check for issues
npm run lint:fix    # Fix issues automatically
```
**What it finds:**
- Unused variables and imports
- Code style issues
- Potential bugs and code smells
- Import organization issues
- Complex functions (cognitive complexity > 15)
- Duplicate code patterns

#### Unused Exports Detection
```bash
npm run check:unused-exports
```
**What it finds:**
- TypeScript/JavaScript exports that are never imported
- Dead code in your modules
- Functions, classes, and variables that can be removed

#### Code Duplication Detection
```bash
npm run check:duplication
```
**What it finds:**
- Duplicated code blocks (5+ lines)
- Copy-paste code that could be refactored
- Similar functions that could be combined
- Generates HTML report in `reports/jscpd/`

#### Unused Dependencies
```bash
npm run check:unused-deps
```
**What it finds:**
- NPM packages that are installed but not used
- Missing dependencies that are used but not declared
- Dev dependencies that should be regular dependencies

#### Unused Files & Unresolved Imports
```bash
npm run check:unimported
```
**What it finds:**
- Files that exist but are never imported
- Imports that can't be resolved
- Dead files that can be safely deleted

## Configuration Files

- **`.jscpdrc.json`** - Code duplication detection settings
- **`.unimportedrc.json`** - Unused files/imports detection settings
- **`eslint.config.mjs`** - Enhanced ESLint rules for code quality

## Reports

Code quality reports are generated in the `reports/` directory:
- `reports/jscpd/` - Code duplication analysis (HTML format)

## Recommended Workflow

1. **Before committing:** Run `npm run code-quality`
2. **To fix issues:** Run `npm run code-quality:fix`
3. **Regular maintenance:** Review duplication and unused code reports
4. **Clean up:** Remove unused files and dependencies based on reports

## ESLint Rules Highlights

### Unused Code Detection
- ✅ Detects unused imports and variables
- ✅ Allows `_` prefix for intentionally unused variables
- ✅ Organizes imports automatically

### Code Quality (SonarJS)
- ✅ Prevents overly complex functions (max complexity: 15)
- ✅ Detects duplicate string literals (3+ occurrences)
- ✅ Finds identical or duplicated code branches
- ✅ Suggests code simplifications

### Import Organization
- ✅ Groups imports by type (builtin, external, internal, etc.)
- ✅ Alphabetizes imports within groups
- ✅ Adds consistent spacing between import groups

## Ignoring False Positives

If you need to ignore certain warnings:

### ESLint
```typescript
// eslint-disable-next-line rule-name
const unusedVar = "I need this for later";
```

### TypeScript unused exports
Add to `.ts-unused-exports.json` if needed.

### Duplication detection
Add paths to `.jscpdrc.json` ignore list.

## Integration with CI/CD

Consider adding to your CI pipeline:
```yaml
- name: Code Quality Check
  run: npm run code-quality
``` 