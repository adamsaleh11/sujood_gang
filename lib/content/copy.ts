type CtaCopy = {
  label: string;
  href: string;
};

type LinkCopy = CtaCopy & {
  id: string;
};

type EditorialSectionCopy = {
  eyebrow: string;
  title: string;
  body: string;
};

type MemberBenefitCopy = {
  id: string;
  title: string;
  body: string;
};

type FaqCopy = {
  id: string;
  question: string;
  answer: string;
};

type EmailCopy = {
  subject: string;
  preview: string;
  heading: string;
  body: string[];
  ctaLabel: string;
  footerNote: string;
};

type SiteCopy = {
  brand: {
    name: string;
    tagline: string;
  };
  accessibility: {
    skipToMain: string;
    openMenu: string;
    closeMenu: string;
    primaryNavigation: string;
    footerNavigation: string;
    socialLinks: string;
    faqRegion: string;
  };
  nav: {
    links: LinkCopy[];
  };
  pendingClient: {
    legalName: string;
    address: string;
    contactEmail: string;
    socialUrls: string[];
  };
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  hero: {
    badgeLabel: string;
    mission: string;
    headline: string;
    supportingLine: string;
    primaryCta: CtaCopy;
    secondaryCta: CtaCopy;
    posterAlt: string;
    video: {
      enabled: boolean;
      posterSrc: string;
      sources: {
        src: string;
        type: string;
      }[];
      captionsSrc: string;
      transcriptHref: string;
      controlsLabel: string;
    };
  };
  strengthThroughSubmission: EditorialSectionCopy;
  vision: EditorialSectionCopy;
  community: EditorialSectionCopy & {
    emptyStateLabel: string;
  };
  merchandise: EditorialSectionCopy & {
    notifyCta: CtaCopy;
    imageAlt: string;
    upcomingLabel: string;
    items: {
      id: string;
      name: string;
      status: string;
    }[];
  };
  memberBenefits: MemberBenefitCopy[];
  join: {
    eyebrow: string;
    title: string;
    body: string;
    formIntro: string;
    submitLabel: string;
    successTitle: string;
    successBody: string;
    confirmationExpectation: string;
  };
  faq: FaqCopy[];
  footer: {
    contactLabel: string;
    organizationLabel: string;
    legalNameLabel: string;
    addressLabel: string;
    contactEmailLabel: string;
    socialsLabel: string;
    pendingLabel: string;
    privacyLink: CtaCopy;
    termsLink: CtaCopy;
    manageLink: CtaCopy;
  };
  legal: {
    privacy: {
      title: string;
      intro: string;
      reviewNotice: string;
      fieldPurposeTitle: string;
      fields: {
        name: string;
        purpose: string;
      }[];
    };
    terms: {
      title: string;
      intro: string;
      reviewNotice: string;
      sections: {
        title: string;
        body: string;
      }[];
    };
  };
  systemPages: {
    notFound: {
      code: string;
      title: string;
      body: string;
      cta: CtaCopy;
    };
    error: {
      code: string;
      title: string;
      body: string;
      ctaLabel: string;
    };
    verify: {
      metaTitle: string;
      successEyebrow: string;
      successTitle: string;
      successBody: string;
      alreadyVerifiedEyebrow: string;
      alreadyVerifiedTitle: string;
      alreadyVerifiedBody: string;
      expiredEyebrow: string;
      expiredTitle: string;
      expiredBody: string;
      emailLabel: string;
      emailPlaceholder: string;
      resendLabel: string;
      invalidEyebrow: string;
      invalidTitle: string;
      invalidBody: string;
      returnCta: CtaCopy;
      referralCtaLabel: string;
    };
  };
  emails: {
    confirmation: EmailCopy;
    welcome: EmailCopy;
  };
};

export const PENDING_CLIENT_LEGAL_NAME = ""; // PENDING_CLIENT — renders nothing until confirmed.
export const PENDING_CLIENT_ADDRESS = ""; // PENDING_CLIENT — renders nothing until confirmed.
export const PENDING_CLIENT_CONTACT_EMAIL = ""; // PENDING_CLIENT — renders nothing until confirmed.
export const PENDING_CLIENT_SOCIAL_URLS: string[] = []; // PENDING_CLIENT — renders nothing until confirmed.

export const siteCopy = {
  brand: {
    name: "Sujood Gang", // DRAFT(ai)
    tagline: "Strength Through Submission", // DRAFT(ai)
  },
  accessibility: {
    skipToMain: "Skip to main content", // DRAFT(ai)
    openMenu: "Open navigation menu", // DRAFT(ai)
    closeMenu: "Close navigation menu", // DRAFT(ai)
    primaryNavigation: "Primary navigation", // DRAFT(ai)
    footerNavigation: "Footer navigation", // DRAFT(ai)
    socialLinks: "Social links", // DRAFT(ai)
    faqRegion: "Frequently asked questions", // DRAFT(ai)
  },
  nav: {
    links: [
      {
        id: "mission", // DRAFT(ai)
        label: "Mission", // DRAFT(ai)
        href: "#mission", // DRAFT(ai)
      },
      {
        id: "community", // DRAFT(ai)
        label: "Community", // DRAFT(ai)
        href: "#community", // DRAFT(ai)
      },
      {
        id: "merchandise", // DRAFT(ai)
        label: "Merchandise", // DRAFT(ai)
        href: "#merchandise", // DRAFT(ai)
      },
      {
        id: "faq", // DRAFT(ai)
        label: "FAQ", // DRAFT(ai)
        href: "#faq", // DRAFT(ai)
      },
    ],
  },
  pendingClient: {
    legalName: PENDING_CLIENT_LEGAL_NAME,
    address: PENDING_CLIENT_ADDRESS,
    contactEmail: PENDING_CLIENT_CONTACT_EMAIL,
    socialUrls: PENDING_CLIENT_SOCIAL_URLS,
  },
  meta: {
    title: "Sujood Gang | Strength Through Submission", // DRAFT(ai)
    description:
      "Join Sujood Gang as a free supporter and be part of a global community vision united by sujood, discipline, and belonging.", // DRAFT(ai)
    ogTitle: "Sujood Gang | Strength Through Submission", // DRAFT(ai)
    ogDescription:
      "A free supporter signup for people who respect the vision of a global community united by sujood.", // DRAFT(ai)
  },
  hero: {
    badgeLabel: "Free supporter signup", // DRAFT(ai)
    mission:
      "A global supporter community united by sujood, discipline, and belonging.", // DRAFT(ai)
    headline: "Strength Through Submission", // DRAFT(ai)
    supportingLine:
      "Join Sujood Gang as a free supporter and take part in a community vision shaped by humility, presence, and shared intention.", // DRAFT(ai)
    primaryCta: {
      label: "Join as a supporter", // DRAFT(ai)
      href: "#join", // DRAFT(ai)
    },
    secondaryCta: {
      label: "Explore the vision", // DRAFT(ai)
      href: "#vision", // DRAFT(ai)
    },
    posterAlt: "Editorial placeholder for the Sujood Gang mission video.", // DRAFT(ai)
    video: {
      enabled: false, // DRAFT(ai)
      posterSrc: "/images/hero-poster-placeholder.svg", // DRAFT(ai)
      sources: [
        {
          src: "/video/sujood-gang-hero.webm", // DRAFT(ai)
          type: "video/webm", // DRAFT(ai)
        },
        {
          src: "/video/sujood-gang-hero.mp4", // DRAFT(ai)
          type: "video/mp4", // DRAFT(ai)
        },
      ],
      captionsSrc: "/video/sujood-gang-hero.vtt", // DRAFT(ai)
      transcriptHref: "/video/sujood-gang-hero-transcript.txt", // DRAFT(ai)
      controlsLabel: "Play mission video", // DRAFT(ai)
    },
  },
  strengthThroughSubmission: {
    eyebrow: "Strength Through Submission", // DRAFT(ai)
    title: "A posture that reshapes the person", // DRAFT(ai)
    body: "Sujood is a moment of complete lowering, but it is not a retreat from strength. It is a return to order: the noise quiets, the ego loosens, and the body remembers what the heart is trying to practice. The idea behind Sujood Gang begins from that image. It speaks to people who see discipline and humility as companions, not opposites, and who want a public identity rooted in something quieter than performance. The name is bold; the posture behind it is grounded. The aim is to gather supporters around that tension with care, restraint, and conviction.", // DRAFT(ai)
  },
  vision: {
    eyebrow: "Vision", // DRAFT(ai)
    title: "A global community, built with restraint", // DRAFT(ai)
    body: "The vision is to build the world's largest community united by sujood: a visible network of supporters connected by belonging rather than noise. It starts with a free signup, a confirmed email, and a shared sense that this identity can travel across countries and cities without losing its center. Scale matters only if it remains human. Sujood Gang should feel global in ambition and personal in tone.", // DRAFT(ai)
  },
  community: {
    eyebrow: "Community", // DRAFT(ai)
    title: "Real support, shown only when it is real", // DRAFT(ai)
    body: "The community story should grow from confirmed people, verified participation, and actual moments worth sharing. Until that evidence exists, Sujood Gang keeps the page restrained and lets the invitation stand on its own.", // DRAFT(ai)
    emptyStateLabel: "Community evidence pending confirmation.", // DRAFT(ai)
  },
  merchandise: {
    eyebrow: "Merchandise", // DRAFT(ai)
    title: "Objects for a vision still taking shape", // DRAFT(ai)
    body: "Merchandise is treated as part of the identity, not as proof of momentum. The first pieces should feel considered, useful, and aligned with the posture behind the name. Supporters can be notified when confirmed releases are ready.", // DRAFT(ai)
    notifyCta: {
      label: "Notify me about merch", // DRAFT(ai)
      href: "#join", // DRAFT(ai)
    },
    imageAlt: "Minimal upcoming merchandise layout for Sujood Gang.", // DRAFT(ai)
    upcomingLabel: "Upcoming", // DRAFT(ai)
    items: [
      {
        id: "daily-wear", // DRAFT(ai)
        name: "Daily wear", // DRAFT(ai)
        status: "upcoming", // DRAFT(ai)
      },
      {
        id: "supporter-pieces", // DRAFT(ai)
        name: "Supporter pieces", // DRAFT(ai)
        status: "upcoming", // DRAFT(ai)
      },
      {
        id: "limited-releases", // DRAFT(ai)
        name: "Limited releases", // DRAFT(ai)
        status: "upcoming", // DRAFT(ai)
      },
    ],
  },
  memberBenefits: [
    {
      id: "community-belonging", // DRAFT(ai)
      title: "Community belonging", // DRAFT(ai) — confirm with client
      body: "Stand with people who respect the purpose of Sujood Gang and want to see the vision grow.", // DRAFT(ai) — confirm with client
    },
    {
      id: "brand-updates", // DRAFT(ai)
      title: "Occasional updates", // DRAFT(ai) — confirm with client
      body: "Receive measured updates as the project develops, including important announcements when they are ready to share.", // DRAFT(ai) — confirm with client
    },
    {
      id: "early-merch-access", // DRAFT(ai)
      title: "Early merch access", // DRAFT(ai) — confirm with client
      body: "Get early access to upcoming merchandise if and when it becomes available.", // DRAFT(ai) — confirm with client
    },
    {
      id: "referral-link", // DRAFT(ai)
      title: "A referral link", // DRAFT(ai) — confirm with client
      body: "Receive a personal link so you can invite others to join the supporter list.", // DRAFT(ai) — confirm with client
    },
  ],
  join: {
    eyebrow: "Join", // DRAFT(ai)
    title: "Become a free supporter", // DRAFT(ai)
    body: "Add your name, email, country, city, and optional Instagram handle to join the supporter list. There is no cost to sign up.", // DRAFT(ai)
    formIntro:
      "Use an email address you can confirm. Your signup is not complete until you verify it from your inbox.", // DRAFT(ai)
    submitLabel: "Join as a supporter", // DRAFT(ai)
    successTitle: "Check your inbox", // DRAFT(ai)
    successBody:
      "We sent a confirmation email. Once you confirm, you will be added to the supporter list and receive occasional updates.", // DRAFT(ai)
    confirmationExpectation:
      "If the email does not arrive, check spam or promotions before trying again.", // DRAFT(ai)
  },
  faq: [
    {
      id: "what-is-sujood-gang", // DRAFT(ai)
      question: "What is Sujood Gang?", // DRAFT(ai)
      answer:
        "Sujood Gang is a community vision called Strength Through Submission. It aspires to become a free supporter network united by sujood, discipline, humility, and belonging.", // DRAFT(ai)
    },
    {
      id: "who-can-join", // DRAFT(ai)
      question: "Who can join?", // DRAFT(ai)
      answer:
        "Anyone who respects the purpose of Sujood Gang may sign up as a supporter. Final community guidelines and participation details are pending client confirmation.", // DRAFT(ai)
    },
    {
      id: "does-it-cost-anything", // DRAFT(ai)
      question: "Does it cost anything to join?", // DRAFT(ai)
      answer:
        "No. Joining as a supporter is free. Merchandise may become available separately in the future, but supporter signup does not require a purchase.", // DRAFT(ai)
    },
    {
      id: "what-happens-after-signup", // DRAFT(ai)
      question: "What happens after I sign up?", // DRAFT(ai)
      answer:
        "You will be asked to confirm your email. After confirmation, your details are added to the supporter list and may be used to send occasional project updates.", // DRAFT(ai)
    },
    {
      id: "what-emails-will-i-receive", // DRAFT(ai)
      question: "What emails will I receive?", // DRAFT(ai)
      answer:
        "You should expect a confirmation email, a welcome email after confirmation, and occasional updates about the project as details become ready to share.", // DRAFT(ai)
    },
    {
      id: "where-is-sujood-gang-active", // DRAFT(ai)
      question: "Where is Sujood Gang active?", // DRAFT(ai)
      answer:
        "The vision is global, and the current signup is online. Specific locations, chapters, events, or local activity have not been confirmed.", // DRAFT(ai)
    },
    {
      id: "is-merch-available", // DRAFT(ai)
      question: "Is merchandise available?", // DRAFT(ai)
      answer:
        "Merchandise is treated as upcoming until the client confirms its status. Supporters may receive early access if and when merchandise becomes available.", // DRAFT(ai)
    },
    {
      id: "how-is-my-data-used", // DRAFT(ai)
      question: "How will my data be used?", // DRAFT(ai)
      answer:
        "Your signup details are used to manage your supporter record, send requested emails, and understand where interest is coming from. Full legal and privacy details are pending client confirmation.", // DRAFT(ai)
    },
    {
      id: "can-i-unsubscribe", // DRAFT(ai)
      question: "Can I unsubscribe?", // DRAFT(ai)
      answer:
        "Yes. Marketing or update emails should include an unsubscribe option where required. Unsubscribing removes you from future non-transactional emails.", // DRAFT(ai)
    },
  ],
  footer: {
    contactLabel: "Contact", // DRAFT(ai)
    organizationLabel: "Organization", // DRAFT(ai)
    legalNameLabel: "Legal name", // DRAFT(ai)
    addressLabel: "Address", // DRAFT(ai)
    contactEmailLabel: "Email", // DRAFT(ai)
    socialsLabel: "Socials", // DRAFT(ai)
    pendingLabel: "PENDING_CLIENT", // DRAFT(ai)
    privacyLink: {
      label: "Privacy", // DRAFT(ai)
      href: "/privacy", // DRAFT(ai)
    },
    termsLink: {
      label: "Terms", // DRAFT(ai)
      href: "/terms", // DRAFT(ai)
    },
    manageLink: {
      label: "Unsubscribe or manage updates", // DRAFT(ai)
      href: "#join", // DRAFT(ai)
    },
  },
  legal: {
    privacy: {
      title: "Privacy", // DRAFT(ai)
      intro:
        "This placeholder privacy page explains the current supporter signup data use at a high level. Final legal language is pending client and legal review.", // DRAFT(ai)
      reviewNotice:
        "Final privacy language requires legal review before launch.", // DRAFT(ai)
      fieldPurposeTitle: "Collected fields and purpose", // DRAFT(ai)
      fields: [
        {
          name: "Name", // DRAFT(ai)
          purpose:
            "Used to identify the supporter record and personalize supporter communications.", // DRAFT(ai)
        },
        {
          name: "Email", // DRAFT(ai)
          purpose:
            "Used to confirm signup, send welcome messages, manage unsubscribe requests, and deliver occasional project updates.", // DRAFT(ai)
        },
        {
          name: "Country", // DRAFT(ai)
          purpose:
            "Used to understand where supporter interest is coming from and shape future community planning.", // DRAFT(ai)
        },
        {
          name: "City", // DRAFT(ai)
          purpose:
            "Used to understand local interest at a city level for possible future community planning.", // DRAFT(ai)
        },
        {
          name: "Instagram handle", // DRAFT(ai)
          purpose:
            "Optional field used to connect supporter records with social identity when the supporter chooses to provide it.", // DRAFT(ai)
        },
        {
          name: "Referral information", // DRAFT(ai)
          purpose:
            "Used to attribute invitations and understand how supporters are discovering Sujood Gang.", // DRAFT(ai)
        },
      ],
    },
    terms: {
      title: "Terms", // DRAFT(ai)
      intro:
        "These placeholder terms describe the supporter signup experience in plain language. Final legal language is pending client and legal review.", // DRAFT(ai)
      reviewNotice: "Final terms require legal review before launch.", // DRAFT(ai)
      sections: [
        {
          title: "Supporter signup", // DRAFT(ai)
          body: "Signing up as a supporter is free and does not create a purchase, membership fee, event registration, or guaranteed benefit.", // DRAFT(ai)
        },
        {
          title: "Project updates", // DRAFT(ai)
          body: "Supporters may receive confirmation, welcome, and occasional update emails related to Sujood Gang.", // DRAFT(ai)
        },
        {
          title: "Merchandise", // DRAFT(ai)
          body: "Merchandise is upcoming until confirmed by the client. Any product availability, price, shipping, or purchase terms must be added later.", // DRAFT(ai)
        },
      ],
    },
  },
  systemPages: {
    notFound: {
      code: "404", // DRAFT(ai)
      title: "This page went missing.", // DRAFT(ai)
      body: "The page you're looking for doesn't exist or has moved.", // DRAFT(ai)
      cta: {
        label: "Back home", // DRAFT(ai)
        href: "/", // DRAFT(ai)
      },
    },
    error: {
      code: "500", // DRAFT(ai)
      title: "Something went wrong.", // DRAFT(ai)
      body: "An unexpected error occurred. Try again. If it keeps happening, come back a little later.", // DRAFT(ai)
      ctaLabel: "Try again", // DRAFT(ai)
    },
    verify: {
      metaTitle: "Verify email", // DRAFT(ai)
      successEyebrow: "Email verified", // DRAFT(ai)
      successTitle: "You are on the supporter list.", // DRAFT(ai)
      successBody:
        "Your welcome email is on its way with your personal referral link.", // DRAFT(ai)
      alreadyVerifiedEyebrow: "Already verified", // DRAFT(ai)
      alreadyVerifiedTitle: "This email is already confirmed.", // DRAFT(ai)
      alreadyVerifiedBody:
        "Your supporter membership is active. You can keep using your referral link.", // DRAFT(ai)
      expiredEyebrow: "Link expired", // DRAFT(ai)
      expiredTitle: "Request a fresh verification email.", // DRAFT(ai)
      expiredBody:
        "Verification links expire after 48 hours. Enter your email and we will send a new link if there is a pending signup.", // DRAFT(ai)
      emailLabel: "Email address", // DRAFT(ai)
      emailPlaceholder: "you@example.com", // DRAFT(ai)
      resendLabel: "Resend", // DRAFT(ai)
      invalidEyebrow: "Invalid link", // DRAFT(ai)
      invalidTitle: "This verification link cannot be used.", // DRAFT(ai)
      invalidBody:
        "Check that you opened the full link from your email, or request a new signup confirmation.", // DRAFT(ai)
      returnCta: {
        label: "Return to signup", // DRAFT(ai)
        href: "/#join", // DRAFT(ai)
      },
      referralCtaLabel: "Open referral link", // DRAFT(ai)
    },
  },
  emails: {
    confirmation: {
      subject: "Confirm your Sujood Gang signup", // DRAFT(ai)
      preview: "One more step to join the supporter list.", // DRAFT(ai)
      heading: "Confirm your email", // DRAFT(ai)
      body: [
        "Thank you for signing up to support Sujood Gang.", // DRAFT(ai)
        "Please confirm your email address so we can add you to the supporter list. Until you confirm, your signup is not complete.", // DRAFT(ai)
        "After confirmation, you may receive occasional updates as the project develops.", // DRAFT(ai)
      ],
      ctaLabel: "Confirm my email", // DRAFT(ai)
      footerNote:
        "If you did not request this email, you can ignore it and no signup will be completed.", // DRAFT(ai)
    },
    welcome: {
      subject: "Welcome to Sujood Gang", // DRAFT(ai)
      preview: "You are now on the supporter list.", // DRAFT(ai)
      heading: "You are confirmed", // DRAFT(ai)
      body: [
        "Your email has been confirmed, and you are now on the Sujood Gang supporter list.", // DRAFT(ai)
        "The vision is to build a global community united by sujood, discipline, and belonging. For now, you will receive measured updates as the project develops.", // DRAFT(ai)
        "If you know someone who respects the purpose, you will be able to share your referral link when that feature is ready.", // DRAFT(ai)
      ],
      ctaLabel: "Return to Sujood Gang", // DRAFT(ai)
      footerNote:
        "You can unsubscribe from non-transactional updates when unsubscribe options are available in future emails.", // DRAFT(ai)
    },
  },
} as const satisfies SiteCopy;

export type {
  CtaCopy,
  EditorialSectionCopy,
  EmailCopy,
  FaqCopy,
  LinkCopy,
  MemberBenefitCopy,
  SiteCopy,
};
