---
description: Mandatory coding standards and stability rules for Tabeeb Pedia to prevent runtime errors and crashes
globs: **/*.{js,jsx,ts,tsx}
alwaysApply: true
---

# Tabeeb Pedia - Mandatory Stability & Coding Guidelines

These rules are strict and must be followed at all times by any AI assistant or developer working on Tabeeb Pedia.

## 1. Absolute Prevention of Temporal Dead Zone (TDZ) / ReferenceErrors
* In large components like `AdminCMS.jsx`, `App.jsx`, `DoctorDashboard.jsx`, and `DoctorAuthModal.jsx`:
  * **All state declarations (`useState`), prop fallbacks, and shared variables (`articlesList`, `doctorsList`, `pagesList`, `categoriesList`, `siteSettings`, etc.) MUST be defined at the TOP of the component**, before any `useEffect`, `useMemo`, `useCallback`, or helper functions that reference them.
  * **NEVER** use a `const` or `let` variable in a `useEffect` body or dependency array before the line where it is declared.
  * In production builds, Vite/Rollup minifies variable names (e.g., `articlesList` becomes `wt`). If a variable is accessed before initialization, the browser throws: `ReferenceError: Cannot access 'wt' before initialization`, triggering the Portal Recovery screen.

## 2. Component Structure Order in Large Files
Every React component must follow this declaration order:
1. Imports & external helpers.
2. Component signature & props extraction.
3. All `useState` state hooks and prop fallback variables (`const itemsList = propItems || internalItems`).
4. `useRef` hooks.
5. `useMemo` & `useCallback` hooks.
6. `useEffect` lifecycle and sync hooks.
7. Event handlers and action functions.
8. JSX return.

## 3. Strict Pre-Push Build Verification
Before committing or pushing any code to GitHub:
1. Always build the project:
   ```powershell
   cmd.exe /c "npm run build"
   ```
2. Verify the build succeeds with exit code 0.
3. Inspect `git diff` carefully to ensure no variable was moved or referenced above its declaration.

## 4. No Broken Endpoints or Missing Backend Files
* When referencing backend endpoints (like `api/media.php` or `api/upload.php`):
  * Ensure required files (e.g. `auth_guard.php`) exist and do not throw fatal PHP errors.
  * Always have safe fallbacks in frontend API callers.
