import React from 'react'

function WarningRow({ text }) {
    return (
        <div className="flex items-start gap-3 text-[26px] leading-[1.2] font-medium text-white">
            <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-red-400/80 text-[16px] text-red-400">!</span>
            <span className="text-[22px] font-medium tracking-[-0.02em] text-white/95">{text}</span>
        </div>
    )
}

export default function GitHubSubmissionPage() {
    return (
        <div className="min-h-screen bg-[#121417] text-white">
            <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col">
                <header className="px-5 pb-4 pt-3">
                    <div className="mb-4 flex items-center justify-between text-[14px] font-medium text-white/80">
                        <div className="flex items-center gap-2 text-white/90">
                            <span>9:52</span>
                            <span className="text-white/50">Thu, 17 Sept</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                            <span>◔</span>
                            <span className="text-[12px]">79</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button aria-label="Back" className="text-[38px] leading-none text-white/90">←</button>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-br from-sky-300 via-sky-200 to-amber-200 text-[18px] font-bold text-slate-700">
                                A
                            </div>
                            <button aria-label="Theme" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white/80">
                                ☾
                            </button>
                            <button aria-label="Share" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white/80">
                                ↗
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-5 pb-6 pt-3">
                    <h1 className="mb-8 text-[56px] font-bold tracking-[-0.05em] text-white">GitHub Submission</h1>

                    <div className="space-y-8 text-white/95">
                        <div className="space-y-3">
                            <h2 className="text-[54px] font-bold leading-[0.95] tracking-[-0.05em] text-white">Submit GitHub Link</h2>
                            <p className="max-w-[340px] text-[24px] leading-[1.45] tracking-[-0.03em] text-white/80">
                                Submit your GitHub repository link before this round closes. Submitting qualifies you automatically. Missing the deadline disqualifies you from every later round.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <WarningRow text="Submit only one GitHub repository." />
                            <WarningRow text="Extra submissions beyond that won't be considered." />
                            <WarningRow text="Your frontend and backend code must live in that same repository, not split across two." />
                            <WarningRow text="Make the repository public. It must be viewable by anyone with the link, with no sign-in or access request required." />
                            <WarningRow text="A private repository disqualifies you immediately. Double check its visibility before you submit." />
                        </div>
                    </div>

                    <div className="mt-8 space-y-2">
                        <label className="flex items-center gap-2 text-[15px] font-medium text-white/80">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/25 text-[12px] text-white/65">🔗</span>
                            <span>Link 1</span>
                        </label>
                        <div className="rounded-2xl border border-[#6d6ae8]/80 bg-[#1e2026] shadow-[0_0_0_1px_rgba(109,106,232,0.45)]">
                            <input
                                value="https://github.com/owner/repo"
                                readOnly
                                className="w-full border-0 bg-transparent px-4 py-4 text-[20px] text-white/80 outline-none placeholder:text-white/40"
                            />
                        </div>
                    </div>
                </main>

                <footer className="border-t border-white/10 bg-[#121417] px-5 pb-4 pt-3">
                    <div className="flex items-center justify-between text-white/75">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[26px]">⋮⋮</div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[28px]">✦</div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5d7bff] text-[26px] text-white shadow-lg shadow-[#5d7bff]/35">C</div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[26px]">◉</div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[26px]">□</div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[26px]">▥</div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[26px]">◁</div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
