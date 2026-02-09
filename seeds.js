require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Announcement = require('./models/Announcement');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Announcement.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@pepeshnele.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
      }
    ]);
    console.log(`Created ${users.length} users`);

    // Create test events
    const now = new Date();
    const events = await Event.create([
      {
        title: 'JavaScript Workshop 2026',
        description: 'Полный курс по JavaScript для начинающих. Изучим основы синтаксиса, DOM, асинхронность и многое другое. Идеально для тех, кто хочет стать веб-разработчиком.',
        category: 'education',
        eventDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 дней в будущем
        location: 'Москва, ул. Пушкина 10',
        createdBy: users[0]._id
      },
      {
        title: 'React Conference 2026',
        description: 'Международная конференция про React. Выступления топ-разработчиков, нетворкинг, воркшопы. Не пропусти!',
        category: 'technology',
        eventDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 дней
        location: 'Санкт-Петербург, Невский проспект',
        createdBy: users[0]._id
      },
      {
        title: 'Музыкальный фестиваль',
        description: 'Грандиозный музыкальный фестиваль с участием известных исполнителей. Живая музыка, артисты, веселье и новые знакомства.',
        category: 'entertainment',
        eventDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 дней
        location: 'Казань, Парк Горького',
        createdBy: users[1]._id
      },
      {
        title: 'Спортивный турнир по футболу',
        description: 'Любительский турнир по футболу. Приветствуются команды разного уровня. Есть проблемы с физкультурой? Приходи и поправь здоровье!',
        category: 'sports',
        eventDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 дней
        location: 'Екатеринбург, Центральный стадион',
        createdBy: users[2]._id
      },
      {
        title: 'Бизнес-семинар: Стартапы',
        description: 'Научись запускать свой стартап. Менторы поделятся опытом, расскажут про фандинг и как избежать ошибок.',
        category: 'business',
        eventDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 дня
        location: 'Новосибирск, Tech Hub',
        createdBy: users[0]._id
      },
      {
        title: 'Выставка современного искусства',
        description: 'Выставка работ молодых художников. Авангард, инсталляция, видео-арт и классика. Откройте для себя новые таланты!',
        category: 'arts',
        eventDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 дней
        location: 'Краснодар, Музей искусств',
        createdBy: users[1]._id
      },
      {
        title: 'Благотворительный марафон',
        description: 'Бегу марафон вместе с сообществом. Все средства идут на помощь детским домам. Вместе мы можем изменить мир!',
        category: 'social',
        eventDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 дней
        location: 'Уфа, Парк Победы',
        createdBy: users[2]._id
      },
      {
        title: 'Прошедшее событие: Вебинар',
        description: 'Это событие уже произошло. Вебинар про веб-разработку прошёл успешно с участием 200+ разработчиков.',
        category: 'education',
        eventDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 дней назад
        location: 'Online',
        createdBy: users[0]._id
      }
    ]);
    console.log(`Created ${events.length} events`);

    // Create test announcements
    const announcements = await Announcement.create([
      {
        title: 'Важное: Новые правила регистрации',
        content: 'Уважаемые пользователи! С 15 февраля вступают в силу новые правила регистрации на события. Теперь требуется верификация email.',
        createdBy: users[0]._id,
        event: events[0]._id
      },
      {
        title: 'Анонс: Новая платформа запущена!',
        content: 'Рады сообщить о запуске новой версии платформы PepeShnele с улучшенным интерфейсом и функциональностью. Спасибо за ваше участие!',
        createdBy: users[0]._id
      },
      {
        title: 'Акция: Скидка 20% на премиум',
        content: 'Первые 100 пользователей, купившие премиум подписку, получат скидку 20%. Предложение ограничено!',
        createdBy: users[0]._id
      },
      {
        title: 'Благодарность участникам',
        content: 'Спасибо всем участникам прошедшего марафона! Вы помогли собрать 500,000 рублей для благотворительности.',
        createdBy: users[1]._id,
        event: events[6]._id
      }
    ]);
    console.log(`Created ${announcements.length} announcements`);

    console.log('\nSeed data created successfully!');
    console.log('Database is ready for testing');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
