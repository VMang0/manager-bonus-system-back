import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';

describe('Управлять задачами на проекте', function() {
  describe('FN-7 Назначить задачу', function() {
    it('Запрос прошел успешно', async function() {
      const response = await request(app).post('/api/task/add').send({
        name: "Выполнить задание",
        dateStart: "2023-11-26T13:05:32.518Z",
        deadline: "2023-11-07T21:00:00.000+00:00",
        priority: {
          _id: "6555342dd677a8a7a0c3b6d1",
          name: "high"
        },
        complexity: {
          _id: "655ac92b3ada3268f5919b21",
          name: "low"
        },
        creator: "6553901d3a299af904ee28dc",
        executor: "65540df60368bd9c73070c20"
      });
      expect(response.statusCode).to.equal(200);
    });
  });
  describe('FN-8 Принять задачу', function() {
    it('Запрос прошел успешно', async function() {
      const response = await request(app).post('/api/task/allow').send({
        id: "65cbf70ce1fcc5537852fcb9",
        ball: 56
      });
      expect(response.statusCode).to.equal(200);
    });
  });
});
