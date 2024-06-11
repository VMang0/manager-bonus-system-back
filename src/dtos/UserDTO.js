class UserDTO {
  email;
  id;
  isActivated;
  role;
  company;
  image;
  scope;
  name;
  patronymic;
  lastname;
  position;
  level;
  rank;
  xp;
  previousXp;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.role = model.role;
    this.company = model.company;
    this.image = model.image;
    this.scope = model.scope;
    this.name = model.name;
    this.patronymic = model.patronymic;
    this.lastname = model.lastname;
    this.position = model.position;
    this.level = model.level;

    this.rank = model.rank;
    this.xp = model.xp;
    this.previousXp = model.previousXp;
  }
}

export default UserDTO;