// styles.js
// used GenAI to genereate starting style based off of mock-up photo (also created using GenAI) in Project Plan
// fine-tuned/tweaked styles from GenAI

import { StyleSheet, Platform } from "react-native";

const COLORS = {
  bg: "#F4F6EA",           // warm off-white
  primary: "#0D3B22",      // deep forest green
  primary2: "#1B5A35",     // accent green
  border: "#184C2D",       // border green
  panel: "#D7D9CF",        // list/map panels
  text: "#0B1F12",         // near-black green
  muted: "#6D756E",        // muted caption
  white: "#FFFFFF",
};

const SHADOW = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  android: {
    elevation: 6,
  },
  default: {},
});

export const styles = StyleSheet.create({
  // ---------- Screen wrapper (the "phone" look) ----------
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  phoneFrame: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.bg,
  },

  // ---------- Header ----------
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },

  headerLeftIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },

  headerTitleWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 34, // balances left icon width
  },

  headerTitle: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  // ---------- Common text ----------
  h1: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.primary,
    textAlign: "center",
    letterSpacing: 1.0,
  },

  h2: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 8,
  },

  caption: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "center",
  },

  // ---------- Auth / Welcome layout ----------
  centerContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingBottom: 12,
  },

  logoBlock: {
    alignItems: "center",
    marginBottom: 18,
  },

  appTitleBig: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.primary,
    textAlign: "center",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },

  logoImage: {
    width: 140,
    height: 90,
    resizeMode: "contain",
    marginVertical: 10,
  },

  // ---------- Buttons ----------
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: "#0A2E1B",
    ...SHADOW,
  },

  buttonSmall: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginVertical: 6,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },

  // ---------- Inputs (Login screen) ----------
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#B7BDB3",
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 14,
    color: COLORS.text,
    marginVertical: 6,
  },

  helperText: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 10,
  },

  link: {
    color: COLORS.primary2,
    fontWeight: "800",
  },

  // ---------- Home/List/Trips layout ----------
  body: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
  },

  // large map/list area (center panel)
  panel: {
    flex: 1,
    backgroundColor: COLORS.panel,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 10,
  },

  // map placeholder
  map: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#E8ECE2",
    borderWidth: 1.5,
    borderColor: "#B8BEB5",
  },

  // list item styling
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#B8BEB5",
  },

  listTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.primary,
    textAlign: "center",
  },

  listSub: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary2,
    textAlign: "center",
    marginTop: 2,
  },

  // Small "List / Map" toggle button centered above footer (like your mock)
  centerToggleWrap: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },

  // ---------- Bottom nav ----------
  footer: {
    height: 54,
    flexDirection: "row",
    borderTopWidth: 2,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },

  navBtn: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#0A2E1B",
  },

  navBtnText: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  // ---------- Section title line (like "Nearby Campsites") ----------
  sectionHeader: {
    marginTop: 8,
    marginBottom: 8,
    alignItems: "center",
  },

  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.primary,
  },

  divider: {
    width: "72%",
    height: 2,
    backgroundColor: COLORS.border,
    marginTop: 6,
    borderRadius: 1,
  },
});

export const theme = { COLORS };
export default styles;