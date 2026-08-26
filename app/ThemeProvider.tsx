'use client';

import { ConfigProvider } from "antd";
import { ReactNode } from "react";
import { antdTheme } from "./theme";

type Props = {
    children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
    return <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>;
}
