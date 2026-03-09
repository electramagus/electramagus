/* ===================================================================
   ElectraMagus Portfolio — JavaScript
   Particles · Typing · Scroll Animations · Custom Cursor · Counter
   =================================================================== */

(function () {
  'use strict';

  // ───────── PARTICLE SYSTEM ─────────
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let animFrame;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulsePhase += this.pulseSpeed;

      // mouse interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x -= dx * force * 0.01;
        this.y -= dy * force * 0.01;
      }

      // wrap
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }
    draw() {
      const pulse = Math.sin(this.pulsePhase) * 0.15 + 0.85;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity * pulse})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 150);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.06 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawConnections();
    animFrame = requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // ───────── CUSTOM CURSOR ─────────
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let cursorX = 0, cursorY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    dot.style.transform = `translate(${cursorX - 3}px, ${cursorY - 3}px)`;
  });

  function updateRing() {
    ringX += (cursorX - ringX) * 0.15;
    ringY += (cursorY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    requestAnimationFrame(updateRing);
  }
  updateRing();

  // Hover effect
  document.querySelectorAll('a, button, .btn, .project-card, .highlight-card, .contact-card, .skill-tag, .pricing-card, .pricing-breakdown-item, .pricing-why-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  // ───────── NAVBAR ─────────
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ───────── TYPING EFFECT ─────────
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    'Full-Stack Developer',
    'Android Engineer',
    'White-Hat Hacker',
    'Embedded Systems Builder',
    'Robotics Engineer',
    'Cyber Security Specialist',
    'Electronics Designer',
    'Problem Solver'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      typewriterEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typewriterEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === current.length) {
      typeSpeed = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // pause before next
    }

    setTimeout(type, typeSpeed);
  }
  type();

  // ───────── SCROLL ANIMATIONS ─────────
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  animatedElements.forEach(el => observer.observe(el));

  // ───────── SKILL BAR ANIMATION ─────────
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.width;
          entry.target.style.width = width + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  skillBars.forEach(bar => skillObserver.observe(bar));

  // ───────── COUNTER ANIMATION ─────────
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el, target) {
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 25);
  }

  // ───────── SMOOTH SCROLL ─────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const pos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

  // ───────── TILT EFFECT ON CARDS ─────────
  document.querySelectorAll('.project-card, .highlight-card, .pricing-card, .pricing-why-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ───────── TOS MODAL ─────────
  const tosOverlay = document.getElementById('tosOverlay');
  const tosClose = document.getElementById('tosClose');
  const tosDecline = document.getElementById('tosDecline');
  const tosAccept = document.getElementById('tosAccept');
  const tosTitle = document.getElementById('tosTitle');
  const tosSubtitle = document.getElementById('tosSubtitle');
  const tosBody = document.getElementById('tosBody');

  const whatsappLinks = {
    1: "https://wa.me/254755457582?text=Hi%20ElectraMagus%2C%20I%27ve%20read%20the%20ToS%20and%20I%27m%20interested%20in%20the%20Code%20%26%20Go%20package.%20Let%27s%20book.",
    2: "https://wa.me/254755457582?text=Hi%20ElectraMagus%2C%20I%27ve%20read%20the%20ToS%20and%20I%27m%20interested%20in%20the%20Full%20Managed%20package.%20Let%27s%20book.",
    3: "https://wa.me/254755457582?text=Hi%20ElectraMagus%2C%20I%27ve%20read%20the%20ToS%20and%20I%20need%20a%20student%20project.%20Let%27s%20book%20a%20slot."
  };

  const tosContent = {
    1: {
      title: 'Terms of Service',
      subtitle: 'TIER 1 — CODE & GO PACKAGE',
      html: `
        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">1</span>
            <span class="tos-phase-title">Booking & Confirmation</span>
          </div>
          <div class="tos-phase-body">
            <p>Contact me via WhatsApp to express interest. I will confirm availability and whether I can take on your project <strong>within 2 business days</strong>.</p>
            <p>If confirmed, we proceed to the briefing phase. If I cannot take it on, I will let you know immediately — no time wasted.</p>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">2</span>
            <span class="tos-phase-title">Briefing (5 Days)</span>
          </div>
          <div class="tos-phase-body">
            <p>You have <strong>5 days</strong> to describe exactly what you want built — the features, the users, the problem it solves, the platforms, and any design preferences.</p>
            <p>This is your time to be as clear as possible. The more detail you give, the more accurate the final product will be. I will ask questions to fill any gaps.</p>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">3</span>
            <span class="tos-phase-title">Research & Planning (1 Week)</span>
          </div>
          <div class="tos-phase-body">
            <p>I take <strong>1 week</strong> to research your project — technical feasibility, architecture decisions, tools needed, and risks.</p>
            <p>At the end of this week, I present you with:</p>
            <ul>
              <li>A clear breakdown of <strong>milestones</strong> (what gets built and in what order)</li>
              <li>A realistic <strong>timeline estimate</strong> per milestone</li>
              <li>The <strong>final agreed price</strong> within the KES 55,000 – 85,000 range</li>
            </ul>
            <p>If you approve the plan, we move to development. If not, we can adjust scope or part ways — no hard feelings, no charge for the research.</p>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">4</span>
            <span class="tos-phase-title">Development & Payment Schedule</span>
          </div>
          <div class="tos-phase-body">
            <p>Building starts <strong>only after you pay a 10% deposit</strong> of the agreed price. This is non-refundable and secures your slot.</p>
            <p>Development follows the milestone plan:</p>
            <ul>
              <li>After each milestone, I demo the progress to you and give an estimate for the next milestone.</li>
              <li>At <strong>50% project completion</strong>, you pay <strong>40% of the agreed price</strong>.</li>
              <li>The remaining <strong>50%</strong> is paid <strong>on final delivery</strong> of the completed project.</li>
            </ul>
            <p><strong>Payment summary:</strong> 10% deposit → 40% at halfway → 50% on delivery.</p>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">5</span>
            <span class="tos-phase-title">Delivery & Handover</span>
          </div>
          <div class="tos-phase-body">
            <p>On final delivery, you receive the <strong>complete codebase</strong> (app + server if applicable), documented and ready for your team to deploy.</p>
            <p>I will walk you through the architecture so you or your developers understand what was built and how to maintain it.</p>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">6</span>
            <span class="tos-phase-title">After Delivery</span>
          </div>
          <div class="tos-phase-body">
            <p>Once the codebase is handed over, <strong>you own the deployment and maintenance</strong>. I do not provide ongoing free support.</p>
            <ul>
              <li>Bug fixes discovered within <strong>14 days</strong> of handover related to the original scope are fixed free of charge.</li>
              <li>Any new features, changes, or support beyond those 14 days are <strong>billed as new work</strong>.</li>
              <li>Since I built the system and know the architecture, you can always hire me again — and it will be faster and cheaper than onboarding someone new.</li>
            </ul>
          </div>
        </div>

        <div class="tos-divider"></div>
        <h4 class="tos-section-label">General Terms</h4>
        <ul class="tos-general-list">
          <li><strong>Scope changes:</strong> Any features or requirements added after the briefing phase will be quoted and billed separately. They may also extend the timeline.</li>
          <li><strong>Communication:</strong> I will keep you updated at every milestone. I expect timely responses from you — delays on your side may push the delivery date.</li>
          <li><strong>Intellectual property:</strong> You own the final product and codebase after full payment. Until full payment is received, the code remains my property.</li>
          <li><strong>Confidentiality:</strong> I will not share your project details, business logic, or proprietary information with anyone.</li>
          <li><strong>Cancellation:</strong> If you cancel mid-project, you pay for all milestones completed up to that point. The 10% deposit is non-refundable.</li>
          <li><strong>Delays on my end:</strong> If I miss a milestone deadline, I will communicate the reason and revised timeline. Chronic delays give you the right to renegotiate.</li>
          <li><strong>No guarantee of commercial success:</strong> I guarantee quality code and a working product. I do not guarantee downloads, revenue, or market performance.</li>
        </ul>
      `
    },
    2: {
      title: 'Terms of Service',
      subtitle: 'TIER 2 — FULL MANAGED PACKAGE',
      html: `
        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">1</span>
            <span class="tos-phase-title">Booking & Confirmation</span>
          </div>
          <div class="tos-phase-body">
            <p>Contact me via WhatsApp to express interest. I will confirm availability and whether I can take on your project <strong>within 2 business days</strong>.</p>
            <p>If confirmed, we proceed to the briefing phase. If I cannot take it on, I will let you know immediately — no time wasted.</p>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">2</span>
            <span class="tos-phase-title">Briefing (5 Days)</span>
          </div>
          <div class="tos-phase-body">
            <p>You have <strong>5 days</strong> to describe exactly what you want built — the features, the users, the problem it solves, the platforms, and any design preferences.</p>
            <p>Don't worry if you're non-technical — I'll guide you through the process and ask the right questions. Just focus on describing your business and what you need the app to do.</p>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">3</span>
            <span class="tos-phase-title">Research & Planning (1 Week)</span>
          </div>
          <div class="tos-phase-body">
            <p>I take <strong>1 week</strong> to research your project — technical feasibility, architecture decisions, hosting requirements, and risks.</p>
            <p>At the end of this week, I present you with:</p>
            <ul>
              <li>A clear breakdown of <strong>milestones</strong> (what gets built and in what order)</li>
              <li>A realistic <strong>timeline estimate</strong> per milestone</li>
              <li>The <strong>final agreed price</strong> within the KES 55,000 – 85,000 range (build cost), plus confirmation of the KES 15,000 monthly management fee</li>
            </ul>
            <p>If you approve the plan, we move to development. If not, we can adjust scope or part ways — no hard feelings, no charge for the research.</p>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">4</span>
            <span class="tos-phase-title">Development & Payment Schedule</span>
          </div>
          <div class="tos-phase-body">
            <p>Building starts <strong>only after you pay a 10% deposit</strong> of the agreed build price. This is non-refundable and secures your slot.</p>
            <p>Development follows the milestone plan:</p>
            <ul>
              <li>After each milestone, I demo the progress to you and give an estimate for the next milestone.</li>
              <li>At <strong>50% project completion</strong>, you pay <strong>40% of the agreed price</strong>.</li>
              <li>The remaining <strong>50%</strong> is paid <strong>on final delivery</strong> of the completed project.</li>
            </ul>
            <p><strong>Payment summary:</strong> 10% deposit → 40% at halfway → 50% on delivery.</p>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">5</span>
            <span class="tos-phase-title">Delivery & Launch</span>
          </div>
          <div class="tos-phase-body">
            <p>On final delivery, I will:</p>
            <ul>
              <li>Deploy the server and set up hosting infrastructure</li>
              <li>Publish the app to your Play Store / App Store accounts (you must provide developer account access)</li>
              <li>Walk you through the product so you understand what it does and how it works</li>
            </ul>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">6</span>
            <span class="tos-phase-title">Year 1 — Managed & Maintained</span>
          </div>
          <div class="tos-phase-body">
            <p>During Year 1 (starting from launch), the <strong>KES 15,000 monthly management fee</strong> covers:</p>
            <ul>
              <li>Server hosting, monitoring, and uptime management</li>
              <li>App Store / Play Store management and updates</li>
              <li>Reasonable feature improvements based on user reviews and feedback</li>
              <li>Business pivot adjustments within the existing product direction</li>
              <li>Bug fixes and performance improvements</li>
            </ul>
            <p><strong>What's NOT included in Year 1:</strong></p>
            <ul>
              <li>Full app rebuilds or major re-architecture</li>
              <li>Third-party API costs, cloud overages, or store fees (you pay these directly)</li>
              <li>New standalone modules or features outside the original scope</li>
            </ul>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">7</span>
            <span class="tos-phase-title">After Year 1</span>
          </div>
          <div class="tos-phase-body">
            <p>After Year 1, feature updates and enhancements are <strong>billed based on complexity</strong>. The monthly management fee continues as long as you want me to host and manage the system.</p>
            <p>If you decide to take over management yourself, I will hand over all access and documentation. After handover, the same Tier 1 post-delivery terms apply.</p>
          </div>
        </div>

        <div class="tos-divider"></div>
        <h4 class="tos-section-label">Account Ownership & Access</h4>
        <ul class="tos-general-list">
          <li><strong>You own everything:</strong> Your Play Store / App Store accounts, your domain, your brand assets — they are yours. I manage them with your authorization.</li>
          <li><strong>Shared access:</strong> You will have visibility into your accounts at all times. I will never lock you out of your own product.</li>
          <li><strong>Transition:</strong> If we part ways, I transfer all access, credentials, and documentation to you or your new team within 7 business days.</li>
        </ul>

        <h4 class="tos-section-label">General Terms</h4>
        <ul class="tos-general-list">
          <li><strong>Scope changes:</strong> Any features or requirements added after the briefing phase will be quoted and billed separately. They may also extend the timeline.</li>
          <li><strong>Communication:</strong> I will keep you updated at every milestone. I expect timely responses from you — delays on your side may push the delivery date.</li>
          <li><strong>Intellectual property:</strong> You own the final product after full payment. Until full payment is received, the code remains my property.</li>
          <li><strong>Confidentiality:</strong> I will not share your project details, business logic, or proprietary information with anyone.</li>
          <li><strong>Cancellation:</strong> If you cancel mid-project, you pay for all milestones completed up to that point. The 10% deposit is non-refundable.</li>
          <li><strong>Management fee:</strong> The KES 15,000 monthly fee is billed monthly. If unpaid for 2+ months, I reserve the right to suspend hosting until resolved.</li>
          <li><strong>Delays on my end:</strong> If I miss a milestone deadline, I will communicate the reason and revised timeline. Chronic delays give you the right to renegotiate.</li>
          <li><strong>No guarantee of commercial success:</strong> I guarantee quality code and a working product. I do not guarantee downloads, revenue, or market performance.</li>
        </ul>
      `
    },
    3: {
      title: 'Terms of Service',
      subtitle: 'TIER 3 — COMRADE / STUDENT PROTOTYPES',
      html: `
        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">1</span>
            <span class="tos-phase-title">Booking a Slot</span>
          </div>
          <div class="tos-phase-body">
            <p>Contact me via WhatsApp to book. Slot availability is <strong>not less than 4 days out</strong> — plan ahead, especially near exam season when demand is high.</p>
            <p>I will confirm if your slot is available and what type of project you need (custom build or archive).</p>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">2</span>
            <span class="tos-phase-title">Concept Briefing (1 Day)</span>
          </div>
          <div class="tos-phase-body">
            <p>You have <strong>1 day</strong> to explain your project concept — what it does, who it's for, and what your university/lecturer expects.</p>
            <p>For <strong>archive projects</strong>: just tell me which one you want and any modifications needed.</p>
            <p>For <strong>custom builds</strong>: describe the full concept clearly. This is the only briefing window.</p>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">3</span>
            <span class="tos-phase-title">Research & Feasibility (2 Days)</span>
          </div>
          <div class="tos-phase-body">
            <p>I take <strong>2 days</strong> to assess feasibility and plan the build. I'll present what I can deliver within the prototype scope and timeline.</p>
            <p>If approved, we move to payment and building.</p>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">4</span>
            <span class="tos-phase-title">Payment & Building</span>
          </div>
          <div class="tos-phase-body">
            <p><strong>For custom builds (KES 5,000):</strong></p>
            <ul>
              <li>Pay <strong>KES 1,000 upfront</strong> to start the build.</li>
              <li>Pay the remaining <strong>KES 4,000 on delivery</strong> (total: KES 5,000 for custom, or adjusted total for others).</li>
              <li>Delivery within <strong>2 weeks</strong> of payment.</li>
            </ul>
            <p><strong>For archive projects (KES 1,000 – 3,000):</strong></p>
            <ul>
              <li><strong>Full payment upfront.</strong> Archive goods are pre-built and delivered immediately after payment.</li>
              <li>Add-ons (+KES 500 per unique feature) are also paid upfront.</li>
              <li>UI/appearance changes on archive projects are <strong>free</strong>.</li>
            </ul>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">5</span>
            <span class="tos-phase-title">Delivery</span>
          </div>
          <div class="tos-phase-body">
            <p>You receive the <strong>full codebase</strong> (app + server if applicable) and the <strong>APK</strong>.</p>
            <p>I'll give you a brief walkthrough of how it works so you can explain it during your presentation or defense.</p>
          </div>
        </div>

        <div class="tos-phase">
          <div class="tos-phase-header">
            <span class="tos-phase-number">6</span>
            <span class="tos-phase-title">After Delivery</span>
          </div>
          <div class="tos-phase-body">
            <p>These are <strong>functional prototypes</strong> — built for grading, demos, and proof-of-concept. They are not designed for production scale (may not handle 100k+ users).</p>
            <ul>
              <li>Minor questions about how the code works within <strong>7 days</strong> of delivery — I'll answer them.</li>
              <li>No ongoing support, bug fixes, or feature additions after delivery unless paid for separately.</li>
              <li>If you need production scale later, upgrade to Tier 1 or Tier 2.</li>
            </ul>
          </div>
        </div>

        <div class="tos-divider"></div>
        <h4 class="tos-section-label">General Terms</h4>
        <ul class="tos-general-list">
          <li><strong>Strict no-refund policy:</strong> All digital archive goods are non-refundable once delivered or shared. Custom builds are non-refundable once building has started.</li>
          <li><strong>As-is delivery:</strong> Prototypes are delivered as functional working builds. No warranty of scalability or commercial-grade quality is implied.</li>
          <li><strong>Not for commercial deployment:</strong> If you plan to monetize or launch publicly, you need a Tier 1 or Tier 2 build.</li>
          <li><strong>Confidentiality:</strong> I will not share your project concept with others. However, similar archive projects may be sold to multiple students (they are not exclusive).</li>
          <li><strong>Academic integrity:</strong> You are responsible for understanding the code. I provide the build — how you present it to your institution is your responsibility.</li>
          <li><strong>Cancellation:</strong> If you cancel a custom build after payment, the KES 1,000 deposit is non-refundable. Unused balance is returned only if no work has started.</li>
        </ul>
      `
    }
  };

  function openTosModal(tier) {
    const data = tosContent[tier];
    if (!data) return;
    tosTitle.textContent = data.title;
    tosSubtitle.textContent = data.subtitle;
    tosBody.innerHTML = data.html;
    tosAccept.href = whatsappLinks[tier];
    tosOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    tosBody.scrollTop = 0;
  }

  function closeTosModal() {
    tosOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Wire up Get Started buttons
  document.querySelectorAll('[data-tos-tier]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tier = parseInt(btn.dataset.tosTier);
      openTosModal(tier);
    });
  });

  tosClose.addEventListener('click', closeTosModal);
  tosDecline.addEventListener('click', closeTosModal);

  // Accept button click handler
  tosAccept.addEventListener('click', (e) => {
    const href = tosAccept.getAttribute('href');
    if (href && href !== '#') {
      e.preventDefault();
      window.open(href, '_blank');
    }
  });

  tosOverlay.addEventListener('click', e => {
    if (e.target === tosOverlay) closeTosModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && tosOverlay.classList.contains('active')) {
      closeTosModal();
    }
  });

  // ───────── CONSOLE EASTER EGG ─────────
  console.log(
    '%c⚡ ElectraMagus Portfolio ⚡',
    'color: #00e5ff; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(0,229,255,0.5);'
  );
  console.log(
    '%cLooking at the source code? Good. That\'s exactly what a hacker would do. 😏',
    'color: #9ca3af; font-size: 12px;'
  );
  console.log(
    '%cWant to work together? Hit me up → https://wa.me/254755457582',
    'color: #25d366; font-size: 12px;'
  );

})();
