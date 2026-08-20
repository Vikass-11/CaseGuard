'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('case_worker');

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/register', { name, email, password, role });
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Account created successfully!');
      router.push('/dashboard');
    },
    onError: (err: any) => {
      const message = err.response?.data?.error?.message || err.response?.data?.message || 'Registration failed';
      toast.error(message);
    }
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0c] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/[0.03] via-[#0a0a0c] to-[#0a0a0c] font-sans selection:bg-white/20">
      
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

      <div className="w-full max-w-[480px] p-10 relative z-10">
        
        <div className="relative bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] border border-white/[0.05] p-12 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-[2rem] pointer-events-none" />
          
          <div className="text-left mb-10 relative">
            <h1 className="text-4xl font-bold text-white tracking-tight uppercase" style={{ fontFamily: 'var(--font-sans)', fontStretch: 'condensed' }}>
              Create<br/>Account
            </h1>
            <p className="text-[#a1a1aa] mt-3 text-sm font-medium tracking-wide">Enter your details to get started.</p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-6 relative">
            <div>
              <input
                type="text"
                className="block w-full bg-[#111113] border border-white/10 px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="FULL NAME"
                required
              />
            </div>
            <div>
              <input
                type="email"
                className="block w-full bg-[#111113] border border-white/10 px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                required
              />
            </div>
            <div>
              <input
                type="password"
                className="block w-full bg-[#111113] border border-white/10 px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                required
                minLength={8}
              />
            </div>
            <div>
              <select
                className="block w-full bg-[#111113] border border-white/10 px-5 py-4 text-white focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm appearance-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="case_worker">CASE WORKER</option>
                <option value="lawyer">LAWYER</option>
                <option value="admin">ADMIN</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full flex items-center justify-between group overflow-hidden bg-white px-6 py-4 text-black font-bold tracking-widest uppercase text-xs transition-all hover:bg-neutral-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2 border border-white"
            >
              <span className="relative flex items-center">
                {registerMutation.isPending ? 'CREATING...' : 'REGISTER NOW'}
              </span>
              <span className="flex items-center justify-center w-8 h-8 rounded-full border border-black/20 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </button>
          </form>
          
          <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center text-xs tracking-widest uppercase text-[#a1a1aa] font-medium">
            <span>ALREADY A MEMBER?</span>
            <Link href="/login" className="text-white hover:text-gray-300 transition-colors flex items-center gap-2 group">
              SIGN IN
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
