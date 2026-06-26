import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MessageSquare, LayoutList, Calendar, LogOut } from "lucide-react";
import { getMe, logoutAction } from "@/lib/actions/auth";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations("Profile");

  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;
  const user = await getMe();

  if (!user) redirect(`/${locale}/login`);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${user.id}?populate=threads,posts`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );
  const userData = await res.json();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile Header */}
      <div className="glass rounded-3xl p-8 mb-8 relative overflow-hidden">
        {/* Logout Button - Using 'end-0' for RTL compatibility */}
        <div className="absolute top-0 end-0 p-8">
          <form action={logoutAction}>
            <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors font-black text-[10px] uppercase tracking-widest">
              <LogOut size={16} />
              {t("logout")}
            </button>
          </form>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-brand-primary to-yellow-500 flex items-center justify-center text-4xl font-black border-4 border-slate-900 shadow-2xl">
            {user.username[0].toUpperCase()}
          </div>
          <div className="text-center md:text-start">
            <h1 className="text-3xl font-black uppercase tracking-tight italic">
              {user.username}
            </h1>
            <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2 mt-1 text-sm font-medium">
              <Calendar size={14} />
              {t("memberSince")}{" "}
              {new Date(user.createdAt).toLocaleDateString(locale)}
            </p>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-white/5 min-w-[100px]">
                <span className="block text-[10px] text-slate-500 font-black uppercase tracking-tighter">
                  {t("stats.threads")}
                </span>
                <span className="text-xl font-black text-brand-primary">
                  {userData.threads?.length || 0}
                </span>
              </div>
              <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-white/5 min-w-[100px]">
                <span className="block text-[10px] text-slate-500 font-black uppercase tracking-tighter">
                  {t("stats.replies")}
                </span>
                <span className="text-xl font-black text-brand-primary">
                  {userData.posts?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Threads */}
        <section>
          <h2 className="flex items-center gap-2 text-xl font-black mb-4 uppercase tracking-tight italic">
            <LayoutList className="text-brand-primary" size={20} />
            {t("sections.discussions")}
          </h2>
          <div className="space-y-3">
            {userData.threads?.length > 0 ? (
              userData.threads.map((thread: any) => (
                <div
                  key={thread.id}
                  className="glass p-4 rounded-xl border-s-4 border-s-brand-primary hover:bg-slate-900/40 transition-colors cursor-pointer"
                >
                  <h3 className="font-bold text-slate-200 line-clamp-1 text-sm">
                    {thread.title}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-black uppercase">
                    {new Date(thread.createdAt).toLocaleDateString(locale)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic text-sm p-4 opacity-50">
                {t("empty.threads")}
              </p>
            )}
          </div>
        </section>

        {/* Recent Activity (Posts) */}
        <section>
          <h2 className="flex items-center gap-2 text-xl font-black mb-4 uppercase tracking-tight italic">
            <MessageSquare className="text-brand-primary" size={20} />
            {t("sections.replies")}
          </h2>
          <div className="space-y-3">
            {userData.posts?.length > 0 ? (
              userData.posts.map((post: any) => (
                <div
                  key={post.id}
                  className="glass p-4 rounded-xl border-s-4 border-s-slate-700 hover:bg-slate-900/40 transition-colors"
                >
                  <p className="text-sm text-slate-300 line-clamp-2 italic leading-relaxed">
                    "{post.content[0]?.children[0]?.text}"
                  </p>
                  <span className="text-[10px] text-slate-500 font-black uppercase block mt-2">
                    {new Date(post.createdAt).toLocaleDateString(locale)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic text-sm p-4 opacity-50">
                {t("empty.replies")}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
