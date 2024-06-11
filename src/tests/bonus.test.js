import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';

describe('Управлять бонусами организаций', function() {
  describe('FN-10 Отправить запрос на использование бонуса', function() {
    it('Запрос прошел успешно', async function() {
      const response = await request(app).post('/api/bonus/request').send({
        bonus: {
          _id: "6579f03a0a3ee8f48685a1ff",
          name: "Бесплатный курс обучения55",
          duration: "1 месяц",
          cost: 100,
          partner: "Учебный центр XYZ",
          price: 200,
          compan: "65465ea157534fa9dc176bba",
          status: true,
          createdAt: "2023-12-13T17:56:10.941Z",
          updatedAt: "2023-12-14T00:53:10.441Z",
        },
        user: "65540df60368bd9c73070c20",
        startDate: "2023-12-14T00:00:00.000Z"
      });
      expect(response.statusCode).to.equal(200);
    });
  });
  describe('FN-11 Добавление бонуса', function() {
    it('Запрос прошел успешно', async function() {
      const response = await request(app).post('/api/bonus').send({
        cost: 1,
        price: "345",
        name: "новый бонус",
        partner: "супер партнер",
        duration: "1 неделя",
        company: "65465ea157534fa9dc176bba"

      });
      expect(response.statusCode).to.equal(200);
    });
    it('Ошибка, компания не найдена', async function() {
      const response = await request(app).post('/api/bonus').send({
        cost: 1,
        price: "345",
        name: "новый бонус",
        partner: "супер партнер",
        duration: "1 неделя",
        company: "65465ea157534fa9dc176bb5a"

      });
      expect(response.statusCode).to.equal(500);
    });
  });
  describe('FN-12 Удаление бонуса', function() {
    it('Запрос прошел успешно', async function() {
      const response = await request(app).put('/api/bonus/657a2cdd81d265fd37e8337c');
      expect(response.statusCode).to.equal(200);
    });
  });
  describe('FN-13 Редактирование данных бонуса', function() {
    it('Запрос прошел успешно', async function() {
      const response = await request(app).put('/api/bonus').send({
        name: "новый бонус2",
        duration: "1 год",
        cost: "16",
        partner: "супер партнер",
        price: 345,
        company: "65465ea157534fa9dc176bba",
        status: true,
        isView: true,
        _id: "65cc01ac221f2ac6ab2e956d",
      });
      expect(response.statusCode).to.equal(200);
    });
    it('Ошибка, бонус не найден', async function() {
      const response = await request(app).put('/api/bonus').send({
        name: "новый бонус2",
        duration: "1 год",
        cost: "16",
        partner: "супер партнер",
        price: 345,
        company: "65465ea157534fa9dc176bba",
        status: true,
        isView: true,
        _id: "65cc01ac221f2ac6ab2e956dд",
      });
      expect(response.statusCode).to.equal(500);
    });
  });
});
