## Команды проекта
Установка зависимостей

`npm i`

Запуск dev-сервера

`npm start`

Сборка в режиме разработки

`npm run dev`

Сборка проекта

`npm run build`

Запуск тестов 

`npm test`

Команда для показа покрытия тестов 

`npm run test-cov`

## Использование плагина

```
const $slider = $('#app').JQSlider()
```

Инициализация с заданием необходимых параметров:

```
const $slider = $(#app).JQSlider({
  minValue: 30,
  maxValue: 80,
  step: 2,
  isVertical: true,
})
````

Список всех возможных параметров:

| Параметр          | Тип                | Значение по умолчанию | Описание                                                                                        |
|-------------------|--------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| minValue          | number             | 0                     | Минимальное значение слайдера                                                                   |
| maxValue          | number             | 100                   | Максимальное значение слайдера                                                                  |
| step              | number             | 1                     | Шаг значений                                                                                    |
| valueStart        | number             | 40                    | Значение первого ползунка                                     |
| valueEnd          | number             | 50                    | Значение второго ползунка                                                    |
| range             | boolean            | false                 | Показывает/скрывает второй ползунок                                      |
| scalePointCount   | number             | 11                    | Количество меток под слайдером                                       |
| showTooltip       | boolean            | true                 | Показывает/скрывает элемент на ползунком                                                           |
| isVertical        | boolean            | false                  | Определяет направление слайдера (горизонтальное/вертикальное)                                   |
| showProgress      | boolean            | false                  | Показывает/скрывает шкалу прогресса                                                               |
| showScale         | boolean            | true                  | Показывает/скрывает метки под слайдером                                                               |

## API плагина

После инициализации плагина можно использовать несколько методов для взаимодействия с ним. Для этого необходимо вместо опций передать в слайдер название метода первым аргументом, а параметры - после него.

* setOptions(options: sliderOptions): void

 Позволяет обновить настройки слайдера

  ```
  
 $slider.JQSlider('setOptions', {
   { minValue: 5 }    // Изменяет минимальное значение
  })
  
  ```
  
* getOptions(): sliderOptions 

 Позволяет узнать настройки слайдера
 ```
 $slider.JQSlider('getOptions')
 ```

* getContainer(): HTMLElement 

 Позволяет узнать родительский элемент слайдера
 ```
 $slider.JQSlider('getContainer')
 ```
 
* getFirstValue(): number

 Позволяет узнать значение первого ползунка
 ```
 $slider.JQSlider('getFirstValue')
 ```
 
 * getSecondValue(): number

 Позволяет узнать значение второго ползунка
 ```
 $slider.JQSlider('getSecondValue')
 ```
 
 * addControlPanel(): Panel

 Позволяет добвать панель управления
 ```
 $slider.JQSlider('addControlPanel')
 ```
 
 ## Архитектура приложения

Слайдер разделён на слои `Model`, `View` и `Presenter`. Для уменьшения связанности `Presenter` подписан на обновления `View` и `Model` с помощью шаблона "Observer". При изменении значений и настроек `Presenter` получает оповещение и вызывает соответствующие методы `Model` и `View`. `Model` ничего не знает о `View`, который знает о её настройках и значениях ползунков, но не может напрямую обратиться к её методам. `View` помимо основного класса имеет дочерние:

- `Track` - дорожка по которой ходят ползунки;
- `Handle` - для каждого ползунка;
- `Progress` - подсветка дорожки от минимума трека до ползунка (для одного ползунка) или между ползунками (для двух ползунков) - опционально;
- `Scale` - шкала значений - опционально;

Для наглядного изменения настроек слайдер оснащён панелью управления `Panel`, которая общается со слайдером через его API.