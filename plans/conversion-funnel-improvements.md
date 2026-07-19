# Plan: Conversion Funnel Improvements

> Source PRD: CRO/reference-funnel brief from attached prompt, plus the grill-me decision pass in this thread.

## Architectural decisions

Durable decisions that apply across all phases:

- **Routes**: Preserve the public App Router routes: `/`, `/privacy`, `/terms`, `/verify`, `/unsubscribe`, and the existing anchor destinations on the landing page.
- **Schema**: Preserve the existing supporter signup shape: name, email, country, city, optional Instagram, optional referral code, optional acquisition source, consent, attribution, verification status, and referral fields.
- **Key models**: Keep `Supporter`, `VerificationToken`, `EmailEvent`, and attribution payloads as the stable funnel models.
- **Auth**: No visitor authentication. Public signup uses email verification as the commitment step.
- **External services**: Preserve Supabase for persistence/rate limiting and Resend for confirmation/welcome email. Analytics should be lightweight and optional, using client-side hooks that do not block submission.
- **Design system**: Preserve the green/lime brand tokens and light-first interface. Use DM Sans as the primary font and keep the logo script as logo-only.
- **Evidence policy**: Do not invent testimonials, member counts, awards, launch dates, product availability, or scarcity. Use honest pending and future-state language where facts are not confirmed.

---

## Phase 1: Sharpen The Signup Funnel

**User stories**: Visitors understand what Sujood Gang is, why joining is free, what happens after signup, and can reach the supporter form from repeated CTAs.

### What to build

Refine the landing page into a clearer supporter-acquisition funnel. The first screen should communicate the identity promise, the free supporter action, and the immediate next step after signup. Repeated CTAs should all support the same primary conversion.

### Acceptance criteria

- [ ] The hero clearly explains the community promise and primary action.
- [ ] The page includes a concise supporter path before the form.
- [ ] Primary CTAs consistently route to the supporter signup.
- [ ] Secondary CTAs help comprehension without competing with signup.
- [ ] Mobile, tablet, and desktop layouts keep the primary action visible and readable.

---

## Phase 2: Improve Trust And Objection Handling

**User stories**: Visitors can evaluate legitimacy, privacy expectations, cost, merch status, and email verification before submitting personal information.

### What to build

Add honest trust-building content around the signup: free status, email confirmation, no purchase requirement, measured updates, pending community proof, and clear merch expectations. Keep unresolved client/legal facts visible as unresolved rather than masking them with unsupported claims.

### Acceptance criteria

- [ ] The page explains that signup is free and not a purchase.
- [ ] The page explains that email verification completes signup.
- [ ] Merch is positioned as upcoming, not currently available.
- [ ] Community proof is not faked when evidence is unavailable.
- [ ] Privacy and consent expectations are visible before submission.

---

## Phase 3: Upgrade Visual System And Typography

**User stories**: Visitors experience the site as premium, deliberate, modern, readable, and brand-consistent across mobile/tablet/desktop.

### What to build

Apply the UI/UX design-system direction: keep the existing brand palette, improve hierarchy and density, replace the placeholder sans with DM Sans, and refine section surfaces so the page feels more specific and less generic.

### Acceptance criteria

- [ ] DM Sans is loaded through Next font optimization.
- [ ] Typography remains readable at phone, tablet, and desktop widths.
- [ ] Components continue to use semantic design tokens.
- [ ] Visual assets and icons are consistent and meaningful.
- [ ] Decorative elements do not create layout instability or accessibility issues.

---

## Phase 4: Strengthen Form UX And Feedback States

**User stories**: Supporters can complete the form with clear labels, understandable optional fields, visible loading/success/error states, keyboard access, and mobile-friendly controls.

### What to build

Improve the supporter form presentation without changing backend behavior. Group required details and optional context, add helper text where it reduces hesitation, preserve browser validation, and keep existing loading/success/error states accessible.

### Acceptance criteria

- [ ] Required and optional fields are visually distinguishable.
- [ ] Every field has a visible label and helper text where useful.
- [ ] Loading, success, duplicate, rate-limit, validation, and unexpected-error states remain visible.
- [ ] The form is keyboard accessible and uses visible focus states.
- [ ] Controls meet minimum practical touch target sizing.

---

## Phase 5: Add Funnel Measurement Hooks

**User stories**: The team can measure CTA clicks, form starts, form submissions, signup outcomes, and attribution-driven funnel behavior.

### What to build

Add optional client-side analytics hooks for important funnel interactions. Events should safely no-op when an analytics provider is absent and should preserve current attribution capture.

### Acceptance criteria

- [ ] Primary and secondary CTA clicks can be observed.
- [ ] Form start, submission attempt, and signup result states can be observed.
- [ ] FAQ opens can be observed through the same helper.
- [ ] Analytics calls do not block navigation or form submission.
- [ ] No provider credentials or new dependencies are required.

---

## Phase 6: QA And Polish Pass

**User stories**: The improved funnel works without regressions across target breakpoints and existing flows.

### What to build

Verify the landing page and signup flow using the repository's available checks and local browser inspection. Fix visual, accessibility, responsiveness, and console issues found during verification.

### Acceptance criteria

- [ ] Lint passes or any remaining lint issue is documented.
- [ ] Typecheck passes.
- [ ] Tests pass.
- [ ] Production build passes.
- [ ] The modified landing page is inspected at mobile, tablet, and desktop widths.
- [ ] Keyboard navigation, visible focus states, form states, links, overflow, and console errors are checked.
