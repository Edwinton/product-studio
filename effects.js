document.addEventListener("DOMContentLoaded", () => {
  console.log("3D Engine running...");

  // Target all cards + hero banners
  const cards = document.querySelectorAll(".card, .prov, .stage, .svc, .deliv, .prog, .hero");
  const buttons = document.querySelectorAll(".btn, .chip");

  // TILT ENGINE
  cards.forEach(card => {
    card.style.transformStyle = "preserve-3d";
    
    // Find direct children (the text content inside the hero)
    // We filter out .hero-actions so buttons don't float weirdly
    const innerElements = Array.from(card.children).filter(child => 
      !child.classList.contains("hero-actions") && 
      !child.classList.contains("card-glow")
    );
    
    // Check if it's a large hero banner to adjust the depth (smaller pop)
    const isHero = card.classList.contains("hero");
    const depth = isHero ? "15px" : "30px";
    const tiltAmount = isHero ? 3 : 6; // Less tilt for big banners

    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      
      const rx = ((cy - y) / cy) * tiltAmount;
      const ry = ((x - cx) / cx) * tiltAmount;
      
      card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      innerElements.forEach(child => {
        child.style.transform = `translateZ(${depth})`;
      });
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)`;
      card.style.setProperty('--mouse-x', '-500px');
      card.style.setProperty('--mouse-y', '-500px');
      
      innerElements.forEach(child => {
        child.style.transform = "translateZ(0px)";
      });
    });
  });

  // MAGNETIC BUTTONS
  buttons.forEach(btn => {
    if (btn.classList.contains("full")) return;

    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      
      btn.style.transform = `translate3d(${dx * 0.3}px, ${dy * 0.3}px, 0)`;
      btn.style.transition = "transform 0.1s ease-out";
    });

    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "translate3d(0px, 0px, 0px)";
      btn.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    });
  });
});
