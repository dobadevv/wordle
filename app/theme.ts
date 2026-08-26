import { theme, type ThemeConfig } from "antd";

/**
 * Single source of truth for the dark purple palette.
 * CSS in globals.css mirrors these values as custom properties.
 */
export const palette = {
    canvas: "#120c1d",
    surface: "rgba(28, 20, 48, 0.72)",
    surfaceRaised: "rgba(45, 33, 74, 0.55)",
    border: "rgba(139, 92, 246, 0.22)",
    borderHover: "rgba(167, 139, 250, 0.55)",
    primary: "#8b5cf6",
    primaryHover: "#a78bfa",
    ink: "#ede9fe",
    inkMuted: "#a294c7",
} as const;

export const antdTheme: ThemeConfig = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorPrimary: palette.primary,
        colorBgBase: palette.canvas,
        colorTextBase: palette.ink,
        colorTextPlaceholder: palette.inkMuted,
        colorBorder: palette.border,
        borderRadius: 10,
        controlHeight: 40,
        fontSize: 15,
    },
    components: {
        Card: {
            colorBgContainer: palette.surface,
            paddingLG: 28,
        },
        Input: {
            colorBgContainer: palette.surfaceRaised,
            activeBorderColor: palette.primaryHover,
            hoverBorderColor: palette.borderHover,
        },
        InputNumber: {
            colorBgContainer: palette.surfaceRaised,
            activeBorderColor: palette.primaryHover,
            hoverBorderColor: palette.borderHover,
        },
        Select: {
            colorBgContainer: palette.surfaceRaised,
            optionSelectedBg: "rgba(139, 92, 246, 0.28)",
        },
        Button: {
            primaryShadow: "0 6px 18px rgba(139, 92, 246, 0.35)",
            fontWeight: 600,
        },
        Alert: {
            colorInfoBg: palette.surfaceRaised,
        },
    },
};
