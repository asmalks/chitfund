import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let user: any = null;
    let profile: any = null;

    if (process.env.NEXT_PUBLIC_DEV_BYPASS === 'true') {
        // Dev bypass: skip all Supabase auth, use mock data
        user = { id: 'dev-user-mock' };
        profile = { name: 'Demo User' };
    } else {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getUser();
        user = data?.user;

        if (!user || error) {
            redirect("/login");
        }

        const { data: profileData } = await supabase
            .from('users')
            .select('name')
            .eq('id', user.id)
            .single();
        profile = profileData;
    }

    return (
        <div style={{
            backgroundColor: 'var(--bg-color)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <TopBar userName={profile?.name} />

            <main style={{ flex: 1, paddingBottom: '90px' }}>
                {children}
            </main>

            <BottomNav />
        </div>
    );
}

