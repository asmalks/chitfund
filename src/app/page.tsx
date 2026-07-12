import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function SplashPage() {
    // Dev bypass: skip auth check
    if (process.env.NEXT_PUBLIC_DEV_BYPASS === 'true') {
        redirect("/dashboard");
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        redirect("/dashboard");
    } else {
        redirect("/intro");
    }

    // Fallback UI in case redirect takes a moment
    return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>
                <h1 className="heading-1" style={{ color: 'var(--primary-accent)' }}>ROSCA</h1>
                <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
            </div>
        </div>
    );
}

