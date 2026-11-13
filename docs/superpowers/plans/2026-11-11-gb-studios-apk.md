# GB Studios APK Rebranding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the provided CRICFy TV Android application into "GB studios" and output a signed, installable APK file (`GB_studios.apk`).

**Architecture:** Decompile the APK resources without disassembling dex code (using apktool `-r` flag for stability), modify string resources (`app_name` and display titles) to "GB studios", recompile using apktool, and sign + zipalign using `uber-apk-signer` (v1/v2/v3).

**Tech Stack:** Java 17, Apktool 2.10.0, Uber-APK-Signer 1.3.0, PowerShell.

**Spec:** `docs/superpowers/specs/2026-11-11-gb-studios-apk-design.md`

## Global Constraints
- Target output file: `c:\Users\Gaurav bhati\Documents\code with gaurav\new website\GB_studios.apk`
- The app display name must be updated to exact string: `GB studios`
- Must retain all original streaming functions, activities, permissions, and network handlers.
- The signed APK must pass Android v1, v2, and v3 signature verification.

## Review Focus
1. Resource corruption during decompile/rebuild: using `-r` flag so resources are kept clean or only values are decoded.
2. UTF-8 encoding integrity in strings.xml.
3. Android 11+ signature requirements (requires v2/v3 signature scheme).
4. Alignment: APK must be 4-byte zipaligned for runtime performance.
5. Rebuilding error due to duplicate or invalid resource IDs: ensure apktool handles aapt2/framework properly.

---

### Task 1: Decompile APK Resources
**Files:**
- Read: `C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\.user_uploaded\media_1794277668915_ccf64fed`
- Target Dir: `C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\scratch\decompiled`

- [x] **Step 1: Execute apktool decompile command**
  Run: `java -jar "C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\scratch\apktool.jar" d "C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\.user_uploaded\media_1794277668915_ccf64fed" -o "C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\scratch\decompiled" -f -s`
- [x] **Step 2: Verify decompile output**
  Check that `apktool.yml` and `res/values/strings.xml` exist in the target directory.

---

### Task 2: Update App Name to "GB studios"
**Files:**
- Modify: `C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\scratch\decompiled\res\values*\strings.xml`
- Modify: `C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\scratch\decompiled\AndroidManifest.xml` (if hardcoded label exists)

- [x] **Step 1: Search and replace app name occurrences**
  Update `<string name="app_name">CRICFy TV</string>` to `<string name="app_name">GB studios</string>`.
  Check any other locale strings (`values-*/strings.xml`) and update accordingly.
- [x] **Step 2: Verify string changes**
  Confirm grep for "app_name" across decompiled directory outputs "GB studios".

---

### Task 3: Rebuild the APK
**Files:**
- Source Dir: `C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\scratch\decompiled`
- Target APK: `C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\scratch\unsigned_rebuilt.apk`

- [x] **Step 1: Run apktool build**
  Run: `java -jar "C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\scratch\apktool.jar" b "C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\scratch\decompiled" -o "C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\scratch\unsigned_rebuilt.apk"`
- [x] **Step 2: Verify rebuilt APK was generated**
  Check that `unsigned_rebuilt.apk` exists and has size > 10MB.

---

### Task 4: Sign and Zipalign the APK
**Files:**
- Input: `C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\scratch\unsigned_rebuilt.apk`
- Target: `c:\Users\Gaurav bhati\Documents\code with gaurav\new website\GB_studios.apk`

- [x] **Step 1: Sign with uber-apk-signer**
  Run: `java -jar "C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\scratch\uber-apk-signer.jar" -a "C:\Users\Gaurav bhati\.gemini\antigravity\brain\71031194-78f2-4351-8346-3f4e4d217778\scratch\unsigned_rebuilt.apk" -o "c:\Users\Gaurav bhati\Documents\code with gaurav\new website" --allowResign`
- [x] **Step 2: Rename signed output to GB_studios.apk**
  Rename the generated `unsigned_rebuilt-aligned-debugSigned.apk` to `GB_studios.apk`.

---

### Task 5: Verify APK
**Files:**
- Target: `c:\Users\Gaurav bhati\Documents\code with gaurav\new website\GB_studios.apk`

- [x] **Step 1: Verify signatures**
  Run uber-apk-signer verify mode on `GB_studios.apk` to confirm v1, v2, and v3 signatures are valid.
- [x] **Step 2: Verify app_name string inside resources.arsc**
  Extract resources.arsc from `GB_studios.apk` and verify that "GB studios" is present and "CRICFy TV" is replaced.
