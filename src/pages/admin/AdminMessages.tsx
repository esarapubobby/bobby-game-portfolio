import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Trash2, Clock, User, AtSign, Inbox } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const { messages, markMessageRead, deleteMessage } = usePortfolio();

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          Contact Inquiries & Messages
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
          Review messages submitted through the public portfolio contact form.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#111720] border border-white/10 p-8 space-y-3">
          <Inbox className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-base font-bold text-white font-display">Inbox is Empty</h3>
          <p className="text-xs text-gray-400 font-mono max-w-md mx-auto">
            When recruiters, indie game studios, or fellow developers send a message from the website, it will be securely delivered and logged here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-colors ${
                msg.read
                  ? 'bg-[#111720] border-white/10'
                  : 'bg-[#131b26] border-accent/40 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base font-display">
                      {msg.name}
                    </h3>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                    >
                      <AtSign className="w-3 h-3" />
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-sm text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
                {msg.message}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-3">
                <a
                  href={`mailto:${msg.email}?subject=Re: Game Development Inquiry&body=Hi ${msg.name},`}
                  className="px-3 py-1.5 rounded-lg bg-accent text-black font-bold text-xs uppercase font-mono tracking-wider hover:bg-accent-hover transition-colors"
                >
                  Reply via Email
                </a>

                {!msg.read && (
                  <button
                    onClick={() => markMessageRead(msg.id)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-colors"
                  >
                    Mark as Read
                  </button>
                )}

                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
