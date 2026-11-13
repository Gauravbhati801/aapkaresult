# GB Studios APK Rebranding Design

**Goal:** Modify the provided CRICFy TV APK to rebrand it as "GB studios" while preserving its original Live TV / Cricket streaming functionality, and produce a signed, ready-to-install Android APK (`GB_studios.apk`).

## Problem Statement
The user provided an APK file (`media_1794277668915_ccf64fed`, identified as CRICFy TV, package `app.cricfy.tv`) and requested a customized version with the application name changed to **"GB studios"**. The user inquired about security/hacking safety and confirmed the rebranding approach.

## Approaches Considered
1. **Rebranding Existing APK (Selected)**:
   - Decompile APK resources using `apktool`.
   - Update application display name (`app_name` and relevant labels) in `res/values/strings.xml` to **"GB studios"**.
   - Recompile the APK with `apktool`.
   - Sign and zipalign using `uber-apk-signer` (v1, v2, v3 schemes).
   - *Trade-off*: Fast, retains 100% of the original video player and streaming channels. Sideloaded APK requires "Install anyway" on Android.
2. **Rebuilding from Scratch in Android Studio / Flutter**:
   - *Trade-off*: Requires extensive reverse engineering of stream endpoints, token authentication, and UI reconstruction. High cost and maintenance. Not selected.

## Constraints & Security
- No malicious code, spyware, or trackers injected.
- App retains original network permissions and functionality.
- Signed with standard release key using v1/v2/v3 signing schemes for compatibility across Android 8 through 14+.
- Output file placed directly in workspace as `GB_studios.apk`.
