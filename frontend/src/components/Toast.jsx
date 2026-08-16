import { useEffect } from "react";
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    X,
} from "lucide-react";

function Toast({
    message,
    type = "success",
    onClose,
}) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3500);

        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: {
            container:
                "border-green-200 bg-green-50 text-green-800",
            icon: CheckCircle2,
        },

        error: {
            container:
                "border-red-200 bg-red-50 text-red-800",
            icon: XCircle,
        },

        warning: {
            container:
                "border-yellow-200 bg-yellow-50 text-yellow-800",
            icon: AlertTriangle,
        },

        info: {
            container:
                "border-blue-200 bg-blue-50 text-blue-800",
            icon: Info,
        },
    };

    const currentStyle =
        styles[type] || styles.success;

    const Icon = currentStyle.icon;

    return (
        <div className="fixed right-6 top-6 z-[9999]">

            <div
                className={`flex min-w-[320px] max-w-[420px] items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${currentStyle.container}`}
            >

                <Icon
                    size={22}
                    className="shrink-0"
                />

                <p className="flex-1 text-sm font-medium">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="rounded-lg p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
                >
                    <X size={18} />
                </button>

            </div>

        </div>
    );
}

export default Toast;