import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Code, Globe, Sparkles } from 'lucide-react';

interface EmbedModalProps {
  onClose: () => void;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [copiedButton, setCopiedButton] = useState(false);
  const [embedTab, setEmbedTab] = useState<'link' | 'iframe' | 'button'>('link');

  const gameUrl = typeof window !== 'undefined' ? window.location.href : 'https://your-website.com/astroquest';

  const iframeSnippet = `<iframe
  src="${gameUrl}"
  width="100%"
  height="720"
  style="border: none; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);"
  allow="fullscreen"
  title="AstroQuest: Relics of the Moon and Mars"
></iframe>`;

  const buttonSnippet = `<!-- Add this button to your website navbar or landing page -->
<a
  href="${gameUrl}"
  target="_blank"
  rel="noopener noreferrer"
  style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a; font-weight: 700; font-family: sans-serif; font-size: 14px; text-decoration: none; border-radius: 9999px; box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.3);"
>
  🚀 Play AstroQuest: Moon & Mars Game
</a>`;

  const copyToClipboard = (text: string, type: 'link' | 'iframe' | 'button') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (type === 'iframe') {
      setCopiedIframe(true);
      setTimeout(() => setCopiedIframe(false), 2000);
    } else {
      setCopiedButton(true);
      setTimeout(() => setCopiedButton(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Link or Embed in Your Website</h2>
              <p className="text-xs text-slate-400">Easily integrate this game into your organization or personal website</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex gap-2">
          <button
            onClick={() => setEmbedTab('link')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              embedTab === 'link' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Direct URL Link
          </button>
          <button
            onClick={() => setEmbedTab('iframe')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              embedTab === 'iframe' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Interactive iFrame Embed
          </button>
          <button
            onClick={() => setEmbedTab('button')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              embedTab === 'button' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Play Button Widget
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {embedTab === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Direct Shareable Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={gameUrl}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-amber-300 font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(gameUrl, 'link')}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-slate-200">Where to use this link:</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li>In your website navigation bar (e.g. "Games" or "Space Quest")</li>
                  <li>In school, museum, or educational newsletters and social media</li>
                  <li>Linked from classroom study materials or space science blogs</li>
                </ul>
              </div>
            </div>
          )}

          {embedTab === 'iframe' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    HTML &lt;iframe&gt; Code
                  </label>
                  <button
                    onClick={() => copyToClipboard(iframeSnippet, 'iframe')}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedIframe ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIframe ? 'Copied code!' : 'Copy snippet'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
                  {iframeSnippet}
                </pre>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-slate-200">How to paste into website builders:</p>
                <p className="text-slate-400">
                  Paste this snippet directly into any <strong>Custom HTML / Embed Block</strong> in WordPress, Squarespace, Wix, Webflow, Shopify, or your React / Next.js codebase.
                </p>
              </div>
            </div>
          )}

          {embedTab === 'button' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Standalone HTML Button Code
                  </label>
                  <button
                    onClick={() => copyToClipboard(buttonSnippet, 'button')}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedButton ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedButton ? 'Copied snippet!' : 'Copy button HTML'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] font-mono text-amber-300/90 overflow-x-auto whitespace-pre leading-relaxed">
                  {buttonSnippet}
                </pre>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400">Button Live Preview:</span>
                <div
                  dangerouslySetInnerHTML={{ __html: buttonSnippet }}
                  className="pointer-events-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-800/60 border-t border-slate-700/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
