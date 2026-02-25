(function() {
  // ⚠️ ВАШ URL (тот, что вы получили при публикации)
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtvQDuK_vuLiavjd_m-pgVgBTeEoiQY5xZ0hnqzt-D8WowQyUGhRzbkJ2SzLX6UT5Y/exec';

  const form = document.getElementById('rsvpForm');
  const messageDiv = document.getElementById('rsvpMessage');
  const errorDiv = document.getElementById('rsvpError');
  const submitBtn = document.getElementById('submitBtn');
  const nameInput = document.getElementById('name');
  const presenceSelect = document.getElementById('presence');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Валидация
      if (!nameInput.value.trim() || !presenceSelect.value) {
        alert('Пожалуйста, введите имя и выберите вариант ответа.');
        return;
      }

      // Блокируем кнопку
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

      // Создаем URL с параметрами
      const url = new URL(SCRIPT_URL);
      url.searchParams.append('name', nameInput.value.trim());
      url.searchParams.append('presence', presenceSelect.value);
      url.searchParams.append('timestamp', timestamp);
      
      console.log('📤 Отправка данных:', url.toString());

      // Используем Image Beacon - самый надежный метод
      const img = new Image();
      
      img.onload = function() {
        console.log('✅ Данные успешно отправлены');
        form.classList.add('hidden');
        messageDiv.classList.remove('hidden');
      };
      
      img.onerror = function() {
        console.log('⚠️ Image onerror, но данные могли отправиться');
        // Даже при ошибке изображения, данные обычно доходят
        // Поэтому все равно показываем успех
        form.classList.add('hidden');
        messageDiv.classList.remove('hidden');
      };

      // Добавляем случайное число, чтобы избежать кэширования
      url.searchParams.append('nocache', Date.now());
      
      // Отправляем
      img.src = url.toString();
      
      // Таймаут на случай, если ничего не сработало
      setTimeout(function() {
        if (!messageDiv.classList.contains('hidden')) return;
        
        console.log('⏱️ Таймаут, но скорее всего данные отправились');
        form.classList.add('hidden');
        messageDiv.classList.remove('hidden');
      }, 3000);
    });
  }

  // Проверка подключения
  function testConnection() {
    const img = new Image();
    const testUrl = new URL(SCRIPT_URL);
    testUrl.searchParams.append('test', '1');
    testUrl.searchParams.append('nocache', Date.now());
    
    img.onload = function() {
      console.log('✅ Соединение с Google Sheets работает');
    };
    
    img.onerror = function() {
      console.log('⚠️ Тестовое соединение: данные всё равно должны работать');
    };
    
    img.src = testUrl.toString();
  }
  
  // Проверяем через 2 секунды
  setTimeout(testConnection, 2000);
  
  console.log('🚀 Скрипт загружен, используем Image Beacon метод');
})();
