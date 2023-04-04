export type newUser = {
  email: string,
  password: string,
}

export type userCredential = {
  uid: string,
  stsTokenManager: {
    expirationTime: string
  }
}
