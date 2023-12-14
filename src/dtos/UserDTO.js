class UserDTO {
  email;
  id;
  isActivated;
  role;
  company;
  image;
  scope;
  info;
  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.role = model.role;
    this.company = model.company;
    this.image = model.image;
    this.scope = model.scope;
    this.info = model.info
  }
}

export default UserDTO;