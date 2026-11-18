'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// The support address as a mailto link, plus a one-tap copy for people whose
// mail app isn't set up on this device.
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <a href={`mailto:${email}`} className="font-semibold text-grape underline-offset-4 hover:underline">
        {email}
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {
            window.location.href = `mailto:${email}`;
          }
        }}
        className="type-eyebrow inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[10px] text-gray-700 transition-colors hover:bg-violet-soft hover:text-violet"
      >
        {copied ? <Check className="h-3 w-3" strokeWidth={3} /> : <Copy className="h-3 w-3" />}
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </span>
  );
}
