import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';

// Import all sliding components
import Dashboard from '../pages/Dashboard';
import Visitors from '../pages/Visitors';
import Appointments from '../pages/Appointments';
import Enquiries from '../pages/Enquiries';
import Calls from '../pages/Calls';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            // Optionally update the URL hash without scrolling
            window.history.replaceState(null, null, `#${entry.target.id}`);
          }
        });
      },
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section hits the middle of the screen
        threshold: 0
      }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activeSection={activeSection} />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col lg:ml-[260px] min-h-screen h-screen transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(true)} activeSection={activeSection} />
        
        {/* Main Content Viewport */}
        <main className="flex-1 w-full overflow-y-auto bg-transparent scroll-smooth no-scrollbar">
          
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto flex flex-col gap-12 lg:gap-24">
            <section id="dashboard" className="min-h-screen pt-4">
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Overview</h2>
                <p className="text-text-secondary mt-1">Your daily summary and statistics.</p>
              </div>
              <Dashboard />
            </section>
            
            <hr className="border-border/50" />

            <section id="visitors" className="min-h-screen pt-4">
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Visitors</h2>
                <p className="text-text-secondary mt-1">Manage all visitor entries and exits.</p>
              </div>
              <Visitors />
            </section>

            <hr className="border-border/50" />

            <section id="appointments" className="min-h-screen pt-4">
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Appointments</h2>
                <p className="text-text-secondary mt-1">Schedule and view upcoming appointments.</p>
              </div>
              <Appointments />
            </section>

            <hr className="border-border/50" />

            <section id="enquiries" className="min-h-screen pt-4">
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Enquiries</h2>
                <p className="text-text-secondary mt-1">Handle queries and requests.</p>
              </div>
              <Enquiries />
            </section>

            <hr className="border-border/50" />

            <section id="calls" className="min-h-screen pt-4">
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Call Log</h2>
                <p className="text-text-secondary mt-1">Track and manage phone calls.</p>
              </div>
              <Calls />
            </section>
          </div>
          
        </main>
      </div>
    </div>
  );
}