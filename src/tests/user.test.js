import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';

describe('Управлять информацией о сотрудниках', function() {
  describe('FN-1 Добавить менеджера', function() {
    it('Запрос прошел успешно', async function() {
      const response = await request(app).post('/api/add/manager').send({
        email: 'dueltmp+ilb4t@gmail.com',
        company: 'Ithech'
      });
      expect(response.statusCode).to.equal(200);
    });
    it('Ошибка, в случае, если пользователь с почтовым адресом уже существует', async function() {
      const response = await request(app).post('/api/add/manager').send({
        email: 'dueltmp+ilb4t@gmail.com',
        company: 'Ithech'
      });
      expect(response.statusCode).to.equal(400);
    });
    it('Ошибка, в случае, если организация не найдена', async function() {
      const response = await request(app).post('/api/add/manager').send({
        email: 'dueltmp+ilb34t@gmail.com',
        company: 'Ithech23224'
      });
      expect(response.statusCode).to.equal(400);
    });
  });
  describe('FN-2 Верифицировать менеджера', function() {
    it('Запрос прошел успешно', async function() {
      const response = await request(app).post('/api/manager/verify').send({
        link: '7a745c5d-5894-4680-8063-c663f51de1c6',
        email: 'dueltmp+ilb4t@gmail.com',
        password: '123456789Aa',
        company: 'Ithech'
      });
      expect(response.statusCode).to.equal(200);
    });
    it('Ошибка, менеджер уже верифицирован', async function() {
      const response = await request(app).post('/api/manager/verify').send({
        link: '7a745c5d-5894-4680-8063-c663f51de1c6',
        email: 'dueltmp+ilb4t@gmail.com',
        password: '123456789Aa',
        company: 'Ithech'
      });
      expect(response.statusCode).to.equal(400);
    });
    it('Ошибка, некорректная ссылка активация', async function() {
      const response = await request(app).post('/api/manager/verify').send({
        link: '7a745c5d-5894-4680-8063-c663f51de1c6dddb800000',
        email: 'dueltmp+ilb4t@gmail.com',
        password: '123456789Aa',
        company: 'Ithech'
      });
      expect(response.statusCode).to.equal(400);
    });
    it('Ошибка, аккаунт не связан с указанной компанией', async function() {
      const response = await request(app).post('/api/manager/verify').send({
        link: '7a745c5d-5894-4680-8063-c663f51de1c6',
        email: 'dueltmp+ilb4t@gmail.com',
        password: '123456789Aa',
        company: 'Modsen'
      });
      expect(response.statusCode).to.equal(400);
    });
  });
  describe('FN-3 Регистрация сотрудника', function() {
    it('Запрос прошел успешно', async function() {
      const response = await request(app).post('/api/registration').send({
        email: 'user123456789@gmail.com',
        password: '123456789Aa',
        chooseItem: 'Modsen',
      });
      expect(response.statusCode).to.equal(200);
    });
  });
  describe('FN-4 Верифицировать сотруника', function() {
    it('Запрос прошел успешно', async function() {
      const response = await request(app).post('/api/user/verify').send({
        id: '65df3d7802f0f76c45a4107f',
        name: 'Валерия',
        lastname: 'Королькова',
        birthday: '2003-03-26T22:00:00.000+00:00',
        workday: '2023-11-14T21:00:00.000+00:00',
        position: 'Frontend developer',
        rang : 'Junior',
        salary: 15
      });
      expect(response.statusCode).to.equal(200);
    });
    it('Ошибка, сотрудник уже верифицирован', async function() {
      const response = await request(app).post('/api/user/verify').send({
        id: '65df3d7802f0f76c45a4107f',
        name: 'Валерия',
        lastname: 'Королькова',
        birthday: '2003-03-26T22:00:00.000+00:00',
        workday: '2023-11-14T21:00:00.000+00:00',
        position: 'Frontend developer',
        rang : 'Junior',
        salary: 15
      });
      expect(response.statusCode).to.equal(400);
    });
  });
});
