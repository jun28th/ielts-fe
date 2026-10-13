"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import * as Y from "yjs";

const COLLAB_URL = process.env.NEXT_PUBLIC_COLLAB_URL ?? "ws://localhost:1234";

export function useOnlineUsers(assignmentId: string, userId: string | null): Set<string> {
    const [onlineIds, setOnlineIds] = useState<Set<string>>(() => new Set());

    useEffect(() => {
        if (!userId) return;

        const provider = new HocuspocusProvider({
            url: COLLAB_URL,
            name: `presence:${assignmentId}`,
            document: new Y.Doc(),
            onAwarenessChange: ({ states }) => {
                const ids = new Set<string>();
                states.forEach((state) => {
                    if (typeof state.userId === "string") ids.add(state.userId);
                });
                setOnlineIds(ids);
            },
        });

        provider.setAwarenessField("userId", userId);

        return () => {
            provider.destroy();
        };
    }, [assignmentId, userId]);

    return onlineIds;
}