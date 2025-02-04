let score = 0;

/*********************
 *  Компонент гравитации
 *********************/
AFRAME.registerComponent('gravity', {
  tick: function () {
    // Если объект уже имеет динамическое тело, применяем к нему силу гравитации
    if (this.el.body) {
      // Применяем силу, учитывая массу тела
      this.el.body.applyForce(new CANNON.Vec3(0, -9.8 * this.el.body.mass, 0), this.el.body.position);
    }
  }
});

/*********************
 *  Компонент для собираемых объектов
 *********************/
AFRAME.registerComponent('collectible', {
  init: function () {
    // Обработчик событий для VR контроллеров и клика мышью
    this.el.addEventListener('grab-start', () => {
      this.collect();
    });
    this.el.addEventListener('click', () => {
      this.collect();
    });
  },
  collect: function () {
    // Удаляем объект из сцены
    this.el.parentNode.removeChild(this.el);
    score++;
    // Обновляем текст счета
    document.querySelector('#scoreText').setAttribute('text', `value: Score: ${score}; color: black; align: center;`);
    // Проигрываем звук сбора
    document.querySelector('#collectSound').components.sound.playSound();
    // Запускаем анимацию-эффект (частицы)
    this.spawnExplosion();
  },
  spawnExplosion: function () {
    // Создаём сущность для эффекта взрыва (частиц)
    let explosion = document.createElement('a-entity');
    explosion.setAttribute('particle-system', 'preset: explosion; color: yellow');
    // Помещаем эффект в позицию собранного объекта
    explosion.setAttribute('position', this.el.getAttribute('position'));
    document.querySelector('a-scene').appendChild(explosion);
    // Удаляем эффект через 1 секунду
    setTimeout(() => {
      if (explosion.parentNode) explosion.parentNode.removeChild(explosion);
    }, 1000);
  }
});

/*********************
 *  Функция рандомизации позиций для новых объектов
 *********************/
function spawnObjects() {
  const positions = [];
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * 10 - 5;
    const z = Math.random() * 10 - 5;
    positions.push({ x, y: 1, z });
  }
  return positions;
}

/*********************
 *  Функция создания новых собираемых объектов
 *********************/
function spawnCollectibles() {
  const positions = spawnObjects();
  const sceneEl = document.querySelector('a-scene');
  // Создаём по одному объекту для каждой сгенерированной позиции
  positions.forEach((pos) => {
    let collectible = document.createElement('a-entity');
    // Используем ассет модели (GLB), загруженный через a-assets
    collectible.setAttribute('gltf-model', '#blockmanModel');
    collectible.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
    collectible.setAttribute('dynamic-body', '');
    collectible.setAttribute('collectible', '');
    collectible.setAttribute('gravity', '');
    sceneEl.appendChild(collectible);
  });
}

// Запускаем спаун собираемых объектов после загрузки сцены
window.addEventListener('load', () => {
  spawnCollectibles();
});
