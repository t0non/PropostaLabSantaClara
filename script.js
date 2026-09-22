/**
 * ============================================================================
 * PROPOSTA COMERCIAL — TOP MARKETING BH -> LABORATÓRIO SANTA CLARA
 * Configurações e Comportamento Interativo
 * ============================================================================
 */

// ============================================================================
// CONFIGURAÇÃO DO WHATSAPP (FÁCIL EDIÇÃO)
// ============================================================================
// Insira abaixo o número de WhatsApp do Eduardo (Top Marketing BH).
// Formato: DDI + DDD + Número (apenas dígitos numéricos, sem espaços ou traços).
// Exemplo: '553197922538' (55 = Brasil, 31 = DDD Belo Horizonte/MG)
const CONFIG = {
  whatsappNumber: '553197922538', // <-- Altere aqui para o número de WhatsApp desejado
  messageText: 'Vamos fechar!'
};

document.addEventListener('DOMContentLoaded', () => {
  // Configuração do botão de ação do WhatsApp
  const startButton = document.getElementById('btn-start-project');

  if (startButton) {
    const encodedMessage = encodeURIComponent(CONFIG.messageText);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
    
    startButton.setAttribute('href', whatsappUrl);
    startButton.setAttribute('target', '_blank');
    startButton.setAttribute('rel', 'noopener noreferrer');
  }

  // Atualização dinâmica do ano no rodapé
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Efeito sutil de revelação suave ao rolar a página (Intersection Observer)
  const cards = document.querySelectorAll('.opportunity-card, .flow-step-card, .deliverable-card, .timeline-card, .pricing-card');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    cards.forEach(card => {
      card.style.opacity = '0.94';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease';
      observer.observe(card);
    });
  }

  // ============================================================================
  // CUSTOM AUDIO PLAYER LOGIC
  // ============================================================================
  const audioFile = document.getElementById('testimonial-audio-file');
  const btnPlay = document.getElementById('btn-play-audio');
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');
  const progressBar = document.getElementById('audio-progress');
  const audioTrack = document.getElementById('audio-track');
  const timeCurrent = document.getElementById('audio-current');
  const timeDuration = document.getElementById('audio-duration');

  if (audioFile && btnPlay) {
    // Duração de fallback em segundos (caso o navegador não consiga ler os metadados)
    const FALLBACK_DURATION = 50;

    // Format time in M:SS — trata NaN e Infinity
    const formatTime = (timeInSeconds) => {
      if (!isFinite(timeInSeconds) || isNaN(timeInSeconds)) return "0:00";
      const m = Math.floor(timeInSeconds / 60);
      const s = Math.floor(timeInSeconds % 60);
      return `${m}:${s < 10 ? '0' + s : s}`;
    };

    // Retorna a duração real ou o fallback
    const getDuration = () => {
      const d = audioFile.duration;
      return (isFinite(d) && !isNaN(d) && d > 0) ? d : FALLBACK_DURATION;
    };

    // Ao carregar metadados, atualiza duração (ou mantém fallback)
    audioFile.addEventListener('loadedmetadata', () => {
      timeDuration.textContent = formatTime(getDuration());
    });

    // Toggle Play/Pause
    btnPlay.addEventListener('click', () => {
      if (audioFile.paused) {
        audioFile.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      } else {
        audioFile.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    });

    // Atualiza barra de progresso e tempo atual
    audioFile.addEventListener('timeupdate', () => {
      const current = audioFile.currentTime;
      const duration = getDuration();
      timeCurrent.textContent = formatTime(current);
      timeDuration.textContent = formatTime(duration);
      const percent = Math.min((current / duration) * 100, 100);
      progressBar.style.width = `${percent}%`;
    });

    // Reset when audio ends
    audioFile.addEventListener('ended', () => {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      progressBar.style.width = '0%';
      timeCurrent.textContent = '0:00';
    });

    // Click on progress bar to seek
    if (audioTrack) {
      audioTrack.addEventListener('click', (e) => {
        const rect = audioTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const clickPercent = clickX / width;
        
        if (audioFile.duration) {
          audioFile.currentTime = clickPercent * audioFile.duration;
        }
      });
    }
  }

});
