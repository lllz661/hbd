(function() {
  // ⚠️ ВАШ URL (тот, что вы получили при публикации)
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxP93YODvhNz57UKsyxIKNsOT8J0PHSPfWp-KB7YP0lc8TLYQNweEFcKk47w7jGwIzi/exec';

  const form = document.getElementById('rsvpForm');
  const messageDiv = document.getElementById('rsvpMessage');
  const errorDiv = document.getElementById('rsvpError');
  const submitBtn = document.getElementById('submitBtn');
  const nameInput = document.getElementById('name');
  const presenceSelect = document.getElementById('presence');

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

      // Форматируем дату
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

      // Создаем URL с данными в GET параметрах
      const url = new URL(SCRIPT_URL);
      url.searchParams.append('name', nameInput.value.trim());
      url.searchParams.append('presence', presenceSelect.value);
      url.searchParams.append('timestamp', timestamp);
      
      console.log('📤 Отправка данных через iframe...');
      console.log('URL:', url.toString());

      // Создаем невидимый iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url.toString();
      
      // Когда iframe загрузится - значит данные отправились
      iframe.onload = function() {
        console.log('✅ Iframe загружен, данные отправлены');
        
        // Убираем iframe
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
        
        // Показываем успех
        form.classList.add('hidden');
        messageDiv.classList.remove('hidden');
      };

      // Если ошибка
      iframe.onerror = function() {
        console.error('❌ Ошибка загрузки iframe');
        
        document.body.removeChild(iframe);
        
        errorDiv.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-envelope"></i> Подтвердить / Conferma';
      };

      // Добавляем iframe на страницу
      document.body.appendChild(iframe);
    });
  }

  console.log('🚀 Скрипт загружен, форма готова к работе');
})();
