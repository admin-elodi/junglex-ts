const Privacy = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-emerald-300 mb-2">Privacy Policy</h1>
      <p className="text-xs text-gray-500 mb-6">
        Draft — last updated August 2026. This is a starting template, not reviewed by a lawyer.
        If you serve users in the EU, Nigeria (NDPR), or other regulated regions, have this reviewed
        against those specific data-protection laws before launch.
      </p>

      <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-emerald-300 font-bold mb-2">1. What we collect</h2>
          <p>
            Your email and password (handled securely by our authentication provider, Supabase — we
            never see your raw password), your chosen username, spirit animal, and optional bio, and
            the content of posts, reactions, and follows you create on the platform.
          </p>
        </section>

        <section>
          <h2 className="text-emerald-300 font-bold mb-2">2. How we use it</h2>
          <p>
            To run the platform: authenticating you, displaying your posts and profile to others,
            sending you account-related emails (like confirmation and password reset), and notifying
            you of reactions and follows.
          </p>
        </section>

        <section>
          <h2 className="text-emerald-300 font-bold mb-2">3. What we don't do</h2>
          <p>
            We don't sell your data to third parties. We don't use your content to train unrelated
            products. We don't display third-party advertising on JungleX.
          </p>
        </section>

        <section>
          <h2 className="text-emerald-300 font-bold mb-2">4. Where your data lives</h2>
          <p>
            Your account and content data is stored with Supabase, our backend provider. Their own
            security and data-handling practices apply to how data is stored and protected.
          </p>
        </section>

        <section>
          <h2 className="text-emerald-300 font-bold mb-2">5. Your rights</h2>
          <p>
            You can edit or delete your profile information and posts at any time. You can request
            full account deletion by contacting the JungleX team.
          </p>
        </section>

        <section>
          <h2 className="text-emerald-300 font-bold mb-2">6. Changes</h2>
          <p>We'll update this page if what we collect or how we use it changes materially.</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
