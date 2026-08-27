"use client";

import React, { useState, useRef, Suspense } from 'react';
import toast from 'react-hot-toast';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import * as THREE from 'three';

// --- 3D Scene Components ---

function ReceptionDesk() {
  return (
    <group position={[0, -1, 0]}>
      {/* Main Desk Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 1, 1.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.2} />
      </mesh>
      
      {/* Desk Top Wood/Accent */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.7, 0.1, 1.4]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Raised Reception Tier */}
      <mesh position={[0, 0.9, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[3.7, 0.6, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.2} />
      </mesh>

      {/* Monitor / Tablet */}
      <group position={[0.5, 0.8, 0.2]} rotation={[-0.2, -0.3, 0]}>
        {/* Screen Stand */}
        <mesh position={[0, -0.2, -0.1]} castShadow>
          <cylinderGeometry args={[0.05, 0.1, 0.4]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
        {/* Screen */}
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.8, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        {/* Screen Glow */}
        <mesh position={[0, 0, 0.026]}>
          <planeGeometry args={[1.1, 0.7]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Small Registration Tablet (Visitor Side) */}
      <group position={[-0.8, 0.65, 0.4]} rotation={[-0.5, 0.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.4, 0.04]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.021]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>
    </group>
  );
}

function FloatingElements() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Visitor Management Card */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[-2, 1.8, 0]}>
        <Html transform center>
          <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-white/50 w-48 text-center pointer-events-none">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <p className="text-sm font-semibold text-slate-800">Visitor Management</p>
          </div>
        </Html>
      </Float>

      {/* Appointments Card */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.6} position={[2, 1.5, 0.5]}>
        <Html transform center>
          <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-white/50 w-44 text-center pointer-events-none">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            </div>
            <p className="text-sm font-semibold text-slate-800">Appointments</p>
          </div>
        </Html>
      </Float>

      {/* Enquiries Card */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4} position={[0, 3.2, -0.5]}>
        <Html transform center>
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 flex items-center gap-3 pointer-events-none">
            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <p className="text-sm font-semibold text-slate-800">Enquiries</p>
          </div>
        </Html>
      </Float>

      {/* Floating Geometric Ornaments */}
      <Float speed={3} rotationIntensity={1} floatIntensity={1} position={[-2.5, 0.5, 1]}>
        <mesh>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial color="#3b82f6" wireframe opacity={0.5} transparent />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={1} floatIntensity={1} position={[2.5, 0.5, -1]}>
        <mesh>
          <torusGeometry args={[0.3, 0.05, 16, 32]} />
          <meshStandardMaterial color="#8b5cf6" roughness={0.1} metalness={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

function Scene() {
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    // Soft parallax effect based on mouse pointer
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, (state.mouse.x * Math.PI) / 10, 0.05);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, (state.mouse.y * Math.PI) / 10, 0.05);
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.current.x * 2, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 2 + mouse.current.y * 1, 0.05);
    state.camera.lookAt(0, 0, 0); // Focus exactly on the center
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Environment lighting to give that premium studio look */}
      <Environment preset="city">
        <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 2, -1]} scale={[10, 2, 1]} />
        <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[5, 2, -1]} scale={[10, 2, 1]} />
      </Environment>

      <ReceptionDesk />
      <FloatingElements />
      
      {/* Soft floor shadow */}
      <ContactShadows position={[0, -1.01, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
    </>
  );
}

// --- Main Component ---

interface LoginSignupProps {
  onLogin?: (email: string, password: string) => void;
  onSignup?: (name: string, email: string, password: string) => void;
  error?: string;
}

export default function Component({ onLogin, onSignup, error }: LoginSignupProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin && onLogin) {
        await onLogin(email, password);
      } else if (!isLogin && onSignup) {
        await onSignup(name, email, password);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.success(`Authenticating with ${provider}...`, { duration: 2000 });
    
    setTimeout(() => {
      const randomStr = Math.random().toString(36).substring(7);
      const demoEmail = `${provider.toLowerCase()}_demo_${randomStr}@example.com`;
      const demoName = `${provider} User`;
      const demoPassword = 'demopassword123';
      
      toast.success(`${provider} Authentication Successful!`);
      if (onSignup) {
        onSignup(demoName, demoEmail, demoPassword);
      }
    }, 1500);
  };

  /* Icons */
  const GoogleIcon = (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  return (
    <div className="min-h-screen w-full flex bg-slate-50 relative overflow-hidden font-sans text-slate-900">
      
      {/* 
        LEFT SIDE (Form) 
      */}
      <div className="w-full lg:w-[500px] xl:w-[550px] relative z-10 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white/70 lg:bg-white backdrop-blur-xl lg:backdrop-blur-none border-r border-white/40 shadow-[20px_0_40px_rgba(0,0,0,0.05)]">
        
        <div className="w-full max-w-[400px] mx-auto">
          {/* Logo & Header */}
          <div className="mb-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary/30 mb-6">
              R
            </div>
            <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-slate-500 font-medium">
              {isLogin 
                ? 'Enter your details to access your dashboard.' 
                : 'Sign up to start managing your reception seamlessly.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium flex items-center gap-2 animate-fade-in">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            {/* Name Input (Signup Only) */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400 font-medium pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {isLogin && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer appearance-none w-4 h-4 border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:outline-none checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none mt-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">or continue with</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 text-sm bg-white shadow-sm"
            >
              {GoogleIcon}
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('Microsoft')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 text-sm bg-white shadow-sm"
            >
              <svg viewBox="0 0 21 21" className="w-5 h-5 flex-shrink-0"><path fill="#f25022" d="M1 1h9v9H1z"/><path fill="#00a4ef" d="M1 11h9v9H1z"/><path fill="#7fba00" d="M11 1h9v9h-9z"/><path fill="#ffb900" d="M11 11h9v9h-9z"/></svg>
              Microsoft
            </button>
          </div>

          {/* Toggle Login/Signup */}
          <p className="text-center text-sm font-medium text-slate-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary-hover font-semibold transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Footer Terms */}
          <p className="text-xs text-center text-slate-400 mt-8 leading-relaxed max-w-[280px] mx-auto">
            By proceeding, you agree to our{' '}
            <a href="#" className="font-medium text-slate-500 hover:text-slate-700 underline underline-offset-2">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="font-medium text-slate-500 hover:text-slate-700 underline underline-offset-2">Privacy Policy</a>.
          </p>
          
          {/* Secure Login Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-6 text-emerald-600">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
             <span className="text-xs font-semibold tracking-wide uppercase">Secure encrypted login</span>
          </div>
        </div>
      </div>

      {/* 
        RIGHT SIDE (3D Visuals) - Absolute on mobile (hidden/behind), 
        flex-1 on desktop. 
      */}
      <div className="absolute inset-0 lg:relative lg:flex-1 w-full h-full lg:block opacity-20 lg:opacity-100 z-0 pointer-events-none lg:pointer-events-auto bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
        <Canvas shadows camera={{ position: [0, 2, 6], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

    </div>
  );
}
