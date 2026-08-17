const Terms = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-emerald-300 mb-2">Terms of Service</h1>
      <p className="text-xs text-gray-500 mb-6">
        Draft — last updated August 2026. This is a starting template, not reviewed by a lawyer.
        Have it checked by legal counsel before relying on it for a public launch.
      </p>

      <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-emerald-300 font-bold mb-2">1. Acceptance of terms</h2>
          <p>
            By creating an account or using JungleX, you agree to these Terms of Service. If you don't
            agree, please don't use the platform.
          </p>
        </section>

        <section>
          <h2 className="text-emerald-300 font-bold mb-2">2. Your account</h2>
          <p>
            You're responsible for the security of your account and everything that happens under it.
            You must provide a valid email and may be required to confirm it before posting. You must
            be old enough to legally use online services in your country of residence.
          </p>
        </section>

        <section>
          <h2 className="text-emerald-300 font-bold mb-2">3. Your content</h2>
          <p>
            You own what you post. By posting, you grant JungleX a license to display, distribute, and
            store your content so the platform can function. You're solely responsible for what you
            post — don't post anything illegal, harassing, hateful, or infringing on someone else's
            rights.
          </p>
        </section>

        <section>
          <h2 className="text-emerald-300 font-bold mb-2">4. Acceptable use</h2>
          <p>
            No spam, no impersonation, no harassment, no illegal content, no attempts to break or abuse
            the platform (including automated posting or circumventing rate limits). We may remove
            content or suspend accounts that violate this.
          </p>
        </section>

        <section>
          <h2 className="text-emerald-300 font-bold mb-2">5. Termination</h2>
          <p>
            You can delete your account at any time. We may suspend or terminate accounts that violate
            these terms, at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-emerald-300 font-bold mb-2">6. Changes</h2>
          <p>
            These terms may change as JungleX grows. Continued use after a change means you accept the
            updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-emerald-300 font-bold mb-2">7. Contact</h2>
          <p>Questions about these terms? Reach out to the JungleX team directly.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
