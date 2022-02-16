function ErrorRes(res, message, Access) {
  return res.status(400).send({ message, Access });
}

export { ErrorRes };
