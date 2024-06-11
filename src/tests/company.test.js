import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';

describe('Управлять информацией об организации', function() {
  describe('FN-5 Добавить организацию в систему', function() {
    it('Запрос прошел успешно', async function() {
      const response = await request(app).post('/api/company').send({
        name: 'SuperCool9',
      });
      expect(response.statusCode).to.equal(200);
    });
    it('Ошибка, компания с данным названием уже существует в системе', async function() {
      const response = await request(app).post('/api/company').send({
        name: 'SuperCool9'
      });
      expect(response.statusCode).to.equal(400);
    });
  });
  describe('FN-6 Просмотреть все организации в системе', function() {
    it('Запрос прошел успешно', async function() {
      const response = await request(app).get('/api/company/all');
      expect(response.statusCode).to.equal(200);
    });
  });
  describe('FN-6 Изменить настройки начисления баллов', function() {
    it('Запрос прошел успешно', async function() {
      const response = await request(app).put('/api/settings').send({
        _id: "6561ead7dff08446b01dbd22",
        company: {
          _id: "6561ead7dff08446b01dbd1d",
          name: "Epic Games"
        },
        settings: {
          priority: {
            critical: 8.0,
            high: 2.0,
            norma: 0.5
          },
          complexity: {
            low: 1.0,
            medium: 1.5,
            high: 2.0
          },
          success: {
            first: 1.0,
            second: 0.8,
            more: 0.7
          }
        }
      });
      expect(response.statusCode).to.equal(200);
    });
    it('Ошибка, организация не найдена', async function() {
      const response = await request(app).put('/api/settings').send({
        _id: "6561ead7dff08446b01dbd223",
        company: {
          _id: "6561ead7dff08446b01dbd1d",
          name: "Epic Games"
        },
        settings: {
          priority: {
            critical: 8.0,
            high: 2.0,
            norma: 0.5
          },
          complexity: {
            low: 1.0,
            medium: 1.5,
            high: 2.0
          },
          success: {
            first: 1.0,
            second: 0.8,
            more: 0.7
          }
        }
      });
      expect(response.statusCode).to.equal(500);
    });
  });
});
