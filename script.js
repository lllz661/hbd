(function() {
  // ⚠️ Настройки - измените под себя
  const CONFIG = {
    // Вставьте ваш URL сюда перед публикацией
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbw8LPVf1lw6m53aFXIHCKtCgCy5TEWDmQ0QQkj5WtUrMYEkkZFX0IAQF0fx7IqgktWG/exec',
    // Номер телефона (можно оставить или убрать)
    PHONE: '+7 777 123 45 67'
  };

  const form = document.getElementById('rsvpForm');
  const messageDiv = document.getElementById('rsvpMessage');
  const errorDiv = document.getElementById('rsvpError');
  const submitBtn = document.getElementById('submitBtn');
  const nameInput = document.getElementById('name');
  const presenceSelect = document.getElementById('presence');

  // Обновляем номер телефона в контактах
  const contactLink = document.querySelector('.contact-info a');
  if (contactLink) {
    contactLink.href = `https://wa.me/${CONFIG.PHONE.replace(/\D/g, '')}`;
    contactLink.textContent = CONFIG.PHONE;
  }

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!nameInput.value.trim() || !presenceSelect.value) {
        alert('Пожалуйста, введите имя и выберите вариант ответа.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
      errorDiv.classList.add('hidden');

      const now = new Date();
      const timestamp = now.toLocaleString('ru-RU', { 
        timeZone: 'Asia/Almaty',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const url = new URL(CONFIG.SCRIPT_URL);
      url.searchParams.append('name', nameInput.value.trim());
      url.searchParams.append('presence', presenceSelect.value);
      url.searchParams.append('timestamp', timestamp);
      
      const callbackName = 'callback_' + Date.now();
      url.searchParams.append('callback', callbackName);
      
      console.log('📤 Отправка данных...');

      window[callbackName] = function(response) {
        console.log('✅ Ответ:', response);
        
        if (response && response.success) {
          form.classList.add('hidden');
          messageDiv.classList.remove('hidden');
        } else {
          throw new Error('Ошибка сервера');
        }
        
        delete window[callbackName];
        document.head.removeChild(script);
      };

      const script = document.createElement('script');
      script.src = url.toString();
      
      script.onerror = function() {
        console.error('❌ Ошибка отправки');
        delete window[callbackName];
        document.head.removeChild(script);
        
        errorDiv.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-envelope"></i> Подтвердить / Conferma';
      };

      document.head.appendChild(script);
    });
  }
})();