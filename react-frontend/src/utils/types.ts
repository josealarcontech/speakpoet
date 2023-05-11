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


export interface tag {
  uid?: string
  name: string
  category: string
}

export interface folder {
  uid?: string
  name: string,
  genre: tag | undefined,
  type: tag | undefined
}
