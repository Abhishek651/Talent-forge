import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../Hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();
  let [user, setUser] = useState({});

  function handleInput(e) {
    const value = e.target.value;
    setUser((c) => ({ ...c, [e.target.name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log("Form Submitted: ", user);
    await handleRegister({ email: user.email, username: user.username, password: user.password });
    navigate('/');
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[75vh] w-[85%] md:w-[80%] lg:w-[75%] mx-auto my-12 md:my-24 rounded-[24px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
      <div className="hidden md:flex flex-1 flex-col justify-center w-full md:w-[45%] bg-white text-black p-16">
        <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Forge Your <br /> Future.
        </h3>
        <p className="text-[#555] max-w-[300px] leading-[1.6]">
          Join TalentForge today. Master your technical skills and ace your next interview.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-center bg-[#1d1c1c] text-white p-12 md:p-16 lg:p-20">
        <div className="mb-6">
          <h5 className="text-2xl font-bold text-white mb-2">Create your account</h5>
          <p className="text-[#888] text-sm">Start your journey with us today for free.</p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative group">
            <span className="absolute -top-2.5 left-3 bg-[#1d1c1c] px-1 text-[#888] font-bold text-[0.8rem] tracking-[1px] uppercase z-10 transition-colors group-focus-within:text-[#8b5cf6]">USERNAME *</span>
            <Input
              id="username"
              name="username"
              type="text"
              required
              value={user.username || ''}
              onChange={handleInput}
              placeholder="Enter your username"
              className="bg-transparent border-[#333] hover:border-[#555] text-white placeholder:text-[#555] focus-visible:border-[#8b5cf6] focus-visible:ring-0 rounded-lg h-14 px-4"
            />
          </div>

          <div className="relative group">
            <span className="absolute -top-2.5 left-3 bg-[#1d1c1c] px-1 text-[#888] font-bold text-[0.8rem] tracking-[1px] uppercase z-10 transition-colors group-focus-within:text-[#8b5cf6]">EMAIL ADDRESS *</span>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={user.email || ''}
              onChange={handleInput}
              placeholder="john@company.com"
              className="bg-transparent border-[#333] hover:border-[#555] text-white placeholder:text-[#555] focus-visible:border-[#8b5cf6] focus-visible:ring-0 rounded-lg h-14 px-4"
            />
          </div>

          <div className="relative group">
            <span className="absolute -top-2.5 left-3 bg-[#1d1c1c] px-1 text-[#888] font-bold text-[0.8rem] tracking-[1px] uppercase z-10 transition-colors group-focus-within:text-[#8b5cf6]">PASSWORD *</span>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={user.password || ''}
              onChange={handleInput}
              placeholder="Min. 8 characters"
              className="bg-transparent border-[#333] hover:border-[#555] text-white placeholder:text-[#555] focus-visible:border-[#8b5cf6] focus-visible:ring-0 rounded-lg h-14 px-4"
            />
          </div>

          <Button type="submit" disabled={loading} className="mt-4 h-12 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg text-base font-bold w-full transition-colors">
            Register
          </Button>

          <p className="text-[#888] text-sm mt-2">
            Already have an account? <Link to={'/login'} className="text-[#8b5cf6] hover:underline underline-offset-2">Login here</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;