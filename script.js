(function() {
  // ⚠️ ВАШ URL (тот, что получили при публикации)
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXhBENrZ4EivWNnPbxuDECZHgKiyXOFRfUHCA_ZKd7m95GPhz-kpCyJxrOEGy3z8Eq/exec';

  const form = document.getElementById('rsvpForm');
  const messageDiv = document.getElementById('rsvpMessage');
  const errorDiv = document.getElementById('rsvpError');
  const submitBtn = document.getElementById('submitBtn');
  const nameInput = document.getElementById('name');
  const presenceSelect = document.getElementById('presence');

  if (form) {
    form.addEventListener('submit', async function(e) {
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

      try {
        // Сначала пробуем через fetch с CORS
        const response = await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            name: nameInput.value.trim(),
            presence: presenceSelect.value,
            timestamp: timestamp
          })
        });

        const result = await response.json();
        console.log('✅ Ответ:', result);

        if (result.success) {
          form.classList.add('hidden');
          messageDiv.classList.remove('hidden');
        } else {
          throw new Error('Ошибка сервера');
        }

      } catch (error) {
        console.log('⚠️ Fetch не сработал, пробуем JSONP...');
        
        // Если fetch не сработал, пробуем JSONP
        sendViaJSONP();
      }
    });
  }

  // Запасной вариант через JSONP
  function sendViaJSONP() {
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

    const url = new URL(SCRIPT_URL);
    url.searchParams.append('name', nameInput.value.trim());
    url.searchParams.append('presence', presenceSelect.value);
    url.searchParams.append('timestamp', timestamp);
    
    const callbackName = 'callback_' + Date.now();
    url.searchParams.append('callback', callbackName);
    
    window[callbackName] = function(response) {
      console.log('✅ JSONP ответ:', response);
      
      if (response && response.success) {
        form.classList.add('hidden');
        messageDiv.classList.remove('hidden');
      } else {
        errorDiv.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-envelope"></i> Подтвердить / Conferma';
      }
      
      delete window[callbackName];
      document.head.removeChild(script);
    };

    const script = document.createElement('script');
    script.src = url.toString();
    
    script.onerror = function() {
      console.error('❌ JSONP ошибка');
      errorDiv.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-envelope"></i> Подтвердить / Conferma';
    };

    document.head.appendChild(script);
  }

  // Проверка подключения
  console.log('🔍 Проверка подключения к скрипту...');
  
  fetch(SCRIPT_URL)
    .then(r => r.json())
    .then(data => console.log('✅ Скрипт доступен:', data))
    .catch(err => console.log('⚠️ Fetch не работает, но JSONP должен работать'));
})();
