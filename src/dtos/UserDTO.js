class UserDTO {
  email;
  id;
  isActivated;
  role;
  company;
  image;
  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.role = model.role;
    this.company = model.company;
    this.image = model.image;
  }
}

export default UserDTO;