import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-8 sm:py-12 px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-6 mt-auto border-t border-zinc-200/10 bg-surface pb-[max(2rem,env(safe-area-inset-bottom,0px))]">
      <div className="text-xs font-body text-zinc-500 text-center md:text-left">
        © 2026 한심지수. All rights reserved. Precision Analytics with Cheer.
      </div>
      <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3">
        <Link
          href="/terms"
          className="text-xs font-body text-zinc-500 hover:text-zinc-800 transition-colors duration-200"
        >
          이용약관
        </Link>
        <Link
          href="/privacy"
          className="text-xs font-body text-zinc-500 hover:text-zinc-800 transition-colors duration-200"
        >
          개인정보처리방침
        </Link>
        <Link
          href="/data-source"
          className="text-xs font-body text-zinc-500 hover:text-zinc-800 transition-colors duration-200"
        >
          데이터 출처
        </Link>
        <Link
          href="/api"
          className="text-xs font-body text-zinc-500 hover:text-zinc-800 transition-colors duration-200"
        >
          API 문의
        </Link>
      </div>
    </footer>
  );
}
