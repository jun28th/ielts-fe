import { AuthProvider } from "@/contexts/auth-context";
import { decrypt, SessionPayload } from "@/lib/session";
import { User } from "@/types/auth-types";
import { cookies } from "next/headers";
import { ConfigProvider } from "antd";
import { QueryProvider } from "./query-provider";
import { MessageProvider } from "@/contexts/message-context";

function payloadToUser(payload: SessionPayload): User {
    return {
        id: payload.sub,
        fullName: payload.fullName,
        email: payload.email,
        roles: payload.roles,
        createdAt: payload.createdAt,
    } as User;
}

async function getInitialUser() : Promise<User | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    
    const payload = await decrypt(accessToken);
    if (!payload) return null;

    return payloadToUser(payload);
}

export default async function Providers({ children } : { children : React.ReactNode}) {
    const initialUser = await getInitialUser();

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: "var(--font-be-vietnam-pro)",
                },
                components: {
                    Menu: {
                        // thanh ngang: chữ + gạch chân của mục đang chọn
                        horizontalItemSelectedColor: "var(--color-accent)",
                        horizontalItemHoverColor: "var(--color-accent)",
                        subMenuItemSelectedColor: "var(--color-accent)",

                        // mục con trong dropdown "Kho đề"
                        itemSelectedColor: "var(--color-accent)",
                        itemSelectedBg: "var(--color-accent-bg)",

                        // chữ của các mục bình thường
                        itemColor: "var(--color-fg)",
                        itemHoverColor: "var(--color-accent)",
                    },
                    Spin: {
                        colorPrimary: "var(--color-muted)",
                    },
                    Breadcrumb: {
                        colorBgTextHover: "inherit",
                        linkHoverColor: "var(--color-accent)"
                    },
                    Table: {
                        borderColor: "var(--color-border)",
                        rowSelectedBg: "var(--color-accent-bg)",
                        rowSelectedHoverBg: "var(--color-accent-bg)"
                    },
                    Select: {
                        colorPrimary: "var(--color-accent)"
                    },
                    Tooltip: {
                        colorBgSpotlight: "var(--color-accent-bg)",
                        colorTextLightSolid: "var(--color-fg)"
                    },
                    Progress: {
                        defaultColor: "var(--color-accent)",
                        colorSuccess: "var(--color-highlight)"
                    },
                    Radio: {
                        colorPrimary: "var(--color-accent)",
                        colorPrimaryHover: "var(--color-accent)",
                    },
                    Pagination: {
                        colorPrimary: "var(--color-accent)",
                        colorPrimaryHover: "var(--color-accent)",
                        itemActiveBg: "transparent",
                    },
                    DatePicker: {
                        colorPrimary: "var(--color-accent)", 
                        hoverBorderColor: "var(--color-accent)",
                        activeBorderColor: "var(--color-accent)",
                        activeShadow: "0 0 0 2px var(--color-accent-bg)",
                        controlItemBgActive: "var(--color-accent-bg)",
                        cellActiveWithRangeBg: "var(--color-accent-bg)",
                        cellHoverWithRangeBg: "var(--color-accent-bg)",
                        cellRangeBorderColor: "var(--color-accent)",
                        colorLink: "var(--color-accent)",
                        colorLinkHover: "var(--color-accent)",
                        colorLinkActive: "var(--color-accent)",
                    },
                    Button: {
                        colorPrimary: "var(--color-accent)",
                        colorPrimaryHover: "var(--color-accent)",
                        colorPrimaryActive: "var(--color-accent)",
                        primaryShadow: "none",
                        defaultHoverColor: "var(--color-accent)",
                        defaultHoverBorderColor: "var(--color-accent)",
                        defaultActiveColor: "var(--color-accent)",
                        defaultActiveBorderColor: "var(--color-accent)",
                    },
                    Upload: {
                        colorPrimary: "var(--color-accent)",
                        colorPrimaryHover: "var(--color-accent)",
                        colorPrimaryActive: "var(--color-accent)",
                        colorLink: "var(--color-accent)",
                        colorLinkHover: "var(--color-accent)",
                        colorLinkActive: "var(--color-accent)",
                    },
                    Checkbox: {
                        colorPrimary: "var(--color-accent)",
                        colorPrimaryHover: "var(--color-accent)",
                        colorPrimaryBorder: "var(--color-accent)",
                    },
                }
            }}
        >
            <MessageProvider>
                <QueryProvider>
                    <AuthProvider initialUser={initialUser}>
                        {children}
                    </AuthProvider>
                </QueryProvider>
            </MessageProvider>
        </ConfigProvider>
    );
}