(function() {
  // ⚠️ ВАШ URL (тот, что вы получили при публикации)
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyPw0m50WpoSVwa2J8s6apEVaSEVmNBo5PogzHobOSdF-xo6LdZ6F8XP2EkzyiqZ2zO/exec';

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
        // Используем FormData вместо URLSearchParams
        const formData = new FormData();
        formData.append('name', nameInput.value.trim());
        formData.append('presence', presenceSelect.value);
        formData.append('timestamp', timestamp);

        // Отправляем с mode: 'no-cors' — это ключевой момент!
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',  // Это обходит CORS
          body: formData
        });

        // При no-cors мы не можем прочитать ответ, 
        // поэтому просто показываем успех
        console.log('✅ Данные отправлены (no-cors)');
        
        form.classList.add('hidden');
        messageDiv.classList.remove('hidden');

      } catch (error) {
        console.error('❌ Ошибка:', error);
        
        errorDiv.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-envelope"></i> Подтвердить / Conferma';
      }
    });
  }

  // Проверка подключения (опционально)
  console.log('🔍 Форма готова к работе на GitHub Pages');
})();

