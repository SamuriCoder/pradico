// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for section and card animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections and info-cards
document.querySelectorAll('section, .info-card').forEach(el => {
    observer.observe(el);
});

// Add hover effect to table rows
document.querySelectorAll('table tr').forEach(row => {
    row.addEventListener('mouseenter', () => {
        row.style.transition = 'background-color 0.3s ease';
    });
});

// Add click animation to CTA buttons
document.querySelectorAll('.hero a, section a').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });
});

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${progress}%`;
});

// Add CSS for the progress bar
const style = document.createElement('style');
style.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--primary-color);
        z-index: 1001;
        transition: width 0.1s ease;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Dropdown functionality
function toggleDropdown(id) {
  const content = document.getElementById(id);
  const button = content.previousElementSibling;
  
  // Close all other dropdowns
  document.querySelectorAll('.dropdown-content.active').forEach(dropdown => {
    if (dropdown.id !== id) {
      dropdown.classList.remove('active');
      dropdown.previousElementSibling.classList.remove('active');
    }
  });

  // Toggle current dropdown
  content.classList.toggle('active');
  button.classList.toggle('active');
}

// Close dropdowns when clicking outside
document.addEventListener('click', (event) => {
  if (!event.target.closest('.dropdown-button') && !event.target.closest('.dropdown-content')) {
    document.querySelectorAll('.dropdown-content.active').forEach(dropdown => {
      dropdown.classList.remove('active');
      dropdown.previousElementSibling.classList.remove('active');
    });
  }
}); 