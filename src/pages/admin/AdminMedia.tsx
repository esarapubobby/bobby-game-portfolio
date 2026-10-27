import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  FileImage,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Trash2,
  AlertCircle,
  Video,
  FileText,
  Search,
} from 'lucide-react';
import { BUTTON_INTERACTIONS } from '../../lib/animations';
import { isValidUrl } from '../../lib/urls';

interface AssetUrlItem {
  id: string;
  title: string;
  url: string;
  category: 'Image' | 'Video' | 'Document';
  source: string;
}

export const AdminMedia: React.FC = () => {
  const { projects, settings } = usePortfolio();

  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Image' | 'Video' | 'Document'>('All');

  // Custom added URLs stored in local reference list
  const [customAssets, setCustomAssets] = useState<AssetUrlItem[]>(() => {
    const saved = localStorage.getItem('bobby_admin_asset_urls');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'asset-deadzone',
            title: 'Deadzone Game Cover',
            url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
            category: 'Image',
            source: 'Stock / Unsplash',
          },
          {
            id: 'asset-survival',
            title: 'Survival Island Cover',
            url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
            category: 'Image',
            source: 'Stock / Unsplash',
          },
        ];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<'Image' | 'Video' | 'Document'>('Image');
  const [urlError, setUrlError] = useState<string | null>(null);

  // Collect all URLs currently used in projects and site settings
  const activeAssets = useMemo<AssetUrlItem[]>(() => {
    const list: AssetUrlItem[] = [];

    // Settings Resume
    if (settings.resumeUrl) {
      list.push({
        id: 'settings-resume',
        title: 'Bobby Esarapu Resume Link',
        url: settings.resumeUrl,
        category: 'Document',
        source: 'Site Settings',
      });
    }

    // Projects Covers and Screenshots
    projects.forEach((proj) => {
      if (proj.coverImage) {
        list.push({
          id: `proj-cover-${proj.id}`,
          title: `${proj.title} (Cover)`,
          url: proj.coverImage,
          category: 'Image',
          source: `Project: ${proj.title}`,
        });
      }
      proj.screenshots?.forEach((shot, sIdx) => {
        list.push({
          id: `proj-shot-${proj.id}-${sIdx}`,
          title: `${proj.title} (Screenshot #${sIdx + 1})`,
          url: shot,
          category: 'Image',
          source: `Project: ${proj.title}`,
        });
      });
      if (proj.gameplayVideoUrl) {
        list.push({
          id: `proj-video-${proj.id}`,
          title: `${proj.title} (Gameplay Video)`,
          url: proj.gameplayVideoUrl,
          category: 'Video',
          source: `Project: ${proj.title}`,
        });
      }
    });

    // Merge custom assets
    return [...list, ...customAssets];
  }, [projects, settings, customAssets]);

  const filteredAssets = useMemo(() => {
    return activeAssets.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'All' || item.category === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [activeAssets, searchTerm, filterType]);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    const trimmedUrl = newUrl.trim();
    if (!trimmedUrl) {
      setUrlError('Please enter a valid URL.');
      return;
    }
    if (!isValidUrl(trimmedUrl)) {
      setUrlError('Please enter a valid HTTP/HTTPS URL or root path.');
      return;
    }

    const newItem: AssetUrlItem = {
      id: `asset-${Date.now()}`,
      title: newTitle.trim() || 'Custom Asset',
      url: trimmedUrl,
      category: newCategory,
      source: 'Custom Asset Hub',
    };

    const updated = [newItem, ...customAssets];
    setCustomAssets(updated);
    localStorage.setItem('bobby_admin_asset_urls', JSON.stringify(updated));

    setNewTitle('');
    setNewUrl('');
  };

  const handleRemoveCustomAsset = (id: string) => {
    const updated = customAssets.filter((a) => a.id !== id);
    setCustomAssets(updated);
    localStorage.setItem('bobby_admin_asset_urls', JSON.stringify(updated));
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          Media & Asset URLs
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
          Manage, preview, and test external image, video, and document URLs used across your portfolio.
        </p>
      </div>

      {/* Add New Asset URL Form */}
      <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4 shadow-xl">
        <h2 className="font-bold text-white text-base font-display flex items-center gap-2">
          <FileImage className="w-5 h-5 text-accent" />
          <span>Add External Asset URL</span>
        </h2>
        <p className="text-xs text-gray-400 font-mono">
          Save verified external image, video, or document URLs to reference when creating or editing projects.
        </p>

        <form onSubmit={handleAddAsset} className="space-y-4 pt-2">
          {urlError && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{urlError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Asset Label (e.g. Hero Gameplay Teaser)"
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-accent focus:outline-none"
              >
                <option value="Image">Image</option>
                <option value="Video">Video</option>
                <option value="Document">Document</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <input
                type="url"
                required
                value={newUrl}
                onChange={(e) => {
                  setNewUrl(e.target.value);
                  setUrlError(null);
                }}
                placeholder="https://... (image, video, or drive link)"
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <motion.button
                type="submit"
                {...BUTTON_INTERACTIONS}
                className="w-full h-full min-h-[38px] px-4 py-2 rounded-lg bg-accent text-black font-bold text-xs uppercase font-mono tracking-wider hover:bg-accent-hover transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add URL</span>
              </motion.button>
            </div>
          </div>
        </form>
      </div>

      {/* Asset Explorer & Active Link Directory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-white text-lg font-display">
              Portfolio Assets Directory ({filteredAssets.length})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search assets..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-[#111720] border border-white/10 text-white text-xs font-mono focus:border-accent focus:outline-none w-48 sm:w-60"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 bg-[#111720] p-1 rounded-lg border border-white/10 text-xs font-mono">
              {(['All', 'Image', 'Video', 'Document'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                    filterType === type ? 'bg-accent text-black font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Asset Cards Grid */}
        {filteredAssets.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#111720] border border-white/5 font-mono text-xs text-gray-400">
            No asset URLs matching your query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="p-4 rounded-xl bg-[#111720] border border-white/10 hover:border-accent/40 transition-colors flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-accent font-semibold">
                      {asset.category}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 truncate max-w-[140px]" title={asset.source}>
                      {asset.source}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white font-display truncate" title={asset.title}>
                    {asset.title}
                  </h3>

                  {/* Thumbnail Preview for Images */}
                  {asset.category === 'Image' ? (
                    <div className="mt-2.5 w-full h-32 rounded-lg overflow-hidden bg-black/40 border border-white/5 relative flex items-center justify-center">
                      <img
                        src={asset.url}
                        alt={asset.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : asset.category === 'Video' ? (
                    <div className="mt-2.5 w-full h-24 rounded-lg bg-black/50 border border-white/5 flex flex-col items-center justify-center gap-1.5 text-gray-400">
                      <Video className="w-6 h-6 text-accent" />
                      <span className="text-[10px] font-mono">External Video Link</span>
                    </div>
                  ) : (
                    <div className="mt-2.5 w-full h-24 rounded-lg bg-black/50 border border-white/5 flex flex-col items-center justify-center gap-1.5 text-gray-400">
                      <FileText className="w-6 h-6 text-accent" />
                      <span className="text-[10px] font-mono">Document / Resume Link</span>
                    </div>
                  )}

                  <p className="mt-2 text-[11px] font-mono text-gray-400 truncate bg-black/30 p-1.5 rounded border border-white/5" title={asset.url}>
                    {asset.url}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(asset.url)}
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1 transition-colors"
                      title="Copy URL to clipboard"
                    >
                      {copiedUrl === asset.url ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-accent" />
                          <span className="text-accent text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Copy URL</span>
                        </>
                      )}
                    </button>

                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      title="Test URL in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {asset.source === 'Custom Asset Hub' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomAsset(asset.id)}
                      className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                      title="Remove custom asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
