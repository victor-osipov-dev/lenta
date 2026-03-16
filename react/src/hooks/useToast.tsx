import { useCallback, useEffect, useRef, useState } from "react";

type UseToastReturn = [string, (text: string) => void];

export function useToast(): UseToastReturn {
    const [msg, setMsg] = useState<string>("");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const show = useCallback((text: string) => {
        setMsg(text);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => setMsg(""), 2200);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return [msg, show];
}
