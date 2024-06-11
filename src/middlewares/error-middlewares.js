import ApiErrors from "../exceptions/api-errors.js";

export default function (err, req, res, next) {
  if (err instanceof ApiErrors) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  console.log(err)
  return res.status(500).json({message: 'Непредвиденная ошибка'})
}