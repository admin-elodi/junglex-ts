const Cookies = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-emerald-300 mb-2">Cookie Policy</h1>
      <p className="text-xs text-gray-500 mb-6">
        Draft — last updated August 2026. This is a starting template, not reviewed by a lawyer.
      </p>

      <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-emerald-300 font-bold mb-2">What we use</h2>
          <p>
            JungleX uses essential, functional storage only — specifically, an authentication session
            token (managed by Supabase) that keeps you signed in between visits. This is required for
            the platform to work and can't be turned off while staying logged in.
          </p>
        </section>

        <section>
          <h2 className="text-emerald-300 font-bold mb-2">What we don't use</h2>
          <p>
            No advertising cookies, no third-party tracking scripts, no cross-site analytics cookies.
          </p>
        </section>

        <section>
          <h2 className="text-emerald-300 font-bold mb-2">Managing storage</h2>
          <p>
            You can clear your session at any time by signing out, or by clearing your browser's site
            data for JungleX — doing so will simply log you out.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Cookies;
