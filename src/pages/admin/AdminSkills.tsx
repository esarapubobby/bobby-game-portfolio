import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Plus, Trash2, Star, Cpu } from 'lucide-react';

export const AdminSkills: React.FC = () => {
  const { skills, saveSkill, deleteSkill, saveSkillCategory } = usePortfolio();

  const [newSkillName, setNewSkillName] = useState<{ [catId: string]: string }>({});
  const [newSkillHighlight, setNewSkillHighlight] = useState<{ [catId: string]: boolean }>({});
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddSkill = async (categoryId: string) => {
    const name = newSkillName[categoryId]?.trim();
    if (!name) return;

    await saveSkill(categoryId, name, Boolean(newSkillHighlight[categoryId]));
    setNewSkillName({ ...newSkillName, [categoryId]: '' });
    setNewSkillHighlight({ ...newSkillHighlight, [categoryId]: false });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const id = `cat-${Date.now()}`;
    await saveSkillCategory({
      id,
      name: newCategoryName.trim(),
      description: 'Technical competencies and tools.',
      skills: [],
      sortOrder: skills.length + 1,
    });
    setNewCategoryName('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          Skills & Technical Competencies
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
          Organize your game development, programming, tools, and engineering proficiencies.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skills.map((category) => (
          <div
            key={category.id}
            className="p-6 rounded-2xl bg-[#111720] border border-white/10 flex flex-col justify-between space-y-5"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-accent" />
                  <h3 className="font-bold text-white text-base font-display">
                    {category.name}
                  </h3>
                </div>
                <span className="text-xs font-mono text-gray-400">
                  {category.skills.length} items
                </span>
              </div>

              {/* Skills List */}
              <div className="space-y-2 mt-4 max-h-64 overflow-y-auto pr-1">
                {category.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs font-mono group"
                  >
                    <span className="flex items-center gap-2 text-gray-200">
                      {skill.highlight ? (
                        <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                      )}
                      {skill.name}
                    </span>

                    <button
                      onClick={() => deleteSkill(category.id, skill.id)}
                      className="p-1 rounded text-gray-500 hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity"
                      title="Delete skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Skill to this Category Form */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillName[category.id] || ''}
                  onChange={(e) =>
                    setNewSkillName({ ...newSkillName, [category.id]: e.target.value })
                  }
                  placeholder="New skill (e.g. NavMesh AI)"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-accent font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(category.id);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(category.id)}
                  className="px-3 py-1.5 rounded-lg bg-accent text-black font-bold text-xs uppercase font-mono tracking-wider hover:bg-accent-hover transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <label className="flex items-center gap-2 text-[11px] font-mono text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(newSkillHighlight[category.id])}
                  onChange={(e) =>
                    setNewSkillHighlight({ ...newSkillHighlight, [category.id]: e.target.checked })
                  }
                  className="w-3.5 h-3.5 rounded text-accent bg-black border-white/20"
                />
                <span>Highlight as priority competency</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Category Card */}
      <form
        onSubmit={handleAddCategory}
        className="p-6 rounded-2xl bg-[#111720] border border-white/10 flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="flex-1 w-full">
          <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
            Create New Skill Group
          </label>
          <input
            type="text"
            required
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g. Shaders & Graphics, Multiplayer Networking"
            className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-colors self-end"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};
